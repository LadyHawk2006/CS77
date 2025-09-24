-- =================================================================================================
--                                      DATABASE SCHEMA
-- =================================================================================================
-- This script combines all individual .sql files into a single, comprehensive schema definition.
-- Organized by dependencies: core tables, modifications, messaging, friendships, notifications,
-- album chat, and RPC functions.
-- =================================================================================================

-- 1. CORE PROFILE SYSTEM
-- -----------------------------------------------------------------------------------------------

-- 1.1: Public Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

COMMENT ON TABLE public.profiles IS 'Stores public-facing user data linked to their authentication entry.';
COMMENT ON COLUMN public.profiles.id IS 'Links directly to the auth.users table.';
COMMENT ON COLUMN public.profiles.username IS 'The user''s unique, public-facing name.';

-- 1.2: Row Level Security (RLS) for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 1.3: Trigger for New User Sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 1.4: Storage Bucket for Avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 1.5: RLS for Avatars Bucket
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "A user can update their own avatar."
  ON storage.objects FOR UPDATE
  USING (auth.uid() = owner)
  WITH CHECK (bucket_id = 'avatars');

-- 2. PROFILE TABLE MODIFICATIONS
-- -----------------------------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS favorite_albums TEXT[],
  ADD COLUMN IF NOT EXISTS top_songs TEXT[],
  ADD COLUMN IF NOT EXISTS social_media_links TEXT[];

COMMENT ON COLUMN public.profiles.favorite_albums IS 'An array of strings listing the user''s favorite album names.';
COMMENT ON COLUMN public.profiles.top_songs IS 'An array of strings listing the user''s top songs.';
COMMENT ON COLUMN public.profiles.social_media_links IS 'An array of URLs to the user''s social media profiles.';

-- 3. DIRECT MESSAGE (DM) SYSTEM
-- -----------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL
);

COMMENT ON TABLE public.direct_messages IS 'Stores private one-on-one messages between users.';

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own direct messages."
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send direct messages."
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- 4. DM FOREIGN KEY ADJUSTMENTS
-- -----------------------------------------------------------------------------------------------

ALTER TABLE public.direct_messages
  DROP CONSTRAINT IF EXISTS direct_messages_sender_id_fkey,
  DROP CONSTRAINT IF EXISTS direct_messages_receiver_id_fkey;

ALTER TABLE public.direct_messages
  ADD CONSTRAINT direct_messages_sender_id_fkey
    FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT direct_messages_receiver_id_fkey
    FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 5. FRIENDSHIP SYSTEM
-- -----------------------------------------------------------------------------------------------

-- 5.1: ENUM for Friendship Status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friendship_status') THEN
    CREATE TYPE public.friendship_status AS ENUM ('pending', 'accepted', 'blocked');
  END IF;
END$$;

-- 5.2: Friendships Table
CREATE TABLE IF NOT EXISTS public.friendships (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_one_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_two_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'pending',
  action_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_user_order CHECK (user_one_id < user_two_id),
  CONSTRAINT unique_friendship UNIQUE (user_one_id, user_two_id),
  CONSTRAINT check_action_user CHECK (action_user_id = user_one_id OR action_user_id = user_two_id)
);

COMMENT ON TABLE public.friendships IS 'Stores all relationship data between users, including pending requests, accepted friendships, and blocks.';

CREATE INDEX IF NOT EXISTS friendships_user_one_id_idx ON public.friendships(user_one_id);
CREATE INDEX IF NOT EXISTS friendships_user_two_id_idx ON public.friendships(user_two_id);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own friendships" ON public.friendships;
CREATE POLICY "Allow users to view their own friendships"
  ON public.friendships FOR SELECT
  USING (
    (auth.uid() = user_one_id OR auth.uid() = user_two_id)
    AND (status <> 'blocked' OR (status = 'blocked' AND action_user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Allow users to send friend requests" ON public.friendships;
CREATE POLICY "Allow users to send friend requests"
  ON public.friendships FOR INSERT
  WITH CHECK (
    action_user_id = auth.uid()
    AND status = 'pending'
    AND (user_one_id = auth.uid() OR user_two_id = auth.uid())
    AND user_one_id <> user_two_id
  );

DROP POLICY IF EXISTS "Allow users to update their friendships" ON public.friendships;
CREATE POLICY "Allow users to update their friendships"
  ON public.friendships FOR UPDATE
  USING (auth.uid() = user_one_id OR auth.uid() = user_two_id)
  WITH CHECK (action_user_id = auth.uid());

DROP POLICY IF EXISTS "Allow users to delete their friendships" ON public.friendships;
CREATE POLICY "Allow users to delete their friendships"
  ON public.friendships FOR DELETE
  USING (
    (auth.uid() = user_one_id OR auth.uid() = user_two_id)
    AND (status = 'accepted' OR status = 'pending')
  );

-- 5.3: Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_friendships_updated ON public.friendships;
CREATE TRIGGER on_friendships_updated
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. NOTIFICATION SYSTEM
-- -----------------------------------------------------------------------------------------------

-- 6.1: ENUM for Notification Types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM ('friend_request');
  END IF;
END$$;

-- 6.2: Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  reference_id BIGINT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_friend_request_notification UNIQUE (user_id, sender_id, type, reference_id)
);

COMMENT ON TABLE public.notifications IS 'Stores notifications for users, such as friend requests.';

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own notifications" ON public.notifications;
CREATE POLICY "Allow users to view their own notifications"
  ON public.notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Allow users to update their own notifications" ON public.notifications;
CREATE POLICY "Allow users to update their own notifications"
  ON public.notifications FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Allow users to delete their own notifications" ON public.notifications;
CREATE POLICY "Allow users to delete their own notifications"
  ON public.notifications FOR DELETE USING (user_id = auth.uid());

-- 7. ALBUM-SPECIFIC CHAT TABLES
-- -----------------------------------------------------------------------------------------------

-- Helper function to create chat tables for each album
CREATE OR REPLACE FUNCTION create_chat_table(table_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
      content TEXT NOT NULL,
      user_id UUID REFERENCES public.profiles(id) NOT NULL,
      username TEXT NOT NULL
    );', table_name);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
  EXECUTE format('CREATE POLICY "Allow read access to all users" ON public.%I FOR SELECT USING (true);', table_name);
  EXECUTE format('CREATE POLICY "Allow insert access for authenticated users" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id);', table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS %I_created_at_idx ON public.%I(created_at DESC);', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Create chat tables for each album
SELECT create_chat_table('debut');
SELECT create_chat_table('fearless');
SELECT create_chat_table('speaknow');
SELECT create_chat_table('red');
SELECT create_chat_table('1989');
SELECT create_chat_table('reputation');
SELECT create_chat_table('lover');
SELECT create_chat_table('folklore');
SELECT create_chat_table('evermore');
SELECT create_chat_table('midnights');
SELECT create_chat_table('ttpd');
SELECT create_chat_table('tloas');

DROP FUNCTION create_chat_table(TEXT);

-- 8. RPC (REMOTE PROCEDURE CALL) FUNCTIONS
-- -----------------------------------------------------------------------------------------------

-- 8.1: Get messages for a specific room, joined with user profile data
CREATE OR REPLACE FUNCTION get_messages_with_profiles(room_name TEXT)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  content TEXT,
  user_id UUID,
  username TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY EXECUTE format('
    SELECT
      t.id, t.created_at, t.content, t.user_id,
      COALESCE(p.username, t.username, ''Anonymous'') AS username,
      p.avatar_url
    FROM public.%I AS t
    LEFT JOIN public.profiles AS p ON t.user_id = p.id
    ORDER BY t.created_at ASC;', room_name);
END;
$$ LANGUAGE plpgsql;

-- 8.2: Search users and return friendship status relative to current user
CREATE OR REPLACE FUNCTION search_users_with_friendship_status(search_query TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  friendship_status public.friendship_status,
  friendship_action_user UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.username, p.avatar_url,
    f.status AS friendship_status,
    f.action_user_id AS friendship_action_user
  FROM public.profiles p
  LEFT JOIN public.friendships f
    ON (f.user_one_id = p.id AND f.user_two_id = auth.uid())
    OR (f.user_one_id = auth.uid() AND f.user_two_id = p.id)
  WHERE p.username ILIKE '%' || search_query || '%'
    AND p.id <> auth.uid()
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 8.3: Get all accepted friends for the current user
CREATE OR REPLACE FUNCTION public.get_friends_list()
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT
) AS $$
  SELECT
    p.id, p.username, p.avatar_url
  FROM public.friendships f
  JOIN public.profiles p
    ON p.id = (CASE WHEN f.user_one_id = auth.uid() THEN f.user_two_id ELSE f.user_one_id END)
  WHERE (f.user_one_id = auth.uid() OR f.user_two_id = auth.uid())
    AND f.status = 'accepted';
$$ LANGUAGE sql;

-- 8.4: Send a friend request and create a notification in a single transaction
CREATE OR REPLACE FUNCTION public.send_friend_request(recipient_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sender_id UUID := auth.uid();
  friendship_id BIGINT;
BEGIN
  INSERT INTO public.friendships (user_one_id, user_two_id, status, action_user_id)
  VALUES (LEAST(sender_id, recipient_id), GREATEST(sender_id, recipient_id), 'pending', sender_id)
  RETURNING id INTO friendship_id;

  INSERT INTO public.notifications (user_id, sender_id, type, reference_id)
  VALUES (recipient_id, sender_id, 'friend_request', friendship_id);
END;
$$;

-- =================================================================================================
--                                      END OF SCRIPT
-- =================================================================================================
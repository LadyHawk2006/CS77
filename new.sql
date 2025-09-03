-- SQL script to create a table for each Taylor Swift album chat

-- For each table, we will:
-- 1. Create the table with columns for id, content, user_id (linked to auth.users), and a precise timestamp.
-- 2. Enable Row Level Security (RLS) to control access to the data.
-- 3. Create a policy to allow all users to read messages.
-- 4. Create a policy to allow authenticated users to insert messages, ensuring they can only insert messages as themselves.

-- Note: auth.uid() is a Supabase function that returns the ID of the currently authenticated user.

-- Table for: debut
CREATE TABLE debut (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE debut ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON debut FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON debut FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: fearless
CREATE TABLE fearless (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE fearless ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON fearless FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON fearless FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: speaknow
CREATE TABLE speaknow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE speaknow ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON speaknow FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON speaknow FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: red
CREATE TABLE red (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE red ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON red FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON red FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: 1989
CREATE TABLE "1989" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE "1989" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON "1989" FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON "1989" FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: reputation
CREATE TABLE reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE reputation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON reputation FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON reputation FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: lover
CREATE TABLE lover (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE lover ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON lover FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON lover FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: folklore
CREATE TABLE folklore (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE folklore ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON folklore FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON folklore FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: evermore
CREATE TABLE evermore (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE evermore ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON evermore FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON evermore FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: midnights
CREATE TABLE midnights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE midnights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON midnights FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON midnights FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: ttpd
CREATE TABLE ttpd (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE ttpd ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON ttpd FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON ttpd FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Table for: tloas
CREATE TABLE tloas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL
);
ALTER TABLE tloas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON tloas FOR SELECT USING (true);
CREATE POLICY "Allow insert access for authenticated users" ON tloas FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deeper User Profiles: Allow users to select a cyberpunk avatar or a
-- favorite Taylor Swift era icon. You could also add a short bio where
-- they can put their favorite lyric or album.

-- 1. Create a table for public profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 3. Create a function to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a trigger that calls the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Create a storage bucket for avatars
-- See https://supabase.com/docs/guides/storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING; -- Fails silently if the bucket already exists

-- 6. Set up RLS policies for the avatars bucket
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "A user can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' );

CREATE OR REPLACE FUNCTION get_messages_with_profiles(room_name TEXT)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  content TEXT,
  user_id UUID,
  username TEXT,
  avatar_url TEXT
)
AS $$
BEGIN
  RETURN QUERY EXECUTE format('SELECT
      t.id,
      t.created_at,
      t.content,
      t.user_id,
      COALESCE(p.username, t.username, ''Anonymous'') AS username,
      p.avatar_url
    FROM
      public.%I AS t
    LEFT JOIN
      public.profiles AS p ON t.user_id = p.id
    ORDER BY
      t.created_at ASC;
  ', room_name);
END;
$$ LANGUAGE plpgsql;
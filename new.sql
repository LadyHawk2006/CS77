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
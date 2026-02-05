create table if not exists youtube_videos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  url text not null,
  thumbnail_url text,
  saved_time numeric default 0,
  user_id uuid default auth.uid()
);

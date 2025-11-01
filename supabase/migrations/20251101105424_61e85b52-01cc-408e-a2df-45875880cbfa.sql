-- Add RLS policies for anonymous users on chats table
-- Anonymous users (guests) can view their own chats
CREATE POLICY "Anonymous users can view their own chats"
ON public.chats
FOR SELECT
TO anon
USING (auth.uid() = user_id);

-- Anonymous users can insert their own chats (but limited by TTL)
CREATE POLICY "Anonymous users can insert their own chats"
ON public.chats
FOR INSERT
TO anon
WITH CHECK (auth.uid() = user_id);

-- Anonymous users can update their own chats
CREATE POLICY "Anonymous users can update their own chats"
ON public.chats
FOR UPDATE
TO anon
USING (auth.uid() = user_id);

-- Anonymous users can delete their own chats
CREATE POLICY "Anonymous users can delete their own chats"
ON public.chats
FOR DELETE
TO anon
USING (auth.uid() = user_id);

-- Add RLS policies for anonymous users on storage
CREATE POLICY "Anonymous users cannot upload files"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Anonymous users cannot read storage"
ON storage.objects
FOR SELECT
TO anon
USING (false);

-- Add function to clean up old anonymous user chats (older than 7 days)
CREATE OR REPLACE FUNCTION public.cleanup_anonymous_chats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.chats
  WHERE user_id IN (
    SELECT id FROM auth.users WHERE is_anonymous = true
  )
  AND updated_at < EXTRACT(EPOCH FROM (NOW() - INTERVAL '7 days')) * 1000;
END;
$$;
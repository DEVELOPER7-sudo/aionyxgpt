-- Fix increment_bot_usage to verify bot accessibility before incrementing
CREATE OR REPLACE FUNCTION public.increment_bot_usage(bot_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only increment if bot exists and is accessible (public/unlisted OR user owns it)
  UPDATE public.bots
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE uuid = bot_uuid
    AND (visibility IN ('public', 'unlisted') OR creator_id = auth.uid());
END;
$$;
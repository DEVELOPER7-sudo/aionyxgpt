-- Create function to increment bot usage count
CREATE OR REPLACE FUNCTION increment_bot_usage(bot_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE bots
  SET usage_count = COALESCE(usage_count, 0) + 1
  WHERE uuid = bot_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_bot_usage(UUID) TO authenticated;

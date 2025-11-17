-- Add creator_fingerprint column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS creator_fingerprint VARCHAR(255);

-- Add index for fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_events_fingerprint ON events(creator_fingerprint) WHERE deleted_at IS NULL;

-- Add comment explaining the purpose
COMMENT ON COLUMN events.creator_fingerprint IS 'Browser fingerprint of the device that created the event. Used to restrict editing to the original device.';

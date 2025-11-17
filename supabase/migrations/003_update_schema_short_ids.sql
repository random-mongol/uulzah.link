-- Migration: Update to short IDs and remove location/owner_name fields
-- This migration changes event IDs from UUID to short alphanumeric IDs (8 chars)
-- and removes unnecessary fields

-- Step 1: Drop dependent foreign key constraints
ALTER TABLE event_dates DROP CONSTRAINT IF EXISTS event_dates_event_id_fkey;
ALTER TABLE participants DROP CONSTRAINT IF EXISTS participants_event_id_fkey;

-- Step 2: Remove location and owner_name columns from events
ALTER TABLE events DROP COLUMN IF EXISTS location;
ALTER TABLE events DROP COLUMN IF EXISTS owner_name;

-- Step 3: Add new id column as VARCHAR and migrate data
-- Since this is a fresh installation, we can recreate the table
-- WARNING: This will delete all existing data. For production, use a different approach.

-- Backup approach: Create new table with short IDs
CREATE TABLE events_new (
  id VARCHAR(10) PRIMARY KEY,
  title VARCHAR(255) NOT NULL CHECK (char_length(title) >= 3),
  description TEXT,
  owner_email VARCHAR(255),
  edit_token VARCHAR(20) NOT NULL UNIQUE,
  timezone VARCHAR(100) DEFAULT 'Asia/Ulaanbaatar',
  allow_multiple_dates BOOLEAN DEFAULT true,
  allow_maybe BOOLEAN DEFAULT true,
  show_responses_after_submit BOOLEAN DEFAULT true,
  deadline_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  creator_fingerprint VARCHAR(255)
);

-- Step 4: Update event_dates to use VARCHAR for event_id
CREATE TABLE event_dates_new (
  id BIGSERIAL PRIMARY KEY,
  event_id VARCHAR(10) NOT NULL REFERENCES events_new(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  is_all_day BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT event_dates_valid_range CHECK (
    end_datetime IS NULL OR end_datetime > start_datetime
  )
);

-- Step 5: Update participants to use VARCHAR for event_id
CREATE TABLE participants_new (
  id BIGSERIAL PRIMARY KEY,
  event_id VARCHAR(10) NOT NULL REFERENCES events_new(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  comment TEXT,
  response_token VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT participants_unique_name_per_event UNIQUE(event_id, name)
);

-- Step 6: Drop old tables and rename new ones
DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS event_dates;
DROP TABLE IF EXISTS events;

ALTER TABLE events_new RENAME TO events;
ALTER TABLE event_dates_new RENAME TO event_dates;
ALTER TABLE participants_new RENAME TO participants;

-- Step 7: Recreate responses table
CREATE TABLE responses (
  id BIGSERIAL PRIMARY KEY,
  participant_id BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  event_date_id BIGINT NOT NULL REFERENCES event_dates(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT responses_unique_participant_date UNIQUE(participant_id, event_date_id)
);

-- Step 8: Recreate indexes
CREATE INDEX idx_events_created_at ON events(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_edit_token ON events(edit_token) WHERE deleted_at IS NULL;
CREATE INDEX idx_event_dates_event_id ON event_dates(event_id, display_order);
CREATE INDEX idx_participants_event_id ON participants(event_id, created_at);
CREATE INDEX idx_participants_response_token ON participants(response_token);
CREATE INDEX idx_responses_participant_id ON responses(participant_id);
CREATE INDEX idx_responses_event_date_id ON responses(event_date_id);
CREATE INDEX idx_responses_date_status ON responses(event_date_id, status);

-- Step 9: Recreate triggers
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Re-enable RLS and recreate policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations on event_dates" ON event_dates FOR ALL USING (true);
CREATE POLICY "Allow all operations on participants" ON participants FOR ALL USING (true);
CREATE POLICY "Allow all operations on responses" ON responses FOR ALL USING (true);

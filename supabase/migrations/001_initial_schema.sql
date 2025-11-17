-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL CHECK (char_length(title) >= 3),
  description TEXT,
  location VARCHAR(500),
  owner_name VARCHAR(100),
  owner_email VARCHAR(255),
  edit_token VARCHAR(64) NOT NULL UNIQUE,
  timezone VARCHAR(100) DEFAULT 'Asia/Ulaanbaatar',
  allow_multiple_dates BOOLEAN DEFAULT true,
  allow_maybe BOOLEAN DEFAULT true,
  show_responses_after_submit BOOLEAN DEFAULT true,
  deadline_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0
);

-- Event dates table
CREATE TABLE event_dates (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  is_all_day BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT event_dates_valid_range CHECK (
    end_datetime IS NULL OR end_datetime > start_datetime
  )
);

-- Participants table
CREATE TABLE participants (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  comment TEXT,
  response_token VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT participants_unique_name_per_event UNIQUE(event_id, name)
);

-- Responses table
CREATE TABLE responses (
  id BIGSERIAL PRIMARY KEY,
  participant_id BIGINT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  event_date_id BIGINT NOT NULL REFERENCES event_dates(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT responses_unique_participant_date UNIQUE(participant_id, event_date_id)
);

-- Indexes for performance
CREATE INDEX idx_events_created_at ON events(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_edit_token ON events(edit_token) WHERE deleted_at IS NULL;
CREATE INDEX idx_event_dates_event_id ON event_dates(event_id, display_order);
CREATE INDEX idx_participants_event_id ON participants(event_id, created_at);
CREATE INDEX idx_participants_response_token ON participants(response_token);
CREATE INDEX idx_responses_participant_id ON participants(id);
CREATE INDEX idx_responses_event_date_id ON responses(event_date_id);
CREATE INDEX idx_responses_date_status ON responses(event_date_id, status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true);
CREATE POLICY "Allow all operations on event_dates" ON event_dates FOR ALL USING (true);
CREATE POLICY "Allow all operations on participants" ON participants FOR ALL USING (true);
CREATE POLICY "Allow all operations on responses" ON responses FOR ALL USING (true);

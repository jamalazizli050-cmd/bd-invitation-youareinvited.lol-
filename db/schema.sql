CREATE TABLE IF NOT EXISTS guests (
  id BIGSERIAL PRIMARY KEY,
  display_name TEXT NOT NULL UNIQUE,
  code_hash TEXT NOT NULL,
  is_ready BOOLEAN NOT NULL DEFAULT FALSE,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ready_requires_confirmation CHECK (NOT is_ready OR confirmed_at IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS guests_display_name_lower_unique ON guests (LOWER(display_name));
CREATE INDEX IF NOT EXISTS guests_ready_idx ON guests (is_ready);

CREATE TABLE IF NOT EXISTS quiz_results (
  id BIGSERIAL PRIMARY KEY,
  guest_id BIGINT NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 15),
  rank TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_results_leaderboard_idx
  ON quiz_results (guest_id, score DESC, completed_at ASC);

CREATE OR REPLACE FUNCTION prevent_ready_reversal() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_ready AND NOT NEW.is_ready THEN
    RAISE EXCEPTION 'READY status cannot be reverted';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS guests_no_ready_reversal ON guests;
CREATE TRIGGER guests_no_ready_reversal BEFORE UPDATE ON guests
FOR EACH ROW EXECUTE FUNCTION prevent_ready_reversal();

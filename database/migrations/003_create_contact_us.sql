-- Migration 001: Create contact_us table

CREATE TABLE IF NOT EXISTS contact_us (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact us
  email         VARCHAR(255) NOT NULL,
  product       VARCHAR(255),
  subject       VARCHAR(255) NOT NULL,
  message       TEXT,

  -- Metadata
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_us_email 
ON contact_us (email);
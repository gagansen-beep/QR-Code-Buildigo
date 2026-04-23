-- Migration 001: Create qr_cards table

CREATE TABLE IF NOT EXISTS qr_cards (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Personal Information
  name          VARCHAR(100) NOT NULL,
  designation   VARCHAR(100),
  image_url     VARCHAR(500),

  -- Contact Details (email is the unique identifier for auth)
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(25),
  whatsapp      VARCHAR(25),

  -- Social Media
  instagram     VARCHAR(500),
  facebook      VARCHAR(500),
  twitter       VARCHAR(500),
  linkedin      VARCHAR(500),
  youtube       VARCHAR(500),

  -- QR Code (stored as base64 data URL)
  qr_code       TEXT,

  -- Metadata
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_cards_email ON qr_cards (email);
CREATE INDEX IF NOT EXISTS idx_qr_cards_phone ON qr_cards (phone);

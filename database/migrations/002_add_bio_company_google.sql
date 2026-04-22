-- Migration 002: Add bio, company, and google fields to qr_cards

ALTER TABLE qr_cards ADD COLUMN IF NOT EXISTS bio     TEXT;
ALTER TABLE qr_cards ADD COLUMN IF NOT EXISTS company  VARCHAR(200);
ALTER TABLE qr_cards ADD COLUMN IF NOT EXISTS google   VARCHAR(500);

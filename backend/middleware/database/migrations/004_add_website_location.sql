-- Migration 004: Add website and location fields to qr_cards

ALTER TABLE qr_cards ADD COLUMN IF NOT EXISTS website  VARCHAR(500);
ALTER TABLE qr_cards ADD COLUMN IF NOT EXISTS location VARCHAR(500);

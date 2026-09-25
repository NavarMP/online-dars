-- Add is_featured column to kutub
ALTER TABLE kutub ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

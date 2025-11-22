-- Create site_settings table for logo and site name
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Apex & Base',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default row
INSERT INTO site_settings (site_name)
VALUES ('Apex & Base')
ON CONFLICT DO NOTHING;

-- Add visibility toggle columns to about_page table
ALTER TABLE about_page
ADD COLUMN IF NOT EXISTS show_mission BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_values BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_principles BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_team BOOLEAN DEFAULT true;

-- Update existing rows to have all sections visible by default
UPDATE about_page
SET
  show_mission = COALESCE(show_mission, true),
  show_values = COALESCE(show_values, true),
  show_principles = COALESCE(show_principles, true),
  show_team = COALESCE(show_team, true);

-- Add comments
COMMENT ON TABLE site_settings IS 'Global site settings including logo and branding';
COMMENT ON COLUMN site_settings.logo_url IS 'URL to the site logo image';
COMMENT ON COLUMN site_settings.site_name IS 'Name of the site displayed in header';

COMMENT ON COLUMN about_page.show_mission IS 'Toggle visibility of Mission section';
COMMENT ON COLUMN about_page.show_values IS 'Toggle visibility of Values section';
COMMENT ON COLUMN about_page.show_principles IS 'Toggle visibility of Principles section';
COMMENT ON COLUMN about_page.show_team IS 'Toggle visibility of Team section';

-- Add visibility toggle columns to about_page table
-- These allow admins to show/hide specific sections on the About page

-- Add show_mission column (default true to maintain current behavior)
ALTER TABLE about_page
ADD COLUMN IF NOT EXISTS show_mission BOOLEAN DEFAULT true NOT NULL;

-- Add show_values column (default true to maintain current behavior)
ALTER TABLE about_page
ADD COLUMN IF NOT EXISTS show_values BOOLEAN DEFAULT true NOT NULL;

-- Add show_principles column (default true to maintain current behavior)
ALTER TABLE about_page
ADD COLUMN IF NOT EXISTS show_principles BOOLEAN DEFAULT true NOT NULL;

-- Add show_team column (default true to maintain current behavior)
ALTER TABLE about_page
ADD COLUMN IF NOT EXISTS show_team BOOLEAN DEFAULT true NOT NULL;

-- Update existing rows to have all sections visible by default
UPDATE about_page
SET
  show_mission = true,
  show_values = true,
  show_principles = true,
  show_team = true
WHERE
  show_mission IS NULL
  OR show_values IS NULL
  OR show_principles IS NULL
  OR show_team IS NULL;

-- Add comment to document the purpose
COMMENT ON COLUMN about_page.show_mission IS 'Toggle visibility of Mission section on About page';
COMMENT ON COLUMN about_page.show_values IS 'Toggle visibility of Values section on About page';
COMMENT ON COLUMN about_page.show_principles IS 'Toggle visibility of Principles section on About page';
COMMENT ON COLUMN about_page.show_team IS 'Toggle visibility of Team section on About page';

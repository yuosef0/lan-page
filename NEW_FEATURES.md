# ✨ New Features Added

## 🎨 UI Improvements

### 1. Home Page Enhancements
- **Centered Single Cards**: When only one feature card exists, it now centers automatically
- **Enhanced Circular Decorations**: Increased visibility with border-4 and opacity-20 (was border-2 and opacity-5)

## 🔧 Admin Features

### 2. Footer Management (`/admin/footer`)
New admin page to manage:
- Company name and tagline
- Copyright text
- Social media links (Facebook, Twitter, LinkedIn, Instagram)
- Only configured social media icons appear on the site

### 3. Site Settings (`/admin/settings`)
New admin page for branding:
- Upload custom logo or provide URL
- Change site name displayed in header
- Logo appears in header when configured, fallback to "AB" icon

### 4. About Page Section Toggles (Re-added)
Control visibility of About page sections:
- Mission section toggle
- Values section toggle
- Principles section toggle
- Team section toggle

Each section can be shown/hidden independently from `/admin/about`

## 📊 Database Changes Required

Run the migration file to add required database tables and columns:

```bash
# File: supabase-migrations/add_site_settings_and_about_toggles.sql
```

This creates:
1. **site_settings** table with:
   - `id` (UUID, Primary Key)
   - `site_name` (Text, default: 'Apex & Base')
   - `logo_url` (Text, optional)
   - `created_at`, `updated_at` (Timestamps)

2. **about_page** table additions:
   - `show_mission` (Boolean, default: true)
   - `show_values` (Boolean, default: true)
   - `show_principles` (Boolean, default: true)
   - `show_team` (Boolean, default: true)

## 🚀 How to Use

### Upload Logo
1. Go to `/admin/settings`
2. Upload an image (recommended: 200x200px PNG with transparent background)
3. Or paste a URL to an existing logo
4. Save changes
5. Logo will appear in header automatically

### Manage Footer
1. Go to `/admin/footer`
2. Edit company information
3. Add social media URLs (leave empty to hide icons)
4. Save changes

### Control About Page Sections
1. Go to `/admin/about`
2. Use checkboxes next to each section header
3. Uncheck "عرض في الموقع" to hide a section
4. Save changes
5. Hidden sections won't appear on the public About page

## 📝 Notes

- All social media links open in new tabs
- Logo uses Next.js Image component for optimization
- Section toggles default to visible (true) for existing data
- Footer only shows social icons when URLs are configured

export interface HomePage {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutPage {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  mission_title: string;
  mission_content: string;
  mission_image?: string;
  show_mission: boolean;
  values_title: string;
  values_content: string;
  show_values: boolean;
  principles_section_title: string;
  principles_section_subtitle?: string;
  show_principles: boolean;
  team_section_title: string;
  team_section_subtitle?: string;
  show_team: boolean;
  created_at: string;
  updated_at: string;
}

export interface Principle {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ServicesPage {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  image_position: 'left' | 'right';
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  office_title: string;
  office_address: string;
  office_phone: string;
  office_email: string;
  office_map_embed_url?: string;
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
  social_instagram: string;
  footer_company_name?: string;
  footer_copyright?: string;
  footer_founded_year: string;
  footer_tagline?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  type: 'general' | 'vendor';
  name?: string;
  email: string;
  message?: string;
  company_name?: string;
  contact_person?: string;
  phone?: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  notes?: string;
  created_at: string;
  updated_at: string;
}

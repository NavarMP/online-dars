-- Create an enum for animation styles
CREATE TYPE animation_style AS ENUM ('fade-up', 'fade-in', 'slide-left', 'slide-right', 'zoom-in', 'none');

-- Create a table for global site settings and theme controls
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL,
    primary_color TEXT DEFAULT '#000000',
    secondary_color TEXT DEFAULT '#FFFFFF',
    enable_webgl BOOLEAN DEFAULT true,
    global_page_transition animation_style DEFAULT 'fade-in',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one row exists for global settings
CREATE UNIQUE INDEX site_settings_single_row ON site_settings((1));

-- Create a table for dynamic media items (images, videos, etc.)
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    alt_text TEXT,
    url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'model3d')),
    blurhash TEXT,
    focal_point_x NUMERIC DEFAULT 50,
    focal_point_y NUMERIC DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for sections where admins can control content and animations
CREATE TABLE page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_route TEXT NOT NULL,
    section_name TEXT NOT NULL,
    content JSONB,
    entrance_animation animation_style DEFAULT 'fade-up',
    animation_delay NUMERIC DEFAULT 0,
    media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for media_assets" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Public read access for page_sections" ON page_sections FOR SELECT USING (true);

-- Allow admin full access (assuming role based admin check exists, otherwise checking auth)
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL TO authenticated USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access media_assets" ON media_assets FOR ALL TO authenticated USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access page_sections" ON page_sections FOR ALL TO authenticated USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

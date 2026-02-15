-- =============================================
-- PARTIE 1/4 - CREATION DES TABLES
-- =============================================
-- Executer en PREMIER dans Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- =============================================

-- 1. groupes
CREATE TABLE IF NOT EXISTS groupes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  description TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. agents
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT,
  email TEXT,
  telephone TEXT,
  groupe_id UUID REFERENCES groupes(id) ON DELETE SET NULL,
  groupe_travail TEXT,
  groupe TEXT,
  site TEXT,
  statut TEXT,
  type_role TEXT DEFAULT 'roulement',
  actif BOOLEAN DEFAULT true,
  ordre INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  signature_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. planning
CREATE TABLE IF NOT EXISTS planning (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  code_service TEXT,
  service_code TEXT,
  poste_code TEXT,
  statut TEXT DEFAULT 'actif',
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, date)
);

-- 4. habilitations
CREATE TABLE IF NOT EXISTS habilitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  poste TEXT NOT NULL,
  date_obtention DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, poste)
);

-- 5. codes_services
CREATE TABLE IF NOT EXISTS codes_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  categorie TEXT,
  service_code TEXT,
  poste_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. uploads_pdf
CREATE TABLE IF NOT EXISTS uploads_pdf (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  fichier_nom TEXT,
  agent_nom TEXT,
  services_count INTEGER DEFAULT 0,
  statut_extraction TEXT DEFAULT 'en_attente',
  commande_a_temps BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  auteur TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. user_color_preferences
CREATE TABLE IF NOT EXISTS user_color_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT 'general',
  colors JSONB DEFAULT '{}',
  sync_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_email, context)
);

-- 9. groupes_contacts
CREATE TABLE IF NOT EXISTS groupes_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  groupe_code TEXT NOT NULL UNIQUE,
  telephone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. postes_figes
CREATE TABLE IF NOT EXISTS postes_figes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE,
  poste TEXT,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

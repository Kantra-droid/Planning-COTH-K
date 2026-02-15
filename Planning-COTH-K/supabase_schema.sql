-- =============================================
-- SCHEMA SUPABASE - Planning COT H/K v1.0.0
-- =============================================
-- A executer dans l'editeur SQL de Supabase
-- Dashboard > SQL Editor > New Query
-- =============================================

-- ============================================
-- 1. TABLE: groupes
-- ============================================
CREATE TABLE IF NOT EXISTS groupes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  description TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Donnees initiales des groupes COT H/K
INSERT INTO groupes (nom, description, ordre) VALUES
  ('GTI', 'Groupe Technique Intervention', 1),
  ('Appui GTI / ROK', 'Appui GTI / ROK', 2),
  ('GM', 'Groupe Maintenance', 3),
  ('GPIV', 'Groupe PIV', 4),
  ('GIV', 'Groupe IV', 5),
  ('RLIV', 'RLIV', 6),
  ('RLIV PSE', 'RLIV PSE', 7),
  ('RLIV HC', 'RLIV HC', 8),
  ('RLIV ZDC', 'RLIV ZDC', 9),
  ('RLIV ZD', 'RLIV ZD', 10),
  ('RLIV ZDE', 'RLIV ZDE', 11)
ON CONFLICT (nom) DO NOTHING;

-- ============================================
-- 2. TABLE: agents
-- ============================================
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

-- Index pour les requetes frequentes
CREATE INDEX IF NOT EXISTS idx_agents_actif ON agents(actif);
CREATE INDEX IF NOT EXISTS idx_agents_groupe_id ON agents(groupe_id);
CREATE INDEX IF NOT EXISTS idx_agents_ordre ON agents(ordre);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);

-- ============================================
-- 3. TABLE: planning
-- ============================================
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
  -- Contrainte unique pour eviter les doublons agent+date
  UNIQUE(agent_id, date)
);

-- Index pour les requetes de planning par mois
CREATE INDEX IF NOT EXISTS idx_planning_date ON planning(date);
CREATE INDEX IF NOT EXISTS idx_planning_agent_id ON planning(agent_id);
CREATE INDEX IF NOT EXISTS idx_planning_agent_date ON planning(agent_id, date);

-- ============================================
-- 4. TABLE: habilitations
-- ============================================
CREATE TABLE IF NOT EXISTS habilitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  poste TEXT NOT NULL,
  date_obtention DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Contrainte unique pour eviter les doublons
  UNIQUE(agent_id, poste)
);

CREATE INDEX IF NOT EXISTS idx_habilitations_agent_id ON habilitations(agent_id);

-- ============================================
-- 5. TABLE: codes_services
-- ============================================
CREATE TABLE IF NOT EXISTS codes_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  categorie TEXT,
  service_code TEXT,
  poste_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_codes_services_code ON codes_services(code);
CREATE INDEX IF NOT EXISTS idx_codes_services_categorie ON codes_services(categorie);

-- Donnees initiales des codes de service
INSERT INTO codes_services (code, description, categorie) VALUES
  -- Services de base
  ('-', 'Matin', 'service'),
  ('O', 'Soir / Apres-midi', 'service'),
  ('X', 'Nuit', 'service'),
  ('I', 'Journee', 'service'),
  -- Repos
  ('RP', 'Repos Periodique', 'repos'),
  ('RU', 'Repos Unique', 'repos'),
  ('RQ', 'Repos Quadruple', 'repos'),
  ('NU', 'Non Utilise', 'repos'),
  -- Conges
  ('C25', 'Conge Annuel 2025', 'conge'),
  ('C26', 'Conge Annuel 2026', 'conge'),
  ('CF', 'Conge Ferie', 'conge'),
  -- Formation
  ('VT', 'Visite Medicale', 'formation'),
  ('F1', 'Formation 1', 'formation'),
  ('F2', 'Formation 2', 'formation'),
  ('F3', 'Formation 3', 'formation'),
  ('F5', 'Formation 5', 'formation'),
  ('F8', 'Formation 8', 'formation'),
  ('F9', 'Formation 9', 'formation'),
  ('F0', 'Formation 0', 'formation'),
  -- Disponibilite
  ('(d)', 'Disponible', 'disponibilite'),
  ('DD', 'Double Disponibilite', 'disponibilite'),
  -- Codes speciaux GTI
  ('-GTI', 'Matin GTI', 'special_gti'),
  ('OGTI', 'Soir GTI', 'special_gti'),
  ('XGTI', 'Nuit GTI', 'special_gti'),
  ('-AGTI', 'Matin Appui GTI', 'special_gti'),
  ('OAGTI', 'Soir Appui GTI', 'special_gti'),
  ('-GM', 'Matin GM', 'special_gti'),
  ('OGM', 'Soir GM', 'special_gti'),
  ('XGM', 'Nuit GM', 'special_gti'),
  -- Codes speciaux GPIV/GIV
  ('-GPIV', 'Matin GPIV', 'special_gpiv'),
  ('OGPIV', 'Soir GPIV', 'special_gpiv'),
  ('-GIV', 'Matin GIV', 'special_gpiv'),
  ('OGIV', 'Soir GIV', 'special_gpiv'),
  ('XGIV', 'Nuit GIV', 'special_gpiv'),
  -- Codes speciaux RLIV
  ('-PSE', 'Matin PSE', 'special_rliv'),
  ('OPSE', 'Soir PSE', 'special_rliv'),
  ('-HC', 'Matin HC', 'special_rliv'),
  ('OHC', 'Soir HC', 'special_rliv'),
  ('-ZDC', 'Matin ZDC', 'special_rliv'),
  ('OZDC', 'Soir ZDC', 'special_rliv'),
  ('-ZD', 'Matin ZD', 'special_rliv'),
  ('OZD', 'Soir ZD', 'special_rliv'),
  ('-ZDE', 'Matin ZDE', 'special_rliv'),
  ('OZDE', 'Soir ZDE', 'special_rliv'),
  -- Autres
  ('CS', 'Compte Supplementaire', 'autre'),
  ('EIA', 'EIA', 'autre'),
  ('MA', 'Maladie', 'autre')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 6. TABLE: uploads_pdf
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_uploads_pdf_created_at ON uploads_pdf(created_at DESC);

-- ============================================
-- 7. TABLE: notes
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  auteur TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_agent_id ON notes(agent_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- ============================================
-- 8. TABLE: user_color_preferences
-- ============================================
CREATE TABLE IF NOT EXISTS user_color_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT 'general',
  colors JSONB DEFAULT '{}',
  sync_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Contrainte unique pour l'upsert (onConflict: 'user_email,context')
  UNIQUE(user_email, context)
);

CREATE INDEX IF NOT EXISTS idx_user_colors_email_context ON user_color_preferences(user_email, context);

-- ============================================
-- 9. TABLE: groupes_contacts
-- ============================================
CREATE TABLE IF NOT EXISTS groupes_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  groupe_code TEXT NOT NULL UNIQUE,
  telephone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 10. TABLE: documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- ============================================
-- 11. TABLE: postes_figes (optionnel, pour statistiques)
-- ============================================
CREATE TABLE IF NOT EXISTS postes_figes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE,
  poste TEXT,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_postes_figes_date ON postes_figes(date);


-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- A creer dans Dashboard > Storage > New Bucket
--
-- 1. "documents"     - Documents personnels agents (prive)
-- 2. "bibliotheque"  - Bibliotheque de documents partagee (prive)
-- 3. "signatures"    - Signatures des agents (prive)
--
-- Pour chaque bucket, configurer les policies dans le dashboard.


-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Activer RLS sur toutes les tables
ALTER TABLE groupes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE habilitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE codes_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads_pdf ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_color_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE groupes_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE postes_figes ENABLE ROW LEVEL SECURITY;

-- Policies: Tous les utilisateurs authentifies peuvent lire/ecrire
-- (Adapter selon vos besoins de securite)

-- GROUPES: lecture pour tous, ecriture pour authentifies
CREATE POLICY "groupes_select" ON groupes FOR SELECT TO authenticated USING (true);
CREATE POLICY "groupes_insert" ON groupes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "groupes_update" ON groupes FOR UPDATE TO authenticated USING (true);

-- AGENTS: lecture pour tous (y compris login), ecriture pour authentifies
CREATE POLICY "agents_select_anon" ON agents FOR SELECT TO anon USING (true);
CREATE POLICY "agents_select" ON agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "agents_insert" ON agents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "agents_update" ON agents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "agents_delete" ON agents FOR DELETE TO authenticated USING (true);

-- PLANNING: lecture/ecriture pour authentifies
CREATE POLICY "planning_select" ON planning FOR SELECT TO authenticated USING (true);
CREATE POLICY "planning_insert" ON planning FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "planning_update" ON planning FOR UPDATE TO authenticated USING (true);
CREATE POLICY "planning_delete" ON planning FOR DELETE TO authenticated USING (true);

-- HABILITATIONS: lecture/ecriture pour authentifies
CREATE POLICY "habilitations_select" ON habilitations FOR SELECT TO authenticated USING (true);
CREATE POLICY "habilitations_insert" ON habilitations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "habilitations_delete" ON habilitations FOR DELETE TO authenticated USING (true);

-- CODES_SERVICES: lecture pour tous
CREATE POLICY "codes_services_select" ON codes_services FOR SELECT TO authenticated USING (true);

-- UPLOADS_PDF: lecture/ecriture pour authentifies
CREATE POLICY "uploads_pdf_select" ON uploads_pdf FOR SELECT TO authenticated USING (true);
CREATE POLICY "uploads_pdf_insert" ON uploads_pdf FOR INSERT TO authenticated WITH CHECK (true);

-- NOTES: lecture/ecriture pour authentifies
CREATE POLICY "notes_select" ON notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "notes_insert" ON notes FOR INSERT TO authenticated WITH CHECK (true);

-- USER_COLOR_PREFERENCES: chaque utilisateur gere ses preferences
CREATE POLICY "user_colors_select" ON user_color_preferences FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_colors_insert" ON user_color_preferences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "user_colors_update" ON user_color_preferences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "user_colors_delete" ON user_color_preferences FOR DELETE TO authenticated USING (true);

-- GROUPES_CONTACTS: lecture/ecriture pour authentifies
CREATE POLICY "groupes_contacts_select" ON groupes_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "groupes_contacts_update" ON groupes_contacts FOR UPDATE TO authenticated USING (true);

-- DOCUMENTS: lecture/ecriture pour authentifies
CREATE POLICY "documents_select" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "documents_insert" ON documents FOR INSERT TO authenticated WITH CHECK (true);

-- POSTES_FIGES: lecture pour authentifies
CREATE POLICY "postes_figes_select" ON postes_figes FOR SELECT TO authenticated USING (true);


-- =============================================
-- CONFIGURATION AUTH SUPABASE (Dashboard)
-- =============================================
-- 1. Dashboard > Authentication > Providers > Email
--    - Activer "Enable Email Provider"
--    - DESACTIVER "Confirm email" (sinon les agents devront confirmer par email)
--    - OU activer "Enable automatic confirmation"
--
-- 2. Dashboard > Authentication > URL Configuration
--    - Site URL: votre URL Netlify (ex: https://votre-app.netlify.app)
--    - Redirect URLs: ajouter votre URL + /reset-password


-- =============================================
-- FIN DU SCHEMA
-- =============================================

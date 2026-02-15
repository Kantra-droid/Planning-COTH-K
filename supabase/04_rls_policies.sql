-- =============================================
-- PARTIE 4/4 - RLS + POLICIES
-- =============================================
-- Executer APRES 03_donnees.sql
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

-- GROUPES
CREATE POLICY "groupes_select" ON groupes FOR SELECT TO authenticated USING (true);
CREATE POLICY "groupes_insert" ON groupes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "groupes_update" ON groupes FOR UPDATE TO authenticated USING (true);

-- AGENTS (anon SELECT pour la page de login)
CREATE POLICY "agents_select_anon" ON agents FOR SELECT TO anon USING (true);
CREATE POLICY "agents_select" ON agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "agents_insert" ON agents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "agents_update" ON agents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "agents_delete" ON agents FOR DELETE TO authenticated USING (true);

-- PLANNING
CREATE POLICY "planning_select" ON planning FOR SELECT TO authenticated USING (true);
CREATE POLICY "planning_insert" ON planning FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "planning_update" ON planning FOR UPDATE TO authenticated USING (true);
CREATE POLICY "planning_delete" ON planning FOR DELETE TO authenticated USING (true);

-- HABILITATIONS
CREATE POLICY "habilitations_select" ON habilitations FOR SELECT TO authenticated USING (true);
CREATE POLICY "habilitations_insert" ON habilitations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "habilitations_delete" ON habilitations FOR DELETE TO authenticated USING (true);

-- CODES_SERVICES
CREATE POLICY "codes_services_select" ON codes_services FOR SELECT TO authenticated USING (true);

-- UPLOADS_PDF
CREATE POLICY "uploads_pdf_select" ON uploads_pdf FOR SELECT TO authenticated USING (true);
CREATE POLICY "uploads_pdf_insert" ON uploads_pdf FOR INSERT TO authenticated WITH CHECK (true);

-- NOTES
CREATE POLICY "notes_select" ON notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "notes_insert" ON notes FOR INSERT TO authenticated WITH CHECK (true);

-- USER_COLOR_PREFERENCES
CREATE POLICY "user_colors_select" ON user_color_preferences FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_colors_insert" ON user_color_preferences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "user_colors_update" ON user_color_preferences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "user_colors_delete" ON user_color_preferences FOR DELETE TO authenticated USING (true);

-- GROUPES_CONTACTS
CREATE POLICY "groupes_contacts_select" ON groupes_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "groupes_contacts_update" ON groupes_contacts FOR UPDATE TO authenticated USING (true);

-- DOCUMENTS
CREATE POLICY "documents_select" ON documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "documents_insert" ON documents FOR INSERT TO authenticated WITH CHECK (true);

-- POSTES_FIGES
CREATE POLICY "postes_figes_select" ON postes_figes FOR SELECT TO authenticated USING (true);


-- =============================================
-- RAPPEL : CONFIG AUTH (a faire dans le Dashboard)
-- =============================================
-- 1. Authentication > Providers > Email
--    - Activer "Enable Email Provider"
--    - DESACTIVER "Confirm email"
--
-- 2. Authentication > URL Configuration
--    - Site URL : votre URL Netlify
--    - Redirect URLs : votre URL + /reset-password
--
-- 3. Storage > New Bucket (creer manuellement) :
--    - "documents"    (prive)
--    - "bibliotheque" (prive)
--    - "signatures"   (prive)

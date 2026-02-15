-- =============================================
-- PARTIE 2/4 - INDEX
-- =============================================
-- Executer APRES 01_tables.sql
-- =============================================

-- agents
CREATE INDEX IF NOT EXISTS idx_agents_actif ON agents(actif);
CREATE INDEX IF NOT EXISTS idx_agents_groupe_id ON agents(groupe_id);
CREATE INDEX IF NOT EXISTS idx_agents_ordre ON agents(ordre);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);

-- planning
CREATE INDEX IF NOT EXISTS idx_planning_date ON planning(date);
CREATE INDEX IF NOT EXISTS idx_planning_agent_id ON planning(agent_id);
CREATE INDEX IF NOT EXISTS idx_planning_agent_date ON planning(agent_id, date);

-- habilitations
CREATE INDEX IF NOT EXISTS idx_habilitations_agent_id ON habilitations(agent_id);

-- codes_services
CREATE INDEX IF NOT EXISTS idx_codes_services_code ON codes_services(code);
CREATE INDEX IF NOT EXISTS idx_codes_services_categorie ON codes_services(categorie);

-- uploads_pdf
CREATE INDEX IF NOT EXISTS idx_uploads_pdf_created_at ON uploads_pdf(created_at DESC);

-- notes
CREATE INDEX IF NOT EXISTS idx_notes_agent_id ON notes(agent_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- user_color_preferences
CREATE INDEX IF NOT EXISTS idx_user_colors_email_context ON user_color_preferences(user_email, context);

-- documents
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- postes_figes
CREATE INDEX IF NOT EXISTS idx_postes_figes_date ON postes_figes(date);

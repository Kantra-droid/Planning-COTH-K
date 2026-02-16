-- ============================================
-- Migration: Ajout colonnes manquantes dans planning
-- A executer dans Supabase SQL Editor
-- ============================================

-- 1. Colonnes pour le statut conge (C, C?, CNA)
ALTER TABLE planning ADD COLUMN IF NOT EXISTS statut_conge TEXT;

-- 2. Colonne texte libre
ALTER TABLE planning ADD COLUMN IF NOT EXISTS texte_libre TEXT;

-- 3. Colonne postes supplementaires (tableau JSON)
ALTER TABLE planning ADD COLUMN IF NOT EXISTS postes_supplementaires JSONB;

-- 4. Colonne note privee (visible uniquement dans Mon Planning)
ALTER TABLE planning ADD COLUMN IF NOT EXISTS note_privee TEXT;

-- 5. Synchroniser les donnees : copier service_code vers code_service si manquant
UPDATE planning
SET code_service = service_code
WHERE code_service IS NULL AND service_code IS NOT NULL;

-- 6. Verification
SELECT
  column_name, data_type
FROM information_schema.columns
WHERE table_name = 'planning'
ORDER BY ordinal_position;

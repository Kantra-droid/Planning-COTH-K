-- ============================================
-- Migration: Systeme de roles et connexion agents
-- A executer dans Supabase SQL Editor AVANT le deploiement
-- ============================================

-- 1. Ajouter les colonnes manquantes
ALTER TABLE agents ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Generer les emails pour tous les agents : nom_en_minuscule@cothk.fr
UPDATE agents SET email = LOWER(REPLACE(nom, ' ', '-')) || '@cothk.fr'
WHERE email IS NULL OR email = '';

-- 3. Lier et promouvoir TRAORE comme admin
UPDATE agents
SET user_id = '946a6a94-2605-4fb5-ab82-1a72b754b05e',
    is_admin = true
WHERE UPPER(nom) = 'TRAORE';

-- 4. Verification
SELECT nom, email, user_id, is_admin FROM agents ORDER BY nom;

-- =============================================
-- PARTIE 3/4 - DONNEES INITIALES
-- =============================================
-- Executer APRES 02_index.sql
-- =============================================

-- Groupes COT H/K
INSERT INTO groupes (nom, description, ordre) VALUES
  ('GTI', 'Groupe Technique Intervention', 1)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('Appui GTI / ROK', 'Appui GTI / ROK', 2)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('GM', 'Groupe Maintenance', 3)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('GPIV', 'Groupe PIV', 4)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('GIV', 'Groupe IV', 5)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('RLIV', 'RLIV', 6)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('RLIV PSE', 'RLIV PSE', 7)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('RLIV HC', 'RLIV HC', 8)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('RLIV ZDC', 'RLIV ZDC', 9)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('RLIV ZD', 'RLIV ZD', 10)
ON CONFLICT (nom) DO NOTHING;

INSERT INTO groupes (nom, description, ordre) VALUES
  ('RLIV ZDE', 'RLIV ZDE', 11)
ON CONFLICT (nom) DO NOTHING;


-- Codes de service : Services de base
INSERT INTO codes_services (code, description, categorie) VALUES
  ('-', 'Matin', 'service')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('O', 'Soir / Apres-midi', 'service')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('X', 'Nuit', 'service')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('I', 'Journee', 'service')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Repos
INSERT INTO codes_services (code, description, categorie) VALUES
  ('RP', 'Repos Periodique', 'repos')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('RU', 'Repos Unique', 'repos')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('RQ', 'Repos Quadruple', 'repos')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('NU', 'Non Utilise', 'repos')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Conges
INSERT INTO codes_services (code, description, categorie) VALUES
  ('C25', 'Conge Annuel 2025', 'conge')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('C26', 'Conge Annuel 2026', 'conge')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('CF', 'Conge Ferie', 'conge')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Formation
INSERT INTO codes_services (code, description, categorie) VALUES
  ('VT', 'Visite Medicale', 'formation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('F1', 'Formation 1', 'formation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('F2', 'Formation 2', 'formation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('F3', 'Formation 3', 'formation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('F5', 'Formation 5', 'formation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('F8', 'Formation 8', 'formation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('F9', 'Formation 9', 'formation')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('F0', 'Formation 0', 'formation')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Disponibilite
INSERT INTO codes_services (code, description, categorie) VALUES
  ('(d)', 'Disponible', 'disponibilite')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('DD', 'Double Disponibilite', 'disponibilite')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Speciaux GTI
INSERT INTO codes_services (code, description, categorie) VALUES
  ('-GTI', 'Matin GTI', 'special_gti')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OGTI', 'Soir GTI', 'special_gti')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('XGTI', 'Nuit GTI', 'special_gti')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('-AGTI', 'Matin Appui GTI', 'special_gti')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OAGTI', 'Soir Appui GTI', 'special_gti')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('-GM', 'Matin GM', 'special_gti')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OGM', 'Soir GM', 'special_gti')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('XGM', 'Nuit GM', 'special_gti')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Speciaux GPIV/GIV
INSERT INTO codes_services (code, description, categorie) VALUES
  ('-GPIV', 'Matin GPIV', 'special_gpiv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OGPIV', 'Soir GPIV', 'special_gpiv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('-GIV', 'Matin GIV', 'special_gpiv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OGIV', 'Soir GIV', 'special_gpiv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('XGIV', 'Nuit GIV', 'special_gpiv')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Speciaux RLIV
INSERT INTO codes_services (code, description, categorie) VALUES
  ('-PSE', 'Matin PSE', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OPSE', 'Soir PSE', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('-HC', 'Matin HC', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OHC', 'Soir HC', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('-ZDC', 'Matin ZDC', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OZDC', 'Soir ZDC', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('-ZD', 'Matin ZD', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OZD', 'Soir ZD', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('-ZDE', 'Matin ZDE', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('OZDE', 'Soir ZDE', 'special_rliv')
ON CONFLICT (code) DO NOTHING;

-- Codes de service : Autres
INSERT INTO codes_services (code, description, categorie) VALUES
  ('CS', 'Compte Supplementaire', 'autre')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('EIA', 'EIA', 'autre')
ON CONFLICT (code) DO NOTHING;

INSERT INTO codes_services (code, description, categorie) VALUES
  ('MA', 'Maladie', 'autre')
ON CONFLICT (code) DO NOTHING;

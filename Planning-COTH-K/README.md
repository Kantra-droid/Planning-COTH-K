# Planning COT H/K

Application web de gestion du planning annuel des groupes d'intervention COT H/K.

## 🏗️ Groupes gérés

### Onglet 1 : GTI / Appui GTI ROK / GM
- **GTI** — Groupe Technique d'Intervention (roulement + réserve)
- **Appui GTI / ROK** — Appui GTI et ROK (roulement + réserve)
- **GM** — Groupe Maintenance (roulement + réserve)

### Onglet 2 : GPIV / GIV / RLIV
- **GPIV** — Groupe Polyvalent d'Intervention Voie (roulement + réserve)
- **GIV** — Groupe d'Intervention Voie (roulement + réserve)
- **RLIV** — Réserve Locale d'Intervention Voie
  - RLIV PSE (Pôle d'échange Pontoise)
  - RLIV HC (Hors Centre)
  - RLIV ZDC (Zone Dense Centre)
  - RLIV ZD (Zone Diffuse)
  - RLIV ZDE (Zone Dense Est)

## 🛠️ Stack technique

- **React 18** — Interface utilisateur
- **Supabase** — Base de données PostgreSQL + authentification
- **Tailwind CSS** — Styles
- **Lucide React** — Icônes
- **date-fns** — Manipulation de dates

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/Kantra-droid/Planning-COTH-K.git
cd Planning-COTH-K

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Lancer l'application
npm start
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine :

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📊 Base de données

### Tables
- `groupes` — Groupes organisationnels (GTI, GM, GPIV, etc.)
- `agents` — Agents avec lien vers groupe et type (roulement/réserve)
- `planning` — Entrées de planning (agent_id + date + code_service)
- `codes_services` — Référentiel des codes (avec couleurs)
- `habilitations` — Habilitations des agents
- `uploads_pdf` — Historique des imports PDF
- `notes` — Notes sur les agents

### Codes services principaux
| Code | Description | Catégorie |
|------|------------|-----------|
| `-` | Matin | Vacation |
| `O` | Soir | Vacation |
| `X` | Nuit | Vacation |
| `RP` | Repos Périodique | Repos |
| `RU` | Repos Unique | Repos |
| `C25`/`C26` | Congé Annuel | Congé |
| `VT` | Visite Médicale | Formation |
| `-GTI`, `OGTI` | Vacations GTI | Spécial |

## 📅 Période couverte

Planning annuel 2026 : du 29/12/2025 au 03/01/2027 (S01 à S52)

## 🔗 Déploiement

L'application peut être déployée sur **Netlify** :

```bash
npm run build
# Le dossier build/ est prêt pour le déploiement
```

## 📝 Licence

Projet interne — Usage réservé.

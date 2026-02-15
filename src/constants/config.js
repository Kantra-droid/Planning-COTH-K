// Constants pour l'application Planning COT H/K

export const MONTHS = [
  'JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DECEMBRE'
];

export const ANNEE_PLANNING = 2026;
export const CURRENT_YEAR = 2026;

export const JOURS_FERIES_2026 = {
  JANVIER: [1],
  FEVRIER: [],
  MARS: [],
  AVRIL: [6],
  MAI: [1, 8, 14, 25],
  JUIN: [],
  JUILLET: [14],
  AOÛT: [15],
  SEPTEMBRE: [],
  OCTOBRE: [],
  NOVEMBRE: [1, 11],
  DECEMBRE: [25]
};

export const JOURS_FERIES = JOURS_FERIES_2026;

export const JOURS_FERIES_2025 = {
  JANVIER: [1],
  FEVRIER: [],
  MARS: [],
  AVRIL: [21],       // Lundi de Paques
  MAI: [1, 8, 29],   // Fete du Travail, Victoire, Ascension
  JUIN: [9],          // Lundi de Pentecote
  JUILLET: [14],
  AOÛT: [15],
  SEPTEMBRE: [],
  OCTOBRE: [],
  NOVEMBRE: [1, 11],
  DECEMBRE: [25]
};

export const CODE_COLORS = {
  '-': 'bg-blue-100 text-blue-800',
  'O': 'bg-orange-100 text-orange-800',
  'X': 'bg-purple-100 text-purple-800',
  'I': 'bg-yellow-50 text-yellow-800',
  'RP': 'bg-green-100 text-green-700',
  'RU': 'bg-green-200 text-green-800',
  'RQ': 'bg-green-300 text-green-900',
  'C': 'bg-yellow-300 text-yellow-900 font-semibold',
  'C25': 'bg-amber-200 text-amber-900',
  'C26': 'bg-amber-300 text-amber-900',
  'CF': 'bg-amber-200 text-amber-800',
  'VT': 'bg-teal-100 text-teal-800',
  'F': 'bg-cyan-100 text-cyan-800',
  'F1': 'bg-cyan-100 text-cyan-800',
  'F2': 'bg-cyan-100 text-cyan-800',
  'F3': 'bg-cyan-100 text-cyan-800',
  'F5': 'bg-cyan-100 text-cyan-800',
  'F8': 'bg-cyan-100 text-cyan-800',
  'F9': 'bg-cyan-100 text-cyan-800',
  'F0': 'bg-cyan-100 text-cyan-800',
  '(d)': 'bg-lime-100 text-lime-800',
  'd': 'bg-lime-100 text-lime-800',
  'DD': 'bg-lime-200 text-lime-900',
  '-GTI': 'bg-blue-200 text-blue-900 font-semibold',
  'OGTI': 'bg-orange-200 text-orange-900 font-semibold',
  'XGTI': 'bg-purple-200 text-purple-900 font-semibold',
  '-AGTI': 'bg-blue-200 text-blue-900',
  'OAGTI': 'bg-orange-200 text-orange-900',
  '-GM': 'bg-blue-200 text-blue-900',
  'OGM': 'bg-orange-200 text-orange-900',
  'XGM': 'bg-purple-200 text-purple-900',
  '-GPIV': 'bg-blue-200 text-blue-900 font-semibold',
  'OGPIV': 'bg-orange-200 text-orange-900 font-semibold',
  '-GIV': 'bg-blue-200 text-blue-900',
  'OGIV': 'bg-orange-200 text-orange-900',
  'XGIV': 'bg-purple-200 text-purple-900',
  '-PSE': 'bg-blue-200 text-blue-900',
  'OPSE': 'bg-orange-200 text-orange-900',
  '-HC': 'bg-blue-200 text-blue-900',
  'OHC': 'bg-orange-200 text-orange-900',
  '-ZDC': 'bg-blue-200 text-blue-900',
  'OZDC': 'bg-orange-200 text-orange-900',
  '-ZD': 'bg-blue-200 text-blue-900',
  'OZD': 'bg-orange-200 text-orange-900',
  '-ZDE': 'bg-blue-200 text-blue-900',
  'OZDE': 'bg-orange-200 text-orange-900',
  'NU': 'bg-gray-100 text-gray-500',
  'CS': 'bg-gray-200 text-gray-700',
  'EIA': 'bg-pink-100 text-pink-800',
  'MA': 'bg-red-200 text-red-800 font-semibold',
  '': 'bg-gray-50 text-gray-400'
};

export const GROUPES_ONGLET_1 = ['GTI', 'Appui GTI / ROK', 'GM'];
export const GROUPES_ONGLET_2 = ['GPIV', 'GIV', 'RLIV', 'RLIV PSE', 'RLIV HC', 'RLIV ZDC', 'RLIV ZD', 'RLIV ZDE'];

export const ORDRE_GROUPES = [
  'GTI', 'Appui GTI / ROK', 'GM',
  'GPIV', 'GIV', 'RLIV',
  'RLIV PSE', 'RLIV HC', 'RLIV ZDC', 'RLIV ZD', 'RLIV ZDE'
];

export const ONGLETS_PLANNING = [
  { id: 'gti_gm', label: 'GTI / Appui GTI ROK / GM', groupes: GROUPES_ONGLET_1 },
  { id: 'gpiv_giv_rliv', label: 'GPIV / GIV / RLIV', groupes: GROUPES_ONGLET_2 }
];

export const SERVICE_CODES = [
  { code: '-', desc: 'Matin' },
  { code: 'O', desc: 'Soir / Après-midi' },
  { code: 'X', desc: 'Nuit' },
  { code: 'I', desc: 'Journée' },
  { code: 'RP', desc: 'Repos Périodique' },
  { code: 'RU', desc: 'Repos Unique' },
  { code: 'RQ', desc: 'Repos Quadruple' },
  { code: 'NU', desc: 'Non Utilisé' }
];

export const CONGES_CODES = [
  { code: 'C25', desc: 'Congé Annuel 2025' },
  { code: 'C26', desc: 'Congé Annuel 2026' },
  { code: 'CF', desc: 'Congé Férié' }
];

export const FORMATION_CODES = [
  { code: 'VT', desc: 'Visite Médicale' },
  { code: 'F1', desc: 'Formation 1' },
  { code: 'F2', desc: 'Formation 2' },
  { code: 'F3', desc: 'Formation 3' },
  { code: 'F5', desc: 'Formation 5' },
  { code: 'F8', desc: 'Formation 8' },
  { code: 'F9', desc: 'Formation 9' },
  { code: 'F0', desc: 'Formation 0' }
];

export const DISPONIBILITE_CODES = [
  { code: '(d)', desc: 'Disponible' },
  { code: 'DD', desc: 'Double Disponibilité' }
];

export const CODES_SPECIAUX_GTI = [
  { code: '-GTI', desc: 'Matin GTI' },
  { code: 'OGTI', desc: 'Soir GTI' },
  { code: 'XGTI', desc: 'Nuit GTI' },
  { code: '-AGTI', desc: 'Matin Appui GTI' },
  { code: 'OAGTI', desc: 'Soir Appui GTI' },
  { code: '-GM', desc: 'Matin GM' },
  { code: 'OGM', desc: 'Soir GM' },
  { code: 'XGM', desc: 'Nuit GM' }
];

export const CODES_SPECIAUX_GPIV_GIV = [
  { code: '-GPIV', desc: 'Matin GPIV' },
  { code: 'OGPIV', desc: 'Soir GPIV' },
  { code: '-GIV', desc: 'Matin GIV' },
  { code: 'OGIV', desc: 'Soir GIV' },
  { code: 'XGIV', desc: 'Nuit GIV' }
];

export const CODES_SPECIAUX_RLIV = [
  { code: '-PSE', desc: 'Matin PSE' },
  { code: 'OPSE', desc: 'Soir PSE' },
  { code: '-HC', desc: 'Matin HC' },
  { code: 'OHC', desc: 'Soir HC' },
  { code: '-ZDC', desc: 'Matin ZDC' },
  { code: 'OZDC', desc: 'Soir ZDC' },
  { code: '-ZD', desc: 'Matin ZD' },
  { code: 'OZD', desc: 'Soir ZD' },
  { code: '-ZDE', desc: 'Matin ZDE' },
  { code: 'OZDE', desc: 'Soir ZDE' }
];

export const AUTRES_CODES = [
  { code: 'CS', desc: 'Compte Supplémentaire' },
  { code: 'EIA', desc: 'EIA' },
  { code: 'MA', desc: 'Maladie' }
];

export const TOUS_LES_CODES = [
  ...SERVICE_CODES,
  ...CONGES_CODES,
  ...FORMATION_CODES,
  ...DISPONIBILITE_CODES,
  ...CODES_SPECIAUX_GTI,
  ...CODES_SPECIAUX_GPIV_GIV,
  ...CODES_SPECIAUX_RLIV,
  ...AUTRES_CODES
];

export const POSTES_CODES = ['GTI', 'AGTI', 'GM', 'GPIV', 'GIV', 'PSE', 'HC', 'ZDC', 'ZD', 'ZDE'];

export const POSTES_CODES_WITH_LIBRE = [
  { code: '', desc: '— Aucun —' },
  { code: 'GTI', desc: 'GTI' },
  { code: 'AGTI', desc: 'Appui GTI' },
  { code: 'GM', desc: 'GM' },
  { code: 'GPIV', desc: 'GPIV' },
  { code: 'GIV', desc: 'GIV' },
  { code: 'PSE', desc: 'RLIV PSE' },
  { code: 'HC', desc: 'RLIV HC' },
  { code: 'ZDC', desc: 'RLIV ZDC' },
  { code: 'ZD', desc: 'RLIV ZD' },
  { code: 'ZDE', desc: 'RLIV ZDE' },
  { code: 'LIBRE', desc: '✏️ Texte libre...' }
];

export const LIBRE_MARKER = 'LIBRE';


// === Exports hérités du projet source (COGC) ===

export const SERVICE_JOUR_CODES = [
  { code: 'VL', desc: 'VL' },
  { code: 'D', desc: 'Disponible' },
  { code: 'EIA', desc: 'EIA' },
  { code: 'DPX', desc: 'DPX' },
  { code: 'PSE', desc: 'PSE' },
  { code: 'INAC', desc: 'Inactif' },
  { code: 'VM', desc: 'VM' }
];

export const HABILITATION_CODES = [
  { code: 'HAB', desc: 'Habilitation' },
  { code: 'FO RO', desc: 'FO RO' },
  { code: 'FO RC', desc: 'FO RC' },
  { code: 'FO CAC', desc: 'FO CAC' },
  { code: 'FO CRC', desc: 'FO CRC' },
  { code: 'FO ACR', desc: 'FO ACR' },
  { code: 'FO CCU', desc: 'FO CCU' }
];

export const JOURS_RH_CODES = [
  { code: 'VT', desc: 'Temps partiel' },
  { code: 'D2I', desc: 'D2I' },
  { code: 'RU', desc: 'RU' },
  { code: 'RA', desc: 'RA' },
  { code: 'RN', desc: 'RN' },
  { code: 'RQ', desc: 'RQ' },
  { code: 'TY', desc: 'TY' },
  { code: 'AY', desc: 'AY' },
  { code: 'AH', desc: 'AH' },
  { code: 'DD', desc: 'DD' }
];

export const PCD_CODES = [
  { code: 'CCCBO', desc: 'CCCBO' },
  { code: 'CBVD', desc: 'CBVD' }
];

export const ABSENCES_CODES = [
  { code: 'MA', desc: 'Maladie' },
  { code: 'F', desc: 'Férié' }
];

export const STATUT_CONGE_CODES = [
  { code: '', desc: 'Aucun' },
  { code: 'C', desc: 'Congé accordé' },
  { code: 'C?', desc: 'Congé en attente' },
  { code: 'CNA', desc: 'Congé refusé' }
];

export const POSTES_PAR_GROUPE = {
  // Agents RC - ROULEMENT REGULATEUR CENTRE → choix RC ou SOUFF
  'RC - ROULEMENT REGULATEUR CENTRE': ['RC', 'SOUF'],
  // Agents EAC - APPORT DENFERT → choix CCU ou RE
  'EAC - APPORT DENFERT': ['CCU', 'RE']
};

export const GROUPES_AVEC_POSTE = [
  'RESERVE REGULATEUR PN',
  'RESERVE REGULATEUR DR',
  'RESERVE PCD - DENFERT',
  'RC - ROULEMENT REGULATEUR CENTRE',
  'EAC - APPORT DENFERT'
];

export const POSTES_SUPPLEMENTAIRES = [
  { code: '+ACR', desc: 'Poste ACR supplémentaire' },
  { code: '+ACRF', desc: 'ACR Figé - temps réguls' },
  { code: '+RO', desc: 'Poste RO supplémentaire' },
  { code: '+RE', desc: 'Poste RE supplémentaire' },
  { code: '+RC', desc: 'Poste RC supplémentaire' },
  { code: '+CCU', desc: 'Poste CCU supplémentaire' },
  { code: '+CAC', desc: 'Poste CAC supplémentaire' },
  { code: '+SOUF', desc: 'Poste SOUF supplémentaire' },
  { code: '+OV', desc: 'Poste OV supplémentaire' },
  { code: '+PN', desc: 'Rapatriement Paris Nord' }
];

export const GROUPES_PAR_STATUT = {
  roulement: [
    'CRC - ROULEMENT CRC COGC',
    'ACR - ROULEMENT ACR COGC',
    'RC - ROULEMENT REGULATEUR CENTRE',
    'RO - ROULEMENT REGULATEUR TABLE OUEST',
    'CCU - ROULEMENT CCU DENFERT',
    'RE - ROULEMENT REGULATEUR TABLE EST DENFERT',
    'CAC - ROULEMENT DENFERT'
  ],
  reserve: [
    'RESERVE REGULATEUR PN',
    'RESERVE REGULATEUR DR',
    'EAC - APPORT DENFERT',
    'RESERVE PCD - DENFERT'
  ]
};


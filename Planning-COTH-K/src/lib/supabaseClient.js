import { createClient } from '@supabase/supabase-js';

// Configuration Supabase via variables d'environnement
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Configuration Supabase manquante!');
  throw new Error('Configuration Supabase manquante');
}

// Créer le client Supabase avec les bonnes options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Vérifier la connexion au démarrage
supabase.from('agents').select('count').then(result => {
  if (result.error) {
    console.error('❌ Erreur connexion Supabase:', result.error);
    console.error('Détails:', result.error.message, result.error.hint);
    console.error('Code erreur:', result.error.code);
  } else {
    // Connexion OK
  }
}).catch(err => {
  console.error('❌ Erreur lors de la vérification de connexion:', err);
});


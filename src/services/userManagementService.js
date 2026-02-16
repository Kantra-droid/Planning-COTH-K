import { supabase } from '../lib/supabaseClient';

// Mot de passe par défaut pour tous les agents
export const DEFAULT_PASSWORD = '123456';

/**
 * Genere l'email COT HK a partir du nom
 * Format: nom_en_minuscule@cothk.fr (espaces remplaces par des tirets)
 *
 * @param {string} nom - Nom de l'agent
 * @param {string} [prenom] - Prenom (ignore, conserve pour compat)
 * @returns {string} Email genere
 */
export const generateEmail = (nom, prenom) => {
  if (!nom) return '';
  const cleanNom = nom.toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `${cleanNom}@cothk.fr`;
};

// Alias pour compatibilite avec l'ancien code
export const generateSNCFEmail = generateEmail;

/**
 * Crée un compte utilisateur Supabase Auth pour un agent
 * 
 * IMPORTANT: Pour éviter l'envoi d'email de confirmation, 
 * configurer Supabase Dashboard:
 * - Authentication > Providers > Email > Désactiver "Confirm email"
 * - Ou activer "Enable automatic confirmation"
 * 
 * @param {Object} agent - L'agent { id, nom, prenom, email }
 * @param {string} agent.id - ID de l'agent en BDD
 * @param {string} agent.nom - Nom de l'agent
 * @param {string} agent.prenom - Prénom de l'agent
 * @param {string} [agent.email] - Email (optionnel, généré si absent)
 * @returns {Object} - { success, email, error, exists, data }
 */
export const createAgentAccount = async (agent) => {
  // Utiliser l'email fourni ou le generer
  const email = agent.email || generateEmail(agent.nom, agent.prenom);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: DEFAULT_PASSWORD,
      options: {
        data: {
          agent_id: agent.id,
          nom: agent.nom,
          prenom: agent.prenom,
        }
      }
    });

    if (error) {
      // Si l'utilisateur existe deja
      if (error.message.includes('already registered') ||
          error.message.includes('already been registered')) {
        return {
          success: false,
          email,
          error: 'Compte déjà existant',
          exists: true
        };
      }
      throw error;
    }

    // Verifier si c'est un utilisateur existant (Supabase retourne quand meme data sans erreur)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return {
        success: false,
        email,
        error: 'Compte déjà existant',
        exists: true
      };
    }

    // Mettre a jour user_id et email dans la table agents
    if (data.user && agent.id) {
      const { error: updateError } = await supabase
        .from('agents')
        .update({ user_id: data.user.id, email })
        .eq('id', agent.id);

      if (updateError) {
        console.error(`Erreur mise a jour agents.user_id pour ${email}:`, updateError);
      }
    }

    console.log(`Compte Auth cree pour ${agent.nom} (${email})`);
    return { success: true, email, data };
  } catch (err) {
    console.error(`Erreur creation compte Auth pour ${email}:`, err);
    return { success: false, email, error: err.message };
  }
};

const userManagementService = {
  DEFAULT_PASSWORD,
  generateEmail,
  generateSNCFEmail,
  createAgentAccount
};

export default userManagementService;

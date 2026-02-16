import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * useRole - Determine le role de l'utilisateur connecte
 *
 * Requete la table `agents` par email pour:
 * - Determiner si l'utilisateur est admin (is_admin)
 * - Recuperer le profil agent (nom, id, groupe, etc.)
 * - Auto-guerison: remplit user_id si manquant au premier login
 *
 * @param {Object} user - L'utilisateur Supabase Auth connecte
 * @returns {{ isAdmin: boolean, agentProfile: Object|null, roleLoading: boolean }}
 */
export function useRole(user) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [agentProfile, setAgentProfile] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setAgentProfile(null);
      setRoleLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setRoleLoading(true);

        // Chercher l'agent par email
        const { data: agent, error } = await supabase
          .from('agents')
          .select('id, nom, prenom, email, user_id, is_admin, groupe_id, type_role, actif')
          .eq('email', user.email)
          .single();

        if (error || !agent) {
          console.warn('useRole: Aucun agent trouve pour', user.email);
          // Fallback: verifier si c'est TRAORE par user_id connu
          if (user.id === '946a6a94-2605-4fb5-ab82-1a72b754b05e') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          setAgentProfile(null);
          setRoleLoading(false);
          return;
        }

        // Auto-guerison: remplir user_id si manquant
        if (!agent.user_id) {
          console.log('useRole: Auto-guerison user_id pour', agent.nom);
          const { error: updateError } = await supabase
            .from('agents')
            .update({ user_id: user.id })
            .eq('id', agent.id);

          if (updateError) {
            console.error('useRole: Erreur mise a jour user_id:', updateError);
          }
        }

        setIsAdmin(agent.is_admin === true);
        setAgentProfile(agent);
      } catch (err) {
        console.error('useRole: Erreur:', err);
        setIsAdmin(false);
        setAgentProfile(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return { isAdmin, agentProfile, roleLoading };
}

export default useRole;

import React, { useState, useMemo } from 'react';
import { X, Edit, Info, Plus, ChevronUp, ChevronDown, UserPlus, Loader2, CheckCircle } from 'lucide-react';
import { generateEmail, createAgentAccount, DEFAULT_PASSWORD } from '../../services/userManagementService';
import { supabase } from '../../lib/supabaseClient';

const ModalGestionAgents = ({ isOpen, agents, isAdmin = false, user, onClose, onEditAgent, onViewHabilitations, onAddAgent, onReloadData }) => {
  const [sortOrder, setSortOrder] = useState(null);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [bulkResult, setBulkResult] = useState(null); // { created, existing, errors, total }

  const sortedAgents = useMemo(() => {
    if (!sortOrder) return agents;
    return [...agents].sort((a, b) => {
      const nameA = a.nom.toUpperCase();
      const nameB = b.nom.toUpperCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB, 'fr');
      } else {
        return nameB.localeCompare(nameA, 'fr');
      }
    });
  }, [agents, sortOrder]);

  const toggleSort = () => {
    if (sortOrder === null) {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder(null);
    }
  };

  const SortIcon = () => {
    if (sortOrder === 'asc') {
      return <ChevronUp className="w-4 h-4 text-blue-600" />;
    } else if (sortOrder === 'desc') {
      return <ChevronDown className="w-4 h-4 text-blue-600" />;
    }
    return (
      <div className="flex flex-col -space-y-1">
        <ChevronUp className="w-3 h-3 text-gray-400" />
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </div>
    );
  };

  // Compter les agents sans user_id (comptes manquants)
  const agentsWithoutAccount = agents.filter(a => !a.user_id);

  const handleBulkCreateAccounts = async () => {
    if (!window.confirm(
      `Creer les comptes pour ${agentsWithoutAccount.length} agents sans compte ?\n\nMot de passe par defaut : ${DEFAULT_PASSWORD}`
    )) return;

    setBulkCreating(true);
    setBulkResult(null);

    let created = 0;
    let existing = 0;
    let errors = 0;
    const total = agentsWithoutAccount.length;

    // Sauvegarder les identifiants admin pour re-login apres
    const adminEmail = user?.email;

    for (const agent of agentsWithoutAccount) {
      const email = agent.email || generateEmail(agent.nom, agent.prenom);

      try {
        const result = await createAgentAccount({
          id: agent.id,
          nom: agent.nom,
          prenom: agent.prenom || '',
          email
        });

        if (result.success) {
          created++;
        } else if (result.exists) {
          existing++;
        } else {
          errors++;
          console.error(`Erreur pour ${agent.nom}: ${result.error}`);
        }
      } catch (err) {
        errors++;
        console.error(`Erreur pour ${agent.nom}:`, err);
      }
    }

    // Re-login admin (signUp peut changer la session active)
    if (adminEmail) {
      try {
        await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: DEFAULT_PASSWORD
        });
      } catch (e) {
        console.warn('Re-login admin echoue, veuillez vous reconnecter manuellement');
      }
    }

    setBulkResult({ created, existing, errors, total });
    setBulkCreating(false);

    // Recharger les donnees pour mettre a jour les user_id
    if (onReloadData) {
      await onReloadData();
    }
  };

  if (!isOpen || !isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Gestion des Agents ({agents.length})</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  <button 
                    onClick={toggleSort}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    title="Trier par nom"
                  >
                    Agent
                    <SortIcon />
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Groupe</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Site</th>
                <th className="px-4 py-2 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAgents.map(agent => (
                <tr key={agent.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">
                    <div className="font-medium">{agent.nom} {agent.prenom}</div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 text-xs rounded ${
                      agent.statut === 'roulement' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {agent.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate" title={agent.groupe}>
                    {agent.groupe}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    <span className={agent.site === 'Denfert-Rochereau' ? 'text-purple-600' : 'text-blue-600'}>
                      {agent.site === 'Denfert-Rochereau' ? 'DR' : 'PN'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={() => onViewHabilitations && onViewHabilitations(agent)}
                        className="p-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        title="Voir habilitations"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditAgent && onEditAgent(agent)}
                        className="p-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        title="Modifier agent"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Resultat creation en masse */}
        {bulkResult && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">Creation terminee</span>
            </div>
            <p className="text-xs text-gray-700">
              {bulkResult.created} crees, {bulkResult.existing} existants, {bulkResult.errors} erreurs / {bulkResult.total} total
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onAddAgent}
              className="flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nouvel Agent
            </button>

            {agentsWithoutAccount.length > 0 && (
              <button
                onClick={handleBulkCreateAccounts}
                disabled={bulkCreating}
                className="flex items-center px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 disabled:bg-gray-400"
              >
                {bulkCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Creation en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Creer comptes manquants ({agentsWithoutAccount.length})
                  </>
                )}
              </button>
            )}
          </div>

          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGestionAgents;

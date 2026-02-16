import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Phone, Mail, Users, Edit2, Save, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import supabaseService from '../../services/supabaseService';
import useIsMobile from '../../hooks/useIsMobile';

/**
 * ModalAnnuaire - Annuaire des agents COT HK
 *
 * Affiche tous les agents triés par catégorie :
 *   - GTI / Appui GTI ROK / GM
 *   - GPIV / GIV / RLIV (+ variantes)
 *
 * Chaque agent peut modifier son propre téléphone/email.
 *
 * v5.0 - Refonte complète sur le vrai schéma DB
 */

// Deux super-catégories demandées
const CATEGORIES = [
  {
    id: 'cat1',
    label: 'GTI / Appui GTI ROK / GM',
    color: '#0066b3',
    // groupes avec ordre 1, 2, 3
    matchOrdre: [1, 2, 3]
  },
  {
    id: 'cat2',
    label: 'GPIV / GIV / RLIV',
    color: '#c91932',
    // groupes avec ordre >= 4
    matchOrdre: [4, 5, 6, 7, 8, 9, 10, 11]
  }
];

const ModalAnnuaire = ({ isOpen, onClose, currentUser }) => {
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Groupes collapsés
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // Édition agent
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ telephone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const toggleGroupCollapse = (groupName) => {
    setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  // Charger les agents avec leurs groupes
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = supabaseService.client;

      const { data, error: queryError } = await supabase
        .from('agents')
        .select('id, nom, prenom, email, telephone, actif, groupe_id, groupes(nom, description, ordre)')
        .eq('actif', true)
        .order('nom');

      if (queryError) throw queryError;

      // Aplatir les données de groupe
      const enriched = (data || []).map(agent => ({
        ...agent,
        groupeNom: agent.groupes?.nom || 'Sans groupe',
        groupeDesc: agent.groupes?.description || '',
        groupeOrdre: agent.groupes?.ordre || 99
      }));

      setAgents(enriched);
    } catch (err) {
      console.error('Erreur chargement annuaire:', err);
      setError('Impossible de charger l\'annuaire');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
      setSearchTerm('');
      setEditingId(null);
    }
  }, [isOpen, loadData]);

  // Vérifier si c'est l'utilisateur connecté
  const isCurrentUser = useCallback((agent) => {
    if (!currentUser?.email || !agent.email) return false;
    return currentUser.email.toLowerCase() === agent.email.toLowerCase();
  }, [currentUser]);

  // Édition
  const startEdit = (agent) => {
    setEditingId(agent.id);
    setEditForm({
      telephone: agent.telephone || '',
      email: agent.email || ''
    });
    setSaveMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ telephone: '', email: '' });
    setSaveMessage(null);
  };

  const saveEdit = async (agentId) => {
    try {
      setSaving(true);
      setSaveMessage(null);

      const supabase = supabaseService.client;
      const { error: updateError } = await supabase
        .from('agents')
        .update({
          telephone: editForm.telephone || null,
          email: editForm.email || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId);

      if (updateError) throw updateError;

      setAgents(prev => prev.map(a =>
        a.id === agentId
          ? { ...a, telephone: editForm.telephone, email: editForm.email }
          : a
      ));

      setSaveMessage({ type: 'success', text: 'Mis à jour !' });
      setTimeout(() => { setEditingId(null); setSaveMessage(null); }, 1500);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setSaveMessage({ type: 'error', text: 'Erreur de sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  // Filtrer les agents par recherche
  const filteredAgents = agents.filter(agent => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${agent.nom} ${agent.prenom || ''}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (agent.telephone || '').includes(searchTerm) ||
      (agent.email || '').toLowerCase().includes(searchLower) ||
      agent.groupeNom.toLowerCase().includes(searchLower)
    );
  });

  // Organiser par catégorie → sous-groupes
  const getOrganizedData = () => {
    return CATEGORIES.map(cat => {
      const catAgents = filteredAgents.filter(a => cat.matchOrdre.includes(a.groupeOrdre));

      // Sous-groupes triés par ordre
      const subGroups = {};
      catAgents.forEach(agent => {
        if (!subGroups[agent.groupeNom]) {
          subGroups[agent.groupeNom] = {
            nom: agent.groupeNom,
            desc: agent.groupeDesc,
            ordre: agent.groupeOrdre,
            agents: []
          };
        }
        subGroups[agent.groupeNom].agents.push(agent);
      });

      const sortedGroups = Object.values(subGroups).sort((a, b) => a.ordre - b.ordre);

      return {
        ...cat,
        groups: sortedGroups,
        totalAgents: catAgents.length
      };
    }).filter(cat => selectedCategory === 'all' || cat.id === selectedCategory);
  };

  const organized = !loading && !error ? getOrganizedData() : [];

  if (!isOpen) return null;

  // === RENDU CARTE AGENT (Mobile) ===
  const renderAgentCard = (agent) => {
    const isCurrent = isCurrentUser(agent);
    const isEditing = editingId === agent.id;

    return (
      <div
        key={agent.id}
        style={{
          padding: '12px',
          borderRadius: '10px',
          border: `1px solid ${isCurrent ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
          backgroundColor: isCurrent ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.03)',
          marginBottom: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: isCurrent ? '#00f0ff' : 'white', fontWeight: 'bold', fontSize: '14px' }}>
              {agent.nom} {agent.prenom || ''}
            </span>
            {isCurrent && (
              <span style={{
                fontSize: '10px', backgroundColor: 'rgba(0,240,255,0.2)', color: '#00f0ff',
                padding: '2px 8px', borderRadius: '10px'
              }}>Vous</span>
            )}
          </div>
          {!isEditing && (
            <button onClick={() => startEdit(agent)} style={styles.editBtn}>
              <Edit2 size={16} />
            </button>
          )}
        </div>

        {isEditing ? renderEditForm(agent) : renderContactInfo(agent)}
      </div>
    );
  };

  // === RENDU LIGNE TABLE (Desktop) ===
  const renderAgentRow = (agent) => {
    const isCurrent = isCurrentUser(agent);
    const isEditing = editingId === agent.id;

    return (
      <tr key={agent.id} style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: isCurrent ? 'rgba(0,240,255,0.06)' : 'transparent'
      }}>
        <td style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: isCurrent ? '#00f0ff' : 'white', fontWeight: '600', fontSize: '13px' }}>
              {agent.nom} {agent.prenom || ''}
            </span>
            {isCurrent && (
              <span style={{
                fontSize: '9px', backgroundColor: 'rgba(0,240,255,0.2)', color: '#00f0ff',
                padding: '2px 6px', borderRadius: '8px'
              }}>Vous</span>
            )}
          </div>
        </td>
        <td style={{ padding: '10px 12px' }}>
          {isEditing ? (
            <input type="tel" value={editForm.telephone}
              onChange={(e) => setEditForm(prev => ({ ...prev, telephone: e.target.value }))}
              placeholder="06 XX XX XX XX" style={styles.input} />
          ) : agent.telephone ? (
            <a href={`tel:${agent.telephone}`} style={styles.link}>
              <Phone size={12} /> {agent.telephone}
            </a>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>-</span>
          )}
        </td>
        <td style={{ padding: '10px 12px' }}>
          {isEditing ? (
            <input type="email" value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="prenom.nom@sncf.fr" style={styles.input} />
          ) : agent.email ? (
            <a href={`mailto:${agent.email}`} style={{ ...styles.link, wordBreak: 'break-all' }}>
              <Mail size={12} /> {agent.email}
            </a>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>-</span>
          )}
        </td>
        <td style={{ padding: '10px 12px', width: '80px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '4px' }}>
              {saving ? (
                <Loader2 size={16} style={{ color: '#00f0ff', animation: 'spin 1s linear infinite' }} />
              ) : saveMessage ? (
                saveMessage.type === 'success'
                  ? <CheckCircle size={16} style={{ color: '#4CAF50' }} />
                  : <AlertCircle size={16} style={{ color: '#ef4444' }} />
              ) : (
                <>
                  <button onClick={() => saveEdit(agent.id)} style={{ ...styles.editBtn, backgroundColor: 'rgba(76,175,80,0.2)' }}>
                    <Save size={14} style={{ color: '#4CAF50' }} />
                  </button>
                  <button onClick={cancelEdit} style={{ ...styles.editBtn, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <X size={14} style={{ color: '#999' }} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => startEdit(agent)} style={styles.editBtn}>
              <Edit2 size={14} />
            </button>
          )}
        </td>
      </tr>
    );
  };

  // Formulaire d'édition mobile
  const renderEditForm = (agent) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Phone size={14} style={{ color: '#666' }} />
        <input type="tel" value={editForm.telephone}
          onChange={(e) => setEditForm(prev => ({ ...prev, telephone: e.target.value }))}
          placeholder="06 XX XX XX XX" style={{ ...styles.input, flex: 1 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Mail size={14} style={{ color: '#666' }} />
        <input type="email" value={editForm.email}
          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
          placeholder="prenom.nom@sncf.fr" style={{ ...styles.input, flex: 1 }} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        {saving ? (
          <Loader2 size={16} style={{ color: '#00f0ff', animation: 'spin 1s linear infinite' }} />
        ) : saveMessage ? (
          <span style={{ color: saveMessage.type === 'success' ? '#4CAF50' : '#ef4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {saveMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {saveMessage.text}
          </span>
        ) : (
          <>
            <button onClick={() => saveEdit(agent.id)} style={{
              flex: 1, padding: '10px', backgroundColor: 'rgba(76,175,80,0.2)', border: '1px solid rgba(76,175,80,0.4)',
              borderRadius: '8px', color: '#4CAF50', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}><Save size={14} /> Enregistrer</button>
            <button onClick={cancelEdit} style={{
              flex: 1, padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px', color: '#999', cursor: 'pointer', fontSize: '13px'
            }}>Annuler</button>
          </>
        )}
      </div>
    </div>
  );

  // Infos contact mobile
  const renderContactInfo = (agent) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {agent.telephone ? (
        <a href={`tel:${agent.telephone}`} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
          backgroundColor: 'rgba(76,175,80,0.1)', borderRadius: '8px', color: '#4CAF50',
          textDecoration: 'none', fontSize: '13px', minHeight: '44px'
        }}><Phone size={16} /> {agent.telephone}</a>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
          <Phone size={14} /> Pas de téléphone
        </div>
      )}
      {agent.email ? (
        <a href={`mailto:${agent.email}`} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
          backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '8px', color: '#3b82f6',
          textDecoration: 'none', fontSize: '13px', wordBreak: 'break-all', minHeight: '44px'
        }}><Mail size={16} /> {agent.email}</a>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
          <Mail size={14} /> Pas d'email
        </div>
      )}
    </div>
  );

  // === RENDU SOUS-GROUPE ===
  const renderSubGroup = (group) => {
    const isCollapsed = collapsedGroups[group.nom];

    return (
      <div key={group.nom} style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        {/* Header sous-groupe */}
        <div
          onClick={() => toggleGroupCollapse(group.nom)}
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(0,102,179,0.1)',
            borderBottom: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '14px' }}>{group.nom}</span>
              <span style={{
                fontSize: '10px', backgroundColor: 'rgba(0,240,255,0.15)', color: '#00f0ff',
                padding: '2px 8px', borderRadius: '10px'
              }}>{group.agents.length}</span>
            </div>
            {group.desc && (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px' }}>{group.desc}</div>
            )}
          </div>
          {isCollapsed ? <ChevronDown size={18} color="#666" /> : <ChevronUp size={18} color="#666" />}
        </div>

        {/* Agents du sous-groupe */}
        {!isCollapsed && (
          isMobile ? (
            <div style={{ padding: '10px' }}>
              {group.agents.map(renderAgentCard)}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <th style={{ padding: '8px 12px' }}>Nom</th>
                    <th style={{ padding: '8px 12px' }}>Téléphone</th>
                    <th style={{ padding: '8px 12px' }}>Email</th>
                    <th style={{ padding: '8px 12px', width: '80px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {group.agents.map(renderAgentRow)}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{
        ...styles.modal,
        ...(isMobile ? { width: '100%', height: '100%', maxHeight: '100%', borderRadius: 0 } : {})
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: 'rgba(0,240,255,0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Users size={20} color="#00f0ff" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Annuaire COT HK</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                {agents.length} agents
              </p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={22} />
          </button>
        </div>

        {/* Search & Filter */}
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', gap: '10px', flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Rechercher un agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 40px',
                backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
              color: 'white', fontSize: '13px', outline: 'none', cursor: 'pointer'
            }}
          >
            <option value="all">Toutes les catégories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div style={{
          overflowY: 'auto', padding: '16px',
          maxHeight: isMobile ? 'calc(100vh - 200px)' : 'calc(90vh - 220px)'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)' }}>
              <Loader2 size={32} style={{ margin: '0 auto 12px', color: '#00f0ff', animation: 'spin 1s linear infinite' }} />
              Chargement de l'annuaire...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 12px' }} />
              {error}
            </div>
          ) : organized.length === 0 || organized.every(c => c.totalAgents === 0) ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
              Aucun résultat trouvé
            </div>
          ) : (
            organized.map(cat => (
              cat.totalAgents > 0 && (
                <div key={cat.id} style={{ marginBottom: '24px' }}>
                  {/* Titre catégorie */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '14px', paddingBottom: '10px',
                    borderBottom: `2px solid ${cat.color}40`
                  }}>
                    <div style={{
                      width: '6px', height: '24px', borderRadius: '3px',
                      backgroundColor: cat.color
                    }} />
                    <h3 style={{ margin: 0, color: cat.color, fontSize: '16px', fontWeight: 'bold' }}>
                      {cat.label}
                    </h3>
                    <span style={{
                      fontSize: '11px', backgroundColor: `${cat.color}20`, color: cat.color,
                      padding: '3px 10px', borderRadius: '12px'
                    }}>{cat.totalAgents} agents</span>
                  </div>

                  {/* Sous-groupes */}
                  {cat.groups.map(renderSubGroup)}
                </div>
              )
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>
            Cliquez sur le crayon pour modifier un contact
          </p>
          <button onClick={onClose} style={{
            padding: '10px 24px', backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
            color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
          }}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 9999, padding: '10px'
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    width: '100%', maxWidth: '900px', maxHeight: '90vh',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    border: '1px solid rgba(0,240,255,0.2)',
    boxShadow: '0 0 40px rgba(0,240,255,0.15)'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: '#1a1a2e'
  },
  closeBtn: {
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer', padding: '8px'
  },
  editBtn: {
    padding: '8px', backgroundColor: 'rgba(0,240,255,0.15)',
    border: '1px solid rgba(0,240,255,0.25)', borderRadius: '8px',
    color: '#00f0ff', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  },
  input: {
    padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px',
    color: 'white', fontSize: '13px', outline: 'none', width: '100%',
    boxSizing: 'border-box'
  },
  link: {
    color: '#00f0ff', textDecoration: 'none', fontSize: '12px',
    display: 'flex', alignItems: 'center', gap: '6px'
  }
};

export default ModalAnnuaire;

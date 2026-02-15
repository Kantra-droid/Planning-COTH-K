import { useState, useCallback, useEffect } from 'react';
import supabaseService from '../services/supabaseService';
import planningService from '../services/planningService';
import { MONTHS, CURRENT_YEAR } from '../constants/config';

/**
 * Hook personnalisé pour la gestion du planning COT H/K
 * @version 1.0.0
 */
export function usePlanning(user, currentMonth, currentYear = CURRENT_YEAR) {
  const [agents, setAgents] = useState([]);
  const [agentsData, setAgentsData] = useState({});
  const [habilitations, setHabilitations] = useState({});
  const [planning, setPlanning] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('⏳ Connexion...');

  const parseDayFromDateString = (dateString) => {
    return parseInt(dateString.split('-')[2], 10);
  };

  /**
   * Charge les données du planning pour le mois spécifié
   */
  const loadData = useCallback(async (month = currentMonth) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('🔗 Connexion Supabase...');
      
      // Charger les agents (avec relation groupe)
      const agentsResult = await supabaseService.getAgents();
      
      if (!agentsResult || agentsResult.length === 0) {
        setConnectionStatus('❌ Aucun agent trouvé');
        setError('Aucun agent trouvé dans la base de données');
        return;
      }
      
      // Charger les habilitations
      const habilitationsResult = await supabaseService.getHabilitations();
      
      // Organiser les données
      const { agentsByGroupe, habilitationsByAgent } = planningService.organizeData(
        agentsResult || [], 
        habilitationsResult || []
      );
      
      setAgents(agentsResult);
      setAgentsData(agentsByGroupe);
      setHabilitations(habilitationsByAgent);
      setConnectionStatus(`✅ ${agentsResult.length} agents connectés`);
      
      // Charger le planning du mois
      const monthIndex = MONTHS.indexOf(month);
      const year = currentYear;
      
      const startDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, monthIndex + 1, 0).getDate();
      const endDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      console.log(`📅 Chargement planning ${month} ${year}: du ${startDate} au ${endDate}`);
      
      const planningFromDB = await supabaseService.getPlanningForMonth(startDate, endDate);
      
      // Organiser les données de planning
      // Clé = "nom prenom" pour correspondre à PlanningTable
      const planningData = {};
      agentsResult.forEach(agent => {
        const agentKey = `${agent.nom} ${agent.prenom}`;
        planningData[agentKey] = {};
      });

      if (planningFromDB && planningFromDB.length > 0) {
        planningFromDB.forEach(entry => {
          const agent = agentsResult.find(a => a.id === entry.agent_id);
          if (agent) {
            const agentKey = `${agent.nom} ${agent.prenom}`;
            const day = parseDayFromDateString(entry.date);
            planningData[agentKey][day] = entry.code_service;
          }
        });
      }
      
      console.log(`📊 Planning: ${planningFromDB?.length || 0} entrées chargées`);
      setPlanning(planningData);
      
    } catch (err) {
      console.error('Erreur chargement données:', err);
      setError(`Erreur de connexion: ${err.message}`);
      setConnectionStatus('❌ Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, user]);

  /**
   * Récupère les données d'une cellule spécifique
   */
  const getCellData = useCallback((agentName, day) => {
    const cellValue = planning[agentName]?.[day];
    if (!cellValue) return null;
    
    if (typeof cellValue === 'string') {
      return { service: cellValue };
    }
    return cellValue;
  }, [planning]);

  /**
   * Met à jour une cellule du planning
   */
  const updateCell = useCallback(async (agentName, day, value) => {
    try {
      const agent = agents.find(a => `${a.nom} ${a.prenom}` === agentName);
      if (!agent) {
        console.error('Agent non trouvé:', agentName);
        return;
      }

      const date = planningService.formatDate(day, currentMonth, currentYear);
      
      if (value === '') {
        await supabaseService.deletePlanning(agent.id, date);
      } else {
        const codeService = typeof value === 'object' ? value.service : value;
        await supabaseService.savePlanning(agent.id, date, codeService);
      }
      
      // Mise à jour optimiste
      setPlanning(prev => ({
        ...prev,
        [agentName]: {
          ...prev[agentName],
          [day]: value
        }
      }));
      
      console.log(`✅ Cellule mise à jour: ${agentName} jour ${day}`, value);
      
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      throw err;
    }
  }, [agents, currentMonth, currentYear]);

  /**
   * Recharge les habilitations
   */
  const reloadHabilitations = useCallback(async () => {
    const habilitationsResult = await supabaseService.getHabilitations();
    const { habilitationsByAgent } = planningService.organizeData(agents, habilitationsResult);
    setHabilitations(habilitationsByAgent);
  }, [agents]);

  // Charger les données quand utilisateur/mois/année change
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentMonth, currentYear, loadData]);

  return {
    agents,
    agentsData,
    habilitations,
    planning,
    loading,
    error,
    connectionStatus,
    loadData,
    updateCell,
    getCellData,
    reloadHabilitations,
    setConnectionStatus
  };
}

export default usePlanning;

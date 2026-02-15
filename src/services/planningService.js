import { MONTHS, JOURS_FERIES, CURRENT_YEAR, ORDRE_GROUPES, CODE_COLORS } from '../constants/config';

/**
 * Service de gestion du planning COT H/K
 * @version 1.0.0
 */
class PlanningService {
  constructor() {
    this.codeColors = CODE_COLORS;
  }

  /**
   * Organise les agents par groupe et les habilitations par agent
   * Adapté pour le schéma COT H/K avec relation agents → groupes
   */
  organizeData(agents, habilitations) {
    const agentsByGroupe = {};
    
    // Initialiser tous les groupes
    ORDRE_GROUPES.forEach(groupe => {
      agentsByGroupe[groupe] = [];
    });
    
    // Organiser les agents par groupe (via la relation groupe.nom)
    agents.forEach(agent => {
      const groupeNom = agent.groupe?.nom || 'DIVERS';
      if (!agentsByGroupe[groupeNom]) {
        agentsByGroupe[groupeNom] = [];
      }
      agentsByGroupe[groupeNom].push(agent);
    });

    // Trier les agents dans chaque groupe par type_role (roulement d'abord) puis par ordre
    Object.keys(agentsByGroupe).forEach(groupe => {
      agentsByGroupe[groupe].sort((a, b) => {
        // Roulement avant réserve
        if (a.type_role !== b.type_role) {
          return a.type_role === 'roulement' ? -1 : 1;
        }
        // Puis par ordre
        return (a.ordre || 0) - (b.ordre || 0);
      });
    });
    
    // Organiser les habilitations par agent avec déduplication
    const habilitationsByAgent = {};
    habilitations.forEach(hab => {
      if (!habilitationsByAgent[hab.agent_id]) {
        habilitationsByAgent[hab.agent_id] = new Set();
      }
      habilitationsByAgent[hab.agent_id].add(hab.poste);
    });
    
    // Convertir Sets en tableaux
    Object.keys(habilitationsByAgent).forEach(agentId => {
      habilitationsByAgent[agentId] = [...habilitationsByAgent[agentId]];
    });
    
    return { agentsByGroupe, habilitationsByAgent };
  }

  /**
   * Retourne le nombre de jours dans un mois
   */
  getDaysInMonth(month, year = CURRENT_YEAR) {
    const monthIndex = MONTHS.indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  /**
   * Retourne le type de jour (weekend, férié)
   */
  getJourType(day, month, year = CURRENT_YEAR) {
    const monthIndex = MONTHS.indexOf(month);
    const date = new Date(year, monthIndex, day);
    const dayOfWeek = date.getDay();
    
    const joursFeriesMois = JOURS_FERIES[month] || [];
    const isFerier = joursFeriesMois.includes(day);
    
    return {
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isFerier: isFerier,
      date: date,
      dayOfWeek: dayOfWeek
    };
  }

  /**
   * Formate une date en string YYYY-MM-DD
   */
  formatDate(day, month, year = CURRENT_YEAR) {
    const monthIndex = MONTHS.indexOf(month);
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  }

  /**
   * Retourne le nom court du jour de la semaine
   */
  getDayName(day, month, year = CURRENT_YEAR) {
    const monthIndex = MONTHS.indexOf(month);
    const date = new Date(year, monthIndex, day);
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  }

  /**
   * Retourne la couleur CSS pour un code de service
   */
  getCodeColor(code) {
    return this.codeColors[code] || '';
  }
}

const planningService = new PlanningService();
export default planningService;

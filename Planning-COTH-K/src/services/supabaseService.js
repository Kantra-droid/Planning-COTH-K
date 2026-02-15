import { supabase } from '../lib/supabaseClient';

/**
 * Service Supabase pour Planning COT H/K
 * Adapté du COGC Planning pour le nouveau schéma avec groupes et agents COT H/K
 * @version 1.0.0
 */
class SupabaseService {
  get client() {
    return supabase;
  }

  // ============================================
  // ANNÉES DISPONIBLES
  // ============================================
  async getAvailableYears() {
    try {
      const { data, error } = await supabase
        .from('planning')
        .select('date')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Erreur getAvailableYears:', error);
        return [new Date().getFullYear()];
      }
      
      if (!data || data.length === 0) {
        return [new Date().getFullYear()];
      }
      
      const years = [...new Set(data.map(row => parseInt(row.date.split('-')[0], 10)))];
      return years.sort((a, b) => b - a);
    } catch (err) {
      console.error('Exception getAvailableYears:', err);
      return [new Date().getFullYear()];
    }
  }

  // ============================================
  // GROUPES
  // ============================================
  async getGroupes() {
    const { data, error } = await supabase
      .from('groupes')
      .select('*')
      .order('ordre');
    
    if (error) {
      console.error('Erreur getGroupes:', error);
      throw error;
    }
    return data || [];
  }

  // ============================================
  // AGENTS
  // ============================================
  async getAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select(`
        *,
        groupe:groupes(id, nom, description, ordre)
      `)
      .eq('actif', true)
      .order('ordre');
    
    if (error) {
      console.error('Erreur getAgents:', error);
      throw error;
    }
    return data || [];
  }

  async createAgent(agentData) {
    const cleanData = {
      nom: agentData.nom,
      prenom: agentData.prenom || null,
      groupe_id: agentData.groupe_id,
      type_role: agentData.type_role || 'roulement',
      actif: true,
      ordre: agentData.ordre || 0
    };

    const { data, error } = await supabase
      .from('agents')
      .insert(cleanData)
      .select(`*, groupe:groupes(id, nom, description, ordre)`);
    
    if (error) {
      console.error('Erreur createAgent:', error);
      throw error;
    }
    return data[0];
  }

  async updateAgent(agentId, agentData) {
    const cleanData = {};
    if (agentData.nom !== undefined) cleanData.nom = agentData.nom;
    if (agentData.prenom !== undefined) cleanData.prenom = agentData.prenom || null;
    if (agentData.groupe_id !== undefined) cleanData.groupe_id = agentData.groupe_id;
    if (agentData.type_role !== undefined) cleanData.type_role = agentData.type_role;
    if (agentData.actif !== undefined) cleanData.actif = agentData.actif;
    if (agentData.ordre !== undefined) cleanData.ordre = agentData.ordre;

    const { data, error } = await supabase
      .from('agents')
      .update(cleanData)
      .eq('id', agentId)
      .select(`*, groupe:groupes(id, nom, description, ordre)`);
    
    if (error) {
      console.error('Erreur updateAgent:', error);
      throw error;
    }
    return data;
  }

  async deleteAgent(agentId) {
    await supabase.from('habilitations').delete().eq('agent_id', agentId);
    await supabase.from('planning').delete().eq('agent_id', agentId);
    
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);
    
    if (error) {
      console.error('Erreur deleteAgent:', error);
      throw error;
    }
    return true;
  }

  // ============================================
  // HABILITATIONS
  // ============================================
  async getHabilitations() {
    const { data, error } = await supabase
      .from('habilitations')
      .select('*');
    
    if (error) {
      console.error('Erreur getHabilitations:', error);
      throw error;
    }
    return data || [];
  }

  async addHabilitation(agentId, poste) {
    const { data, error } = await supabase
      .from('habilitations')
      .insert({
        agent_id: agentId,
        poste: poste,
        date_obtention: new Date().toISOString().split('T')[0]
      })
      .select();
    
    if (error) throw error;
    return data;
  }

  async removeHabilitation(agentId, poste) {
    const { error } = await supabase
      .from('habilitations')
      .delete()
      .eq('agent_id', agentId)
      .eq('poste', poste);
    
    if (error) throw error;
    return true;
  }

  // ============================================
  // PLANNING
  // ============================================
  async getPlanningForMonth(startDate, endDate) {
    console.log(`🔍 getPlanningForMonth: ${startDate} → ${endDate}`);
    
    const { data, error, count } = await supabase
      .from('planning')
      .select('*', { count: 'exact' })
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date')
      .limit(5000);
    
    if (error) {
      console.error('❌ Erreur getPlanningForMonth:', error);
      throw error;
    }
    
    console.log(`📊 getPlanningForMonth: ${data?.length || 0} entrées (count: ${count})`);
    return data || [];
  }

  async savePlanning(agentId, date, codeService) {
    const { data: existing } = await supabase
      .from('planning')
      .select('id')
      .eq('agent_id', agentId)
      .eq('date', date)
      .single();

    const planningData = {
      agent_id: agentId,
      date: date,
      code_service: codeService
    };

    if (existing) {
      const { data, error } = await supabase
        .from('planning')
        .update(planningData)
        .eq('id', existing.id)
        .select();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('planning')
        .insert(planningData)
        .select();
      
      if (error) throw error;
      return data;
    }
  }

  async deletePlanning(agentId, date) {
    const { error } = await supabase
      .from('planning')
      .delete()
      .eq('agent_id', agentId)
      .eq('date', date);
    
    if (error) throw error;
    return true;
  }

  // ============================================
  // CODES SERVICES
  // ============================================
  async getCodesServices() {
    const { data, error } = await supabase
      .from('codes_services')
      .select('*')
      .order('categorie, code');
    
    if (error) {
      console.error('Erreur getCodesServices:', error);
      throw error;
    }
    return data || [];
  }

  // ============================================
  // UPLOAD PDF
  // ============================================
  async saveUploadRecord(uploadData) {
    const { data, error } = await supabase
      .from('uploads_pdf')
      .insert(uploadData)
      .select();
    
    if (error) throw error;
    return data;
  }

  async getUploads() {
    const { data, error } = await supabase
      .from('uploads_pdf')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // ============================================
  // NOTES
  // ============================================
  async getNotesForAgent(agentId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async addNote(agentId, contenu, auteur = null) {
    const { data, error } = await supabase
      .from('notes')
      .insert({ agent_id: agentId, contenu, auteur })
      .select();
    
    if (error) throw error;
    return data[0];
  }
}

const supabaseService = new SupabaseService();
export default supabaseService;

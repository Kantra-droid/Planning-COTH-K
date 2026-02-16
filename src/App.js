import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Hooks personnalisés
import { useAuth } from './hooks/useAuth';
import { useRole } from './hooks/useRole';
import { usePlanning } from './hooks/usePlanning';
import { useModals } from './hooks/useModals';

// Services
import supabaseService from './services/supabaseService';

// Components
import Header from './components/Header';
import MonthTabs from './components/MonthTabs';
import PlanningTable from './components/PlanningTable';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';

// Modals
import ModalCellEdit from './components/modals/ModalCellEdit';
import ModalGestionAgents from './components/modals/ModalGestionAgents';
import ModalEditAgent from './components/modals/ModalEditAgent';
import ModalHabilitations from './components/modals/ModalHabilitations';
import ModalPrevisionnelJour from './components/modals/ModalPrevisionnelJour';

// Constants
import { MONTHS, ONGLETS_PLANNING } from './constants/config';

// Styles
import './App.css';

/**
 * App - Composant principal Planning COT H/K
 * @version 1.0.0
 */
const App = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, agentProfile, roleLoading } = useRole(user);

  const [currentView, setCurrentView] = React.useState('landing');
  const [currentMonth, setCurrentMonth] = React.useState(MONTHS[new Date().getMonth()]);
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = React.useState([]);
  const [yearsLoading, setYearsLoading] = React.useState(true);
  
  // Onglet actif (GTI/GM ou GPIV/GIV/RLIV)
  const [activeTab, setActiveTab] = React.useState(ONGLETS_PLANNING[0].id);

  const {
    agents,
    agentsData,
    habilitations,
    planning,
    loading: dataLoading,
    error,
    connectionStatus,
    loadData,
    updateCell,
    getCellData,
    reloadHabilitations,
    setConnectionStatus
  } = usePlanning(user, currentMonth, currentYear);
  
  const {
    modals,
    selectedCell,
    selectedAgent,
    selectedDate,
    openCellEdit,
    openGestionAgents,
    openEditAgent,
    openHabilitations,
    openPrevisionnelJour,
    openChatAssistant,
    closeModal,
    setSelectedAgent
  } = useModals();

  // Années forcées
  const FORCED_YEARS = [2026];
  
  React.useEffect(() => {
    const loadAvailableYears = async () => {
      try {
        setYearsLoading(true);
        const yearsFromDB = await supabaseService.getAvailableYears();
        const allYears = [...new Set([...FORCED_YEARS, ...(yearsFromDB || [])])];
        const sortedYears = allYears.sort((a, b) => a - b);
        setAvailableYears(sortedYears);
        
        if (!sortedYears.includes(currentYear)) {
          setCurrentYear(sortedYears[0]);
        }
      } catch (err) {
        console.error('Erreur chargement années:', err);
        setAvailableYears(FORCED_YEARS);
      } finally {
        setYearsLoading(false);
      }
    };
    
    if (user) {
      loadAvailableYears();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigation
  const handleNavigate = (view) => {
    if (view === 'planning') {
      setCurrentMonth(MONTHS[new Date().getMonth()]);
      setCurrentView('planning');
    }
  };

  const handleBackToLanding = () => setCurrentView('landing');
  
  const handleChangeYear = (year) => {
    console.log(`🗓️ Changement année: ${currentYear} → ${year}`);
    setCurrentYear(year);
  };

  // Handlers planning
  const handleCellClick = (agentName, day) => {
    // Non-admin ne peut editer que sa propre ligne
    if (!isAdmin && agentProfile) {
      const ownName = `${agentProfile.nom} ${agentProfile.prenom || ''}`.trim();
      if (agentName.trim() !== ownName) return;
    }
    openCellEdit(agentName, day);
  };

  const handleDayHeaderClick = (day) => {
    const monthIndex = MONTHS.indexOf(currentMonth);
    const month = String(monthIndex + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${month}-${dayStr}`;
    openPrevisionnelJour(dateStr);
  };

  const handleUpdateCell = async (agentName, day, value) => {
    try {
      await updateCell(agentName, day, value);
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Handlers agents
  const handleAgentClick = (agent) => openHabilitations(agent);

  const handleEditAgent = (agent) => {
    openEditAgent(agent);
    closeModal('gestionAgents');
  };

  const handleAddAgent = () => {
    openEditAgent(null);
    closeModal('gestionAgents');
  };

  const handleCreateAgent = async (formData) => {
    try {
      const createdAgent = await supabaseService.createAgent(formData);
      await loadData(currentMonth);
      setConnectionStatus('✅ Nouvel agent créé');
      return createdAgent;
    } catch (err) {
      alert(`Erreur: ${err.message}`);
      throw err;
    }
  };

  const handleSaveAgent = async (agentId, formData) => {
    try {
      await supabaseService.updateAgent(agentId, formData);
      await loadData(currentMonth);
      setConnectionStatus('✅ Agent mis à jour');
      closeModal('editAgent');
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      await supabaseService.deleteAgent(agentId);
      await loadData(currentMonth);
      setConnectionStatus('✅ Agent supprimé');
      closeModal('editAgent');
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  // Habilitations
  const handleAddHabilitation = async (agentId, poste) => {
    try {
      await supabaseService.addHabilitation(agentId, poste);
      await reloadHabilitations();
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleRemoveHabilitation = async (agentId, poste) => {
    try {
      await supabaseService.removeHabilitation(agentId, poste);
      await reloadHabilitations();
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  // Filtrer les agents par onglet actif
  const activeOnglet = ONGLETS_PLANNING.find(o => o.id === activeTab);
  const filteredAgentsData = {};
  if (activeOnglet) {
    activeOnglet.groupes.forEach(groupe => {
      if (agentsData[groupe]) {
        filteredAgentsData[groupe] = agentsData[groupe];
      }
    });
  }

  // === RENDU ===
  
  if (authLoading || (user && roleLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <div className="text-lg text-gray-600">Vérification...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => {}} />;
  }

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onNavigate={handleNavigate}
        user={user}
        onSignOut={signOut}
      />
    );
  }

  if (dataLoading || yearsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <div className="text-lg text-gray-600">Chargement des données...</div>
          <div className="text-sm text-gray-500 mt-2">{connectionStatus}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <div className="text-lg text-red-600 mb-2">Erreur de connexion</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => loadData()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Réessayer
            </button>
            <button onClick={handleBackToLanding} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCellData = selectedCell ? getCellData(selectedCell.agent, selectedCell.day) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        isAdmin={isAdmin}
        connectionStatus={connectionStatus}
        onOpenGestionAgents={openGestionAgents}
        onOpenChatAssistant={openChatAssistant}
        onSignOut={signOut}
        onBackToLanding={handleBackToLanding}
        showBackButton={true}
      />
      
      <MonthTabs 
        currentMonth={currentMonth}
        currentYear={currentYear}
        availableYears={availableYears}
        onChangeMonth={setCurrentMonth}
        onChangeYear={handleChangeYear}
      />

      {/* Onglets COT H/K */}
      <div className="bg-white border-b px-4">
        <div className="flex gap-1">
          {ONGLETS_PLANNING.map(onglet => (
            <button
              key={onglet.id}
              onClick={() => setActiveTab(onglet.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === onglet.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {onglet.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <PlanningTable
          currentMonth={currentMonth}
          currentYear={currentYear}
          planning={planning}
          agentsData={filteredAgentsData}
          onCellClick={handleCellClick}
          onAgentClick={handleAgentClick}
          onDayHeaderClick={handleDayHeaderClick}
          currentUser={user}
          isAdmin={isAdmin}
          agentProfile={agentProfile}
        />
      </div>
      
      {/* MODALS */}
      {selectedCell && (
        <ModalCellEdit
          selectedCell={selectedCell}
          cellData={selectedCellData}
          agentsData={agentsData}
          allAgents={agents}
          allPlanning={planning}
          currentMonth={MONTHS.indexOf(currentMonth)}
          currentYear={currentYear}
          userEmail={user?.email}
          isAdmin={isAdmin}
          agentProfile={agentProfile}
          onUpdateCell={handleUpdateCell}
          onClose={() => closeModal('cellEdit')}
        />
      )}
      
      <ModalGestionAgents
        isOpen={modals.gestionAgents}
        agents={agents}
        isAdmin={isAdmin}
        user={user}
        onClose={() => closeModal('gestionAgents')}
        onEditAgent={handleEditAgent}
        onViewHabilitations={handleAgentClick}
        onAddAgent={handleAddAgent}
        onReloadData={() => loadData(currentMonth)}
      />

      <ModalEditAgent
        isOpen={modals.editAgent}
        agent={selectedAgent}
        isAdmin={isAdmin}
        onClose={() => {
          closeModal('editAgent');
          setSelectedAgent(null);
        }}
        onSave={handleSaveAgent}
        onDelete={handleDeleteAgent}
        onCreate={handleCreateAgent}
      />
      
      <ModalHabilitations
        isOpen={modals.habilitations}
        agent={selectedAgent}
        habilitations={habilitations}
        onClose={() => closeModal('habilitations')}
        onAddHabilitation={handleAddHabilitation}
        onRemoveHabilitation={handleRemoveHabilitation}
      />

      <ModalPrevisionnelJour
        isOpen={modals.previsionnelJour}
        selectedDate={selectedDate}
        agents={agents}
        planningData={planning}
        onClose={() => closeModal('previsionnelJour')}
      />
    </div>
  );
};

export default App;

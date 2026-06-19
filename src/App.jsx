import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import AICoach from './components/AICoach';
import Challenges from './components/Challenges';
import Goals from './components/Goals';
import Achievements from './components/Achievements';
import Profile from './components/Profile';
import Insights from './components/Insights';
import { initialChallenges, badgesList, defaultState } from './data/environmentalData';
import { calculateEmissions, calculateScore } from './utils/calculations';

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage('ecotrack_tab', 'landing');
  const [hasCalculated, setHasCalculated] = useLocalStorage('ecotrack_has_calc', false);
  const [inputs, setInputs] = useLocalStorage('ecotrack_inputs', defaultState.inputs);
  const [results, setResults] = useLocalStorage('ecotrack_results', null);
  const [points, setPoints] = useLocalStorage('ecotrack_points', 0);
  const [challenges, setChallenges] = useLocalStorage('ecotrack_challenges', initialChallenges);
  const [badges, setBadges] = useLocalStorage('ecotrack_badges', badgesList);
  const [activeGoalsList, setActiveGoalsList] = useLocalStorage('ecotrack_active_goals', []);
  const [goalsState, setGoalsState] = useLocalStorage('ecotrack_goals_state', defaultState.goals);

  // Re-calculate score helper
  const annualTons = results?.annualTotalTons || 0;
  const score = results ? calculateScore(annualTons) : 0;

  // Handle calculator submission
  const handleCalculate = (newInputs, calculatedResults) => {
    setInputs(newInputs);
    setResults(calculatedResults);
    setHasCalculated(true);
    
    // Unlock beginner badge
    let updatedBadges = [...badges];
    updatedBadges = updatedBadges.map(b => {
      if (b.id === 'badge-beginner') return { ...b, unlocked: true };
      
      const newScore = calculateScore(calculatedResults.annualTotalTons);
      if (b.id === 'badge-warrior' && newScore >= 70) return { ...b, unlocked: true };
      
      // Sustainability master check
      const completedCount = challenges.filter(c => c.completed).length;
      if (b.id === 'badge-master' && newScore >= 90 && completedCount >= 5) return { ...b, unlocked: true };
      
      return b;
    });
    setBadges(updatedBadges);
  };

  // Complete a challenge
  const handleCompleteChallenge = (id, challengePoints) => {
    const updatedChallenges = challenges.map(c => 
      c.id === id ? { ...c, completed: true } : c
    );
    setChallenges(updatedChallenges);
    const newPoints = points + challengePoints;
    setPoints(newPoints);

    // Badges checks
    const completedCount = updatedChallenges.filter(c => c.completed).length;
    const updatedBadges = badges.map(b => {
      if (b.id === 'badge-defender' && completedCount >= 3) return { ...b, unlocked: true };
      if (b.id === 'badge-master' && score >= 90 && completedCount >= 5) return { ...b, unlocked: true };
      return b;
    });
    setBadges(updatedBadges);
  };

  // Add commitment/goal from AI Coach
  const handleAddGoal = (title, savings) => {
    if (activeGoalsList.some(g => g.title === title)) return;
    const newGoals = [...activeGoalsList, { title, savings }];
    setActiveGoalsList(newGoals);

    // Unlock cutter badge
    const updatedBadges = badges.map(b => {
      if (b.id === 'badge-cutter') return { ...b, unlocked: true };
      return b;
    });
    setBadges(updatedBadges);
  };

  // Remove goal
  const handleRemoveGoal = (title) => {
    setActiveGoalsList(activeGoalsList.filter(g => g.title !== title));
  };

  // Add custom goal manually
  const handleAddCustomGoal = (title) => {
    if (activeGoalsList.some(g => g.title === title)) return;
    const newGoals = [...activeGoalsList, { title, savings: 25 }]; // default custom savings estimate
    setActiveGoalsList(newGoals);

    // Unlock cutter badge
    const updatedBadges = badges.map(b => {
      if (b.id === 'badge-cutter') return { ...b, unlocked: true };
      return b;
    });
    setBadges(updatedBadges);
  };

  // Reset entire dashboard local storage values
  const handleResetData = () => {
    setActiveTab('landing');
    setHasCalculated(false);
    setInputs(defaultState.inputs);
    setResults(null);
    setPoints(0);
    setChallenges(initialChallenges);
    setBadges(badgesList);
    setActiveGoalsList([]);
    setGoalsState(defaultState.goals);
    window.localStorage.clear();
  };

  // Render proper view page component
  const renderPage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage 
            onStart={(tab = 'calculator') => setActiveTab(tab)} 
            hasCalculated={hasCalculated} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            state={{ points, history: defaultState.history, challenges }} 
            results={results} 
            activeGoalsList={activeGoalsList}
            setActiveTab={setActiveTab} 
          />
        );
      case 'calculator':
        return (
          <Calculator 
            currentInputs={inputs} 
            onCalculate={handleCalculate} 
            hasCalculated={hasCalculated}
          />
        );
      case 'coach':
        return (
          <AICoach 
            inputs={inputs} 
            results={results} 
            activeGoals={activeGoalsList.map(g => g.title)} 
            onAddGoal={handleAddGoal} 
            points={points} 
          />
        );
      case 'challenges':
        return (
          <Challenges 
            challenges={challenges} 
            onCompleteChallenge={handleCompleteChallenge} 
            points={points} 
          />
        );
      case 'goals':
        return (
          <Goals 
            currentAnnualEmissions={annualTons} 
            goalsState={goalsState} 
            onUpdateGoal={setGoalsState} 
            activeGoalsList={activeGoalsList}
            onRemoveGoal={handleRemoveGoal}
            onAddCustomGoal={handleAddCustomGoal}
          />
        );
      case 'achievements':
        return (
          <Achievements 
            badges={badges} 
            score={score} 
            completedChallengesCount={challenges.filter(c => c.completed).length} 
            activeGoalsCount={activeGoalsList.length} 
            hasCalculated={hasCalculated} 
          />
        );
      case 'insights':
        return <Insights />;
      case 'profile':
        return (
          <Profile 
            inputs={inputs} 
            results={results} 
            points={points} 
            completedChallengesCount={challenges.filter(c => c.completed).length} 
            activeGoalsCount={activeGoalsList.length} 
            badges={badges}
            score={score}
            onResetData={handleResetData}
          />
        );
      default:
        return (
          <LandingPage 
            onStart={() => setActiveTab('calculator')} 
            hasCalculated={hasCalculated} 
          />
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      points={points}
      score={score}
      hasCalculated={hasCalculated}
    >
      {renderPage()}
    </Layout>
  );
}

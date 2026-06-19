import React, { useState, useEffect } from 'react';
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
import { generateLocalInsight, generateLocalRecommendations } from './utils/aiService';
import { Award } from 'lucide-react';

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

  // Gemini state triggers
  const [aiInsight, setAiInsight] = useLocalStorage('ecotrack_ai_insight', null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useLocalStorage('ecotrack_ai_recs', []);
  const [aiRecommendationsLoading, setAiRecommendationsLoading] = useState(false);

  // New slide-in badge unlock toast state
  const [unlockedBadgeToast, setUnlockedBadgeToast] = useState(null);

  // Re-calculate score helper
  const annualTons = results?.annualTotalTons || 0;
  const score = results ? calculateScore(annualTons) : 0;

  // Handle calculator submission
  const handleCalculate = (newInputs, calculatedResults) => {
    setInputs(newInputs);
    setResults(calculatedResults);
    setHasCalculated(true);
    
    // Clear old AI cache
    setAiInsight(null);
    setAiRecommendations([]);

    // Trigger AI compilation loaders with simulated delay for professional feel
    setAiInsightLoading(true);
    setAiRecommendationsLoading(true);
    
    setTimeout(() => {
      const insight = generateLocalInsight(newInputs, calculatedResults);
      setAiInsight(insight);
      setAiInsightLoading(false);
    }, 1200);

    setTimeout(() => {
      const recs = generateLocalRecommendations(newInputs, calculatedResults);
      setAiRecommendations(recs);
      setAiRecommendationsLoading(false);
    }, 1600);
  };

  // Backfill AI data if user refreshed or loads an existing calculation
  useEffect(() => {
    if (hasCalculated && results && !aiInsight && !aiInsightLoading) {
      setAiInsightLoading(true);
      setTimeout(() => {
        const res = generateLocalInsight(inputs, results);
        setAiInsight(res);
        setAiInsightLoading(false);
      }, 600);
    }
    if (hasCalculated && results && (!aiRecommendations || aiRecommendations.length === 0) && !aiRecommendationsLoading) {
      setAiRecommendationsLoading(true);
      setTimeout(() => {
        const res = generateLocalRecommendations(inputs, results);
        setAiRecommendations(res);
        setAiRecommendationsLoading(false);
      }, 900);
    }
  }, [hasCalculated, results]);

  // Centralized Badge Unlocker Trigger
  useEffect(() => {
    if (!hasCalculated || !results) return;

    const completedCount = challenges.filter(c => c.completed).length;
    const goalsCount = activeGoalsList.length;

    const updated = badges.map(b => {
      let shouldUnlock = b.unlocked;

      if (b.id === 'badge-beginner') {
        shouldUnlock = true;
      } else if (b.id === 'badge-explorer') {
        shouldUnlock = score >= 60;
      } else if (b.id === 'badge-crusher') {
        shouldUnlock = goalsCount >= 2;
      } else if (b.id === 'badge-defender') {
        shouldUnlock = completedCount >= 3;
      } else if (b.id === 'badge-master') {
        shouldUnlock = score >= 85 && completedCount >= 5;
      } else if (b.id === 'badge-guardian') {
        shouldUnlock = score >= 90 && completedCount >= 7 && goalsCount >= 3;
      }

      if (shouldUnlock !== b.unlocked) {
        // Trigger Toast for new unlock!
        if (shouldUnlock === true) {
          setUnlockedBadgeToast(b);
          setTimeout(() => {
            setUnlockedBadgeToast(null);
          }, 4500);
        }
        return { ...b, unlocked: shouldUnlock };
      }
      return b;
    });

    const hasChanged = updated.some((b, i) => b.unlocked !== badges[i].unlocked);
    if (hasChanged) {
      setBadges(updated);
    }
  }, [hasCalculated, results, score, challenges, activeGoalsList, badges]);

  // Complete a challenge
  const handleCompleteChallenge = (id, challengePoints) => {
    const updatedChallenges = challenges.map(c => 
      c.id === id ? { ...c, completed: true } : c
    );
    setChallenges(updatedChallenges);
    const newPoints = points + challengePoints;
    setPoints(newPoints);
  };

  // Add commitment/goal from AI Coach
  const handleAddGoal = (title, savings) => {
    if (activeGoalsList.some(g => g.title === title)) return;
    const newGoals = [...activeGoalsList, { title, savings }];
    setActiveGoalsList(newGoals);
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
    setAiInsight(null);
    setAiRecommendations([]);
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
            aiInsight={aiInsight}
            aiInsightLoading={aiInsightLoading} 
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
            aiRecommendations={aiRecommendations}
            aiRecommendationsLoading={aiRecommendationsLoading} 
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
      {/* Dynamic Slide-in Badge Toast */}
      {unlockedBadgeToast && (
        <div className="fixed top-5 left-1/2 z-50 animate-toast-slide">
          <div className="glass-card border border-emerald-500/30 bg-slate-900/90 backdrop-blur-xl px-6 py-4 rounded-2xl flex items-center gap-4 shadow-[0_15px_40px_rgba(16,185,129,0.25)] border-emerald-400/30">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${unlockedBadgeToast.color} text-slate-950 flex-shrink-0 shadow-lg shadow-emerald-500/20`}>
              <Award className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest block">Achievement Unlocked!</span>
              <h4 className="font-extrabold text-sm text-white mt-0.5">{unlockedBadgeToast.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{unlockedBadgeToast.description}</p>
            </div>
          </div>
        </div>
      )}
      {renderPage()}
    </Layout>
  );
}

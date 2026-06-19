import React from 'react';
import { 
  Award, 
  Lock, 
  Compass, 
  Shield, 
  TrendingDown, 
  Zap, 
  HelpCircle,
  Trophy,
  Globe
} from 'lucide-react';

const ICON_MAP = {
  Compass: Compass,
  Award: Award,
  Shield: Shield,
  TrendingDown: TrendingDown,
  Zap: Zap
};

export default function Achievements({ 
  badges = [], 
  score = 0, 
  completedChallengesCount = 0, 
  activeGoalsCount = 0,
  hasCalculated = false 
}) {
  const unlockedCount = badges.filter(b => b.unlocked).length;

  // Calculate progression details per badge id
  const getBadgeProgress = (id) => {
    switch (id) {
      case 'badge-beginner':
        return {
          current: hasCalculated ? 1 : 0,
          target: 1,
          percent: hasCalculated ? 100 : 0,
          text: hasCalculated ? "Done" : "0 / 1 Completed"
        };
      case 'badge-explorer':
        const wPercent = Math.min(100, Math.round((score / 60) * 100));
        return {
          current: score,
          target: 60,
          percent: wPercent,
          text: `Score: ${score} / 60`
        };
      case 'badge-crusher':
        const crusherPercent = Math.min(100, Math.round((activeGoalsCount / 2) * 100));
        return {
          current: activeGoalsCount,
          target: 2,
          percent: crusherPercent,
          text: `Goals: ${activeGoalsCount} / 2`
        };
      case 'badge-defender':
        const dPercent = Math.min(100, Math.round((completedChallengesCount / 3) * 100));
        return {
          current: completedChallengesCount,
          target: 3,
          percent: dPercent,
          text: `Challenges: ${completedChallengesCount} / 3`
        };
      case 'badge-master':
        const scorePassedM = score >= 85 ? 1 : 0;
        const questsPassedM = completedChallengesCount >= 5 ? 1 : 0;
        const mPercent = Math.round(((scorePassedM + questsPassedM) / 2) * 100);
        return {
          current: scorePassedM + questsPassedM,
          target: 2,
          percent: mPercent,
          text: `Score >= 85: ${score >= 85 ? 'Yes' : 'No'} | Quests: ${completedChallengesCount}/5`
        };
      case 'badge-guardian':
        const scorePassedG = score >= 90 ? 1 : 0;
        const questsPassedG = completedChallengesCount >= 7 ? 1 : 0;
        const goalsPassedG = activeGoalsCount >= 3 ? 1 : 0;
        const gPercent = Math.round(((scorePassedG + questsPassedG + goalsPassedG) / 3) * 100);
        return {
          current: scorePassedG + questsPassedG + goalsPassedG,
          target: 3,
          percent: gPercent,
          text: `Score 90+: ${score >= 90 ? 'Yes' : 'No'} | Quests: ${completedChallengesCount}/7 | Goals: ${activeGoalsCount}/3`
        };
      default:
        return { current: 0, target: 1, percent: 0, text: "" };
    }
  };

  return (
    <div className="py-2 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Award className="w-8 h-8 text-emerald-400" />
          Eco Achievements & Badges
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Unlock prestigious achievements by hitting sustainable carbon goals and completing challenges.
        </p>
      </div>

      {/* Stats Board */}
      <div className="glass-card border border-emerald-500/20 bg-emerald-950/10 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex gap-4.5 items-center">
          <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30">
            <Trophy className="w-7 h-7 text-emerald-400 animate-float" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base md:text-lg mb-0.5">Your Ecological Badges Status</h3>
            <p className="text-slate-400 text-xs font-medium">
              Earn and claim medals to lock in your title as an Earth Guardian.
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right bg-slate-900/60 border border-white/5 px-6 py-3.5 rounded-2xl flex-shrink-0">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">Unlocked Medals</span>
          <span className="text-2xl font-black text-emerald-400">{unlockedCount} / {badges.length}</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map(b => {
          const IconComponent = ICON_MAP[b.icon] || HelpCircle;
          const prog = getBadgeProgress(b.id);
          const isUnlocked = b.unlocked;

          return (
            <div 
              key={b.id} 
              className={`glass-card border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                isUnlocked 
                  ? `border-emerald-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950/80 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.15)]`
                  : 'border-white/5 bg-slate-950/40 opacity-55'
              }`}
            >
              {/* spotlight glow */}
              {isUnlocked && (
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${b.color} opacity-[0.05] blur-xl`}></div>
              )}

              <div>
                {/* Badge Icon & Status label */}
                <div className="flex justify-between items-center mb-5">
                  <div className={`p-3.5 rounded-2xl border flex-shrink-0 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${b.color} text-slate-950 border-transparent shadow-lg shadow-emerald-500/10`
                      : 'bg-slate-900 border-white/5 text-slate-650'
                  }`}>
                    {isUnlocked ? <IconComponent className="w-6 h-6 text-slate-950" /> : <Lock className="w-6 h-6" />}
                  </div>
                  
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    isUnlocked 
                      ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                      : 'text-slate-650 border-slate-900 bg-slate-950'
                  }`}>
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-white mb-1.5 group-hover:text-emerald-400 transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                  {b.description}
                </p>
              </div>

              {/* Requirement & Progression bar */}
              <div className="border-t border-white/5 pt-4 mt-auto space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Requirement</span>
                  <span className={isUnlocked ? 'text-emerald-400' : 'text-slate-400'}>{b.requirementText}</span>
                </div>
                
                {/* Sub progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-extrabold text-slate-550">
                    <span>PROGRESSION</span>
                    <span>{prog.text}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${isUnlocked ? 'from-emerald-400 to-teal-400' : 'from-slate-700 to-slate-600'}`}
                      style={{ width: `${prog.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

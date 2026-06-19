import React from 'react';
import { 
  User, 
  Award, 
  Trash2, 
  RotateCcw, 
  TrendingDown, 
  Trophy, 
  Zap, 
  Target,
  ShieldAlert
} from 'lucide-react';
import { getScoreDetails } from '../utils/calculations';

export default function Profile({ 
  inputs, 
  results, 
  points = 0, 
  completedChallengesCount = 0, 
  activeGoalsCount = 0,
  badges = [],
  score = 0,
  onResetData
}) {
  const scoreDetails = getScoreDetails(score);
  const unlockedBadges = badges.filter(b => b.unlocked);

  const stats = [
    { label: "Eco Score", value: `${score}/100`, desc: scoreDetails.badge, icon: Award, color: "text-emerald-400" },
    { label: "Eco Points Balance", value: points, desc: "earned from challenges", icon: Zap, color: "text-amber-400" },
    { label: "Quests Completed", value: completedChallengesCount, desc: "weekly challenges", icon: Trophy, color: "text-sky-400" },
    { label: "Active Commitments", value: activeGoalsCount, desc: "carbon saving targets", icon: Target, color: "text-violet-400" }
  ];

  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-emerald-400" />
          Eco Profile & Statistics
        </h2>
        <p className="text-slate-400 text-sm">
          Overview of your environmental statistics, unlocked achievements, and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile overview & badges */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main profile card */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
            {/* Glow spotlight background */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${scoreDetails.color} opacity-[0.05] blur-2xl`}></div>
            
            {/* Avatar block */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${scoreDetails.color} flex items-center justify-center text-slate-950 font-black text-2xl flex-shrink-0 shadow-lg shadow-emerald-500/10`}>
              <User className="w-10 h-10 text-slate-950" />
            </div>

            {/* User details */}
            <div className="text-center md:text-left space-y-2">
              <div>
                <h3 className="text-xl font-extrabold text-white">Global Citizen</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Eco Rank: <span className={scoreDetails.textColor}>{scoreDetails.badge}</span></p>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                {scoreDetails.description}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                  {results ? `${results.annualTotalTons} Tons CO₂/Yr` : 'No calculation'}
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400">
                  Carbon Level: {score >= 70 ? 'Sustainable' : score >= 50 ? 'Moderate' : 'High'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="glass-card border border-white/5 rounded-2xl p-4.5 text-center flex flex-col items-center">
                  <div className="bg-slate-950 p-2 rounded-xl border border-white/5 text-slate-500 mb-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold block mb-0.5">{s.label}</span>
                  <span className={`text-xl md:text-2xl font-black ${s.color} block mb-0.5`}>{s.value}</span>
                  <span className="text-[9px] text-slate-400 leading-tight block">{s.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Badges summary list */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Recent Badges
            </h4>
            
            <div className="flex flex-wrap gap-4 pt-1">
              {unlockedBadges.map(b => (
                <div 
                  key={b.id}
                  className="flex items-center gap-2.5 bg-slate-950/60 border border-emerald-500/20 p-2.5 rounded-2xl"
                  title={b.description}
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${b.color} text-slate-950 flex-shrink-0`}>
                    <Award className="w-3.5 h-3.5 text-slate-950" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{b.title}</span>
                </div>
              ))}

              {unlockedBadges.length === 0 && (
                <div className="py-4 text-slate-500 text-xs italic">
                  No badges unlocked yet. Complete calculations and challenges to claim achievements!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Account Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Danger Zone
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Resetting local data will completely wipe your carbon calculations, weekly challenges progress, committed goals, and accrued Eco Points from your browser storage. This action is irreversible.
            </p>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all your EcoTrack AI data? This will clear all calculations, challenges, and goals.")) {
                  onResetData();
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 font-bold py-3 px-4 rounded-xl transition-all text-xs"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Reset All Application Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { 
  Award, 
  Zap, 
  Target, 
  Trophy, 
  Calendar, 
  ArrowUpRight, 
  Leaf, 
  Play, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  Activity,
  Globe,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';
import { getScoreDetails } from '../utils/calculations';

const CATEGORY_COLORS = {
  transportation: '#38bdf8', // sky-400
  energy: '#f59e0b',        // amber-500
  food: '#10b981',          // emerald-500
  lifestyle: '#a78bfa'       // violet-400
};

// Custom tooltip renderer for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-white/10 backdrop-blur-xl px-3 py-2 rounded-xl text-xs shadow-2xl">
        <p className="font-extrabold text-slate-400 mb-0.5">{label}</p>
        <p className="font-extrabold text-emerald-400">
          {payload[0].value.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">Tons CO₂</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ 
  state, 
  results, 
  activeGoalsList = [], 
  setActiveTab 
}) {
  const { points = 0, history = [], challenges = [] } = state;
  const annualTons = results?.annualTotalTons || 0;
  const score = results ? Math.max(0, Math.min(100, Math.round(100 - (annualTons / 18) * 100))) : 0;
  const scoreDetails = getScoreDetails(score);

  // SVG Circular progress details
  const radius = 55;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Formatting historical trend for chart
  const trendChartData = history.map(item => {
    const factor = annualTons > 0 ? annualTons / 7.5 : 1; // scale history points based on user's current annual footprint
    return {
      month: item.month,
      emissions: parseFloat((item.emissions * factor).toFixed(1))
    };
  });

  const categoryChartData = results ? [
    { name: 'Transit', value: results.breakdown.transportation / 1000, color: CATEGORY_COLORS.transportation },
    { name: 'Energy', value: results.breakdown.energy / 1000, color: CATEGORY_COLORS.energy },
    { name: 'Food', value: results.breakdown.food / 1000, color: CATEGORY_COLORS.food },
    { name: 'Lifestyle', value: results.breakdown.lifestyle / 1000, color: CATEGORY_COLORS.lifestyle }
  ] : [];

  const incompleteChallenges = challenges.filter(c => !c.completed);
  const quickChallenges = incompleteChallenges.slice(0, 2);

  // EMPTY STATE RENDER: If no calculation results exist
  if (!results) {
    return (
      <div className="py-8 flex flex-col items-center justify-center min-h-[70vh] text-center max-w-xl mx-auto space-y-6">
        <div className="bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20 animate-float shadow-xl shadow-emerald-500/5">
          <Leaf className="w-12 h-12 text-emerald-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">No Environmental Profile</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            To unlock the interactive dashboard, projection trends, achievements list, and personalized AI coaching plans, calculate your initial carbon footprint index.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('calculator')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02]"
        >
          <span>Calculate Carbon Footprint</span>
          <ArrowUpRight className="w-4.5 h-4.5 text-slate-950" />
        </button>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-1 tracking-tight">Eco Dashboard</h2>
          <p className="text-slate-400 text-sm font-medium">Analyze your real-time carbon coefficients, active targets, and badges progress.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className="flex items-center gap-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
          >
            Update Footprint
          </button>
        </div>
      </div>

      {/* Main Core Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score circular dial panel */}
        <div className="glass-card border border-white/5 rounded-3xl p-6 flex items-center justify-between gap-4 md:col-span-1 shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${scoreDetails.color} opacity-[0.03] blur-xl`}></div>
          <div className="space-y-4 relative z-10">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold block">Eco Score</span>
            <div>
              <h3 className={`text-xl font-black ${scoreDetails.textColor}`}>{scoreDetails.badge}</h3>
              <span className="text-[10px] text-slate-400 block mt-1">Footprint is {score >= 70 ? 'Optimal' : score >= 50 ? 'Moderate' : 'Heavy'}</span>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline"
            >
              View rank criteria <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* SVG Circular Gauge */}
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${scoreDetails.color} opacity-[0.05] blur-md`}></div>
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-900/60"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-emerald-500"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.8s ease-in-out',
                }}
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-3xl font-black text-white">{score}</span>
              <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Index</span>
            </div>
          </div>
        </div>

        {/* Total Emissions Stats */}
        <div className="glass-card border border-white/5 rounded-3xl p-6 flex flex-col justify-between gap-6 md:col-span-1 shadow-2xl">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Total Footprint</span>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Annual tons
            </span>
          </div>

          <div>
            <span className="text-4xl md:text-5xl font-black text-sky-400 leading-none">{annualTons}</span>
            <span className="text-xs font-bold text-slate-400 ml-2.5">Tons CO₂/Yr</span>
          </div>

          <div className="flex items-center gap-2 border-t border-white/5 pt-3.5 text-xs text-slate-400 font-semibold">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Monthly Equivalent: <strong className="text-slate-200">{results?.monthlyTotalKg} kg CO₂</strong></span>
          </div>
        </div>

        {/* Eco points & targets */}
        <div className="glass-card border border-white/5 rounded-3xl p-6 flex flex-col justify-between gap-6 md:col-span-1 shadow-2xl">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Reward Balance</span>
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Eco balance
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-amber-500/15 p-3 rounded-2xl border border-amber-500/25 text-amber-400 flex-shrink-0">
              <Zap className="w-8 h-8 text-amber-400 fill-amber-400/20" />
            </div>
            <div>
              <span className="text-3xl font-black text-white">{points}</span>
              <span className="text-xs text-slate-400 block mt-0.5 font-semibold">Eco points claimed</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-3.5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold"><Target className="w-4 h-4 text-emerald-400" /> Target Goal:</span>
            <strong className="text-slate-200">{state.goals?.targetEmissions} Tons/Yr</strong>
          </div>
        </div>

      </div>

      {/* Visualizations & interactive list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Graphs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Line Area Chart */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-bold text-white text-base">Carbon Progression Trend</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Historical carbon footprint trends (Scaled Tons/Yr).</p>
              </div>
              <span className="flex items-center gap-1.5 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                <TrendingDown className="w-3.5 h-3.5" /> Progressing Down
              </span>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" stroke="#475569" fontSize={9} />
                  <YAxis stroke="#475569" fontSize={9} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart breakdown */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-1">Carbon Breakdown by Category</h3>
            <p className="text-[10px] text-slate-500 mb-5 font-medium">Annual carbon footprint representation across components (Tons/Yr).</p>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ left: -25, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                  <YAxis stroke="#475569" fontSize={9} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,23,42,0.9)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '10px'
                    }}
                    formatter={(val) => [`${val.toFixed(2)} Tons CO₂`, 'Emissions']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Side: Quick Action Challenges and Active Goals */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Challenges */}
          <div className="glass-card border border-white/5 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Trophy className="w-4.5 h-4.5 text-emerald-400" /> Active Quests
              </h3>
              <button 
                onClick={() => setActiveTab('challenges')}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {quickChallenges.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setActiveTab('challenges')}
                  className="bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-emerald-500/25 p-3.5 rounded-2xl cursor-pointer transition-all flex justify-between items-center gap-3 group"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-xs mb-0.5 leading-snug truncate">{c.title}</h4>
                    <span className="text-[9px] text-slate-500 block leading-tight truncate">
                      {c.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                      +{c.points}
                    </span>
                    <Play className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              ))}

              {quickChallenges.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs italic">
                  All weekly challenges completed! Go check you badges dashboard.
                </div>
              )}
            </div>
          </div>

          {/* Active Goals list */}
          <div className="glass-card border border-white/5 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-emerald-400" /> Reduction Commitments
              </h3>
              <button 
                onClick={() => setActiveTab('goals')}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
              >
                Manage goals
              </button>
            </div>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {activeGoalsList.slice(0, 3).map((g, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950/60 border border-white/5 p-3 rounded-xl flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-300 leading-tight truncate max-w-[150px] md:max-w-[180px]">{g.title}</span>
                  <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex-shrink-0">
                    -{g.savings} kg/yr
                  </span>
                </div>
              ))}

              {activeGoalsList.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs italic flex flex-col items-center gap-1">
                  <span>No active targets.</span>
                  <button 
                    onClick={() => setActiveTab('coach')}
                    className="text-[10px] text-emerald-400 hover:underline font-bold"
                  >
                    Commit to goals with Coach
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

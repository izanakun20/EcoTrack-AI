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
  Bot,
  Car,
  GlassWater,
  TreePine,
  ShieldCheck
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const benchmark = 2.0;
    const diffPercent = ((val - benchmark) / benchmark) * 100;
    const isAbove = diffPercent > 0;
    
    return (
      <div className="bg-slate-950/95 border border-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl text-xs shadow-2xl">
        <p className="font-black text-slate-400 mb-1.5">{label}</p>
        <div className="space-y-1">
          <p className="font-black text-emerald-400 flex items-center gap-1.5 text-sm">
            {val.toFixed(1)} <span className="text-[10px] font-medium text-slate-400">Tons CO₂/Yr</span>
          </p>
          <p className={`text-[10px] font-black ${isAbove ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isAbove ? `+${diffPercent.toFixed(0)}%` : `${diffPercent.toFixed(0)}%`} {isAbove ? 'above' : 'below'} benchmark (2.0t)
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const val = entry.value;
    return (
      <div className="bg-slate-950/95 border border-white/10 backdrop-blur-xl px-3.5 py-2.5 rounded-xl text-xs shadow-2xl">
        <p className="font-black text-slate-400 uppercase tracking-wider text-[9px] mb-1">{entry.payload.name}</p>
        <p className="font-black text-sm" style={{ color: entry.payload.color || '#fff' }}>
          {val.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">Tons CO₂</span>
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
  setActiveTab,
  aiInsight = null,
  aiInsightLoading = false 
}) {
  const isDemo = !results;

  const mockResults = {
    annualTotalTons: 6.8,
    monthlyTotalKg: 566,
    breakdown: {
      transportation: 3200,
      energy: 2100,
      food: 1100,
      lifestyle: 400
    }
  };

  const mockAiInsight = {
    category: 'Transit',
    impact: 'High',
    text: 'Transportation contributes 47% of your emissions. Switch to an EV or take public transit twice a week to save up to 1.8 Tons of CO₂ annually.'
  };

  const displayResults = results || mockResults;
  const displayInsight = aiInsight || (isDemo ? mockAiInsight : null);
  const displayInsightLoading = isDemo ? false : aiInsightLoading;

  const { points = 0, history = [], challenges = [] } = state;
  const annualTons = displayResults.annualTotalTons;
  const score = Math.max(0, Math.min(100, Math.round(100 - (annualTons / 18) * 100)));
  const scoreDetails = getScoreDetails(score);

  // SVG Circular progress details
  const radius = 55;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Calculate savings from active goals
  const totalAnnualSavingsKg = isDemo ? 420 : activeGoalsList.reduce((acc, g) => acc + (g.savings || 0), 0);
  const monthlySavingsKg = Math.round(totalAnnualSavingsKg / 12);

  // Equivalents calculations
  const equivalentTrees = Math.round(totalAnnualSavingsKg / 21.8);
  const equivalentBottles = Math.round(totalAnnualSavingsKg / 0.1);
  const equivalentCarKm = Math.round(totalAnnualSavingsKg / 0.171);

  // Formatting historical trend for chart
  const trendChartData = history.map(item => {
    const factor = annualTons > 0 ? annualTons / 7.5 : 1;
    return {
      month: item.month,
      emissions: parseFloat((item.emissions * factor).toFixed(1))
    };
  });

  const categoryChartData = [
    { name: 'Transit', value: displayResults.breakdown.transportation / 1000, color: CATEGORY_COLORS.transportation },
    { name: 'Energy', value: displayResults.breakdown.energy / 1000, color: CATEGORY_COLORS.energy },
    { name: 'Food', value: displayResults.breakdown.food / 1000, color: CATEGORY_COLORS.food },
    { name: 'Lifestyle', value: displayResults.breakdown.lifestyle / 1000, color: CATEGORY_COLORS.lifestyle }
  ];

  const incompleteChallenges = challenges.filter(c => !c.completed);
  const quickChallenges = incompleteChallenges.slice(0, 2);

  return (
    <div className="relative min-h-[80vh]">
      {/* High-Fidelity blurred overlay for Demo empty state */}
      {isDemo && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-[2px]">
          <div className="glass-card border border-emerald-500/30 bg-slate-950/85 backdrop-blur-xl max-w-md p-7.5 rounded-3xl text-center space-y-5.5 shadow-[0_20px_50px_rgba(16,185,129,0.18)] animate-float border-emerald-400/20">
            <div className="bg-emerald-500/10 mx-auto w-14 h-14 rounded-2xl border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5">
              <Leaf className="w-7 h-7 text-emerald-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white tracking-tight">No Environmental Profile</h3>
              <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed">
                Begin your carbon coefficients calculation to unlock live interactive charts, personalized AI coaching plans, and progress tracking meters.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('calculator')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-5.5 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-emerald-400/50 outline-none"
              aria-label="Calculate Carbon Footprint"
            >
              <span>Calculate Carbon Footprint</span>
              <ArrowUpRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}

      <div className={isDemo ? "filter blur-[6px] select-none pointer-events-none opacity-40 transition-all duration-300 py-2 space-y-8" : "transition-all duration-300 py-2 space-y-8"}>
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
              aria-label="Update Footprint"
            >
              Update Footprint
            </button>
          </div>
        </div>

        {/* 🤖 AI Sustainability Insight Card (Top of Dashboard) */}
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl filter blur-xl pointer-events-none"></div>
          {displayInsightLoading ? (
            <div className="glass-card border border-emerald-500/20 rounded-3xl p-6.5 shadow-2xl flex flex-col md:flex-row gap-5 items-center justify-between animate-pulse">
              <div className="flex items-center gap-4 w-full">
                <div className="bg-slate-950 p-4.5 rounded-2xl border border-white/5 flex-shrink-0 shimmer w-14 h-14"></div>
                <div className="space-y-2 w-full">
                  <div className="h-4.5 bg-slate-800 rounded-lg w-1/3 shimmer"></div>
                  <div className="h-3.5 bg-slate-850 rounded-lg w-3/4 shimmer"></div>
                  <div className="h-3.5 bg-slate-850 rounded-lg w-1/2 shimmer"></div>
                </div>
              </div>
            </div>
          ) : displayInsight ? (
            <div className="glass-card border border-emerald-500/20 bg-gradient-to-r from-slate-950/70 via-emerald-950/15 to-slate-950/70 rounded-3xl p-6.5 shadow-2xl flex flex-col md:flex-row gap-5 items-center justify-between relative overflow-hidden group">
              <div className="flex items-center gap-4.5">
                <div className="bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/25 text-emerald-400 flex-shrink-0 shadow-lg shadow-emerald-500/5 animate-pulse">
                  <Bot className="w-6.5 h-6.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      🤖 AI Sustainability Insight
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {displayInsight.category}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full">
                      Impact: {displayInsight.impact}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-semibold pr-4 mt-1.5">
                    "{displayInsight.text}"
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setActiveTab('coach')}
                className="flex-shrink-0 flex items-center gap-1 bg-emerald-555 hover:bg-emerald-500 text-slate-950 font-black px-4.5 py-3 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/5 group-hover:scale-[1.02]"
                style={{ backgroundColor: '#10b981' }}
                aria-label="Ask AI Coach"
              >
                <span>Ask AI Coach</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          ) : (
            <div className="glass-card border border-white/5 rounded-3xl p-6.5 text-center flex flex-col items-center justify-center">
              <Bot className="w-8 h-8 text-slate-650 mb-2 animate-bounce" />
              <p className="text-xs text-slate-500 font-semibold">Generating AI sustainability profiles in the background...</p>
            </div>
          )}
        </div>

        {/* Main Core Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Score circular dial panel */}
          <div className="glass-card border border-white/5 rounded-3xl p-5 flex items-center justify-between gap-3 shadow-2xl relative overflow-hidden md:col-span-1">
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${scoreDetails.color} opacity-[0.03] blur-lg`}></div>
            <div className="space-y-3 relative z-10">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold block">Eco Score</span>
              <div>
                <h3 className={`text-lg font-black ${scoreDetails.textColor} leading-tight`}>{scoreDetails.badge}</h3>
                <span className="text-[9px] text-slate-400 block mt-1">Footprint is {score >= 70 ? 'Optimal' : score >= 50 ? 'Moderate' : 'Heavy'}</span>
              </div>
              <button 
                onClick={() => setActiveTab('profile')}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline font-sans"
                aria-label="View Ranks"
              >
                Ranks <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* SVG Circular Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-slate-900/60"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-emerald-500"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 - (score / 100) * 2 * Math.PI * 38}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.8s ease-in-out',
                  }}
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-2xl font-black text-white">{score}</span>
                <span className="text-[7px] text-slate-500 uppercase tracking-wider font-bold">Index</span>
              </div>
            </div>
          </div>

          {/* Total Emissions Stats */}
          <div className="glass-card border border-white/5 rounded-3xl p-5 flex flex-col justify-between gap-5 shadow-2xl md:col-span-1">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Total Footprint</span>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Annual tons
              </span>
            </div>

            <div>
              <span className="text-3xl md:text-4xl font-black text-sky-400 leading-none">{annualTons}</span>
              <span className="text-[10px] font-bold text-slate-400 ml-2">Tons CO₂/Yr</span>
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 pt-3 text-[10px] text-slate-400 font-semibold">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Monthly equivalent: <strong className="text-slate-200">{displayResults.monthlyTotalKg} kg CO₂</strong></span>
            </div>
          </div>

          {/* Monthly Carbon Savings Card */}
          <div className="glass-card border border-white/5 rounded-3xl p-5 flex flex-col justify-between gap-5 shadow-2xl md:col-span-1">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Monthly Savings</span>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Target saved
              </span>
            </div>

            <div>
              <span className="text-3xl md:text-4xl font-black text-emerald-400 leading-none">-{monthlySavingsKg}</span>
              <span className="text-[10px] font-bold text-slate-400 ml-2">kg CO₂/Mo</span>
            </div>

            <div className="flex items-center gap-1.5 border-t border-white/5 pt-3 text-[10px] text-slate-400 font-semibold">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Annual offset: <strong className="text-slate-200">{(totalAnnualSavingsKg/1000).toFixed(2)} Tons</strong></span>
            </div>
          </div>

          {/* Eco points */}
          <div className="glass-card border border-white/5 rounded-3xl p-5 flex flex-col justify-between gap-5 shadow-2xl md:col-span-1">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold font-sans">Eco Rewards</span>
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                balance
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="bg-amber-500/15 p-2 rounded-xl border border-amber-500/25 text-amber-400 flex-shrink-0">
                <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              </div>
              <div>
                <span className="text-2xl font-black text-white">{points}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5 font-semibold">Points claimed</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold"><Target className="w-4 h-4 text-emerald-400" /> Target:</span>
              <strong className="text-slate-200">{state.goals?.targetEmissions} Tons/Yr</strong>
            </div>
          </div>

        </div>

        {/* Visualizations & Environmental Equivalents Grid */}
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

              <div className="h-[220px] w-full" role="region" aria-label="Carbon Progression Trend Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendChartData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                        <stop offset="50%" stopColor="#059669" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="emissions" stroke="url(#strokeGradient)" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart breakdown */}
            <div className="glass-card border border-white/5 rounded-3xl p-6 shadow-2xl">
              <h3 className="font-bold text-white text-base mb-1">Carbon Breakdown by Category</h3>
              <p className="text-[10px] text-slate-500 mb-5 font-medium">Annual carbon footprint representation across components (Tons/Yr).</p>
              
              <div className="h-[180px] w-full" role="region" aria-label="Carbon Breakdown by Category Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ left: -25, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Side: Environmental Impact Equivalents & Quick Quests */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Environmental Impact Equivalents Card */}
            <div className="glass-card border border-white/5 rounded-3xl p-5 md:p-6 space-y-4.5 shadow-2xl">
              <div className="border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" /> Environmental Equivalents
                </h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Offset projections from committed targets.</p>
              </div>

              <div className="space-y-4">
                {/* Trees equivalent */}
                <div className="flex items-center gap-3.5 bg-slate-950/60 border border-white/5 p-3 rounded-2xl">
                  <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
                    <TreePine className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Native Trees Saved</span>
                    <span className="text-base font-black text-white mt-0.5">{equivalentTrees} <span className="text-[10px] text-slate-400 font-normal">trees / yr</span></span>
                  </div>
                </div>

                {/* Plastic Bottles equivalent */}
                <div className="flex items-center gap-3.5 bg-slate-950/60 border border-white/5 p-3 rounded-2xl">
                  <div className="bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20 text-violet-400">
                    <GlassWater className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Plastic Bottles Avoided</span>
                    <span className="text-base font-black text-white mt-0.5">{equivalentBottles} <span className="text-[10px] text-slate-400 font-normal">bottles / yr</span></span>
                  </div>
                </div>

                {/* Transit Offset equivalent */}
                <div className="flex items-center gap-3.5 bg-slate-950/60 border border-white/5 p-3 rounded-2xl">
                  <div className="bg-sky-500/10 p-2.5 rounded-xl border border-sky-500/20 text-sky-400">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Car Commutes Offset</span>
                    <span className="text-base font-black text-white mt-0.5">{equivalentCarKm} <span className="text-[10px] text-slate-400 font-normal">km / yr</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Challenges */}
            <div className="glass-card border border-white/5 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Trophy className="w-4.5 h-4.5 text-emerald-400" /> Active Quests
                </h3>
                <button 
                  onClick={() => setActiveTab('challenges')}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                  aria-label="View all quests"
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
                      <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                        +{c.points}
                      </span>
                      <Play className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                ))}

                {quickChallenges.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs italic">
                    All weekly challenges completed! Go check your badges dashboard.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

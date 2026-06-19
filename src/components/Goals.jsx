import React, { useState } from 'react';
import { 
  Target, 
  TrendingDown, 
  PlusCircle, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Calendar,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid 
} from 'recharts';

export default function Goals({ 
  currentAnnualEmissions, 
  goalsState, 
  onUpdateGoal, 
  activeGoalsList = [], 
  onRemoveGoal,
  onAddCustomGoal
}) {
  const [targetTons, setTargetTons] = useState(goalsState?.targetEmissions || Math.round(currentAnnualEmissions * 0.8 * 10) / 10);
  const [newGoalText, setNewGoalText] = useState('');
  const [activeFaq, setActiveFaq] = useState(false);

  const reductionPercent = Math.max(0, Math.round(((currentAnnualEmissions - targetTons) / Math.max(0.1, currentAnnualEmissions)) * 100));
  const estimatedSavings = Math.max(0, parseFloat((currentAnnualEmissions - targetTons).toFixed(2)));

  const handleUpdateTarget = (val) => {
    const num = parseFloat(val);
    setTargetTons(num);
    onUpdateGoal({
      ...goalsState,
      targetEmissions: num
    });
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    onAddCustomGoal(newGoalText.trim());
    setNewGoalText('');
  };

  // Forecast projection calculations
  const savingsOver5Years = parseFloat((estimatedSavings * 5).toFixed(1));
  const savingsOver10Years = parseFloat((estimatedSavings * 10).toFixed(1));
  const equivalentTreesPlanted = Math.round(estimatedSavings * 1000 / 21.8);

  const chartData = [
    { name: 'Current', value: currentAnnualEmissions, color: '#f43f5e' }, // rose-500
    { name: 'Target', value: targetTons, color: '#10b981' } // emerald-500
  ];

  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-emerald-400" />
          Carbon Reduction Goals
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Set customized reduction targets and forecast environmental impact milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Target Setter */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/5 opacity-50 blur-xl"></div>
            
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 relative z-10">
              <TrendingDown className="w-5 h-5 text-emerald-400" /> Set Carbon Target
            </h3>

            {/* Slider container */}
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Footprint:</span>
                <span className="text-white font-extrabold">{currentAnnualEmissions} Tons/Yr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Target Footprint:</span>
                <span className="text-emerald-400 font-extrabold">{targetTons} Tons/Yr</span>
              </div>

              <input 
                type="range" 
                min={Math.round(currentAnnualEmissions * 0.3 * 10) / 10} 
                max={currentAnnualEmissions} 
                step="0.1"
                value={targetTons} 
                onChange={e => handleUpdateTarget(e.target.value)}
                className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                aria-label="Set Carbon Target Slider"
              />

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>70% Cut (Aggressive)</span>
                <span>35% Cut (Moderate)</span>
                <span>No Cut</span>
              </div>
            </div>

            {/* Summary statistics boxes */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5 mt-2 relative z-10">
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Target Reduction</span>
                <span className="text-2xl font-black text-emerald-400">{reductionPercent}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">carbon savings</span>
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Annual CO₂ Saved</span>
                <span className="text-2xl font-black text-sky-400">{estimatedSavings}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">Tons / Year</span>
              </div>
            </div>

            {/* Quote Callout */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-2.5 relative z-10">
              <AlertCircle className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                By targetting a <strong>{reductionPercent}%</strong> cut, you offset emissions equivalent to planting <strong>{equivalentTreesPlanted}</strong> mature trees annually.
              </p>
            </div>
          </div>

          {/* Forecasting Milestones */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" /> Carbon Offset Projection
            </h4>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">5-Year Offset</span>
                <span className="text-lg font-black text-emerald-400">{savingsOver5Years} Tons</span>
                <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">estimated total savings</span>
              </div>
              <div className="bg-slate-950/40 border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">10-Year Offset</span>
                <span className="text-lg font-black text-emerald-400">{savingsOver10Years} Tons</span>
                <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">estimated total savings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Committed Reduction Goals list */}
        <div className="lg:col-span-6 space-y-6">
          {/* Bar Chart comparing Current vs Target */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 h-[220px] flex flex-col justify-between shadow-2xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Target vs Current Profile (Tons/Yr)</h4>
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
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
                    formatter={(val) => [`${val} Tons CO₂`, 'Value']}
                  />
                  <Bar dataKey="value" barSize={40} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Commitments Card */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 md:p-8 min-h-[350px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Active Commitments
                </h3>
                <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                  {activeGoalsList.length} Goals
                </span>
              </div>

              {/* Goal List */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 mb-6">
                {activeGoalsList.map((g, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center bg-slate-950/60 border border-white/5 p-4 rounded-2xl group transition-all hover:border-emerald-500/20"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-slate-200 truncate">{g.title}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                        -{g.savings} kg/yr
                      </span>
                      <button
                        onClick={() => onRemoveGoal(g.title)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 bg-white/5 rounded-lg border border-transparent hover:border-rose-500/20 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove Goal"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeGoalsList.length === 0 && (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <Target className="w-10 h-10 text-slate-650 mb-3 animate-pulse" />
                    <h4 className="text-xs font-bold text-slate-400">No active commitments</h4>
                    <p className="text-xs text-slate-500 max-w-[240px] mt-1.5 leading-relaxed mx-auto">
                      Visit the <strong>AI Eco Coach</strong> tab and commit to suggested actions to populate your active target list!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Custom goal form */}
            <form onSubmit={handleAddCustom} className="border-t border-white/5 pt-5 mt-auto">
              <label className="text-xs font-semibold text-slate-400 block mb-2">Create Custom Green Commitment</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Turn off router before sleeping, buy glass jugs..."
                  value={newGoalText}
                  onChange={e => setNewGoalText(e.target.value)}
                  className="glass-input flex-grow px-4 py-2.5 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 rounded-xl text-slate-950 transition-all shadow-md shadow-emerald-500/10 font-bold text-xs flex items-center gap-1.5 flex-shrink-0"
                >
                  <PlusCircle className="w-4 h-4 text-slate-950" /> Add
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

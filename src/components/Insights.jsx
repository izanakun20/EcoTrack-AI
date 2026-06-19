import React, { useState } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Leaf, 
  Zap, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { environmentalTips } from '../data/environmentalData';

export default function Insights() {
  const [activeTipIdx, setActiveTipIdx] = useState(0);

  const handleNextTip = () => {
    setActiveTipIdx(prev => (prev + 1) % environmentalTips.length);
  };

  const handlePrevTip = () => {
    setActiveTipIdx(prev => (prev - 1 + environmentalTips.length) % environmentalTips.length);
  };

  const activeTip = environmentalTips[activeTipIdx];

  const quickTips = [
    { text: "Swap traditional bulbs for LEDs to consume 80% less heat and energy.", icon: Zap },
    { text: "Air dry clothes on laundry racks instead of using heavy spinning dryer machines.", icon: Leaf },
    { text: "Reduce beef and lamb meals to lower methane emissions in the atmosphere.", icon: BookOpen },
    { text: "Bring canvas shopping bags to the groceries to avoid landfill plastics.", icon: Info }
  ];

  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-emerald-400" />
          Sustainability Insights & Tips
        </h2>
        <p className="text-slate-400 text-sm">
          Educate yourself on environmental science, facts, and eco-friendly recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Interactive Tip Slider */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card border border-emerald-500/20 bg-gradient-to-br from-slate-900/60 to-emerald-950/15 rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              {/* Badge & navigation */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-extrabold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 uppercase tracking-widest">
                  Environmental Fact #{activeTip.id}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrevTip}
                    className="p-1.5 bg-slate-950 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all text-xs"
                    aria-label="Previous fact"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextTip}
                    className="p-1.5 bg-slate-950 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all text-xs"
                    aria-label="Next fact"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Fact body */}
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 leading-snug">
                {activeTip.title}
              </h3>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 font-medium">
                "{activeTip.fact}"
              </p>
            </div>

            {/* Recommendation Footer banner */}
            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 flex gap-3 items-start mt-4">
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 flex-shrink-0 mt-0.5 border border-emerald-500/20">
                <Leaf className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-semibold">Actionable Tip</span>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold mt-0.5">
                  {activeTip.action}
                </p>
              </div>
            </div>
          </div>

          {/* Quick tips list grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div key={idx} className="glass-card border border-white/5 p-5 rounded-2xl flex gap-4 items-start">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5 text-slate-400 flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tip.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Environmental Trivia and facts checklist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card border border-white/5 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Ecological Milestones
            </h3>
            
            <ul className="space-y-4 text-xs text-slate-400">
              <li className="flex gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>50% reduction</strong> by 2030 is targetted by global climate agreements to keep warming below 1.5°C.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>70% of energy</strong> in typical households is consumed by heating, cooling, and hot water boilers.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>80% of waste</strong> plastic bottle emissions are caused by manufacturing processes rather than freight shipping.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Organic composting</strong> of household kitchen scraps cuts food landfills methane emissions entirely.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

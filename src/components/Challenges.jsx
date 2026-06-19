import React, { useState } from 'react';
import { 
  Trophy, 
  Trash2, 
  Bus, 
  ZapOff, 
  Leaf, 
  TreePine, 
  Wind, 
  Activity, 
  Check, 
  Sparkles,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

const ICON_MAP = {
  Trash2: Trash2,
  Bus: Bus,
  ZapOff: ZapOff,
  Leaf: Leaf,
  TreePine: TreePine,
  Wind: Wind,
  Activity: Activity
};

const CHALLENGE_SUBTASKS = {
  "challenge-plastic": [
    "Ditch disposable coffee cups & use reusable containers.",
    "Refuse plastic bags at checkout; carry canvas tote bags.",
    "Order food delivery specifying 'no plastic utensils'."
  ],
  "challenge-transit": [
    "Substitute your personal car trip with train or bus logs.",
    "Ride a bicycle or walk for destinations within 4km.",
    "Inquire about workspace/school carpool networks."
  ],
  "challenge-power": [
    "Turn off household router and standby adapters before sleep.",
    "Shut down all computer rigs instead of keeping sleep modes.",
    "Prepare meals without heavy electric baking heaters today."
  ],
  "challenge-veggie": [
    "Eat a strictly vegan/vegetarian lunch block.",
    "Substitute dairy milk for almond, soy, or oat variables.",
    "Avoid beef/lamb products for dinner menu completely."
  ],
  "challenge-tree": [
    "Buy native seeds or potted houseplant herbs.",
    "Join local city park watering programs.",
    "Help remove neighborhood garden plastic trash."
  ],
  "challenge-cold-wash": [
    "Switch washing machine dial to 20°C/Cold water wash.",
    "Run laundry only when drum is fully populated.",
    "Hang washings to air dry on laundry racks."
  ],
  "challenge-walk": [
    "Record walking logs on phone fitness tracker.",
    "Walk to local neighborhood grocery store.",
    "Take stairwells instead of elevator transits today."
  ]
};

export default function Challenges({ 
  challenges, 
  onCompleteChallenge, 
  points = 0 
}) {
  const [filter, setFilter] = useState('all');
  const [successBannerMsg, setSuccessBannerMsg] = useState(null);

  const completedCount = challenges.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / challenges.length) * 100);

  const filteredChallenges = challenges.filter(c => {
    if (filter === 'completed') return c.completed;
    if (filter === 'active') return !c.completed;
    return true;
  });

  const handleClaimPoints = (id, title, pts) => {
    onCompleteChallenge(id, pts);
    setSuccessBannerMsg(`Quest Completed! Successfully claimed +${pts} Eco Points for completing "${title}"!`);
    
    // Auto-dismiss banner after 4 seconds
    setTimeout(() => {
      setSuccessBannerMsg(null);
    }, 4000);
  };

  return (
    <div className="py-2 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-emerald-400" />
          Weekly Eco Challenges
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Participate in gamified ecological tasks, earn reward points, and unlock achievements.
        </p>
      </div>

      {/* Dynamic Success Claim Banner */}
      {successBannerMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-lg shadow-emerald-500/5">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
          <p className="text-xs font-bold text-emerald-300 leading-snug">{successBannerMsg}</p>
        </div>
      )}

      {/* Progress Card */}
      <div className="glass-card border border-emerald-500/20 bg-emerald-950/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex gap-4.5 items-center">
          <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30">
            <Trophy className="w-7 h-7 text-emerald-400 animate-float" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base md:text-lg mb-0.5">Weekly Quest Progression</h3>
            <p className="text-slate-400 text-xs font-medium">
              Complete challenges to raise your score and unlock exclusive badges.
            </p>
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Progress ({completedCount}/{challenges.length})</span>
            <span className="text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-white/5 p-[1px]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters & Points */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2.5">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold capitalize border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                filter === f
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 bg-slate-900/40 border border-white/5 px-4.5 py-2.5 rounded-2xl">
          <Sparkles className="w-4.5 h-4.5 text-emerald-400 fill-emerald-400/10" />
          <span className="text-xs text-slate-400 font-semibold">Eco Balance:</span>
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">{points} Pts</span>
        </div>
      </div>

      {/* Challenges List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(c => {
          const IconComponent = ICON_MAP[c.icon] || Leaf;
          const subtasks = CHALLENGE_SUBTASKS[c.id] || ["Complete general challenge guidelines."];
          
          return (
            <div 
              key={c.id} 
              className={`glass-card border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                c.completed 
                  ? 'border-emerald-500/15 bg-emerald-950/5'
                  : 'border-white/5 hover:border-white/10 hover:shadow-xl'
              }`}
            >
              {/* Completed Watermark icon background */}
              {c.completed && (
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
                  <Check className="w-32 h-32 text-emerald-400" />
                </div>
              )}

              <div>
                {/* Icon & Points header */}
                <div className="flex justify-between items-center mb-5">
                  <div className={`p-2.5 rounded-xl border ${
                    c.completed
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                      : 'bg-slate-950 border-white/5 text-slate-400'
                  }`}>
                    <IconComponent className="w-5.5 h-5.5" />
                  </div>
                  <span className={`text-[9px] font-extrabold border px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    c.completed 
                      ? 'text-slate-500 border-slate-800 bg-slate-950'
                      : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                  }`}>
                    +{c.points} Pts
                  </span>
                </div>

                <h3 className={`font-extrabold text-base mb-1.5 ${c.completed ? 'text-slate-500 line-through font-bold' : 'text-white'}`}>
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">
                  {c.description}
                </p>

                {/* Subtask checklist details */}
                <div className="space-y-2 border-t border-white/5 pt-4 mb-6">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold block">Quest Tasks</span>
                  <ul className="space-y-1.5">
                    {subtasks.map((task, sIdx) => (
                      <li key={sIdx} className="flex gap-2 items-start text-[10px] text-slate-400 leading-relaxed">
                        <ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className={c.completed ? 'line-through text-slate-550' : ''}>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-3.5 mt-auto">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">
                  {c.category}
                </span>

                {c.completed ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-xl">
                    <Check className="w-3.5 h-3.5" /> Completed
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaimPoints(c.id, c.title, c.points)}
                    className="flex items-center gap-1 text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/5 group-hover:shadow-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredChallenges.length === 0 && (
          <div className="col-span-full py-16 flex flex-col justify-center items-center text-center">
            <Award className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
            <h4 className="text-lg font-bold text-slate-400">No Challenges Found</h4>
            <p className="text-xs text-slate-500 mt-1">There are no challenges under this category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

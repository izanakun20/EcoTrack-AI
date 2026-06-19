import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Leaf, 
  Check, 
  Plus, 
  Zap, 
  Car, 
  Utensils, 
  ShoppingBag,
  Bot,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Compass,
  Trophy
} from 'lucide-react';
import { calculateScore } from '../utils/calculations';
import { chatWithLocalEcoCoach, runSustainabilityDecisionEngine } from '../utils/aiService';

const CATEGORY_ICONS = {
  transportation: Car,
  energy: Zap,
  food: Utensils,
  lifestyle: ShoppingBag
};

export default function AICoach({ 
  inputs, 
  results, 
  activeGoals, 
  onAddGoal, 
  points = 0,
  aiRecommendations = [],
  aiRecommendationsLoading = false 
}) {
  const engine = runSustainabilityDecisionEngine(inputs, results);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'coach',
      text: `Hello there! I am your AI Eco Coach. I've classified your profile as **${engine.persona.name}** (Carbon Score: ${calculateScore(results?.annualTotalTons)}/100) with a recommendation confidence score of **${engine.confidence}%**.\n\nOur Sustainability Decision Engine has generated a custom plan for you. Ask me how to optimize your top emission sources!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('high'); // 'high' | 'all'
  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    "How can I reduce my footprint?",
    "Create a 30-day eco plan.",
    "What is my biggest emission source?",
    "Give me weekly sustainability goals.",
    "Compare my footprint with the average person."
  ];

  // Chat message sending utilizing intelligent local NLP engine
  const handleSendMessage = (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulated AI typing animation delay
    setTimeout(() => {
      const reply = chatWithLocalEcoCoach(text, messages, inputs, results);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'coach',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 800);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleSendMessage(inputVal);
    setInputVal('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const filteredRecommendations = aiRecommendations.filter(rec => {
    if (activeTab === 'high') return rec.priority === 'High';
    return true;
  });

  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-emerald-400" />
          AI Eco Coach
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Consult our generative AI chat assistant or select goals derived from footprint analytics.
        </p>
      </div>

      {/* 🧠 Sustainability Decision Engine - 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Sustainability Persona */}
        <div className="glass-card border border-white/5 rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 opacity-[0.03] blur-xl"></div>
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold block">Sustainability Profile</span>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                CONFIDENCE: {engine.confidence}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5 text-emerald-400">
                {engine.persona.name.includes("Commuter") ? (
                  <Car className="w-5.5 h-5.5 text-sky-400" />
                ) : engine.persona.name.includes("Energy") ? (
                  <Zap className="w-5.5 h-5.5 text-amber-500" />
                ) : engine.persona.name.includes("Champion") ? (
                  <Trophy className="w-5.5 h-5.5 text-amber-400" />
                ) : engine.persona.name.includes("Explorer") ? (
                  <Compass className="w-5.5 h-5.5 text-sky-400" />
                ) : (
                  <Leaf className="w-5.5 h-5.5 text-emerald-400 animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="text-base font-black text-white leading-tight">{engine.persona.name}</h3>
                <span className="text-[9px] text-slate-400 font-semibold">User Classification</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              {engine.persona.desc}
            </p>
          </div>
        </div>

        {/* Card 2: What Should I Do First */}
        <div className="glass-card border border-emerald-500/20 bg-gradient-to-r from-slate-950/70 via-emerald-950/5 to-slate-950/70 rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold block">Best Next Action</span>
              <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-extrabold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Priority: {engine.bestNextAction.priority}
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm md:text-base leading-snug">{engine.bestNextAction.title}</h4>
              <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed font-medium">
                {engine.bestNextAction.description}
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                -{engine.bestNextAction.savings} kg CO₂/yr
              </span>
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                Time: {engine.bestNextAction.timeToImplement}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: AI Reasoning */}
        <div className="glass-card border border-white/5 rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold block">AI Reasoning & drivers</span>
            <p className="text-[10.5px] text-slate-400 leading-relaxed font-semibold">
              "{engine.reasoning}"
            </p>
            <div className="space-y-2 border-t border-white/5 pt-3">
              <span className="text-[9px] text-slate-500 uppercase font-extrabold block">Top Emission Sources</span>
              <div className="space-y-1.5">
                {engine.top3Sources.map((src, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-extrabold text-slate-400">
                      <span>{idx + 1}. {src.name}</span>
                      <span>{src.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${
                          src.id === 'transportation' 
                            ? 'from-sky-500 to-sky-400'
                            : src.id === 'energy'
                              ? 'from-amber-500 to-amber-450'
                              : src.id === 'food'
                                ? 'from-emerald-500 to-emerald-400'
                                : 'from-violet-500 to-violet-400'
                        }`}
                        style={{ width: `${src.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Recommendations List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              Tailored Carbon Reduction Plan
            </h3>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('high')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold transition-all uppercase tracking-wider ${
                  activeTab === 'high'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                High Impact
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold transition-all uppercase tracking-wider ${
                  activeTab === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Goals
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {aiRecommendationsLoading ? (
              // Skeleton Loader states
              [1, 2, 3].map(idx => (
                <div key={idx} className="glass-card border border-white/5 rounded-3xl p-5 animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="flex gap-3 w-full">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 shimmer"></div>
                      <div className="space-y-2 w-1/2">
                        <div className="h-4 bg-slate-800 rounded shimmer"></div>
                        <div className="h-2.5 bg-slate-850 rounded w-1/3 shimmer"></div>
                      </div>
                    </div>
                    <div className="w-16 h-4 bg-slate-800 rounded shimmer"></div>
                  </div>
                  <div className="h-3 bg-slate-800 rounded w-3/4 shimmer ml-13"></div>
                  <div className="h-3 bg-slate-800 rounded w-1/2 shimmer ml-13"></div>
                </div>
              ))
            ) : filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec, idx) => {
                const Icon = CATEGORY_ICONS[rec.category] || Leaf;
                const isCommitted = activeGoals.includes(rec.title);
                
                return (
                  <div 
                    key={idx}
                    className={`glass-card border rounded-3xl p-5 transition-all duration-300 ${
                      isCommitted 
                        ? 'border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_15px_-4px_rgba(16,185,129,0.15)]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2.5">
                      <div className="flex gap-3.5 items-start">
                        <div className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 ${
                          rec.category === 'transportation' 
                            ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                            : rec.category === 'energy'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : rec.category === 'food'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-sm md:text-base leading-snug">{rec.title}</h4>
                          <span className="text-[9px] text-slate-500 capitalize tracking-wider font-bold">{rec.category}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                          -{rec.savings} kg/yr
                        </span>
                        <span className={`text-[8px] uppercase tracking-widest font-extrabold ${
                          rec.priority === 'High' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {rec.priority} Priority
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4 ml-12 font-medium">
                      {rec.description}
                    </p>

                    <div className="flex justify-between items-center ml-12 border-t border-white/5 pt-3.5">
                      <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 font-semibold">
                        <span>
                          Difficulty: <strong className="text-slate-400 capitalize">{rec.difficulty}</strong>
                        </span>
                        {rec.timeToImplement && (
                          <span>
                            Time: <strong className="text-slate-405">{rec.timeToImplement}</strong>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onAddGoal(rec.title, rec.savings)}
                        disabled={isCommitted}
                        className={`flex items-center gap-1.5 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all ${
                          isCommitted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-emerald-500/30'
                        }`}
                      >
                        {isCommitted ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Committed
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Commit to Goal
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="glass-card border border-white/5 rounded-3xl p-8 text-center flex flex-col items-center">
                <HelpCircle className="w-8 h-8 text-slate-650 mb-2" />
                <p className="text-xs text-slate-500 font-semibold">No high priority recommendations found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Assistant panel & Weekly Goals */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-3xl p-5 md:p-6 flex flex-col h-[630px] justify-between shadow-2xl">
            <div>
              <div className="border-b border-white/5 pb-3.5 mb-3.5 flex items-center gap-3">
                <div className="relative bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center justify-center overflow-hidden w-11 h-11 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0">
                  <div className="absolute inset-0 border border-dashed border-emerald-400/30 rounded-xl animate-spin [animation-duration:10s]"></div>
                  <Leaf className="w-5 h-5 text-emerald-400 relative z-10 animate-float" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">Eco Coach Chat</h3>
                  <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                  </span>
                </div>
              </div>

              {/* Suggested Prompt Chips */}
              <div className="flex flex-col gap-1.5 mb-4">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Suggested Prompts</span>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[10px] text-slate-350 bg-slate-950/60 border border-white/5 hover:border-emerald-500/40 hover:text-emerald-400 px-3.5 py-2 rounded-xl transition-all duration-300 font-extrabold flex items-center gap-1.5 hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(16,185,129,0.1)] outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500 hover:text-emerald-400" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages list */}
            <div className="flex-grow overflow-y-auto space-y-3.5 pr-1 mb-4">
              {messages.map(m => (
                <div 
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${
                    m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className={`p-3.5 rounded-2xl text-xs md:text-sm ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 rounded-tr-none font-bold shadow-md shadow-emerald-500/5'
                      : 'bg-slate-950/60 border border-white/5 text-slate-200 rounded-tl-none leading-relaxed font-medium'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-650 mt-1 px-1">{m.time}</span>
                </div>
              ))}
              
              {/* AI typing pulsing loader */}
              {isTyping && (
                <div className="flex flex-col items-start max-w-[85%] animate-pulse">
                  <div className="bg-slate-950/60 border border-white/5 text-slate-400 p-3.5 px-5 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleFormSubmit} className="flex gap-2 border-t border-white/5 pt-4">
              <input
                type="text"
                placeholder="Ask how to reduce commutes, optimize AC power..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                className="glass-input flex-grow px-4 py-2.5 rounded-xl text-xs"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 p-2.5 rounded-xl text-slate-950 transition-all shadow-md shadow-emerald-500/10 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          </div>

          {/* Personalized Weekly Goals Card */}
          <div className="glass-card border border-emerald-500/10 bg-slate-950/20 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Trophy className="w-4.5 h-4.5 text-amber-400 font-black" />
              Personalized Weekly Goals
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold leading-none">Weekly milestones dynamically tailored to your Carbon Persona.</p>
            <div className="space-y-2.5">
              {engine.weeklyGoals.map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/60 border border-white/5 p-3.5 rounded-2xl">
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-slate-300 leading-relaxed font-semibold">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

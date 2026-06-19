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
  Flame,
  MessageSquare
} from 'lucide-react';
import { calculateScore } from '../utils/calculations';

// Local chatbot responses
const chatbotResponses = {
  plastic: "Plastics take up to 500 years to decompose. Switch to reusable canvas bags, stainless steel water flasks, and glass mason jars. This saves roughly 25kg of CO₂ annually!",
  diet: "Diet accounts for a large portion of personal emissions. Reducing beef/lamb and eating chicken, fish, or plant-based proteins can cut your food footprint by up to 50% (saving ~800 kg CO₂ annually!).",
  food: "Diet accounts for a large portion of personal emissions. Reducing beef/lamb and eating chicken, fish, or plant-based proteins can cut your food footprint by up to 50% (saving ~800 kg CO₂ annually!).",
  meat: "Beef has 10x the carbon footprint of chicken! Substituting red meat for poultry, beans, or lentils once or twice a week makes a significant carbon dent.",
  car: "Passenger vehicles are a primary carbon source. Try carpooling, public transit, or cycling. Walking or biking for trips under 5km reduces vehicle startups and saves fuel.",
  drive: "Passenger vehicles are a primary carbon source. Try carpooling, public transit, or cycling. Walking or biking for trips under 5km reduces vehicle startups and saves fuel.",
  electricity: "Unplug 'vampire' electronics, switch to LED bulbs, and choose Energy Star appliances. Washing clothes in cold water saves 90% of the washing machine's heating energy.",
  power: "Unplug 'vampire' electronics, switch to LED bulbs, and choose Energy Star appliances. Washing clothes in cold water saves 90% of the washing machine's heating energy.",
  ac: "Air conditioners consume massive energy. Setting your AC thermostat to 24°C (75°F) instead of colder temperatures saves about 3-5% energy per degree.",
  heat: "Air conditioners consume massive energy. Setting your AC thermostat to 24°C (75°F) instead of colder temperatures saves about 3-5% energy per degree.",
  tree: "A single mature tree absorbs roughly 22 kg (48 lbs) of carbon dioxide per year. Supporting local community gardens or reforestation projects directly offsets emissions.",
  plant: "A single mature tree absorbs roughly 22 kg (48 lbs) of carbon dioxide per year. Supporting local community gardens or reforestation projects directly offsets emissions.",
  goal: "Setting a goal keeps you accountable! Try aiming for a 10% reduction this month. Start by walking short commutes and reducing air conditioner hours.",
  hello: "Hello! I am your AI Eco Coach. Ask me anything about reducing energy, plastic waste, switching commutes, or optimizing your dietary carbon footprint!",
  hi: "Hello! I am your AI Eco Coach. Ask me anything about reducing energy, plastic waste, switching commutes, or optimizing your dietary carbon footprint!"
};

const getChatbotReply = (msg) => {
  const cleanMsg = msg.toLowerCase().trim();
  for (const key of Object.keys(chatbotResponses)) {
    if (cleanMsg.includes(key)) {
      return chatbotResponses[key];
    }
  }
  return "That's an interesting question! Generally, reducing private vehicle commutes and lowering home AC/heating usage represent the fastest ways to cut emissions. What specific area (diet, plastic, transport) would you like to optimize?";
};

export default function AICoach({ 
  inputs, 
  results, 
  activeGoals, 
  onAddGoal, 
  points = 0 
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'coach',
      text: `Hello there! I am your AI Eco Coach. I've analyzed your Carbon Footprint calculations (Score: ${calculateScore(results.annualTotalTons)}/100) and generated a customized plan of action below. \n\nYou can ask me specific questions in the chat assistant panel, or browse your custom recommendations!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('high'); // 'high' | 'all'
  const chatEndRef = useRef(null);

  const quickPrompts = [
    { text: "How can I reduce my AC electricity?", key: "ac" },
    { text: "What is the carbon impact of red meat?", key: "meat" },
    { text: "Tips to decrease plastic usage", key: "plastic" }
  ];

  // Generate recommendations dynamically based on inputs
  useEffect(() => {
    if (!inputs) return;
    const list = [];

    // 1. Car commute recommendation
    if (inputs.carTravel > 15) {
      list.push({
        id: 'rec-carpool',
        title: 'Initiate Carpooling or Transit Commute',
        description: `Your car commute is ${inputs.carTravel} km daily. Carpooling or taking public transit 2 days/week will drastically cut fuel consumption.`,
        category: 'transportation',
        icon: Car,
        priority: 'High',
        difficulty: 'Medium',
        savings: Math.round(inputs.carTravel * 0.171 * 52 * 2),
        committed: activeGoals.includes('Initiate Carpooling or Transit Commute')
      });
    }

    // 2. Flight recommendation
    if (inputs.flights > 2) {
      list.push({
        id: 'rec-flight',
        title: 'Carbon-Offset Flights & Choose Trains',
        description: `With ${inputs.flights} flights annually, air travel is a major emission source. Consider local train journeys where possible, or purchase verified carbon offsets.`,
        category: 'transportation',
        icon: Car,
        priority: 'High',
        difficulty: 'Medium',
        savings: 300, 
        committed: activeGoals.includes('Carbon-Offset Flights & Choose Trains')
      });
    }

    // 3. Electricity recommendation
    if (inputs.electricity > 250) {
      list.push({
        id: 'rec-led',
        title: 'Install Smart Power Strips & LEDs',
        description: `Your monthly power is ${inputs.electricity} kWh. Upgrading to LED lighting and cutting phantom load can save up to 12% on household emissions.`,
        category: 'energy',
        icon: Zap,
        priority: 'Medium',
        difficulty: 'Easy',
        savings: Math.round(inputs.electricity * 0.12 * 0.475 * 12),
        committed: activeGoals.includes('Install Smart Power Strips & LEDs')
      });
    }

    // 4. AC recommendation
    if (inputs.acUsage > 3) {
      list.push({
        id: 'rec-ac',
        title: 'Optimize AC Thermostat to 24°C',
        description: `Adjusting your AC daily cooling temperature to 24°C/75°F (with ceiling fans) instead of colder settings saves significant compressor electricity.`,
        category: 'energy',
        icon: Zap,
        priority: 'Medium',
        difficulty: 'Easy',
        savings: Math.round(inputs.acUsage * 0.3 * 30),
        committed: activeGoals.includes('Optimize AC Thermostat to 24°C')
      });
    }

    // 5. Diet recommendation
    if (inputs.foodHabit === 'meatHeavy') {
      list.push({
        id: 'rec-meat',
        title: 'Transition to "Meatless Mondays"',
        description: 'Going vegetarian just one day a week saves beef livestock production emissions. You can substitute beef for poultry or legumes.',
        category: 'food',
        icon: Utensils,
        priority: 'High',
        difficulty: 'Easy',
        savings: 80,
        committed: activeGoals.includes('Transition to "Meatless Mondays"')
      });
    } else if (inputs.foodHabit === 'mixed') {
      list.push({
        id: 'rec-vegan',
        title: 'Increase Plant-Based Meals',
        description: 'Try adding more lentils, vegetables, and plant milks into your regular diet. Replacing cheese and butter cuts dairy carbon load.',
        category: 'food',
        icon: Utensils,
        priority: 'Medium',
        difficulty: 'Medium',
        savings: 40,
        committed: activeGoals.includes('Increase Plant-Based Meals')
      });
    }

    // 6. Plastic usage recommendation
    if (inputs.plasticUsage !== 'low') {
      list.push({
        id: 'rec-plastic',
        title: 'Adopt Zero-Waste Reusables',
        description: 'Replace plastic grocery bags, food wrap, and bottled waters with canvas totes, glass containers, and stainless flasks.',
        category: 'lifestyle',
        icon: ShoppingBag,
        priority: 'Medium',
        difficulty: 'Easy',
        savings: 20,
        committed: activeGoals.includes('Adopt Zero-Waste Reusables')
      });
    }

    // 7. Shopping recommendation
    if (inputs.shoppingFrequency === 'frequently') {
      list.push({
        id: 'rec-secondhand',
        title: 'Embrace Secondhand & Vintage',
        description: 'Fast fashion and electronic goods require intensive manufacturing energy. Buying vintage or refurbished cuts supply-chain footprint.',
        category: 'lifestyle',
        icon: ShoppingBag,
        priority: 'Medium',
        difficulty: 'Medium',
        savings: 45,
        committed: activeGoals.includes('Embrace Secondhand & Vintage')
      });
    }

    // 8. General carbon offset: Trees
    list.push({
      id: 'rec-tree',
      title: 'Plant a Native Backyard Tree',
      description: 'A single tree can absorb over 20 kg of carbon dioxide every year while improving local biodiversity and air quality.',
      category: 'lifestyle',
      icon: Leaf,
      priority: 'Low',
      difficulty: 'Easy',
      savings: 22,
      committed: activeGoals.includes('Plant a Native Backyard Tree')
    });

    // 9. Laundry recommendation
    list.push({
      id: 'rec-laundry',
      title: 'Wash Laundry on Cold Cycles',
      description: 'Heating water accounts for 90% of a washing machine\'s energy. Washing on cold cycles cuts emissions and extends clothing life.',
      category: 'energy',
      icon: Zap,
      priority: 'Medium',
      difficulty: 'Easy',
      savings: 15,
      committed: activeGoals.includes('Wash Laundry on Cold Cycles')
    });

    setRecommendations(list);
  }, [inputs, activeGoals]);

  // Chat message sending
  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate coach typing dots
    setTimeout(() => {
      setIsTyping(false);
      const reply = getChatbotReply(text);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'coach',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 900);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const filteredRecs = recommendations.filter(rec => {
    if (activeTab === 'high') return rec.priority === 'High';
    return true;
  });

  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-emerald-400" />
          AI Sustainability Coach
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Ask queries to our AI assistant or browse tailored goals generated based on calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Recommendations List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              Custom Sustainability Plan
            </h3>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('high')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                  activeTab === 'high'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                High Impact
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
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
            {filteredRecs.map(rec => {
              const Icon = rec.icon || Leaf;
              const isCommitted = activeGoals.includes(rec.title);
              
              return (
                <div 
                  key={rec.id}
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
                        <span className="text-[9px] text-slate-500 capitalize tracking-wider font-semibold">{rec.category}</span>
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
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Difficulty: <strong className="text-slate-400 capitalize">{rec.difficulty}</strong>
                    </span>

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
                          <Check className="w-3.5 h-3.5" /> Committed
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
            })}
          </div>
        </div>

        {/* Right Side: Chat panel styled like ChatGPT */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-3xl p-5 md:p-6 flex flex-col h-[630px] justify-between shadow-2xl">
          <div>
            <div className="border-b border-white/5 pb-3.5 mb-3.5 flex items-center gap-3">
              <div className="bg-emerald-500/15 p-2.5 rounded-xl border border-emerald-500/30">
                <Bot className="w-5.5 h-5.5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Eco Coach AI</h3>
                <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                </span>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(p.text)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/5 hover:border-emerald-500/20 hover:text-white px-2.5 py-1.5 rounded-xl transition-all"
                >
                  <MessageSquare className="w-3 h-3" /> {p.text}
                </button>
              ))}
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
                <span className="text-[9px] text-slate-600 mt-1 px-1">{m.time}</span>
              </div>
            ))}
            
            {/* AI typing pulsing loader */}
            {isTyping && (
              <div className="flex flex-col items-start max-w-[85%]">
                <div className="bg-slate-950/60 border border-white/5 text-slate-400 p-3 px-5 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input field */}
          <form onSubmit={handleFormSubmit} className="flex gap-2 border-t border-white/5 pt-4">
            <input
              type="text"
              placeholder="Ask me a sustainability question..."
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
      </div>
    </div>
  );
}

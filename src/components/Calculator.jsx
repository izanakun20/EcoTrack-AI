import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Bike, 
  Bus, 
  Plane, 
  Zap, 
  FlameKindling, 
  Utensils, 
  ShoppingBag, 
  Trash2, 
  Calculator as CalcIcon,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  Sparkles,
  Loader2,
  Minus,
  Plus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { calculateEmissions, calculateScore } from '../utils/calculations';

const CATEGORY_COLORS = {
  transportation: '#38bdf8', // sky-400
  energy: '#f59e0b',        // amber-500
  food: '#10b981',          // emerald-500
  lifestyle: '#a78bfa'       // violet-400
};

const LOADING_STATUSES = [
  "Mapping transportation emission coefficients...",
  "Calibrating regional energy grid mix indexes...",
  "Synthesizing food dietary footprint models...",
  "Running AI Sustainability recommendation engine..."
];

export default function Calculator({ currentInputs, onCalculate, hasCalculated }) {
  const [activeStep, setActiveStep] = useState(1);
  const [inputs, setInputs] = useState(currentInputs);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);

  // Live estimate updates in real-time as user changes values
  const [liveResults, setLiveResults] = useState(() => calculateEmissions(currentInputs));

  useEffect(() => {
    setLiveResults(calculateEmissions(inputs));
  }, [inputs]);

  // Loading text cycling effect
  useEffect(() => {
    let interval;
    if (isCalculating) {
      interval = setInterval(() => {
        setLoadingTextIdx(prev => (prev + 1) % LOADING_STATUSES.length);
      }, 700);
    } else {
      setLoadingTextIdx(0);
    }
    return () => clearInterval(interval);
  }, [isCalculating]);

  const handleInputChange = (field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const incrementField = (field, step = 5, max = 1000) => {
    setInputs(prev => ({
      ...prev,
      [field]: Math.min(max, prev[field] + step)
    }));
  };

  const decrementField = (field, step = 5) => {
    setInputs(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] - step)
    }));
  };

  const handleCalculateClick = (e) => {
    e.preventDefault();
    setIsCalculating(true);

    // Simulate AI loading calculations
    setTimeout(() => {
      setIsCalculating(false);
      const finalData = calculateEmissions(inputs);
      onCalculate(inputs, finalData);
      setActiveStep(4); // Move to results step
    }, 2800);
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  // Chart data formatting
  const pieData = liveResults ? [
    { name: 'Transportation', value: liveResults.breakdown.transportation, color: CATEGORY_COLORS.transportation },
    { name: 'Energy', value: liveResults.breakdown.energy, color: CATEGORY_COLORS.energy },
    { name: 'Food', value: liveResults.breakdown.food, color: CATEGORY_COLORS.food },
    { name: 'Lifestyle', value: liveResults.breakdown.lifestyle, color: CATEGORY_COLORS.lifestyle }
  ] : [];

  const barData = liveResults ? [
    { name: 'Your Footprint', value: liveResults.annualTotalTons, color: '#10b981' },
    { name: 'Global Average', value: 4.7, color: '#f59e0b' },
    { name: 'US Average', value: 16.0, color: '#ef4444' },
    { name: 'Eco Target', value: 2.0, color: '#38bdf8' }
  ] : [];

  return (
    <div className="py-2 relative">
      
      {/* Dynamic AI Loading Overlay screen */}
      {isCalculating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex flex-col justify-center items-center text-center p-6 transition-all duration-300">
          <div className="bg-emerald-500/10 p-5 rounded-full border border-emerald-500/30 mb-6 animate-pulse">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          </div>
          
          <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">EcoTrack AI Computing</h3>
          <p className="text-xs md:text-sm text-emerald-400 font-bold max-w-sm tracking-wide h-6">
            {LOADING_STATUSES[loadingTextIdx]}
          </p>
          <div className="w-48 bg-slate-900 h-1.5 rounded-full mt-6 overflow-hidden border border-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-gradient w-3/4"></div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <CalcIcon className="w-8 h-8 text-emerald-400" />
          Carbon Footprint Calculator
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Answer the questionnaire to evaluate and profile your individual carbon footprint index.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center max-w-xl mx-auto mb-10 relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
        {[1, 2, 3, 4].map(step => (
          <button
            key={step}
            onClick={() => liveResults && step <= 4 && setActiveStep(step)}
            disabled={!hasCalculated && step === 4}
            className={`w-9 h-9 rounded-full font-extrabold flex items-center justify-center z-10 transition-all text-xs border ${
              activeStep === step 
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_15px_-2px_rgba(16,185,129,0.5)]'
                : activeStep > step
                  ? 'bg-slate-900 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            aria-label={`Go to step ${step}`}
          >
            {step}
          </button>
        ))}
      </div>

      {/* Calculator Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Panel */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 min-h-[460px] flex flex-col justify-between shadow-2xl">
          <form onSubmit={handleCalculateClick}>
            
            {/* STEP 1: TRANSPORTATION */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <Car className="w-5.5 h-5.5 text-sky-400" />
                    Daily Commutes & Flight Logs
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Estimate daily vehicles and yearly flight logs.</p>
                </div>

                <div className="space-y-5">
                  {/* Car input */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <label className="text-slate-300 font-bold flex items-center gap-2">
                        Daily Car Travel (km)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => decrementField('carTravel', 5)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                        <span className="text-emerald-400 font-extrabold text-xs w-14 text-center">{inputs.carTravel} km</span>
                        <button type="button" onClick={() => incrementField('carTravel', 5, 200)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="150" step="5"
                      value={inputs.carTravel} 
                      onChange={e => handleInputChange('carTravel', e.target.value)}
                      className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                      aria-label="Daily Car Travel Slider"
                    />
                  </div>

                  {/* Bike Input */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <label className="text-slate-300 font-bold flex items-center gap-2">
                        Daily Motorbike Travel (km)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => decrementField('bikeTravel', 5)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                        <span className="text-emerald-400 font-extrabold text-xs w-14 text-center">{inputs.bikeTravel} km</span>
                        <button type="button" onClick={() => incrementField('bikeTravel', 5, 150)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="5"
                      value={inputs.bikeTravel} 
                      onChange={e => handleInputChange('bikeTravel', e.target.value)}
                      className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                      aria-label="Daily Motorbike Travel Slider"
                    />
                  </div>

                  {/* Public Transit Input */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <label className="text-slate-300 font-bold flex items-center gap-2">
                        Public Transit usage (km/day)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => decrementField('publicTransport', 5)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                        <span className="text-emerald-400 font-extrabold text-xs w-14 text-center">{inputs.publicTransport} km</span>
                        <button type="button" onClick={() => incrementField('publicTransport', 5, 200)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="120" step="5"
                      value={inputs.publicTransport} 
                      onChange={e => handleInputChange('publicTransport', e.target.value)}
                      className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                      aria-label="Public Transit Slider"
                    />
                  </div>

                  {/* Flights Input */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <label className="text-slate-300 font-bold flex items-center gap-2">
                        Flights taken per Year
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => decrementField('flights', 1)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                        <span className="text-emerald-400 font-extrabold text-xs w-14 text-center">{inputs.flights} flights</span>
                        <button type="button" onClick={() => incrementField('flights', 1, 50)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="25" step="1"
                      value={inputs.flights} 
                      onChange={e => handleInputChange('flights', e.target.value)}
                      className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                      aria-label="Annual Flights Slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ENERGY CONSUMPTION */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <Zap className="w-5.5 h-5.5 text-amber-500" />
                    Household Energy Grid
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Estimate electricity and air conditioner draw.</p>
                </div>

                <div className="space-y-6">
                  {/* Electricity Input */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <label className="text-slate-300 font-bold flex items-center gap-2">
                        Monthly Electricity (kWh)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => decrementField('electricity', 10)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                        <span className="text-emerald-400 font-extrabold text-xs w-20 text-center">{inputs.electricity} kWh</span>
                        <button type="button" onClick={() => incrementField('electricity', 10, 2000)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <input 
                      type="range" min="50" max="1200" step="10"
                      value={inputs.electricity} 
                      onChange={e => handleInputChange('electricity', e.target.value)}
                      className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                      aria-label="Electricity kWh Slider"
                    />
                  </div>

                  {/* AC Input */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <label className="text-slate-300 font-bold flex items-center gap-2">
                        Daily AC usage (Hours)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => decrementField('acUsage', 1)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                        <span className="text-emerald-400 font-extrabold text-xs w-16 text-center">{inputs.acUsage} hrs</span>
                        <button type="button" onClick={() => incrementField('acUsage', 1, 24)} className="p-1 bg-slate-800 border border-white/5 rounded text-slate-400 hover:text-white" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="24" step="1"
                      value={inputs.acUsage} 
                      onChange={e => handleInputChange('acUsage', e.target.value)}
                      className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                      aria-label="AC Usage Hours Slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: FOOD & LIFESTYLE */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <Utensils className="w-5.5 h-5.5 text-emerald-400" />
                    Food & Lifestyle Coefficients
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Submit dietary and plastic trash variables.</p>
                </div>

                <div className="space-y-6">
                  {/* Food habit select */}
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-3">
                      Food Diet Habits
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, plant heavy', emoji: '🥬' },
                        { id: 'mixed', label: 'Mixed Diet', desc: 'Moderate poultry/fish', emoji: '🍗' },
                        { id: 'meatHeavy', label: 'Heavy Meat', desc: 'Red meat daily', emoji: '🥩' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleInputChange('foodHabit', opt.id)}
                          className={`p-4.5 border rounded-2xl flex flex-col items-center text-center transition-all duration-300 scale-100 hover:scale-[1.03] outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                            inputs.foodHabit === opt.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500'
                              : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-white/10 hover:bg-slate-950/60'
                          }`}
                        >
                          <span className="text-3xl mb-2.5 filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)] animate-float">{opt.emoji}</span>
                          <span className="text-xs font-black mb-1">{opt.label}</span>
                          <span className="text-[9px] leading-snug text-slate-500 font-medium">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plastic usage select */}
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-3">
                      Plastic Waste Generation
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'low', label: 'Eco-conscious', desc: 'Active recycling', emoji: '♻️' },
                        { id: 'medium', label: 'Average', desc: 'Moderate buying', emoji: '🛍️' },
                        { id: 'high', label: 'Heavy Waste', desc: 'Single-use plastic', emoji: '🥤' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleInputChange('plasticUsage', opt.id)}
                          className={`p-4.5 border rounded-2xl flex flex-col items-center text-center transition-all duration-300 scale-100 hover:scale-[1.03] outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                            inputs.plasticUsage === opt.id
                              ? 'border-sky-500 bg-sky-500/10 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-1 ring-sky-500'
                              : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-white/10 hover:bg-slate-950/60'
                          }`}
                        >
                          <span className="text-3xl mb-2.5 filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)] animate-float">{opt.emoji}</span>
                          <span className="text-xs font-black mb-1">{opt.label}</span>
                          <span className="text-[9px] leading-snug text-slate-500 font-medium">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shopping frequency select */}
                  <div>
                    <label className="text-slate-300 text-xs font-bold block mb-3">
                      Shopping Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'rarely', label: 'Minimalist', desc: 'Essentials only', emoji: '📦' },
                        { id: 'average', label: 'Average', desc: 'Occasional clothes', emoji: '👕' },
                        { id: 'frequently', label: 'Consumerist', desc: 'Weekly packages', emoji: '🛒' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleInputChange('shoppingFrequency', opt.id)}
                          className={`p-4.5 border rounded-2xl flex flex-col items-center text-center transition-all duration-300 scale-100 hover:scale-[1.03] outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                            inputs.shoppingFrequency === opt.id
                              ? 'border-violet-500 bg-violet-500/10 text-white shadow-[0_0_20px_rgba(167,139,250,0.25)] ring-1 ring-violet-500'
                              : 'border-white/5 bg-slate-950/40 text-slate-400 hover:border-white/10 hover:bg-slate-950/60'
                          }`}
                        >
                          <span className="text-3xl mb-2.5 filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)] animate-float">{opt.emoji}</span>
                          <span className="text-xs font-black mb-1">{opt.label}</span>
                          <span className="text-[9px] leading-snug text-slate-500 font-medium">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: CALCULATED RESULTS */}
            {activeStep === 4 && liveResults && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <CheckCircle className="w-5.5 h-5.5 text-emerald-400" />
                    Footprint Analysis Complete!
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Here is how your annual carbon footprint sums up.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Monthly Impact</span>
                    <span className="text-2xl md:text-3xl font-black text-emerald-400">{liveResults.monthlyTotalKg}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">kg CO₂</span>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Annual Impact</span>
                    <span className="text-2xl md:text-3xl font-black text-sky-400">{liveResults.annualTotalTons}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Tons CO₂</span>
                  </div>
                </div>

                {/* Score badge summary */}
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400">Carbon Score</h4>
                    <span className="text-2xl font-black text-emerald-400">{calculateScore(liveResults.annualTotalTons)} / 100</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    {calculateScore(liveResults.annualTotalTons) >= 90 ? 'Green Hero' : calculateScore(liveResults.annualTotalTons) >= 70 ? 'Eco Champion' : calculateScore(liveResults.annualTotalTons) >= 50 ? 'Eco Explorer' : 'Carbon Learner'}
                  </span>
                </div>
              </div>
            )}
          </form>

          {/* Form navigation buttons */}
          <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-white/5">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1 bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold px-4 py-2.5 rounded-xl transition-all text-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl transition-all text-xs"
              >
                Continue <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            ) : activeStep === 3 ? (
              <button
                type="button"
                onClick={handleCalculateClick}
                className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3 rounded-xl transition-all text-xs shadow-lg shadow-emerald-500/15"
              >
                <CalcIcon className="w-4 h-4 text-slate-950 animate-pulse" /> Compute Carbon
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="ml-auto flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold px-5 py-2.5 rounded-xl border border-white/5 transition-all text-xs"
              >
                Recalculate
              </button>
            )}
          </div>
        </div>

        {/* Real-time sidebar estimator panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 min-h-[460px] flex flex-col justify-between shadow-2xl">
            <div className="h-full flex flex-col justify-between flex-grow space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5">Live Estimate</h3>
                  <p className="text-[10px] text-slate-500">Real-time simulation of parameters.</p>
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] text-emerald-400 font-bold animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Real-Time</span>
                </div>
              </div>
              
              {/* 1. Category Pie Chart */}
              <div className="h-[180px] w-full flex justify-center items-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(15,23,42,0.85)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px'
                      }} 
                      formatter={(val) => [`${val.toLocaleString()} kg CO₂`, 'Emissions']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center score */}
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold">Tons</span>
                  <span className="text-xl font-extrabold text-white">{liveResults.annualTotalTons}</span>
                </div>
              </div>

              {/* Pie chart legends */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-white/5 pt-4">
                {pieData.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                    <span className="text-slate-400 font-medium">{p.name}:</span>
                    <span className="text-slate-200 font-bold ml-auto">{Math.round((p.value / Math.max(1, liveResults.annualTotalKg)) * 100)}%</span>
                  </div>
                ))}
              </div>

              {/* 2. Comparative Bar Chart */}
              <div className="border-t border-white/5 pt-4">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2.5">Emissions Benchmark (Tons/Yr)</h4>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical" margin={{ left: -15, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" stroke="#475569" fontSize={9} />
                      <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} width={80} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15,23,42,0.85)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '10px'
                        }}
                        formatter={(val) => [`${val} Tons CO₂`, 'Annual']}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

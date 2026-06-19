import React, { useState } from 'react';
import { 
  Leaf, 
  LayoutDashboard, 
  Calculator, 
  MessageSquareCode, 
  Trophy, 
  Target, 
  Award, 
  Lightbulb, 
  User, 
  Menu, 
  X,
  Zap,
  Globe
} from 'lucide-react';

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  points = 0, 
  score = 0,
  hasCalculated = false
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresCalc: true },
    { id: 'calculator', label: 'Carbon Calculator', icon: Calculator, requiresCalc: false },
    { id: 'coach', label: 'AI Eco Coach', icon: MessageSquareCode, requiresCalc: true },
    { id: 'challenges', label: 'Weekly Challenges', icon: Trophy, requiresCalc: true },
    { id: 'goals', label: 'Reduction Goals', icon: Target, requiresCalc: true },
    { id: 'achievements', label: 'Eco Achievements', icon: Award, requiresCalc: true },
    { id: 'insights', label: 'Insights & Tips', icon: Lightbulb, requiresCalc: false },
    { id: 'profile', label: 'Eco Profile', icon: User, requiresCalc: false },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative overflow-hidden flex flex-col md:flex-row">
      
      {/* Background Ambient Mesh Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* Mobile Top Navbar */}
      <header className="md:hidden glass-navbar sticky top-0 z-50 px-5 py-4 flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-sans font-black text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
            EcoTrack AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {hasCalculated && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full text-xs text-emerald-400 font-bold">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{points} pts</span>
            </div>
          )}
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-900/60 border border-white/5 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-950/60 border-r border-white/5 backdrop-blur-3xl p-6.5 sticky top-0 h-screen justify-between z-40">
        <div>
          {/* Logo */}
          <div 
            className="flex items-center gap-3.5 mb-10 cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => setActiveTab('landing')}
          >
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 p-3 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-sans font-black text-2xl tracking-tight bg-gradient-to-r from-emerald-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
                EcoTrack AI
              </h1>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1 mt-0.5">
                <Globe className="w-2.5 h-2.5 text-emerald-500" /> Startup Carbon Guard
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const disabled = item.requiresCalc && !hasCalculated;
              const active = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => !disabled && handleTabClick(item.id)}
                  aria-label={item.label}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 transform ${
                    active 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_4px_20px_-3px_rgba(16,185,129,0.15)] translate-x-1' 
                      : disabled 
                        ? 'text-slate-700 cursor-not-allowed opacity-40' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:translate-x-0.5'
                  }`}
                  disabled={disabled}
                  title={disabled ? 'Complete carbon calculator first' : ''}
                >
                  <Icon className={`w-4.5 h-4.5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info Block */}
        {hasCalculated && (
          <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-4.5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Climate Index</span>
              <span className={`text-xs font-bold ${
                score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-sky-400' : 'text-amber-400'
              }`}>{score}/100</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5 p-[1px]">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${
                  score >= 70 ? 'from-emerald-400 to-teal-400' : score >= 50 ? 'from-sky-400 to-teal-400' : 'from-amber-400 to-orange-400'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-0.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
                <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10" /> Reward points
              </span>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">{points}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl flex flex-col p-6 pt-24 space-y-4 animate-fade-in">
          <nav className="space-y-2 flex-grow">
            {navItems.map((item) => {
              const Icon = item.icon;
              const disabled = item.requiresCalc && !hasCalculated;
              const active = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => !disabled && handleTabClick(item.id)}
                  className={`w-full flex items-center gap-4.5 px-5 py-4.5 rounded-2xl text-sm font-bold transition-all ${
                    active 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-md' 
                      : disabled 
                        ? 'text-slate-800 cursor-not-allowed opacity-30' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                  disabled={disabled}
                >
                  <Icon className="w-5.5 h-5.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          {hasCalculated && (
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4.5 flex flex-col gap-2 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Eco Score</span>
                <span className="text-xs font-bold text-emerald-400">{score}/100</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1">
                <span className="text-xs text-slate-500">Total Eco Points</span>
                <span className="text-sm font-bold text-emerald-400">{points} pts</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-5 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full z-10">
        {children}
      </main>
      
    </div>
  );
}

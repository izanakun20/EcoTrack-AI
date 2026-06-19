import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      window.localStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background Ambient Mesh Lights */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-rose-500/10 rounded-full blur-[160px] pointer-events-none z-0"></div>

          <div className="glass-card border border-rose-500/20 bg-slate-950/85 backdrop-blur-xl max-w-md w-full p-8 rounded-[32px] text-center space-y-6 shadow-2xl z-10 relative">
            <div className="bg-rose-500/10 mx-auto w-16 h-16 rounded-2xl border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/5">
              <AlertTriangle className="w-8 h-8 text-rose-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Something went wrong</h2>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                An unexpected system render error occurred. Your calculation progress can be recovered by reloading, or resetting your browser storage.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl text-left max-h-32 overflow-y-auto">
                <code className="text-[10px] text-rose-400 font-mono block break-all leading-normal whitespace-pre-wrap">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl border border-white/5 transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-400 hover:to-orange-500 text-white font-black py-3 px-4 rounded-xl shadow-lg transition-all text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset App Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

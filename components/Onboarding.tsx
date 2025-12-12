import React from 'react';
import { X, ChevronRight, Scale, Command, MessageSquare, Archive } from 'lucide-react';

interface OnboardingProps {
    onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-bg-paper border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-slide-up">
                
                {/* Visual Side */}
                <div className="bg-gradient-to-br from-accent-primary/20 to-bg-primary w-full md:w-1/3 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700/50">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                        <Scale className="text-accent-primary w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white text-center">LEX SIMULACRA</h2>
                    <p className="text-xs text-accent-primary mt-2 font-mono tracking-widest">ORIENTATION</p>
                </div>

                {/* Content Side */}
                <div className="p-8 flex-1">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>

                    <h3 className="text-lg font-bold text-white mb-2">Welcome, Counselor.</h3>
                    <p className="text-sm text-slate-400 mb-6">
                        The Court Clerk has initialized your workspace. Here is a brief overview of your tactical capabilities in this simulation.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-accent-secondary">
                                <Command size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-200">Command Interface</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Type <code className="bg-slate-800 px-1 py-0.5 rounded border border-slate-700 text-slate-300">/</code> in the input bar to access agent commands. Switch roles to <span className="text-accent-secondary">/mentor</span> for advice or <span className="text-accent-primary">/judge</span> to rule.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-accent-gold">
                                <MessageSquare size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-200">Case Notes</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Use the <strong>Brief</strong> tab in the sidebar to maintain private case notes and review strategy.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-accent-success">
                                <Archive size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-200">Evidence Filtering</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Quickly sort through discovery materials in the <strong>Evidence</strong> tab using the new filter controls.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-accent-primary hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        Proceed to Trial <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
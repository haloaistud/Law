import React from 'react';
import { Scale, Shield, Gavel, Book, Settings, Activity, Cpu, Sword } from 'lucide-react';
import { UserRole } from '../types';

interface SplashScreenProps {
    onStart: (role: UserRole) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg-primary relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="z-10 text-center max-w-6xl w-full animate-[slideInUp_0.8s_ease-out]">
                {/* Logo */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border-2 border-accent-primary/50 flex items-center justify-center animate-glow backdrop-blur-sm">
                    <Scale className="w-12 h-12 text-accent-primary" />
                </div>

                <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-br from-accent-primary to-accent-secondary text-transparent bg-clip-text">
                    LEX SIMULACRA
                </h1>
                <p className="font-mono text-accent-secondary/80 tracking-[0.2em] mb-12 text-sm uppercase">
                    AI Litigation Engine
                </p>

                {/* Role Selection */}
                <h2 className="text-xl text-white font-bold mb-6">Choose Your Role</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
                    {/* Prosecution Card */}
                    <button 
                        onClick={() => onStart('prosecution')}
                        className="group relative overflow-hidden bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-accent-secondary p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 text-accent-secondary group-hover:scale-110 transition-transform">
                                <Sword size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Prosecution</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Represent the State. Burden of proof is on you. Use forensic evidence and aggressive cross-examination to secure a conviction.
                            </p>
                            <span className="text-xs font-mono text-accent-secondary uppercase tracking-widest flex items-center gap-2">
                                Select <span className="text-lg">→</span>
                            </span>
                        </div>
                    </button>

                    {/* Defense Card */}
                    <button 
                        onClick={() => onStart('defense')}
                        className="group relative overflow-hidden bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-accent-primary p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 text-accent-primary group-hover:scale-110 transition-transform">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Defense</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Represent the Accused. Cast reasonable doubt. Suppress damaging evidence and protect your client's constitutional rights.
                            </p>
                            <span className="text-xs font-mono text-accent-primary uppercase tracking-widest flex items-center gap-2">
                                Select <span className="text-lg">→</span>
                            </span>
                        </div>
                    </button>
                </div>

                <div className="flex justify-center gap-6 text-sm text-slate-500">
                    <span className="flex items-center gap-2"><Cpu size={14} /> Adaptive AI</span>
                    <span className="flex items-center gap-2"><Gavel size={14} /> Realistic Procedure</span>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
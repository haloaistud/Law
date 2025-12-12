import React, { useState } from 'react';
import { PromptCategory, PromptTemplate } from '../types';
import { ChevronRight, ChevronDown, X } from 'lucide-react';

interface PromptGuideProps {
    categories: PromptCategory[];
    onSelect: (text: string) => void;
    onClose: () => void;
}

const PromptGuide: React.FC<PromptGuideProps> = ({ categories, onSelect, onClose }) => {
    const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);

    return (
        <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-bg-paper/95 backdrop-blur-xl border border-slate-600 rounded-xl shadow-2xl flex flex-col max-h-[60vh] overflow-hidden animate-slide-up z-50">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
                    Tactical Guide
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Categories Sidebar */}
                <div className="w-12 md:w-32 border-r border-slate-700 bg-slate-900/50 flex flex-col overflow-y-auto">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`p-3 flex flex-col items-center justify-center gap-1 border-l-2 transition-all ${activeCategory === cat.id ? 'border-l-accent-primary bg-slate-800/80 text-accent-primary' : 'border-l-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
                            >
                                <Icon size={18} />
                                <span className="text-[10px] hidden md:block font-medium">{cat.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Templates List */}
                <div className="flex-1 overflow-y-auto p-2 bg-slate-900/30">
                    {categories.find(c => c.id === activeCategory)?.templates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template.text)}
                            className="w-full text-left p-3 mb-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-accent-primary/50 group transition-all"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-slate-200 group-hover:text-white">{template.label}</span>
                                <ChevronRight size={14} className="text-slate-600 group-hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2">{template.description}</p>
                            <div className="mt-2 text-[10px] font-mono text-accent-secondary/80 truncate opacity-60">"{template.text}"</div>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="p-2 border-t border-slate-700 bg-slate-800/30 text-[10px] text-center text-slate-500">
                Select a template to populate the command line.
            </div>
        </div>
    );
};

export default PromptGuide;
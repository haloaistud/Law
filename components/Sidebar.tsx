import React, { useState } from 'react';
import { TimelineEvent, CaseDetails, Note, Witness } from '../types';
import { WITNESS_DATA } from '../constants';
import { 
    FileText, Gavel, Scale, Search, Handshake, Paperclip, Pin, 
    Clock, Archive, Info, File, Shield, Plus, Trash2, Filter, Users, User, Mic
} from 'lucide-react';

interface SidebarProps {
    events: TimelineEvent[];
    caseDetails: CaseDetails;
    isOpen: boolean;
    notes: Note[];
    onAddNote: (content: string) => void;
    onDeleteNote: (id: string) => void;
    onCallWitness?: (witnessId: string) => void;
}

type Tab = 'timeline' | 'evidence' | 'brief' | 'witnesses';
type EvidenceFilter = 'all' | 'pdf' | 'image' | 'document';

const Sidebar: React.FC<SidebarProps> = ({ events, caseDetails, isOpen, notes, onAddNote, onDeleteNote, onCallWitness }) => {
    const [activeTab, setActiveTab] = useState<Tab>('timeline');
    const [evidenceFilter, setEvidenceFilter] = useState<EvidenceFilter>('all');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [selectedWitnessId, setSelectedWitnessId] = useState<string | null>(null);

    // Extract all attachments from events to form the Evidence list
    const allEvidence = events.flatMap(e => e.attachments.map(a => ({ ...a, sourceEventId: e.id, date: e.date })));
    
    const filteredEvidence = allEvidence.filter(item => {
        if (evidenceFilter === 'all') return true;
        return item.type === evidenceFilter;
    });

    const handleAddNote = () => {
        if (!newNoteContent.trim()) return;
        onAddNote(newNoteContent);
        setNewNoteContent('');
    };

    const getIcon = (type: TimelineEvent['type']) => {
        switch (type) {
            case 'filing': return <FileText size={14} />;
            case 'motion': return <Gavel size={14} />;
            case 'hearing': return <Scale size={14} />;
            case 'evidence': return <Search size={14} />;
            case 'plea': return <Handshake size={14} />;
            default: return <FileText size={14} />;
        }
    };

    return (
        <aside className={`${isOpen ? 'w-80 md:w-96 translate-x-0' : 'w-0 -translate-x-full opacity-0'} flex flex-col fixed md:relative z-20 h-[calc(100vh-64px)] border-r border-slate-700/50 bg-bg-paper transition-all duration-300 shadow-2xl overflow-hidden`}>
            
            {/* Tabs Header */}
            <div className="flex border-b border-slate-700/50 bg-bg-primary/50 overflow-x-auto no-scrollbar">
                {(['timeline', 'evidence', 'witnesses', 'brief'] as Tab[]).map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 px-2 min-w-[70px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors relative ${activeTab === tab ? 'text-accent-primary bg-slate-800/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
                    >
                        {tab === 'timeline' && <Clock size={16} />}
                        {tab === 'evidence' && <Archive size={16} />}
                        {tab === 'brief' && <Info size={16} />}
                        {tab === 'witnesses' && <Users size={16} />}
                        <span className="hidden sm:inline">{tab}</span>
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-bg-paper to-bg-primary">
                
                {/* TIMELINE TAB */}
                {activeTab === 'timeline' && (
                    <div className="p-6 space-y-8">
                        {events.map((event, index) => (
                            <div key={event.id} className="relative pl-8 group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                {/* Connector Line */}
                                {index !== events.length - 1 && (
                                    <div className="absolute left-[11px] top-6 bottom-[-32px] w-px bg-slate-700 group-hover:bg-slate-600 transition-colors"></div>
                                )}
                                
                                {/* Node */}
                                <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center bg-bg-paper transition-all z-10 ${event.pinned ? 'border-accent-gold text-accent-gold shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-600 text-slate-400 group-hover:border-accent-primary group-hover:text-accent-primary'}`}>
                                    {event.pinned ? <Pin size={10} className="fill-current" /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                                </div>

                                <div className="relative">
                                    <div className="flex items-baseline justify-between mb-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${event.pinned ? 'text-accent-gold' : 'text-accent-primary'}`}>
                                            {getIcon(event.type)}
                                            {event.type}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500">{event.date}</span>
                                    </div>
                                    
                                    <h3 className="text-sm font-semibold text-slate-200 mb-1 group-hover:text-white transition-colors">{event.title}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{event.description}</p>
                                    
                                    {event.attachments.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {event.attachments.map((att, i) => (
                                                <span key={i} className="flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700/50 hover:border-slate-600 cursor-pointer">
                                                    <Paperclip size={10} />
                                                    {att.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EVIDENCE TAB */}
                {activeTab === 'evidence' && (
                    <div className="p-6">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(['all', 'document', 'image', 'pdf'] as EvidenceFilter[]).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setEvidenceFilter(filter)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider border transition-all ${evidenceFilter === filter ? 'bg-accent-primary text-white border-accent-primary' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                                >
                                    {filter === 'all' ? 'All' : filter}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {filteredEvidence.map((item, idx) => (
                                <div key={idx} className="bg-slate-800/40 border border-slate-700 hover:border-accent-primary/50 hover:bg-slate-800/80 rounded-lg p-3 cursor-pointer transition-all group animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-accent-primary group-hover:scale-110 transition-all">
                                            {item.type === 'image' ? <File size={16} /> : <FileText size={16} />}
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-600">{item.date}</span>
                                    </div>
                                    <div className="text-xs font-medium text-slate-300 truncate mb-1">{item.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{item.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* WITNESSES TAB */}
                {activeTab === 'witnesses' && (
                    <div className="p-6 space-y-4">
                        <div className="text-xs text-slate-400 mb-2">Available Witnesses</div>
                        {WITNESS_DATA.map((witness) => (
                            <div key={witness.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden hover:border-accent-primary/30 transition-all">
                                <div className="p-4 cursor-pointer" onClick={() => setSelectedWitnessId(selectedWitnessId === witness.id ? null : witness.id)}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${witness.side === 'prosecution' ? 'border-red-500/30 bg-red-900/20 text-red-400' : witness.side === 'defense' ? 'border-blue-500/30 bg-blue-900/20 text-blue-400' : 'border-slate-500/30 bg-slate-800 text-slate-400'}`}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-200">{witness.name}</h3>
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500">{witness.role}</span>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${witness.side === 'prosecution' ? 'border-red-500/20 text-red-500' : witness.side === 'defense' ? 'border-blue-500/20 text-blue-500' : 'border-slate-600 text-slate-500'}`}>
                                            {witness.side}
                                        </span>
                                    </div>
                                </div>

                                {selectedWitnessId === witness.id && (
                                    <div className="border-t border-slate-700/50 bg-slate-900/30 p-4 space-y-3 animate-fade-in">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Background</h4>
                                            <p className="text-xs text-slate-300 leading-relaxed">{witness.description}</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Key Facts</h4>
                                            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                                {witness.facts.map((f, i) => <li key={i}>{f}</li>)}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Statement Preview</h4>
                                            <p className="text-xs text-slate-400 italic bg-slate-800 p-2 rounded border border-slate-700/50">
                                                "{witness.statement.substring(0, 120)}..."
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => onCallWitness && onCallWitness(witness.id)}
                                            className="w-full mt-2 py-2 bg-accent-primary/10 hover:bg-accent-primary hover:text-white text-accent-primary border border-accent-primary/50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Mic size={14} />
                                            Call to Stand
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* BRIEF TAB */}
                {activeTab === 'brief' && (
                    <div className="p-6 space-y-6 animate-fade-in">
                        {/* Case Info Card */}
                         <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-primary/5 rounded-full blur-xl"></div>
                            
                            <h2 className="text-lg font-bold text-white mb-1 relative z-10">{caseDetails.defendant}</h2>
                            <p className="text-xs text-accent-primary font-mono mb-4 relative z-10">{caseDetails.title}</p>
                            
                            <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                                    <span className="text-xs text-slate-400">Charge</span>
                                    <span className="text-xs font-semibold text-slate-200 text-right">{caseDetails.charge}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                                    <span className="text-xs text-slate-400">Location</span>
                                    <span className="text-xs font-semibold text-slate-200 text-right">{caseDetails.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Info */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Shield size={12} />
                                Strategy Overview
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/30 p-3 rounded border border-slate-700/30">
                                {caseDetails.description}
                            </p>
                        </div>

                        {/* Case Notes Section */}
                        <div className="pt-4 border-t border-slate-700/50">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center justify-between">
                                <span>Case Notes</span>
                                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">{notes.length}</span>
                            </h3>
                            
                            {/* Note Input */}
                            <div className="space-y-2 mb-4">
                                <textarea 
                                    value={newNoteContent}
                                    onChange={(e) => setNewNoteContent(e.target.value)}
                                    placeholder="Add strategic observation..."
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent-primary/50 min-h-[80px]"
                                />
                                <button 
                                    onClick={handleAddNote}
                                    disabled={!newNoteContent.trim()}
                                    className="w-full py-2 bg-slate-800 hover:bg-accent-primary/20 border border-slate-700 hover:border-accent-primary/50 text-slate-300 hover:text-accent-primary rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Plus size={12} />
                                    Add Note
                                </button>
                            </div>

                            {/* Note List */}
                            <div className="space-y-3">
                                {notes.map(note => (
                                    <div key={note.id} className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3 group hover:border-slate-600 transition-colors">
                                        <p className="text-xs text-slate-300 leading-relaxed mb-2 whitespace-pre-wrap">{note.content}</p>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                                            <span className="text-[10px] text-slate-600 font-mono">
                                                {note.timestamp.toLocaleDateString()} {note.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            <button 
                                                onClick={() => onDeleteNote(note.id)}
                                                className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-700/50 bg-bg-paper text-[10px] text-slate-600 font-mono flex justify-between">
                <span>LEX-OS v2.4</span>
                <span className="flex items-center gap-1 text-accent-success"><div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div> SECURE</span>
            </div>
        </aside>
    );
};

export default Sidebar;
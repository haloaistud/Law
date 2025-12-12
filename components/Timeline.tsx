import React from 'react';
import { TimelineEvent } from '../types';
import { FileText, Gavel, Scale, Search, Handshake, Paperclip, Pin } from 'lucide-react';

interface TimelineProps {
    events: TimelineEvent[];
    isOpen: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ events, isOpen }) => {
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
        <aside className={`${isOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0'} transition-all duration-300 bg-bg-secondary border-r border-gray-800 flex flex-col fixed md:relative z-20 h-[calc(100vh-64px)] overflow-hidden`}>
            <div className="p-6 border-b border-gray-800 shrink-0">
                <h2 className="text-xl font-bold text-white mb-2">Case Timeline</h2>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>35%</span>
                </div>
                <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary w-[35%]"></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="relative pl-6 border-l-2 border-gray-800 last:border-l-0 group">
                        {/* Dot */}
                        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-accent-primary ring-4 ring-bg-secondary group-hover:ring-accent-primary/20 transition-all"></div>
                        
                        <div className="bg-bg-tertiary/50 border border-gray-800 rounded-lg p-4 hover:border-accent-primary/50 transition-colors cursor-pointer group-hover:bg-bg-tertiary">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${event.pinned ? 'text-accent-gold' : 'text-accent-primary'}`}>
                                    {event.pinned && <Pin size={10} className="fill-current" />}
                                    {getIcon(event.type)}
                                    {event.type}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">{event.date}</span>
                            </div>
                            
                            <h3 className="text-sm font-bold text-gray-200 mb-1">{event.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed mb-3">{event.description}</p>
                            
                            {event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {event.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {event.attachments.length > 0 && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 pt-2 border-t border-gray-700/50">
                                    <Paperclip size={10} />
                                    {event.attachments.length} attachment(s)
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Timeline;
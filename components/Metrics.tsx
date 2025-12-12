import React from 'react';
import { CaseMetrics } from '../types';
import { Activity, Users, FileSearch } from 'lucide-react';

const Metrics: React.FC<{ metrics: CaseMetrics }> = ({ metrics }) => {
    return (
        <div className="h-16 border-b border-slate-700/50 bg-bg-paper/50 backdrop-blur-sm flex items-center justify-between px-6 gap-6">
            <MetricItem 
                icon={<Activity size={14} />} 
                label="Case Strength" 
                value={metrics.caseStrength} 
                color="text-accent-primary" 
                barColor="bg-accent-primary"
            />
            <div className="h-8 w-px bg-slate-700/50"></div>
            <MetricItem 
                icon={<Users size={14} />} 
                label="Jury Sentiment" 
                value={metrics.jurySentiment} 
                color="text-accent-secondary" 
                barColor="bg-accent-secondary"
            />
            <div className="h-8 w-px bg-slate-700/50"></div>
            <MetricItem 
                icon={<FileSearch size={14} />} 
                label="Evidence Score" 
                value={metrics.evidenceScore} 
                color="text-accent-success" 
                barColor="bg-accent-success"
            />
        </div>
    );
};

const MetricItem: React.FC<{ icon: React.ReactNode, label: string, value: number, color: string, barColor: string }> = ({ icon, label, value, color, barColor }) => (
    <div className="flex-1 flex flex-col justify-center gap-1.5 group cursor-default">
        <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-2 text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                <span className={color}>{icon}</span>
                {label}
            </span>
            <span className={`font-mono font-bold ${color}`}>{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
            <div 
                className={`h-full ${barColor} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`} 
                style={{ width: `${value}%`, opacity: 0.8 }}
            ></div>
        </div>
    </div>
);

export default Metrics;
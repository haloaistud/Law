export interface TimelineEvent {
    id: number;
    type: 'filing' | 'motion' | 'hearing' | 'evidence' | 'plea' | 'ruling';
    title: string;
    date: string;
    description: string;
    tags: string[];
    pinned: boolean;
    attachments: { type: 'pdf' | 'image' | 'document'; name: string }[];
    notes?: string;
    aiChain?: { step: string; detail: string }[];
}

export type UserRole = 'defense' | 'prosecution';

export type AgentRole = 'judge' | 'mentor' | 'clerk' | 'opposing' | 'jury' | 'witness';

export interface Witness {
    id: string;
    name: string;
    role: string;
    side: 'prosecution' | 'defense' | 'neutral';
    description: string;
    facts: string[]; // Key knowledge points
    personality: string;
    statement: string; // The full text of their affidavit/statement
}

export interface Message {
    id: string;
    sender: 'user' | 'ai' | 'system';
    role?: AgentRole; // Specific role of the AI sender
    senderName?: string;
    content: string;
    timestamp: Date;
    type?: 'normal' | 'ruling' | 'evidence';
}

export interface CaseMetrics {
    caseStrength: number;
    jurySentiment: number;
    evidenceScore: number;
}

export interface CaseDetails {
    title: string;
    defendant: string;
    charge: string;
    role: string; // Display string
    userSide: UserRole; // Logical side
    location: string;
    day: number;
    totalDays: number;
    description: string;
}

export interface Note {
    id: string;
    content: string;
    timestamp: Date;
}

export interface SlashCommand {
    command: string;
    description: string;
    action: () => void;
    roleRequired?: AgentRole;
}

export interface PromptTemplate {
    id: string;
    label: string;
    text: string;
    description?: string;
}

export interface PromptCategory {
    id: string;
    title: string;
    icon: any; // Lucide icon component
    templates: PromptTemplate[];
}

// Extend Window for Web Speech API
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}
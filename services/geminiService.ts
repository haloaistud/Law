import { GoogleGenAI, Chat } from "@google/genai";
import { getAgentPersona } from "../constants";
import { AgentRole, UserRole } from "../types";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;
let currentAgentRole: AgentRole = 'judge';
let currentUserSide: UserRole = 'defense';
let currentContext: any = null;

export const initializeGemini = (userSide: UserRole, agentRole: AgentRole = 'judge', context?: any) => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found in environment variables.");
        return;
    }
    
    currentUserSide = userSide;
    currentAgentRole = agentRole;
    currentContext = context;

    try {
        genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
        startNewSession(agentRole, userSide, context);
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
    }
};

const startNewSession = (agentRole: AgentRole, userSide: UserRole, context?: any) => {
    if (!genAI) return;
    
    const persona = getAgentPersona(agentRole, userSide, context);

    // Create new chat with specific agent persona
    chatSession = genAI.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: persona.instruction,
            temperature: 0.7,
        }
    });
};

export const switchAgentRole = (agentRole: AgentRole, context?: any) => {
    currentAgentRole = agentRole;
    currentContext = context;
    startNewSession(agentRole, currentUserSide, context);
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
    if (!chatSession) {
        return new Promise(resolve => {
            setTimeout(() => {
                const persona = getAgentPersona(currentAgentRole, currentUserSide, currentContext);
                resolve(`${persona.name} (Offline): I acknowledge: "${message}"`);
            }, 1000);
        });
    }

    try {
        const result = await chatSession.sendMessage({ message });
        return result.text || "(No response)";
    } catch (error) {
        console.error("Gemini interaction error:", error);
        return "System Error: The AI agent is unresponsive.";
    }
};
import React, { useState, useEffect, useRef } from 'react';
import { Scale, Mic, Send, Menu, ShieldAlert, FolderOpen, Users, FileText, Bot, Gavel, Sparkles, X, Terminal, Command, Volume2, VolumeX, Swords, Shield, Book, Play } from 'lucide-react';
import { initializeGemini, sendMessageToGemini, switchAgentRole } from './services/geminiService';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Metrics from './components/Metrics';
import Onboarding from './components/Onboarding';
import PromptGuide from './components/PromptGuide';
import { INITIAL_METRICS, TIMELINE_DATA, getAgentPersona, getCaseDetails, PROMPT_TEMPLATES, WITNESS_DATA } from './constants';
import { Message, Note, AgentRole, SlashCommand, UserRole, CaseDetails, CaseMetrics, Witness } from './types';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('defense');
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [turn, setTurn] = useState<'user' | 'opponent'>('user');
  
  // Dynamic State
  const [metrics, setMetrics] = useState<CaseMetrics>(INITIAL_METRICS);
  const [activeWitness, setActiveWitness] = useState<Witness | null>(null);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPromptGuide, setShowPromptGuide] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State for Features
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeAgent, setActiveAgent] = useState<AgentRole>('judge');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initial Greeting when simulation starts
  useEffect(() => {
    if (hasStarted && messages.length === 0 && caseDetails) {
        // Initialize Gemini with Role
        initializeGemini(caseDetails.userSide, 'judge');

        // Play Music
        if (audioRef.current) {
            audioRef.current.volume = 0.15;
            audioRef.current.play().catch(e => console.log("Audio autoplay prevented"));
        }

        setTimeout(() => {
            setShowOnboarding(true);
            addMessage('system', 'System', 'Court is now in session. The Honorable Judge Morrison presiding.');
            
            setTimeout(() => {
                const judgeIntro = caseDetails.userSide === 'defense' 
                    ? "Case No. 24-901. State vs Henderson. Prosecution, you may proceed with your opening."
                    : "Case No. 24-901. State vs Henderson. Prosecution, your opening?";
                
                addMessage('ai', 'Judge Morrison', judgeIntro, 'judge');
                
                // PvAI Logic: If user is defense, Opponent (Prosecution) goes first automatically
                if (caseDetails.userSide === 'defense') {
                    setTurn('opponent');
                    setTimeout(() => {
                        triggerAgentResponse('opposing', "Deliver a short, aggressive opening statement accusing Alex Henderson of burglary. End by emphasizing the forensic evidence.");
                    }, 2500);
                } else {
                    setTurn('user');
                }
            }, 800);
        }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, caseDetails]);

  // Check for Slash Commands
  useEffect(() => {
    if (inputText.startsWith('/')) {
        setShowCommandMenu(true);
    } else {
        setShowCommandMenu(false);
    }
  }, [inputText]);

  const handleStart = (role: UserRole) => {
      setUserRole(role);
      setCaseDetails(getCaseDetails(role));
      setHasStarted(true);
  };

  const addMessage = (sender: Message['sender'], name: string, content: string, role: AgentRole = 'judge') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender,
      senderName: name,
      content,
      role,
      timestamp: new Date()
    }]);
  };

  const handleCallWitness = (witnessId: string) => {
    const witness = WITNESS_DATA.find(w => w.id === witnessId);
    if (witness) {
        setActiveWitness(witness);
        setActiveAgent('witness');
        switchAgentRole('witness', witness); 
        
        addMessage('system', 'System', `${witness.side === 'prosecution' ? 'Prosecution' : 'Defense'} calls ${witness.name} to the stand.`);
        setIsThinking(true);
        setTimeout(() => {
            setIsThinking(false);
            addMessage('ai', witness.name, "I do.", 'witness');
        }, 1000);
        
        // If sidebar is mobile, close it
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }
  };

  // Heuristic function to parse AI response and update metrics
  const analyzeTurnImpact = (aiResponse: string, role: AgentRole) => {
      const lowerText = aiResponse.toLowerCase();
      let dStrength = 0;
      let dSentiment = 0;
      let dEvidence = 0;

      // Judge logic
      if (role === 'judge') {
          if (lowerText.includes('sustained')) {
              dStrength += 5;
              dSentiment += 3;
          } else if (lowerText.includes('overruled')) {
              dStrength -= 3;
              dSentiment -= 2;
          } else if (lowerText.includes('approach the bench')) {
              dStrength -= 1;
          }
      }

      // Opposing Counsel logic
      if (role === 'opposing') {
          if (lowerText.includes('objection')) {
              dStrength -= 2; // Immediate pressure
          }
      }

      // Witness logic 
      if (role === 'witness') {
          if (lowerText.includes('don\'t recall') || lowerText.includes('not sure')) {
              dStrength += 2; // Good for cross-examination
              dEvidence -= 2; // Weakens testimony
          }
          if (lowerText.includes('yes') && lowerText.length < 10) {
              dEvidence += 1; // Direct confirmation
          }
      }

      setMetrics(prev => ({
          caseStrength: Math.min(100, Math.max(0, prev.caseStrength + dStrength)),
          jurySentiment: Math.min(100, Math.max(0, prev.jurySentiment + dSentiment)),
          evidenceScore: Math.min(100, Math.max(0, prev.evidenceScore + dEvidence))
      }));
  };

  // Helper to trigger an AI response without user input (PvAI Opponent Moves)
  const triggerAgentResponse = async (agent: AgentRole, systemPrompt: string) => {
      setIsThinking(true);
      setActiveAgent(agent);
      switchAgentRole(agent, agent === 'witness' ? activeWitness : undefined);
      
      try {
          const response = await sendMessageToGemini(systemPrompt);
          setIsThinking(false);
          const persona = getAgentPersona(agent, userRole, activeWitness);
          addMessage('ai', persona.name, response, agent);
          analyzeTurnImpact(response, agent);
          
          // Pass turn back to user after opponent speaks
          if (agent === 'opposing') {
              setTurn('user');
          }
      } catch (error) {
          setIsThinking(false);
      }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isThinking) return;

    // Handle Commands explicitly if user typed one without clicking menu
    if (inputText.startsWith('/')) {
        const cmd = getSlashCommands().find(c => c.command === inputText.trim());
        if (cmd) {
            cmd.action();
            setInputText('');
            return;
        }
    }

    const text = inputText;
    setInputText('');
    setShowPromptGuide(false); 
    addMessage('user', userRole === 'defense' ? 'Defense Attorney' : 'Prosecutor', text);
    setIsThinking(true);

    try {
      const response = await sendMessageToGemini(text);
      setIsThinking(false);
      const persona = getAgentPersona(activeAgent, userRole, activeWitness);
      addMessage('ai', persona.name, response, activeAgent);
      
      // Update Metrics based on what happened
      analyzeTurnImpact(response, activeAgent);

      // PvAI Logic: Dynamic Opponent Reaction
      if (activeAgent === 'judge' && Math.random() > 0.8) {
           setTimeout(() => {
               setTurn('opponent');
               triggerAgentResponse('opposing', "React to the previous statement or ruling. Be obstructionist or argumentative.");
           }, 1500);
      }

    } catch (error) {
      setIsThinking(false);
      addMessage('system', 'System', 'Error communicating with AI Agent.');
    }
  };

  const handleAddNote = (content: string) => {
    const newNote: Note = {
        id: Date.now().toString(),
        content,
        timestamp: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleRoleSwitch = (newRole: AgentRole) => {
      setActiveAgent(newRole);
      switchAgentRole(newRole);
      setInputText(''); 
      setShowCommandMenu(false);
  };

  const getSlashCommands = (): SlashCommand[] => [
    { command: '/judge', description: 'Address the Judge', action: () => handleRoleSwitch('judge'), roleRequired: 'judge' },
    { command: '/mentor', description: userRole === 'defense' ? 'Consult Co-Counsel' : 'Consult D.A.', action: () => handleRoleSwitch('mentor'), roleRequired: 'mentor' },
    { command: '/opposing', description: userRole === 'defense' ? 'Address Prosecutor' : 'Address Defense', action: () => handleRoleSwitch('opposing'), roleRequired: 'opposing' },
    { command: '/clerk', description: 'Ask Court Clerk', action: () => handleRoleSwitch('clerk'), roleRequired: 'clerk' },
    { command: '/jury', description: 'Analyze Jury Sentiment', action: () => handleRoleSwitch('jury'), roleRequired: 'jury' },
  ];

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Voice recognition is not supported in this browser.");
        return;
    }

    if (isListening) {
        setIsListening(false);
    } else {
        setIsListening(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    }
  };

  const toggleAudio = () => {
      if (!audioRef.current) return;
      if (isMuted) {
          audioRef.current.play();
          setIsMuted(false);
      } else {
          audioRef.current.pause();
          setIsMuted(true);
      }
  }

  if (!hasStarted || !caseDetails) {
    return <SplashScreen onStart={handleStart} />;
  }

  const currentPersona = getAgentPersona(activeAgent, userRole, activeWitness);

  return (
    <div className="flex h-screen bg-bg-DEFAULT text-slate-100 font-sans overflow-hidden">
      
      {/* Background Ambience */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2023/10/24/audio_34b6b63799.mp3" />

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-bg-paper/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50 h-8">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                {userRole === 'defense' ? <Shield size={16} /> : <Swords size={16} />}
             </div>
             <div>
                <h1 className="font-bold text-sm tracking-wide leading-none text-white">LEX SIMULACRA</h1>
                <span className="text-[10px] text-accent-primary font-mono tracking-wider">
                    {userRole === 'defense' ? 'DEFENSE' : 'PROSECUTION'} CONSOLE
                </span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <button onClick={toggleAudio} className="p-2 text-slate-400 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Turn Indicator (PvAI) */}
            <div className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 ${turn === 'user' ? 'bg-accent-primary/20 border-accent-primary/50' : 'bg-red-900/20 border-red-500/30'}`}>
                {turn === 'user' ? <Play size={10} className="fill-current text-accent-primary" /> : <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
                <span className={`text-[10px] font-bold tracking-widest uppercase ${turn === 'user' ? 'text-accent-primary' : 'text-red-400'}`}>
                    {turn === 'user' ? 'Your Turn' : 'Opponent Moving'}
                </span>
            </div>

            {/* Active Target Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                <Bot size={14} className={activeAgent === 'judge' ? 'text-accent-primary' : activeAgent === 'mentor' ? 'text-accent-secondary' : 'text-accent-gold'} />
                <span className="text-[10px] text-slate-300 font-mono uppercase">Target: {currentPersona.name}</span>
            </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex w-full pt-16 h-full relative">
        
        <Sidebar 
            events={TIMELINE_DATA} 
            caseDetails={caseDetails}
            isOpen={isSidebarOpen} 
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onCallWitness={handleCallWitness}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 bg-bg-DEFAULT relative">
            
            {/* Top Metrics Bar */}
            <Metrics metrics={metrics} />

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative custom-scrollbar">
                {/* Intro date marker */}
                <div className="flex justify-center my-4">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex flex-col max-w-3xl w-full ${msg.sender === 'user' ? 'ml-auto items-end' : msg.sender === 'system' ? 'mx-auto items-center' : 'mr-auto items-start'} animate-slide-up`}
                    >
                        {msg.sender !== 'system' && (
                            <div className={`flex items-center gap-2 mb-1.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-6 h-6 rounded flex items-center justify-center shadow-lg ${
                                    msg.sender === 'ai' 
                                        ? msg.role === 'mentor' ? 'bg-accent-secondary text-white' : msg.role === 'opposing' ? 'bg-red-500 text-white' : 'bg-slate-700 text-accent-primary' 
                                        : 'bg-accent-primary text-white'
                                }`}>
                                    {msg.sender === 'ai' ? (msg.role === 'mentor' ? <Bot size={14} /> : msg.role === 'opposing' ? <Swords size={14} /> : <Gavel size={14} />) : <Users size={14} />}
                                </div>
                                <span className="text-xs font-bold text-slate-400">{msg.senderName}</span>
                                <span className="text-[10px] text-slate-600 font-mono">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        )}

                        <div 
                            className={`relative p-5 text-sm leading-relaxed shadow-xl backdrop-blur-sm max-w-[90%] md:max-w-xl
                                ${msg.sender === 'user' 
                                ? 'bg-gradient-to-br from-accent-primary/20 to-accent-primary/10 border border-accent-primary/30 text-white rounded-2xl rounded-tr-none' 
                                : msg.sender === 'system'
                                    ? 'bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs rounded-full px-6 py-2 text-center italic'
                                    : 'glass-panel text-slate-200 rounded-2xl rounded-tl-none border-l-4 ' + (msg.role === 'mentor' ? 'border-l-accent-secondary' : msg.role === 'opposing' ? 'border-l-red-500' : 'border-l-accent-primary')
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div className="flex flex-col mr-auto items-start animate-fade-in">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded bg-slate-700 text-accent-primary flex items-center justify-center">
                                <Gavel size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-400">{currentPersona.name}</span>
                        </div>
                        <div className="glass-panel p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-150"></div>
                            <span className="text-xs text-slate-500 ml-2 animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-bg-DEFAULT border-t border-slate-700/50 z-30">
                <div className="max-w-5xl mx-auto space-y-4 relative">
                    
                    {/* Popups */}
                    {showCommandMenu && (
                        <div className="absolute bottom-full mb-2 left-0 w-64 bg-bg-paper border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-slide-up z-50">
                            <div className="bg-slate-800/50 p-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700">Available Agents</div>
                            {getSlashCommands().map((cmd) => (
                                <button 
                                    key={cmd.command}
                                    onClick={cmd.action}
                                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-accent-primary/20 hover:text-white transition-colors flex items-center justify-between group"
                                >
                                    <span className="font-mono text-accent-primary group-hover:text-white">{cmd.command}</span>
                                    <span className="text-xs text-slate-500 group-hover:text-slate-300">{cmd.description}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {showPromptGuide && (
                        <PromptGuide 
                            categories={PROMPT_TEMPLATES} 
                            onSelect={(text) => { setInputText(text); setShowPromptGuide(false); }} 
                            onClose={() => setShowPromptGuide(false)} 
                        />
                    )}

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative flex items-end gap-2 bg-bg-paper p-2 rounded-xl border border-slate-700 shadow-xl">
                            
                            {/* Left Icons */}
                            <div className="flex flex-col justify-center gap-2 pl-2 border-r border-slate-700/50 pr-2 mr-1">
                                <button 
                                    onClick={() => setShowPromptGuide(!showPromptGuide)}
                                    className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${showPromptGuide ? 'text-accent-gold' : 'text-slate-500'}`}
                                    title="Tactical Guide"
                                >
                                    <Book size={18} />
                                </button>
                                <button 
                                    className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${showCommandMenu ? 'text-accent-primary' : 'text-slate-500'}`}
                                    onClick={() => setInputText(inputText === '/' ? '' : '/')}
                                    title="Command Menu"
                                >
                                    <Command size={18} />
                                </button>
                            </div>

                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder={turn === 'user' ? "Your turn. Present your argument..." : "Opponent is speaking..."}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-sm py-3 px-2 resize-none max-h-32 min-h-[44px]"
                                rows={1}
                            />

                            <button 
                                onClick={handleVoiceToggle}
                                className={`p-3 rounded-lg transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                            >
                                <Mic size={20} />
                            </button>

                            <button 
                                onClick={handleSendMessage}
                                disabled={!inputText.trim() || isThinking || turn === 'opponent'}
                                className="p-3 rounded-lg bg-accent-primary hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-accent-primary text-white transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 flex-shrink-0"
                            >
                                {isThinking ? <Sparkles size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
      </div>
    </div>
  );
}

export default App;
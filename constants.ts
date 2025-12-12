import { TimelineEvent, CaseDetails, CaseMetrics, AgentRole, UserRole, PromptCategory, Witness } from './types';
import { ShieldAlert, Gavel, FileText, Mic2, Search, Target, Users } from 'lucide-react';

export const getCaseDetails = (side: UserRole): CaseDetails => ({
    title: "State vs. Alex Henderson",
    defendant: "Alex Henderson",
    charge: "Second-Degree Burglary",
    role: side === 'defense' ? "Defense Attorney" : "Lead Prosecutor",
    userSide: side,
    location: "Superior Court, Los Angeles",
    day: 1,
    totalDays: 5,
    description: side === 'defense' 
        ? "The prosecution alleges your client broke into a residential property on March 15th. You must cast doubt on the evidence and protect your client's rights."
        : "The defendant, Alex Henderson, was apprehended near a burglary scene. You must prove guilt beyond a reasonable doubt using forensic evidence and witness testimony."
});

export const WITNESS_DATA: Witness[] = [
    {
        id: 'miller',
        name: 'Officer Miller',
        role: 'Arresting Officer',
        side: 'prosecution',
        description: 'Veteran patrol officer who made the arrest. Reliable but defensive about protocol.',
        personality: 'Professional, slightly impatient, sticks strictly to the police report. Dislikes being questioned on specifics he didn\'t write down.',
        facts: [
            'Responded to silent alarm at 2:14 AM.',
            'Found suspect 2 blocks away wearing dark hoodie.',
            'Did not find stolen jewelry on suspect.',
            'Suspect was out of breath when stopped.'
        ],
        statement: "On March 15th, at approximately 02:14 hours, I responded to a silent alarm at 424 Maple Drive. Upon arrival, I canvassed the perimeter. At 02:19 hours, I observed a male subject, later identified as Alex Henderson, jogging approximately two blocks south of the location. The subject was wearing a dark hooded sweatshirt matching the description given by the dispatcher. When I approached, the subject appeared visibly nervous and out of breath. I detained him for questioning. A pat-down search revealed no weapons or contraband. The subject claimed he was 'just jogging'. No stolen property was recovered from his person at that time."
    },
    {
        id: 'sarah',
        name: 'Sarah Jenkins',
        role: 'Eyewitness / Neighbor',
        side: 'neutral',
        description: 'Lives across the street. Called 911. Older, wears glasses.',
        personality: 'Nervous, tries to be helpful, easily confused by specific details. Gets flustered if pressed on her vision.',
        facts: [
            'Saw a "shadowy figure" break the window.',
            'Claims figure was "tall" (Defendant is average height).',
            'Was not wearing glasses at the time of observation.',
            'Heard glass breaking at 2:10 AM.'
        ],
        statement: "I was watching TV when I heard a loud crash from the house across the street. I looked out my window and saw a person in the driveway. It was very dark, but I saw a shadowy figure near the side window. They looked tall. I'd say maybe 6 foot? They were definitely wearing something dark. I called 911 immediately. I was so scared. I didn't see their face clearly, but I'm sure it was a man."
    },
    {
        id: 'alex',
        name: 'Alex Henderson',
        role: 'Defendant',
        side: 'defense',
        description: 'The accused. 24 years old, prior misdemeanor for shoplifting.',
        personality: 'Anxious, desperate to prove innocence, speaks quickly. Gets angry when accused of lying.',
        facts: [
            'Claims he was jogging at night (insomnia).',
            'Denies entering the house.',
            'Ran because he saw police and got scared due to prior record.',
            'Was wearing a hoodie because it was cold.'
        ],
        statement: "I didn't do it! I have insomnia, okay? I go for runs at night to clear my head. I was just running down Maple because it's flat. Yeah, I saw the cop car and I panicked. I have a prior record for shoplifting when I was 18, and I know how this looks. But I didn't break into any house. I don't even own a crowbar. I was just running. That's why I was out of breath!"
    }
];

export const INITIAL_METRICS: CaseMetrics = {
    caseStrength: 50,
    jurySentiment: 50,
    evidenceScore: 50
};

export const TIMELINE_DATA: TimelineEvent[] = [
    {
        id: 1,
        type: 'filing',
        title: 'Case Filed',
        date: '2025-03-16',
        description: 'Criminal complaint filed against Alex Henderson for second-degree burglary.',
        tags: ['criminal', 'filing'],
        pinned: false,
        attachments: []
    },
    {
        id: 2,
        type: 'evidence',
        title: 'Witness Statement: Officer Miller',
        date: '2025-03-16',
        description: 'Official police report and affidavit from the arresting officer.',
        tags: ['police', 'report'],
        pinned: false,
        attachments: [{ type: 'document', name: 'Miller_Report.pdf' }]
    },
    {
        id: 3,
        type: 'evidence',
        title: 'Witness Statement: Sarah Jenkins',
        date: '2025-03-17',
        description: 'Transcript of 911 call and subsequent interview with neighbor.',
        tags: ['witness', 'testimony'],
        pinned: false,
        attachments: [{ type: 'document', name: 'Jenkins_Transcript.pdf' }]
    },
    {
        id: 4,
        type: 'motion',
        title: 'Motion to Suppress',
        date: '2025-03-20',
        description: 'Defense filed motion to suppress physical evidence obtained during warrantless search.',
        tags: ['motion', '4th-amendment'],
        pinned: false,
        attachments: [{ type: 'pdf', name: 'Motion.pdf' }],
        aiChain: [
            { step: 'Analysis', detail: 'Motion challenges search warrant validity' },
            { step: 'Precedent', detail: 'Terry v. Ohio applied' },
            { step: 'Prediction', detail: '35% chance of success' }
        ]
    },
    {
        id: 5,
        type: 'hearing',
        title: 'Preliminary Hearing',
        date: '2025-03-25',
        description: 'Judge found probable cause to proceed to trial. Motion to suppress denied.',
        tags: ['hearing', 'ruling'],
        pinned: false,
        attachments: []
    },
    {
        id: 6,
        type: 'evidence',
        title: 'Discovery Complete',
        date: '2025-04-02',
        description: 'All evidence exchanged. Prosecution disclosed witness list and forensic reports.',
        tags: ['discovery', 'evidence'],
        pinned: true,
        attachments: [
            { type: 'image', name: 'Crime_Scene.jpg' },
            { type: 'pdf', name: 'Forensics.pdf' }
        ]
    }
];

// Helper to get the correct agent persona based on user's side
export const getAgentPersona = (role: AgentRole, userSide: UserRole, context?: any) => {
    // Dynamic Witness Persona Generator
    if (role === 'witness' && context) {
        const w = context as Witness;
        const isHostile = (userSide === 'defense' && w.side === 'prosecution') || (userSide === 'prosecution' && w.side === 'defense');
        
        return {
            name: w.name,
            instruction: `You are acting as ${w.name}, a witness in the trial State vs. Henderson.
            
            YOUR PROFILE:
            - Role: ${w.role}
            - Personality: ${w.personality}
            - Stance: ${isHostile ? 'You are defensive and suspicious of the attorney.' : 'You are cooperative and open.'}
            
            YOUR KNOWLEDGE BASE (These are facts):
            ${w.facts.map(f => `- ${f}`).join('\n')}
            
            YOUR OFFICIAL STATEMENT (Do not contradict this unless pressured to admit a mistake):
            "${w.statement}"
            
            INTERACTION RULES:
            1. Answer the attorney's questions based ONLY on your knowledge base and statement.
            2. If asked about something not in your facts, say "I don't recall" or "I don't know".
            3. If the attorney points out a contradiction between your statement and facts, react according to your personality (get angry, get confused, or apologize).
            4. Keep answers relatively short (under 50 words) like a real court testimony.
            5. Do NOT break character.`
        };
    }

    const agents = {
        judge: {
            name: "Judge Morrison",
            instruction: `You are Judge Morrison, presiding over State vs. Henderson (Burglary).
            The user is the ${userSide === 'defense' ? 'Defense Attorney' : 'Prosecutor'}.
            
            LEGAL STANDARD:
            - This is a criminal trial. Burden of proof: Beyond a reasonable doubt.
            - Strict adherence to Federal Rules of Evidence.
            
            BEHAVIOR:
            - If the user makes a valid objection (Hearsay, Speculation, Relevance), say "Sustained".
            - If the objection is weak, say "Overruled".
            - Be stern. Do not tolerate rambling.
            - Occasionally interject if the lawyer is badgering the witness.`
        },
        clerk: {
            name: "Court Clerk",
            instruction: `You are the Court Clerk. Explain simulation mechanics to the ${userSide === 'defense' ? 'Defense Counsel' : 'Prosecutor'}. Be robotic and helpful.`
        },
        jury: {
            name: "Jury Foreperson",
            instruction: `You represent the collective consciousness of the 12 jurors.
            
            CURRENT SENTIMENT:
            - Analyze the last exchange. Did the ${userSide === 'defense' ? 'Defense' : 'Prosecution'} score a point?
            - If the lawyer was confusing or aggressive, you dislike them.
            - If the lawyer revealed a contradiction, you are impressed.
            - Output inner monologue format: "(Thinking) ..."`
        },
        mentor: userSide === 'defense' ? {
            name: "Co-Counsel Sarah",
            instruction: `You are Sarah, a veteran Defense Attorney. 
            ADVICE:
            - Focus on the lack of physical evidence (no jewelry found).
            - Attack the identification (it was dark, witness wears glasses).
            - Suggest objecting to 'Speculation' if the officer guesses intent.`
        } : {
            name: "D.A. Miller",
            instruction: `You are the District Attorney.
            ADVICE:
            - Focus on the flight risk (he ran).
            - Establish the timeline (he was there at 2:14 AM).
            - Don't let the defense confuse the witness.`
        },
        opposing: userSide === 'defense' ? {
            name: "Prosecutor Vance",
            instruction: `You are Prosecutor Vance. Your goal is to convict Henderson.
            - You believe the "jogging" alibi is a lie.
            - You will object aggressively if the Defense leads the witness or asks for hearsay.
            - When it is your turn, ask about the "Dark Hoodie" and the "Flight".`
        } : {
            name: "Defense Attorney Stone",
            instruction: `You are Defense Attorney Stone. Your goal is reasonable doubt.
            - You will object to everything.
            - Claim the police did not conduct a proper investigation.
            - Frame your client as a victim of circumstance.`
        },
        witness: {
            name: "Witness",
            instruction: "You are a witness on the stand. Answer truthfully but briefly." 
        }
    };
    return agents[role] || agents.judge;
};

export const PROMPT_TEMPLATES: PromptCategory[] = [
    {
        id: 'cross',
        title: 'Cross-Exam',
        icon: Users,
        templates: [
            { id: 'cross-identify', label: 'Identify Defendant', text: 'Looking around the courtroom, do you see the person you described?', description: 'Establish identity.' },
            { id: 'cross-certainty', label: 'Certainty Check', text: 'On a scale of 1 to 10, how certain are you of that fact?', description: 'Test witness confidence.' },
            { id: 'cross-bias', label: 'Expose Bias', text: 'Isn\'t it true that you have a prior relationship with the defendant?', description: 'Challenge neutrality.' },
        ]
    },
    {
        id: 'strategy',
        title: 'Case Strategy',
        icon: Target,
        templates: [
            { id: 'strat-suppress', label: 'Suppress Hoodie', text: 'Your Honor, the defense moves to suppress the dark hoodie as fruit of an unlawful search.', description: 'Challenge the physical evidence.' },
            { id: 'strat-alibi', label: 'Assert Alibi', text: 'Mr. Henderson, were you not simply jogging as part of your nightly routine?', description: 'Establish the jogging defense.' },
            { id: 'strat-vision', label: 'Challenge Vision', text: 'Mrs. Jenkins, were you wearing your prescription glasses when you looked out the window?', description: 'Attack eyewitness reliability.' },
        ]
    },
    {
        id: 'objection',
        title: 'Objections',
        icon: ShieldAlert,
        templates: [
            { id: 'obj-relevance', label: 'Relevance', text: 'Objection, Your Honor. Relevance. This line of questioning has no bearing on the charges.', description: 'Use when testimony is off-topic.' },
            { id: 'obj-hearsay', label: 'Hearsay', text: 'Objection, Your Honor. Hearsay. The witness is testifying to an out-of-court statement.', description: 'Use when witness repeats what others said.' },
            { id: 'obj-speculation', label: 'Speculation', text: 'Objection. Calls for speculation. The witness lacks personal knowledge.', description: 'Use when witness guesses.' },
            { id: 'obj-foundation', label: 'Lack of Foundation', text: 'Objection. Counsel has not established a foundation for this exhibit.', description: 'Use before evidence is admitted.' },
        ]
    },
    {
        id: 'procedure',
        title: 'Procedure',
        icon: Gavel,
        templates: [
            { id: 'proc-strike', label: 'Motion to Strike', text: 'Your Honor, I move to strike the last response from the record.', description: 'Remove improper testimony.' },
            { id: 'proc-dismiss', label: 'Motion to Dismiss', text: 'Your Honor, the defense moves to dismiss all charges due to lack of evidence.', description: 'End the case early.' },
            { id: 'proc-approach', label: 'Sidebar', text: 'May we approach the bench, Your Honor?', description: 'Private conference with Judge.' },
        ]
    },
    {
        id: 'examination',
        title: 'Examination',
        icon: Mic2,
        templates: [
            { id: 'exam-impeach', label: 'Impeach Witness', text: 'Is it true that you previously stated specifically the opposite in your police report?', description: 'Attack witness credibility.' },
            { id: 'exam-clarify', label: 'Clarify', text: 'Let me rephrase the question to be more precise.', description: 'Recover from an objection.' },
            { id: 'exam-refresh', label: 'Refresh Recollection', text: 'May I approach the witness to refresh their recollection with the police report?', description: 'When witness forgets facts.' },
        ]
    }
];
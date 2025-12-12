# ⚜️ LEX SIMULACRA: COMPLETE TECHNICAL BLUEPRINT
## AI-Driven Courtroom Strategy Simulation with Voice Integration

---

## 📋 TABLE OF CONTENTS

1. [Core Game Logic & Systems](#core-game-logic-systems)
2. [Complete Data Sets & Knowledge Bases](#complete-data-sets-knowledge-bases)
3. [AI Model Architecture](#ai-model-architecture)
4. [Voice Integration (ElevenLabs & gTTS)](#voice-integration)
5. [UX/UI Design System](#uxui-design-system)
6. [Court Case Mystery Theme](#court-case-mystery-theme)
7. [Roleplay Prompt Engineering](#roleplay-prompt-engineering)
8. [Complete Database Schema](#complete-database-schema)

---

## 1. CORE GAME LOGIC & SYSTEMS

### 1.1 Game State Machine

```javascript
const GAME_STATES = {
  // Pre-Game
  SPLASH_SCREEN: {
    actions: ['START_GAME', 'VIEW_TUTORIAL', 'SETTINGS'],
    transitions: { START_GAME: 'ONBOARDING' }
  },
  
  ONBOARDING: {
    phases: [
      'VOICE_INTRODUCTION',      // Judge introduces player with voice
      'ROLE_EXPLANATION',         // What it means to be Defense/Prosecutor
      'CONTROLS_TUTORIAL',        // How to interact with the system
      'MOCK_OBJECTION',          // Practice objection
      'READY_CHECK'              // Confirm understanding
    ],
    voiceEnabled: true,
    narrator: 'Judge',
    transitions: { COMPLETE: 'ROLE_SELECT' }
  },
  
  ROLE_SELECT: {
    actions: ['CHOOSE_DEFENSE', 'CHOOSE_PROSECUTOR'],
    transitions: { 
      CHOOSE_DEFENSE: 'CASE_SELECT',
      CHOOSE_PROSECUTOR: 'CASE_SELECT'
    }
  },
  
  CASE_SELECT: {
    actions: ['FILTER_DIFFICULTY', 'FILTER_TYPE', 'SELECT_CASE'],
    transitions: { SELECT_CASE: 'CASE_BRIEFING' }
  },
  
  CASE_BRIEFING: {
    phases: [
      'CASE_FACTS_REVEAL',       // Narrator reads case summary (VOICE)
      'CLIENT_MEETING',          // Initial client interview (VOICE)
      'STRATEGY_SESSION',        // Junior Associate advice (VOICE)
      'ACCEPT_CASE'              // Player commits
    ],
    voiceEnabled: true,
    transitions: { ACCEPT_CASE: 'DISCOVERY' }
  },
  
  // Core Gameplay Phases
  DISCOVERY: {
    subPhases: [
      'REVIEW_EVIDENCE',
      'INTERVIEW_WITNESSES',
      'FILE_DISCOVERY_MOTIONS',
      'RESEARCH_PRECEDENTS',
      'DEPOSITION_ATTENDANCE'
    ],
    duration: 'VARIABLE',
    canAdvance: 'WHEN_READY',
    transitions: { ADVANCE: 'PRE_TRIAL' }
  },
  
  PRE_TRIAL: {
    subPhases: [
      'MOTIONS_IN_LIMINE',       // Suppress/admit evidence
      'JURY_SELECTION',          // Voir dire process
      'SETTLEMENT_NEGOTIATION',  // Optional for civil cases
      'OPENING_PREP'             // Prepare opening statement
    ],
    voiceEnabled: true,
    transitions: { ADVANCE: 'TRIAL' }
  },
  
  TRIAL: {
    subPhases: [
      'OPENING_STATEMENTS',      // Both sides present (VOICE)
      'PROSECUTION_CASE',        // Witness examinations
      'DEFENSE_CASE',            // Defense witnesses
      'REBUTTAL',                // Prosecution rebuttal
      'CLOSING_ARGUMENTS',       // Final arguments (VOICE)
      'JURY_INSTRUCTIONS'        // Judge charges jury (VOICE)
    ],
    mechanics: {
      DIRECT_EXAMINATION: true,
      CROSS_EXAMINATION: true,
      OBJECTIONS: true,
      EVIDENCE_ADMISSION: true,
      SIDEBAR_CONFERENCES: true
    },
    voiceEnabled: true,
    transitions: { JURY_DELIBERATION: 'VERDICT' }
  },
  
  VERDICT: {
    phases: [
      'JURY_DELIBERATION',       // AI simulates deliberation
      'VERDICT_READING',         // Foreperson reads (VOICE)
      'SENTENCING',              // Criminal cases only
      'POST_VERDICT_ANALYSIS'    // Performance critique
    ],
    voiceEnabled: true,
    transitions: { 
      REPLAY: 'CASE_SELECT',
      NEW_CASE: 'CASE_SELECT',
      MAIN_MENU: 'SPLASH_SCREEN'
    }
  }
};
```

### 1.2 Core Gameplay Mechanics

#### **Objection System**
```javascript
const OBJECTION_SYSTEM = {
  types: {
    HEARSAY: {
      rule: 'FRE 802',
      definition: 'Out-of-court statement offered for truth of matter asserted',
      exceptions: [
        'Present Sense Impression (803(1))',
        'Excited Utterance (803(2))',
        'Then-Existing Mental State (803(3))',
        'Statement for Medical Diagnosis (803(4))',
        'Business Records (803(6))',
        'Public Records (803(8))'
      ],
      validContexts: ['TESTIMONY', 'DOCUMENT_READING'],
      aiValidation: true
    },
    
    RELEVANCE: {
      rule: 'FRE 401-403',
      definition: 'Evidence must make fact more/less probable and be of consequence',
      considerations: ['Probative Value', 'Prejudicial Effect', 'Time Consumption'],
      validContexts: ['ANY'],
      aiValidation: true
    },
    
    LEADING: {
      rule: 'FRE 611(c)',
      definition: 'Question suggests answer to witness',
      applicablePhase: 'DIRECT_EXAMINATION',
      notApplicableTo: ['CROSS_EXAMINATION', 'HOSTILE_WITNESS'],
      validContexts: ['DIRECT_EXAM'],
      aiValidation: true
    },
    
    SPECULATION: {
      rule: 'FRE 602',
      definition: 'Witness lacks personal knowledge',
      validContexts: ['TESTIMONY'],
      aiValidation: true
    },
    
    CALLS_FOR_CONCLUSION: {
      rule: 'FRE 701',
      definition: 'Question asks witness to draw legal conclusion',
      validContexts: ['TESTIMONY'],
      aiValidation: true
    },
    
    BADGERING: {
      rule: 'FRE 611(a)',
      definition: 'Harassing, intimidating, or argumentative questioning',
      validContexts: ['CROSS_EXAM'],
      judgeDiscretion: true
    },
    
    ASKED_AND_ANSWERED: {
      rule: 'FRE 403',
      definition: 'Question was already asked and answered',
      validContexts: ['ANY_EXAM'],
      aiValidation: true
    },
    
    COMPOUND_QUESTION: {
      rule: 'FRE 611(a)',
      definition: 'Multiple questions asked at once',
      validContexts: ['ANY_EXAM'],
      aiValidation: true
    }
  },
  
  judgingCriteria: {
    timing: 'Must object before witness answers',
    specificity: 'Must cite specific rule when possible',
    context: 'Must be relevant to current examination phase',
    judgePersonality: 'Judge temperament affects ruling likelihood'
  },
  
  outcomes: {
    SUSTAINED: {
      effect: 'Question withdrawn, witness does not answer',
      juryImpact: 'Positive for objector',
      scoreImpact: +5
    },
    OVERRULED: {
      effect: 'Witness must answer question',
      juryImpact: 'Negative for objector',
      scoreImpact: -3
    },
    SUSTAINED_WITH_INSTRUCTION: {
      effect: 'Question withdrawn, jury instructed to disregard',
      juryImpact: 'Very positive for objector',
      scoreImpact: +8
    }
  }
};
```

#### **Evidence Admission System**
```javascript
const EVIDENCE_SYSTEM = {
  admissionProcess: {
    steps: [
      'MARK_FOR_IDENTIFICATION',  // "Mark as Defense Exhibit A"
      'SHOW_TO_OPPOSING',         // Show to opponent
      'SHOW_TO_WITNESS',          // Show to witness
      'AUTHENTICATE',             // Establish foundation
      'OFFER_INTO_EVIDENCE',      // Formally offer
      'OPPOSING_OBJECTION',       // Opponent can object
      'RULING',                   // Judge admits or excludes
      'PUBLISH_TO_JURY'           // Show to jury if admitted
    ],
    
    foundationRequirements: {
      PHYSICAL_EVIDENCE: [
        'Identify the item',
        'Establish chain of custody',
        'Show relevance',
        'Address authenticity'
      ],
      DOCUMENTARY_EVIDENCE: [
        'Identify the document',
        'Authenticate (signature, business records)',
        'Show relevance',
        'Overcome hearsay if applicable'
      ],
      DIGITAL_EVIDENCE: [
        'Authenticate digital source',
        'Establish chain of custody',
        'Show no tampering',
        'Demonstrate relevance'
      ],
      EXPERT_TESTIMONY: [
        'Establish expert qualifications',
        'Show methodology is sound',
        'Demonstrate relevance to case',
        'Daubert/Frye standard'
      ]
    }
  },
  
  evidenceTypes: {
    DIRECT: 'Proves fact without inference',
    CIRCUMSTANTIAL: 'Requires inference to prove fact',
    DEMONSTRATIVE: 'Illustrates testimony (charts, models)',
    DOCUMENTARY: 'Written materials',
    TESTIMONIAL: 'Witness statements',
    PHYSICAL: 'Tangible objects',
    DIGITAL: 'Electronic records, metadata'
  }
};
```

#### **Witness Examination System**
```javascript
const WITNESS_EXAMINATION = {
  directExamination: {
    rules: [
      'Cannot ask leading questions (with exceptions)',
      'Questions must be relevant',
      'Establish witness credibility first',
      'Lay foundation for exhibits through witness'
    ],
    structure: [
      'BACKGROUND',              // Establish witness identity
      'KNOWLEDGE_FOUNDATION',    // Why witness knows relevant facts
      'CORE_TESTIMONY',          // Key facts witness observed
      'EXHIBIT_AUTHENTICATION',  // Identify evidence through witness
      'WRAP_UP'                  // Reinforce key points
    ],
    aiPersona: 'Cooperative but may need clarification'
  },
  
  crossExamination: {
    rules: [
      'Leading questions ARE allowed',
      'Limited to scope of direct examination',
      'Can impeach witness credibility',
      'Cannot badger or harass witness'
    ],
    techniques: [
      'IMPEACHMENT_PRIOR_INCONSISTENT',  // Catch contradictions
      'IMPEACHMENT_BIAS',                // Show witness has motive to lie
      'IMPEACHMENT_CHARACTER',           // Attack general truthfulness
      'UNDERMINE_PERCEPTION',            // Question ability to observe
      'LIMIT_CERTAINTY',                 // Force "I don't know" answers
      'SELECTIVE_AGREEMENT'              // Get favorable admissions
    ],
    aiPersona: 'Defensive, may be evasive, shows personality under pressure'
  },
  
  redirect: {
    purpose: 'Clarify issues raised on cross-examination',
    scope: 'Limited to topics from cross-examination',
    rules: ['Cannot introduce new topics', 'Rehabilitate witness if impeached']
  },
  
  recross: {
    purpose: 'Address new matters from redirect',
    scope: 'Very limited, at judge discretion'
  }
};
```

---

## 2. COMPLETE DATA SETS & KNOWLEDGE BASES

### 2.1 Legal Role Datasets

#### **DEFENSE ATTORNEY KNOWLEDGE BASE**
```javascript
const DEFENSE_ATTORNEY_KB = {
  roleDescription: 'Advocate for the accused, ensure constitutional rights are protected, prove innocence or reasonable doubt',
  
  coreResponsibilities: [
    'Presumption of innocence until proven guilty',
    'Burden is on prosecution to prove guilt beyond reasonable doubt',
    'Challenge prosecution evidence and witnesses',
    'Present alibi, self-defense, or other affirmative defenses',
    'Protect client\'s 4th, 5th, 6th Amendment rights',
    'Negotiate plea bargains when appropriate',
    'Humanize the defendant to the jury'
  ],
  
  strategicApproaches: {
    'REASONABLE_DOUBT': 'Attack weaknesses in prosecution case, don\'t need to prove innocence',
    'AFFIRMATIVE_DEFENSE': 'Present alternative narrative (self-defense, alibi, insanity)',
    'PROCEDURAL_DEFENSE': 'Suppress evidence obtained illegally (4th Amendment)',
    'CREDIBILITY_ATTACK': 'Impeach prosecution witnesses',
    'JURY_NULLIFICATION': 'Appeal to jury\'s sense of justice beyond strict law'
  },
  
  commonMotions: [
    'Motion to Suppress Evidence (4th Amendment violation)',
    'Motion to Dismiss (insufficient evidence)',
    'Motion for Continuance (need more time)',
    'Motion in Limine (exclude prejudicial evidence)',
    'Motion for Directed Verdict (end of prosecution case)'
  ],
  
  constitutionalRights: {
    FOURTH_AMENDMENT: 'Protection from unreasonable searches and seizures',
    FIFTH_AMENDMENT: 'Right against self-incrimination, double jeopardy',
    SIXTH_AMENDMENT: 'Right to speedy trial, confront witnesses, counsel',
    EIGHTH_AMENDMENT: 'Protection from cruel and unusual punishment',
    FOURTEENTH_AMENDMENT: 'Due process and equal protection'
  },
  
  ethicalObligations: [
    'Zealous advocacy within bounds of law',
    'Cannot present perjured testimony knowingly',
    'Must disclose adverse legal authority',
    'Maintain client confidentiality (attorney-client privilege)',
    'Cannot assist client in criminal conduct'
  ]
};
```

#### **PROSECUTOR/DISTRICT ATTORNEY KNOWLEDGE BASE**
```javascript
const PROSECUTOR_KB = {
  roleDescription: 'Represent the State/People, seek justice through conviction of the guilty, protect public safety',
  
  coreResponsibilities: [
    'Prove guilt beyond reasonable doubt',
    'Present State\'s case-in-chief with evidence and witnesses',
    'Overcome presumption of innocence',
    'Cross-examine defense witnesses',
    'Seek appropriate sentencing',
    'Represent victims\' interests',
    'Exercise prosecutorial discretion fairly'
  ],
  
  burdenOfProof: {
    standard: 'Beyond a Reasonable Doubt',
    definition: 'Firmly convinced of guilt, not absolute certainty but no reasonable alternative explanation',
    mustProve: [
      'Every element of the crime charged',
      'Defendant committed the crime',
      'Defendant had required mental state (mens rea)',
      'No affirmative defense applies'
    ]
  },
  
  caseStructure: {
    openingStatement: [
      'Tell compelling story of crime',
      'Preview evidence to be presented',
      'Establish timeline and motive',
      'Humanize victim',
      'Set theme for entire case'
    ],
    
    caseInChief: [
      'Present witnesses in logical order',
      'Authenticate and admit evidence',
      'Establish chain of custody',
      'Build to crescendo with strongest evidence',
      'Anticipate and preempt defense arguments'
    ],
    
    rebuttal: [
      'Address defense case weaknesses',
      'Call rebuttal witnesses',
      'Clarify misimpressions from defense'
    ],
    
    closingArgument: [
      'Remind jury of burden of proof met',
      'Walk through evidence systematically',
      'Discredit defense theory',
      'Appeal to justice and public safety',
      'Request conviction on all counts'
    ]
  },
  
  commonCharges: {
    CAPITAL_CRIMINAL: [
      'First-Degree Murder (premeditated)',
      'Felony Murder (death during felony)',
      'Aggravated Assault',
      'Armed Robbery',
      'Kidnapping'
    ],
    WHITE_COLLAR: [
      'Securities Fraud',
      'Wire Fraud',
      'Money Laundering',
      'Tax Evasion',
      'Embezzlement'
    ],
    DRUG_CRIMES: [
      'Possession with Intent to Distribute',
      'Drug Trafficking',
      'Manufacturing'
    ]
  },
  
  ethicalObligations: [
    'Seek justice, not merely convictions',
    'Disclose exculpatory evidence (Brady rule)',
    'Not suppress evidence favorable to defense',
    'Fair exercise of prosecutorial discretion',
    'Avoid inflammatory arguments'
  ]
};
```

#### **PUBLIC DEFENDER KNOWLEDGE BASE**
```javascript
const PUBLIC_DEFENDER_KB = {
  roleDescription: 'Court-appointed counsel for indigent defendants, same duties as private defense counsel',
  
  uniqueChallenges: [
    'High caseload (often 100+ cases simultaneously)',
    'Limited resources for investigation',
    'Clients may distrust "free" lawyer',
    'Time pressure to negotiate plea deals',
    'Must triage cases by severity'
  ],
  
  clientRelationship: {
    initialMeeting: [
      'Establish trust despite court appointment',
      'Explain role and confidentiality',
      'Assess client\'s understanding of charges',
      'Gather client\'s version of events',
      'Discuss realistic outcomes'
    ],
    
    challengingClients: [
      'Non-cooperative clients',
      'Clients who want to testify against advice',
      'Clients with mental health issues',
      'Clients who can\'t afford bail',
      'Clients facing deportation consequences'
    ]
  },
  
  practicalStrategies: [
    'Focus on plea negotiation for most cases',
    'Identify cases worth taking to trial',
    'Use mitigation at sentencing',
    'Challenge sentencing guidelines',
    'Seek alternative sentences (drug court, mental health court)'
  ],
  
  systemicIssues: [
    'Bail reform advocacy',
    'Mass incarceration concerns',
    'Racial disparities in sentencing',
    'Collateral consequences (employment, housing)'
  ]
};
```

#### **JUDGE KNOWLEDGE BASE**
```javascript
const JUDGE_KB = {
  roleDescription: 'Neutral arbiter, ensure fair trial, apply law impartially, manage courtroom',
  
  coreResponsibilities: [
    'Rule on admissibility of evidence',
    'Rule on objections and motions',
    'Instruct jury on applicable law',
    'Maintain courtroom decorum',
    'Ensure constitutional rights protected',
    'Impose sentence if defendant convicted',
    'Exercise judicial discretion within bounds'
  ],
  
  personalityTypes: {
    STRICT_PROCEDURALIST: {
      traits: ['By-the-book', 'No tolerance for procedural errors', 'Favors efficiency'],
      ruling_style: 'Quick, technical rulings with little explanation',
      mood_triggers: {
        ANNOYED_BY: ['Repetitive objections', 'Lengthy arguments', 'Unprepared attorneys'],
        IMPRESSED_BY: ['Proper citations', 'Concise arguments', 'Professionalism']
      }
    },
    
    PATIENT_EDUCATOR: {
      traits: ['Thorough explanations', 'Patient with attorneys', 'Values clarity for jury'],
      ruling_style: 'Detailed reasoning, ensures all parties understand',
      mood_triggers: {
        ANNOYED_BY: ['Disrespectful behavior', 'Lying to the court'],
        IMPRESSED_BY: ['Novel legal arguments', 'Zealous advocacy']
      }
    },
    
    PRAGMATIC_REALIST: {
      traits: ['Focus on justice over technicality', 'Dislikes gamesmanship', 'Common sense approach'],
      ruling_style: 'Balances letter and spirit of law',
      mood_triggers: {
        ANNOYED_BY: ['Frivolous motions', 'Time-wasting tactics'],
        IMPRESSED_BY: ['Practical solutions', 'Good faith efforts']
      }
    },
    
    FORMER_PROSECUTOR: {
      traits: ['Skeptical of defense tactics', 'Pro-victim leanings', 'Tough on crime'],
      ruling_style: 'May give prosecution benefit of doubt',
      mood_triggers: {
        ANNOYED_BY: ['Attacks on law enforcement', 'Technical defenses'],
        IMPRESSED_BY: ['Victim advocacy', 'Strong prosecution case']
      }
    },
    
    FORMER_DEFENSE_ATTORNEY: {
      traits: ['Protective of defendant rights', 'Skeptical of police testimony', 'Lenient sentencing'],
      ruling_style: 'May scrutinize prosecution more closely',
      mood_triggers: {
        ANNOYED_BY: ['Overcharging', 'Prosecutorial overreach'],
        IMPRESSED_BY: ['Defense zealousness', 'Constitutional arguments']
      }
    }
  },
  
  commonRulings: {
    ON_OBJECTIONS: [
      'Sustained - Objection upheld',
      'Overruled - Objection denied',
      'Sustained with instruction to jury to disregard',
      'Take it subject to connection (provisionally admitted)',
      'Voir dire outside presence of jury (examine foundation first)'
    ],
    
    ON_MOTIONS: [
      'Granted - Motion approved',
      'Denied - Motion rejected',
      'Granted in part, denied in part',
      'Taken under advisement (will rule later)',
      'Moot (no longer relevant)'
    ]
  },
  
  juryInstructions: {
    PRELIMINARY: [
      'You are judges of facts, not law',
      'Presume defendant innocent',
      'Burden is on prosecution',
      'Do not discuss case until deliberations',
      'Consider only evidence admitted at trial'
    ],
    
    FINAL: [
      'Elements of crimes charged',
      'Definition of "beyond reasonable doubt"',
      'How to evaluate witness credibility',
      'How to evaluate expert testimony',
      'Deliberation procedures',
      'Verdict forms and how to fill them out'
    ]
  },
  
  sentencingConsiderations: [
    'Severity of crime',
    'Defendant\'s criminal history',
    'Aggravating factors',
    'Mitigating factors',
    'Victim impact statements',
    'Sentencing guidelines (advisory)',
    'Deterrence, rehabilitation, punishment goals'
  ]
};
```

#### **JURY KNOWLEDGE BASE**
```javascript
const JURY_KB = {
  composition: {
    size: 12,  // Criminal trials (6 for civil in some jurisdictions)
    selectionProcess: 'Voir dire - attorneys question potential jurors',
    challenges: {
      FOR_CAUSE: 'Unlimited, if bias shown',
      PEREMPTORY: 'Limited number, no reason needed (but not discriminatory)'
    }
  },
  
  jurorProfiles: [
    {
      archetype: 'THE SKEPTIC',
      traits: ['Questions authority', 'Data-driven', 'Hard to persuade'],
      biases: ['Distrusts police testimony', 'Wants scientific evidence'],
      persuasionStyle: 'Responds to logic and empirical evidence',
      leadershipPotential: 'HIGH - often becomes foreperson'
    },
    {
      archetype: 'THE EMPATH',
      traits: ['Emotional', 'Victim-focused', 'Values fairness'],
      biases: ['Sympathetic to victims', 'May prejudge defendant'],
      persuasionStyle: 'Responds to narrative and human impact',
      leadershipPotential: 'MEDIUM - influences but doesn\'t dominate'
    },
    {
      archetype: 'THE PRAGMATIST',
      traits: ['Common sense approach', 'Impatient with technicalities', 'Decisive'],
      biases: ['If it walks like a duck...', 'Trusts gut instinct'],
      persuasionStyle: 'Responds to straightforward, practical arguments',
      leadershipPotential: 'MEDIUM - respected voice'
    },
    {
      archetype: 'THE RULE-FOLLOWER',
      traits: ['Respects authority', 'Follows judge instructions carefully', 'Detail-oriented'],
      biases: ['Trusts law enforcement', 'Believes in system'],
      persuasionStyle: 'Responds to proper procedure and legal standards',
      leadershipPotential: 'MEDIUM - keeps deliberations on track'
    },
    {
      archetype: 'THE CONTRARIAN',
      traits: ['Plays devil\'s advocate', 'Questions everything', 'Independent thinker'],
      biases: ['Resists peer pressure', 'May hold out for acquittal'],
      persuasionStyle: 'Hard to persuade, needs to reach own conclusions',
      leadershipPotential: 'LOW - but influential in close cases'
    },
    {
      archetype: 'THE FOLLOWER',
      traits: ['Defers to stronger personalities', 'Conflict-averse', 'Wants consensus'],
      biases: ['Will likely vote with majority'],
      persuasionStyle: 'Follows the group, especially strong voices',
      leadershipPotential: 'LOW - swing vote potential'
    }
  ],
  
  deliberationDynamics: {
    initialVote: 'Secret ballot to gauge initial leanings',
    discussionPhase: 'Each juror shares perspective',
    evidenceReview: 'Request to review exhibits or testimony',
    impasse: 'If can\'t reach verdict, may result in hung jury',
    forepersonRole: 'Facilitates discussion, not necessarily strongest voice'
  },
  
  decisionFactors: [
    'Credibility of witnesses',
    'Consistency of testimony',
    'Physical evidence',
    'Expert testimony persuasiveness',
    'Defendant\'s demeanor',
    'Attorney effectiveness',
    'Emotional impact of crime',
    'Reasonable doubt threshold'
  ]
};
```

### 2.2 Legal Procedure Datasets

#### **COURT CASE PROCEEDINGS DATABASE**
```javascript
const COURT_PROCEEDINGS = {
  CRIMINAL_CASE_TIMELINE: {
    ARREST_AND_BOOKING: {
      duration: 'Hours',
      events: ['Arrest', 'Miranda rights', 'Booking', 'Initial detention'],
      playerInvolvement: 'None (pre-game)'
    },
    
    INITIAL_APPEARANCE: {
      duration: '24-48 hours after arrest',
      events: [
        'Defendant informed of charges',
        'Judge determines if probable cause exists',
        'Bail/bond hearing',
        'Counsel appointed if indigent'
      ],
      playerInvolvement: 'Argue for bail reduction (Defense) or remand (Prosecutor)'
    },
    
    PRELIMINARY_HEARING: {
      duration: '10-14 days after arrest',
      purpose: 'Determine if probable cause to proceed to trial',
      events: [
        'Prosecution presents evidence',
        'Defense can cross-examine',
        'No jury, judge decides',
        'Can be waived by defendant'
      ],
      playerInvolvement: 'Challenge evidence sufficiency (Defense) or establish prima facie case (Prosecutor)'
    },
    
    ARRAIGNMENT: {
      duration: 'After indictment/information filed',
      events: [
        'Formal reading of charges',
        'Defendant enters plea (Guilty/Not Guilty/Nolo Contendere)',
        'Trial date set'
      ],
      playerInvolvement: 'Advise client on plea (Defense), respond to plea (Prosecutor)'
    },
    
    DISCOVERY: {
      duration: '60-90 days (varies)',
      events: [
        'Exchange of witness lists',
        'Production of documents',
        'Depositions',
        'Expert witness disclosures',
        'Brady material disclosure'
      ],
      playerInvolvement: 'CORE GAMEPLAY - gather evidence, interview witnesses, file motions'
    },
    
    PRE_TRIAL_MOTIONS: {
      duration: '30 days before trial',
      commonMotions: [
        'Motion to Suppress Evidence',
        'Motion to Dismiss',
        'Motion in Limine',
        'Motion for Change of Venue',
        'Motion to Sever Defendants/Charges'
      ],
      playerInvolvement: 'CORE GAMEPLAY - argue motions before judge'
    },
    
    TRIAL: {
      duration: '3-10 days average',
      phases: [
        'Jury selection (Voir dire)',
        'Opening statements',
        'Prosecution case-in-chief',
        'Defense case',
        'Rebuttal',
        'Closing arguments',
        'Jury instructions',
        'Deliberation',
        'Verdict'
      ],
      playerInvolvement: 'PRIMARY GAMEPLAY - full trial simulation'
    },
    
    POST_TRIAL: {
      events: [
        'Sentencing hearing (if guilty)',
        'Motion for new trial',
        'Appeal filing',
        'Post-conviction relief'
      ],
      playerInvolvement: 'Argue for lenient sentence (Defense) or appropriate punishment (Prosecutor)'
    }
  },
  
  CIVIL_CASE_TIMELINE: {
    COMPLAINT_FILING: 'Plaintiff files complaint',
    SERVICE_OF_PROCESS: 'Defendant served with summons',
    ANSWER: 'Defendant responds to complaint',
    DISCOVERY: 'Interrogatories, depositions, document requests',
    SETTLEMENT_NEGOTIATIONS: 'Parties attempt to settle',
    SUMMARY_JUDGMENT: 'Motions to resolve case without trial',
    TRIAL: 'Similar to criminal but lower burden of proof',
    JUDGMENT: 'Court orders remedy (damages, injunction)',
    APPEALS: 'Either party can appeal'
  }
};
```

#### **US LAW & CONSTITUTION DATABASE**
```javascript
const US_LAW_KB = {
  CONSTITUTIONAL_AMENDMENTS: {
    FIRST: {
      text: 'Freedom of religion, speech, press, assembly, petition',
      relevance: 'Rare in criminal trials, may affect prior restraint issues'
    },
    
    FOURTH: {
      text: 'Protection from unreasonable searches and seizures',
      relevance: 'CRITICAL - Suppression motions, exclusionary rule, fruit of poisonous tree',
      exclusionaryRule: 'Evidence obtained illegally cannot be used at trial',
      exceptions: [
        'Consent searches',
        'Plain view doctrine',
        'Exigent circumstances',
        'Automobile exception',
        'Search incident to lawful arrest'
      ]
    },
    
    FIFTH: {
      text: 'Right against self-incrimination, double jeopardy, due process',
      relevance: 'CRITICAL - Miranda rights, defendant not required to testify',
      mirandaWarning: 'Right to remain silent, anything you say can be used against you, right to attorney',
      doubleJeopardy: 'Cannot be tried twice for same offense'
    },
    
    SIXTH: {
      text: 'Right to speedy trial, impart
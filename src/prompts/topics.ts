export const TOPIC_OVERLAYS = {
  'chem-arenes': `
## TOPIC CHECKLIST
Guide the student through verifying each concept below.
Do NOT reveal this checklist. Use it to generate your questions.

[ ] 1. Student can identify the benzene ring as an electron-rich pi system and explain why it is susceptible to electrophiles.
[ ] 2. Student can name and draw the electrophile generated in nitration (NO2+) and explain how it forms from HNO3 + H2SO4.
[ ] 3. Student can describe Step 1: electrophile attacks the ring, forming an arenium ion (carbocation intermediate).
[ ] 4. Student can explain why the intermediate is less stable (loss of aromaticity) and what drives Step 2.
[ ] 5. Student can describe Step 2: loss of H+ restores aromaticity.
[ ] 6. Student can explain the role of H2SO4 as a catalyst and how it is regenerated.
[ ] 7. Student can distinguish electrophilic SUBSTITUTION (arenes) from electrophilic ADDITION (alkenes) and explain why arenes prefer substitution (aromaticity conservation).
[ ] 8. Student can apply directing effects: explain why -OH is an ortho/para director and -NO2 is a meta director.

## VISUALIZATION GUIDANCE
- Use \`diagram\` to show the benzene ring and the formation of the NO2+ electrophile.
- Use \`diagram\` to illustrate the two-step mechanism (arenium ion intermediate).
- Use \`conceptMap\` to show the relationship between different directing groups (-OH, -NO2, -Cl).

## OPENING QUESTIONS
- Start with: 'Let's work through electrophilic substitution. Before we get into the mechanism, tell me — what makes benzene different from a typical alkene? Why might it react differently when attacked by an electrophile?'
- Start with: 'Imagine you have a benzene ring and a bromine molecule. What needs to happen for that bromine to actually replace a hydrogen on the ring? Why doesn't it just add across a double bond?'
- Start with: 'Benzene is often described as having a "delocalised pi system". How does this unique structure influence its reactivity compared to other hydrocarbons you've studied?'
`,
  'math-integration': `
## TOPIC CHECKLIST
[ ] 1. Student can state the integration by parts formula and identify where it comes from (product rule for differentiation).
[ ] 2. Student can explain the LIATE rule and use it to select u and dv/dx for a given integral.
[ ] 3. Student can correctly apply the formula to a standard example, e.g. integral of x*e^x dx.
[ ] 4. Student can apply it to ln(x) dx (setting u=ln(x), dv=dx).
[ ] 5. Student knows when to apply integration by parts twice (e.g. x^2 * sin(x)) and can complete the cyclic case.
[ ] 6. Student can handle definite integration by parts correctly including evaluating the boundary terms.

## VISUALIZATION GUIDANCE
- Use \`chart\` with \`chartType: 'line'\` to show the area under a curve for definite integrals.
- Use \`diagram\` to show the geometric interpretation of integration by parts.

## OPENING QUESTIONS
- Start with: 'Let's think about integration by parts. What differentiation rule do you think inspired this technique, and why would that connection be useful?'
- Start with: 'When you see an integral like ∫x sin(x) dx, what's your first thought? Why would standard substitution fail here, and what makes integration by parts a better choice?'
- Start with: 'Integration by parts is often seen as the "product rule in reverse". Can you explain the logic behind this comparison?'
`,
  'bio-enzymes': `
## TOPIC CHECKLIST
[ ] 1. Student can distinguish competitive from non-competitive inhibition by inhibitor binding site and effect on Vmax/Km.
[ ] 2. Student can explain why competitive inhibition is reversible and what 'increasing substrate concentration' does to it.
[ ] 3. Student can explain why non-competitive inhibition changes the enzyme's shape at the active site even though the inhibitor binds elsewhere (allosteric effect).
[ ] 4. Student can interpret a Lineweaver-Burk plot to identify inhibition type from the graph.
[ ] 5. Student can give biological examples of inhibition (e.g. end-product inhibition in metabolic pathways).

## VISUALIZATION GUIDANCE
- Use \`diagram\` to show the difference between lock-and-key and induced fit models.
- Use \`chart\` with \`chartType: 'line'\` to show V vs [S] curves with and without inhibitors.
- Use \`diagram\` to illustrate competitive vs non-competitive inhibition at the active/allosteric site.

## OPENING QUESTIONS
- Start with: 'Imagine two inhibitor molecules — one that looks almost identical to the substrate, and one that looks completely different. Without me telling you anything else, how would you expect each one to interact with the enzyme?'
- Start with: 'If you wanted to stop an enzyme from working but couldn't block its active site directly, what other strategy could you use? How would that affect the enzyme's overall shape?'
- Start with: 'How does the presence of a competitive inhibitor change the relationship between substrate concentration and the rate of reaction? Why does adding more substrate eventually overcome the inhibition?'
`,
  'phy-oscillations': `
## TOPIC CHECKLIST
[ ] 1. Student can state the defining condition of SHM: acceleration is proportional to and directed opposite to displacement from equilibrium.
[ ] 2. Student can write and interpret a = -omega^2 * x.
[ ] 3. Student can describe energy exchange between KE and PE and sketch the energy-displacement graph.
[ ] 4. Student can solve for displacement, velocity, and acceleration at a given position using x = A*cos(omega*t + phi).
[ ] 5. Student understands what changes when damping is applied (amplitude decreases, energy dissipated).
[ ] 6. Student can explain resonance: conditions for it, examples, and why it can be useful or dangerous.

## VISUALIZATION GUIDANCE
- Use the \`interactive\` type with \`logic: 'pendulum'\` to show the relationship between length and period.
- Use the \`interactive\` type with \`logic: 'spring'\` to show energy exchange in a mass-spring system.
- Use \`diagram\` to show phase differences between displacement, velocity, and acceleration.

## OPENING QUESTIONS
- Start with: 'Before we define SHM formally, describe the motion of a pendulum in your own words. What pattern do you notice about how it speeds up and slows down?'
- Start with: 'Imagine a mass on a spring bouncing up and down. At what point in its motion is it moving the fastest? At what point is its acceleration the greatest?'
- Start with: 'What happens to the energy of a vibrating system if we don't keep pushing it? Where does that energy go, and how does the motion change over time?'
- Start with: 'Have you ever heard of "resonance"? Can you think of a real-world example where a small, repeated push can lead to a very large oscillation?'
- Start with: 'How does the period of a simple pendulum change if you make the string longer? Does the mass of the bob matter at all?'
`,
  'ell-p1-lexis': `
## TOPIC CHECKLIST
[ ] 1. Student can identify word classes (nouns, verbs, adjectives, etc.) and explain their functional significance in a text.
[ ] 2. Student can identify semantic fields and explain how they contribute to the text's theme or mood.
[ ] 3. Student can distinguish between denotation and connotation and explain how connotations shape audience perception.
[ ] 4. Student can identify lexical cohesion (repetition, synonymy, antonymy) and explain its role in text structure.
[ ] 5. Student can analyze collocations and explain how they contribute to the text's register or tone.

## OPENING QUESTIONS
- Start with: 'Let's look at the vocabulary of a text. If you see a lot of words related to "war" in a speech about "business", what does that tell you about the speaker's intention?'
- Start with: 'How does the choice of specific word classes (like using many abstract nouns vs. concrete verbs) change the tone of a piece of writing?'
- Start with: 'If a writer uses a lot of synonyms for the same concept, what effect does that have on the text's cohesion and the reader's focus?'
- Start with: 'Think about the difference between "house" and "home". How do the connotations of these words shape our perception of a text?'
- Start with: 'What can we learn about a text's register by looking at its collocations? Are there any word pairings that seem particularly formal or informal?'
`,
  'ell-p1-grammar': `
## TOPIC CHECKLIST
[ ] 1. Student can identify sentence types (declarative, imperative, interrogative, exclamative) and explain their pragmatic function.
[ ] 2. Student can analyze clause structures (simple, compound, complex, compound-complex) and explain how they affect information flow.
[ ] 3. Student can identify and explain the effect of active vs passive voice (e.g. agent deletion).
[ ] 4. Student can analyze modality (epistemic vs deontic) and explain how it reflects the speaker's certainty or authority.
[ ] 5. Student can identify and explain the effect of nominalization in formal or academic texts.

## OPENING QUESTIONS
- Start with: 'Think about the difference between "The cat sat on the mat" and "The mat was sat upon by the cat." Why would a writer choose one over the other? What changes in terms of focus?'
- Start with: 'How does the use of complex sentence structures (with multiple subordinate clauses) affect the way information is presented to the reader?'
- Start with: 'Why might a writer choose to use an imperative sentence instead of a declarative one? How does this change the relationship with the audience?'
- Start with: 'What's the difference between "I might go" and "I must go"? How does this change in modality reflect the speaker's level of certainty or authority?'
- Start with: 'In formal or academic writing, why is nominalization (turning verbs into nouns) so common? What effect does it have on the tone of the text?'
`,
  'ell-p1-pragmatics': `
## TOPIC CHECKLIST
[ ] 1. Student can identify speech acts (locutionary, illocutionary, perlocutionary) and explain their impact.
[ ] 2. Student can apply Politeness Theory (Face Needs, Face Threatening Acts) to analyze social interactions in a text.
[ ] 3. Student can identify and explain the use of Grice's Maxims (and their flouting) in dialogue.
[ ] 4. Student can distinguish between cohesion (linguistic links) and coherence (conceptual unity).
[ ] 5. Student can analyze how genre conventions shape the pragmatic expectations of a text.

## OPENING QUESTIONS
- Start with: 'If someone asks "Can you pass the salt?" and you just say "Yes" without moving, which of Grice's maxims are you flouting, and why is that socially awkward?'
- Start with: 'How does Politeness Theory help us understand why people use indirect language in social interactions? Can you think of an example of a "Face Threatening Act"?'
- Start with: 'What's the difference between what someone says (locutionary act) and what they actually mean (illocutionary act)? How do we figure out the intended meaning?'
- Start with: 'How do our expectations of a particular genre (like a formal letter vs. a text message) influence the way we interpret the language used?'
- Start with: 'In a conversation, what happens when someone "flouts" a maxim? Does it always lead to a misunderstanding, or can it create a new layer of meaning?'
`,
  'ell-p1-comparison': `
## TOPIC CHECKLIST
[ ] 1. Student can identify fundamental differences in mode (spoken vs written vs multi-modal) and their linguistic consequences.
[ ] 2. Student can compare how different audiences shape the register and tone of two texts on the same topic.
[ ] 3. Student can analyze how purpose (to persuade, to inform, to entertain) leads to different linguistic strategies.
[ ] 4. Student can identify intertextual references and explain how they create meaning across texts.
[ ] 5. Student can synthesize findings to draw a conclusion about the relationship between context and language.

## OPENING QUESTIONS
- Start with: 'When comparing a formal speech and a casual tweet about the same event, what's the first major linguistic difference that jumps out at you? Is it the grammar, the lexis, or something else?'
- Start with: 'How does the intended audience of a text influence its register and tone? Can you think of two texts on the same topic that sound completely different because of who they're for?'
- Start with: 'Why is it important to consider the "mode" of a text (whether it's spoken, written, or multi-modal) when comparing linguistic features?'
- Start with: 'How do the different purposes of two texts (e.g., to persuade vs. to inform) lead to the use of different linguistic strategies?'
- Start with: 'What can intertextual references tell us about the relationship between two texts? How do they help to create a shared meaning for the audience?'
`,
  'ell-p2-identity': `
## TOPIC CHECKLIST
[ ] 1. Student can explain how language reflects and constructs social identity (gender, age, class, ethnicity).
[ ] 2. Student can discuss the concept of "Social Networks" and "Communities of Practice" in relation to language use.
[ ] 3. Student can analyze how gendered language (e.g. tag questions, hedges) has been theorized (Deficit, Dominance, Difference, Diversity models).
[ ] 4. Student can explain how age-graded features (e.g. slang, neologisms) mark group membership.
[ ] 5. Student can discuss the relationship between social class and prestige (overt vs covert prestige).

## OPENING QUESTIONS
- Start with: 'Do you think men and women really speak differently, or is that just a social stereotype? What linguistic evidence have you seen that supports or challenges this?'
- Start with: 'Think about the way you speak with your friends versus your family. How does your language use reflect different parts of your identity in these social networks?'
- Start with: 'What are some key linguistic studies you've come across that explore the relationship between gender and language use? Do they support the "difference" or "dominance" model?'
- Start with: 'How does the concept of "prestige" (overt vs covert) influence the way different social groups use language to mark their identity?'
- Start with: 'If someone uses a lot of slang or neologisms, what does that tell you about their age or social group membership? Is it always a reliable indicator?'
`,
  'ell-p2-power': `
## TOPIC CHECKLIST
[ ] 1. Student can identify instrumental vs influential power in language.
[ ] 2. Student can analyze how institutional talk (e.g. doctor-patient, teacher-student) maintains power imbalances.
[ ] 3. Student can identify and explain the use of ideology in political discourse (e.g. "us vs them" rhetoric).
[ ] 4. Student can apply Critical Discourse Analysis (CDA) to uncover hidden power structures in a text.
[ ] 5. Student can analyze how advertising uses synthetic personalization to exert influence.

## OPENING QUESTIONS
- Start with: 'When a teacher says "Would you like to sit down now?", is that a genuine question or a command? How does the power dynamic between you and the teacher change the way you interpret it?'
- Start with: 'How does "institutional talk" (like in a doctor's office or a courtroom) maintain and reinforce power imbalances between participants?'
- Start with: 'In political speeches, how is language used to create an "us vs. them" rhetoric? What linguistic features contribute to this ideological framing?'
- Start with: 'How can Critical Discourse Analysis (CDA) help us to uncover hidden power structures and biases in everyday texts?'
- Start with: 'In advertising, what is "synthetic personalization", and how does it help companies to exert influence over their target audience?'
`,
  'ell-p2-world-englishes': `
## TOPIC CHECKLIST
[ ] 1. Student can explain Kachru's Three Circles model and its limitations in the modern world.
[ ] 2. Student can discuss the features and social status of Singlish (Standard vs Non-standard).
[ ] 3. Student can explain the process of nativisation and how new varieties of English emerge.
[ ] 4. Student can evaluate the impact of language policy (e.g. Speak Good English Movement) on national identity.
[ ] 5. Student can discuss the concept of "Global English" and its implications for linguistic diversity.

## OPENING QUESTIONS
- Start with: 'Is Singlish a "broken" version of English, or is it a sophisticated variety with its own rules? How would you defend your position to someone who thinks it should be banned?'
- Start with: 'How does Kachru's "Three Circles" model help us to understand the global spread and development of English? What are some of its limitations?'
- Start with: 'What is "nativisation", and how does it lead to the emergence of new, distinct varieties of English in different parts of the world?'
- Start with: 'How do language policies (like the "Speak Good English Movement" in Singapore) influence a nation's identity and its people's language use?'
- Start with: 'What are the implications of "Global English" for linguistic diversity? Is English becoming a "killer language", or is it just a useful tool for international communication?'
`,
  'ell-p2-change': `
## TOPIC CHECKLIST
[ ] 1. Student can identify drivers of language change (social, technological, political).
[ ] 2. Student can explain the process of lexical change (neologisms, archaisms, narrowing, broadening).
[ ] 3. Student can discuss the impact of the internet and social media on modern English (e.g. CMC features).
[ ] 4. Student can analyze historical developments in English (e.g. Great Vowel Shift, influence of other languages).
[ ] 5. Student can evaluate prescriptive vs descriptive attitudes towards language change.

## OPENING QUESTIONS
- Start with: 'Think about words like "ghosting" or "cringe" used as adjectives. Are these signs that English is "decaying", or is it just evolving? Why do some people get so upset about new words?'
- Start with: 'What are some of the major social, technological, and political drivers of language change in the modern world?'
- Start with: 'How has the internet and social media changed the way we use English? Can you think of any specific "CMC" (Computer-Mediated Communication) features?'
- Start with: 'What's the difference between a "prescriptive" and a "descriptive" attitude towards language change? Which one do you think is more useful for a linguist?'
- Start with: 'How do processes like "narrowing" and "broadening" change the meaning of words over time? Can you think of any examples?'
`,
};

export interface Topic {
  id: string;
  name: string;
  subtopics: string[];
  group?: string;
}

export interface Section {
  name: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  sections: Section[];
}

export const SYLLABUS: Record<string, Subject> = {
  mathematics: {
    id: 'math',
    name: 'H2 Mathematics (9758)',
    sections: [
      {
        name: 'Pure Mathematics',
        topics: [
          { id: 'math-functions', name: 'Functions & Graphs', subtopics: ['Domain/range', 'Inverse', 'Composite', 'Transformations', 'Asymptotes'] },
          { id: 'math-sequences', name: 'Sequences & Series', subtopics: ['AP/GP', 'Sigma notation', 'Method of differences', 'Maclaurin series'] },
          { id: 'math-vectors', name: 'Vectors', subtopics: ['Operations', 'Scalar/vector products', 'Lines and planes in 3D', 'Angles', 'Distances'] },
          { id: 'math-complex', name: 'Complex Numbers', subtopics: ['Cartesian form', 'Argand diagram', 'Modulus-argument form', 'Loci'] },
          { id: 'math-differentiation', name: 'Differentiation', subtopics: ['Techniques', 'Implicit', 'Parametric', 'Applications', "Maclaurin's theorem"] },
          { id: 'math-integration', name: 'Integration', subtopics: ['Standard integrals', 'By parts', 'Substitution', 'Partial fractions', 'Area/volume'] },
          { id: 'math-de', name: 'Differential Equations', subtopics: ['First order DEs', 'Variables separable', 'Integrating factor', 'Modelling'] },
        ]
      },
      {
        name: 'Statistics',
        topics: [
          { id: 'math-permutations', name: 'Permutations & Combinations', subtopics: ['Counting', 'Arrangement', 'Selection'] },
          { id: 'math-probability', name: 'Probability', subtopics: ['Basic probability', 'Conditional probability', 'Independence'] },
          { id: 'math-discrete', name: 'Discrete Random Variables', subtopics: ['Expectation', 'Variance', 'Binomial distribution'] },
          { id: 'math-normal', name: 'Normal Distribution', subtopics: ['Standard normal', 'Continuity correction', 'Hypothesis testing'] },
          { id: 'math-sampling', name: 'Sampling & Hypothesis Testing', subtopics: ['t-tests', 'z-tests', 'Null/alternative hypotheses'] },
          { id: 'math-correlation', name: 'Correlation & Regression', subtopics: ["Pearson's r", 'Least-squares regression', 'Interpolation/extrapolation'] },
        ]
      }
    ]
  },
  physics: {
    id: 'physics',
    name: 'H2 Physics (9749)',
    sections: [
      {
        name: 'Core Physics',
        topics: [
          { id: 'phy-measurement', name: 'Measurement', subtopics: ['SI units', 'Uncertainty', 'Significant figures'] },
          { id: 'phy-kinematics', name: 'Kinematics', subtopics: ['Displacement', 'Velocity', 'Acceleration', 'Graphs of motion'] },
          { id: 'phy-dynamics', name: 'Dynamics', subtopics: ["Newton's laws", 'Momentum', 'Impulse', 'Conservation'] },
          { id: 'phy-forces', name: 'Forces', subtopics: ['Types of forces', 'Equilibrium', 'Friction', 'Centre of gravity'] },
          { id: 'phy-energy', name: 'Work, Energy & Power', subtopics: ['Work-energy theorem', 'Conservation of energy', 'Power'] },
          { id: 'phy-circular', name: 'Motion in a Circle', subtopics: ['Angular velocity', 'Centripetal force', 'Banking'] },
          { id: 'phy-gravitational', name: 'Gravitational Field', subtopics: ["Newton's law", 'Field strength', 'Potential', 'Satellites', 'Orbits'] },
          { id: 'phy-thermal', name: 'Temperature & Ideal Gases', subtopics: ['Thermal equilibrium', 'Ideal gas equation', 'Kinetic theory'] },
          { id: 'phy-thermodynamics', name: 'First Law of Thermodynamics', subtopics: ['Internal energy', 'Heat', 'Work'] },
          { id: 'phy-oscillations', name: 'Oscillations', subtopics: ['SHM', 'Energy in SHM', 'Damping', 'Resonance'] },
          { id: 'phy-waves', name: 'Wave Motion', subtopics: ['Transverse/longitudinal', 'Superposition', 'Standing waves'] },
          { id: 'phy-superposition', name: 'Superposition', subtopics: ['Interference', 'Diffraction grating', 'Single slit'] },
          { id: 'phy-electric', name: 'Electric Fields', subtopics: ["Coulomb's law", 'Field strength', 'Potential', 'Capacitors'] },
          { id: 'phy-current', name: 'Current of Electricity', subtopics: ['Charge', 'Current', 'Resistance', "Ohm's law", 'EMF'] },
          { id: 'phy-dc', name: 'DC Circuits', subtopics: ['Series/parallel', "Kirchhoff's laws", 'Potential divider', 'Wheatstone bridge'] },
          { id: 'phy-electromagnetism', name: 'Electromagnetism', subtopics: ['Magnetic force', 'Fields', 'Electromagnetic induction', 'Faraday/Lenz'] },
          { id: 'phy-alternating', name: 'Alternating Currents', subtopics: ['RMS values', 'Transformers', 'Rectification'] },
          { id: 'phy-quantum', name: 'Quantum Physics', subtopics: ['Photoelectric effect', 'Wave-particle duality', 'Energy levels'] },
          { id: 'phy-nuclear', name: 'Nuclear Physics', subtopics: ['Radioactive decay', 'Nuclear reactions', 'Mass-energy equivalence'] },
        ]
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    name: 'H2 Chemistry (9729)',
    sections: [
      {
        name: 'Physical Chemistry',
        topics: [
          { id: 'chem-atomic', name: 'Atomic Structure', subtopics: ['Subatomic particles', 'Quantum shells', 'Electronic configuration'] },
          { id: 'chem-bonding', name: 'Chemical Bonding', subtopics: ['Ionic', 'Covalent', 'Metallic', 'VSEPR', 'Intermolecular forces'] },
          { id: 'chem-gaseous', name: 'The Gaseous State', subtopics: ['Ideal gas law', 'Deviation from ideal behaviour'] },
          { id: 'chem-energetics', name: 'Energetics', subtopics: ["Hess's law", 'Bond energies', 'Born-Haber cycles', 'Entropy', 'Gibbs energy'] },
          { id: 'chem-equilibria', name: 'Chemical Equilibria', subtopics: ["Le Chatelier's principle", 'Kc', 'Kp', 'Acid-base equilibria', 'Kw', 'pH'] },
          { id: 'chem-kinetics', name: 'Reaction Kinetics', subtopics: ['Rate laws', 'Order of reaction', 'Arrhenius equation', 'Mechanisms'] },
          { id: 'chem-electro', name: 'Electrochemistry', subtopics: ['Electrode potentials', 'Electrochemical cells', 'Electrolysis'] },
        ]
      },
      {
        name: 'Inorganic Chemistry',
        topics: [
          { id: 'chem-periodicity', name: 'Periodicity', subtopics: ['Physical/chemical properties across Period 3'] },
          { id: 'chem-group2', name: 'Group 2', subtopics: ['Reactions of Group 2 metals', 'Uses of compounds'] },
          { id: 'chem-group17', name: 'Group 17', subtopics: ['Reactions of halogens', 'Halide ions', 'Tests for ions'] },
          { id: 'chem-transition', name: 'Transition Elements', subtopics: ['Properties', 'Complex ions', 'Colour', 'Catalysis'] },
        ]
      },
      {
        name: 'Organic Chemistry',
        topics: [
          { id: 'chem-intro-organic', name: 'Introduction to Organic Chemistry', subtopics: ['Nomenclature', 'Isomerism', 'Structural formulae'] },
          { id: 'chem-alkanes', name: 'Alkanes', subtopics: ['Free radical substitution mechanism'] },
          { id: 'chem-alkenes', name: 'Alkenes', subtopics: ['Electrophilic addition mechanism', "Markovnikov's rule"] },
          { id: 'chem-arenes', name: 'Arenes', subtopics: ['Electrophilic substitution mechanism', 'Directing effects'] },
          { id: 'chem-halogenoalkanes', name: 'Halogenoalkanes', subtopics: ['Nucleophilic substitution (SN1/SN2)', 'Elimination'] },
          { id: 'chem-alcohols', name: 'Alcohols', subtopics: ['Reactions: oxidation', 'Esterification', 'Dehydration'] },
          { id: 'chem-carbonyl', name: 'Carbonyl Compounds', subtopics: ['Aldehydes/ketones', 'Nucleophilic addition', 'Oxidation', 'Condensation'] },
          { id: 'chem-carboxylic', name: 'Carboxylic Acids & Derivatives', subtopics: ['Acyl chlorides', 'Esters', 'Amides'] },
          { id: 'chem-nitrogen', name: 'Nitrogen Compounds', subtopics: ['Amines', 'Amides', 'Amino acids'] },
          { id: 'chem-polymerisation', name: 'Polymerisation', subtopics: ['Addition and condensation polymers'] },
        ]
      }
    ]
  },
  biology: {
    id: 'biology',
    name: 'H2 Biology (9744)',
    sections: [
      {
        name: 'Core Biology',
        topics: [
          { id: 'bio-cell-structure', name: 'Cell Structure', subtopics: ['Prokaryotic/eukaryotic', 'Organelles', 'Cell fractionation'] },
          { id: 'bio-molecules', name: 'Biological Molecules', subtopics: ['Carbohydrates', 'Lipids', 'Proteins', 'Water', 'Inorganic ions'] },
          { id: 'bio-enzymes', name: 'Enzymes', subtopics: ['Lock-and-key', 'Induced fit', 'Inhibition', 'Factors affecting rate'] },
          { id: 'bio-membranes', name: 'Cell Membranes & Transport', subtopics: ['Fluid mosaic model', 'Diffusion', 'Osmosis', 'Active transport'] },
          { id: 'bio-cell-division', name: 'Cell Division', subtopics: ['Mitosis', 'Meiosis', 'Significance'] },
          { id: 'bio-photosynthesis', name: 'Photosynthesis', subtopics: ['Light-dependent/independent reactions', 'Factors affecting rate'] },
          { id: 'bio-respiration', name: 'Respiration', subtopics: ['Glycolysis', 'Krebs cycle', 'Oxidative phosphorylation', 'Anaerobic'] },
          { id: 'bio-inherited', name: 'Inherited Change', subtopics: ['DNA structure', 'Replication', 'Genetic code', 'Transcription', 'Translation'] },
          { id: 'bio-gene-tech', name: 'Gene Technology', subtopics: ['PCR', 'Gel electrophoresis', 'Genetic engineering', 'GMOs'] },
          { id: 'bio-regulation', name: 'Regulation', subtopics: ['Homeostasis', 'Nervous system', 'Hormonal coordination', 'Thermoregulation'] },
          { id: 'bio-immunity', name: 'Immunity', subtopics: ['Innate/adaptive immunity', 'Antibodies', 'Vaccines', 'HIV'] },
          { id: 'bio-ecosystems', name: 'Energy & Ecosystems', subtopics: ['Food chains', 'Energy flow', 'Nutrient cycles', 'Human impact'] },
          { id: 'bio-genetics', name: 'Genetics & Evolution', subtopics: ['Mendelian genetics', 'Chi-squared test', 'Natural selection', 'Speciation'] },
        ]
      }
    ]
  },
  ell: {
    id: 'ell',
    name: 'H2 English Language & Linguistics (9508)',
    sections: [
      {
        name: 'Paper 1: Analysis of Texts',
        topics: [
          { id: 'ell-p1-lexis', name: 'Lexis & Semantics', group: 'Section A: Textual Analysis', subtopics: ['Word classes', 'Semantic fields', 'Collocation', 'Denotation/Connotation', 'Lexical cohesion'] },
          { id: 'ell-p1-grammar', name: 'Grammar & Syntax', group: 'Section A: Textual Analysis', subtopics: ['Sentence types', 'Clause structures', 'Morphology', 'Tense/Aspect', 'Voice', 'Modality'] },
          { id: 'ell-p1-phonology', name: 'Phonology & Graphology', group: 'Section A: Textual Analysis', subtopics: ['Prosodic features', 'Sound patterns', 'Visual design', 'Typography', 'Multimodality'] },
          { id: 'ell-p1-pragmatics', name: 'Pragmatics & Discourse', group: 'Section A: Textual Analysis', subtopics: ['Speech acts', 'Politeness', 'Cohesion', 'Coherence', 'Genre', 'Register'] },
          { id: 'ell-p1-comparison', name: 'Comparative Analysis', group: 'Section B: Comparison of Texts', subtopics: ['Comparing mode', 'Comparing audience', 'Comparing purpose', 'Contextual factors', 'Intertextuality'] },
        ]
      },
      {
        name: 'Paper 2: Language in Society',
        topics: [
          { id: 'ell-p2-identity', name: 'Language & Identity', group: 'Section A: Language and the Individual', subtopics: ['Gender', 'Age', 'Social Class', 'Ethnicity', 'Social networks', 'Community of Practice'] },
          { id: 'ell-p2-mind', name: 'Language & the Mind', group: 'Section A: Language and the Individual', subtopics: ['L1 Acquisition', 'L2 Acquisition', 'Bilingualism', 'Cognitive linguistics'] },
          { id: 'ell-p2-power', name: 'Language & Power', group: 'Section B: Language and Society', subtopics: ['Political discourse', 'Advertising', 'Institutional talk', 'Ideology', 'Critical Discourse Analysis'] },
          { id: 'ell-p2-world-englishes', name: 'World Englishes', group: 'Section B: Language and Society', subtopics: ['Singlish', 'Global varieties', 'Standard vs Non-standard', 'Nativisation', 'Language Policy'] },
          { id: 'ell-p2-change', name: 'Language Change', group: 'Section B: Language and Society', subtopics: ['Historical development', 'Neologisms', 'Archaic features', 'Social drivers', 'Technological impact'] },
        ]
      }
    ]
  }
};

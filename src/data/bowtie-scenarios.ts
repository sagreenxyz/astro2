export interface BowtieOption {
  id: string;
  text: string;
}

export interface BowTieScenario {
  id: string;
  title: string;
  vignette: string;
  actions: BowtieOption[];
  conditions: BowtieOption[];
  parameters: BowtieOption[];
  correctActionIds: [string, string];
  correctConditionId: string;
  correctParameterIds: [string, string];
  rationale: string;
}

export const BOWTIE_SCENARIOS: BowTieScenario[] = [
  {
    id: 'ischemic-stroke',
    title: 'Ischemic Stroke',
    vignette:
      'A 72-year-old male is brought by ambulance after sudden onset of right-sided weakness and facial droop with slurred speech. Vital signs: BP 188/102 mmHg, HR 88 bpm, O₂ saturation 94% on room air. Last known well was 90 minutes ago. CT head is pending. He has no known drug allergies and his past medical history includes hypertension and atrial fibrillation.',
    conditions: [
      { id: 'bells-palsy', text: "Bell's palsy" },
      { id: 'hypoglycemia', text: 'Hypoglycemia' },
      { id: 'ischemic-stroke', text: 'Ischemic stroke' },
      { id: 'uti', text: 'Urinary tract infection' },
    ],
    actions: [
      { id: 'oral-steroid', text: 'Request oral steroid prescription' },
      { id: 'oxygen', text: 'Administer oxygen at 2 L/min via nasal cannula' },
      { id: 'iv-access', text: 'Insert a peripheral venous access device' },
      { id: 'urine-cs', text: 'Obtain urine for culture and sensitivity' },
      { id: 'dextrose', text: 'Request 50% dextrose IV push' },
    ],
    parameters: [
      { id: 'temperature', text: 'Temperature' },
      { id: 'urinary-output', text: 'Urinary output' },
      { id: 'neuro-status', text: 'Neurologic status' },
      { id: 'serum-glucose', text: 'Serum glucose level' },
      { id: 'ecg', text: 'ECG rhythm' },
    ],
    correctConditionId: 'ischemic-stroke',
    correctActionIds: ['oxygen', 'iv-access'],
    correctParameterIds: ['neuro-status', 'serum-glucose'],
    rationale:
      'Ischemic stroke explains the unilateral weakness, facial droop, and slurred speech within the thrombolytic time window. Supplemental oxygen corrects hypoxemia (O₂ sat 94%), and IV access is essential for potential thrombolytic therapy. Neurologic status must be trended to detect improvement or deterioration, and serum glucose must be monitored because hypoglycemia can mimic stroke and hyperglycemia worsens outcomes.',
  },
  {
    id: 'acute-heart-failure',
    title: 'Acute Decompensated Heart Failure',
    vignette:
      'A 68-year-old female with a known history of heart failure presents with a 3-day history of worsening shortness of breath. Assessment reveals bilateral crackles to the mid-lungs, 3+ pitting edema in bilateral lower extremities, and a weight gain of 4 kg over 3 days. Vital signs: BP 158/96 mmHg, HR 102 bpm, O₂ saturation 89% on room air. She is sitting upright and appears anxious.',
    conditions: [
      { id: 'pneumonia', text: 'Pneumonia' },
      { id: 'pulmonary-embolism', text: 'Pulmonary embolism' },
      { id: 'adhf', text: 'Acute decompensated heart failure' },
      { id: 'copd', text: 'COPD exacerbation' },
    ],
    actions: [
      { id: 'furosemide', text: 'Administer IV furosemide as prescribed' },
      { id: 'high-fowlers', text: "Position in high Fowler's position" },
      { id: 'antibiotics', text: 'Administer antibiotics as prescribed' },
      { id: 'scd', text: 'Apply sequential compression devices' },
      { id: 'intubation', text: 'Prepare for intubation' },
    ],
    parameters: [
      { id: 'daily-weight', text: 'Daily weight' },
      { id: 'potassium', text: 'Serum potassium' },
      { id: 'urine-output', text: 'Urine output' },
      { id: 'cxr', text: 'Chest X-ray result' },
      { id: 'bnp', text: 'BNP level' },
    ],
    correctConditionId: 'adhf',
    correctActionIds: ['furosemide', 'high-fowlers'],
    correctParameterIds: ['daily-weight', 'potassium'],
    rationale:
      "Bilateral crackles, dependent edema, rapid weight gain, and her cardiac history are hallmark signs of acute decompensated heart failure. IV furosemide reduces preload by promoting diuresis, and high Fowler's positioning uses gravity to reduce venous return and improve lung expansion. Daily weight is the most sensitive indicator of fluid balance, and serum potassium must be monitored closely because loop diuretics cause significant potassium loss that can lead to dangerous arrhythmias.",
  },
  {
    id: 'dka',
    title: 'Diabetic Ketoacidosis (DKA)',
    vignette:
      'A 24-year-old male with type 1 diabetes presents with nausea, vomiting, abdominal pain, and confusion for 12 hours. He reports running out of insulin 2 days ago. Vital signs: T 37.8°C, HR 124 bpm, RR 28 and deep, BP 94/60 mmHg, O₂ saturation 97%. Laboratory results: blood glucose 520 mg/dL, arterial pH 7.18, serum bicarbonate 10 mEq/L, serum potassium 5.8 mEq/L, urine and serum ketones positive.',
    conditions: [
      { id: 'hhs', text: 'Hyperglycemic hyperosmolar state (HHS)' },
      { id: 'hypoglycemia', text: 'Hypoglycemia' },
      { id: 'dka', text: 'Diabetic ketoacidosis (DKA)' },
      { id: 'sepsis', text: 'Sepsis' },
    ],
    actions: [
      { id: 'insulin-infusion', text: 'Administer IV regular insulin infusion as prescribed' },
      { id: 'ns-fluids', text: 'Initiate IV 0.9% normal saline fluid resuscitation' },
      { id: 'oral-glucose', text: 'Administer oral glucose tablets' },
      { id: 'bicarb', text: 'Administer sodium bicarbonate IV push' },
      { id: 'restrict-fluids', text: 'Restrict oral fluid intake' },
    ],
    parameters: [
      { id: 'potassium', text: 'Serum potassium' },
      { id: 'blood-glucose', text: 'Blood glucose level' },
      { id: 'urine-output', text: 'Urine output' },
      { id: 'temperature', text: 'Temperature' },
      { id: 'sodium', text: 'Sodium level' },
    ],
    correctConditionId: 'dka',
    correctActionIds: ['insulin-infusion', 'ns-fluids'],
    correctParameterIds: ['potassium', 'blood-glucose'],
    rationale:
      'DKA is confirmed by the triad of elevated blood glucose (520 mg/dL), metabolic acidosis (pH 7.18, bicarbonate 10 mEq/L), and positive ketones, combined with the missed insulin history. IV insulin infusion lowers blood glucose and halts ketone production, while IV 0.9% normal saline corrects severe dehydration and hypotension. Serum potassium must be monitored continuously because insulin drives potassium into cells, risking dangerous hypokalemia despite the initially elevated level. Blood glucose is trended to titrate the insulin infusion and prevent iatrogenic hypoglycemia.',
  },
  {
    id: 'septic-shock',
    title: 'Septic Shock',
    vignette:
      'A 58-year-old female is on post-operative day 2 following a bowel resection. The nurse notes she is increasingly confused. Vital signs: HR 118 bpm, RR 24 breaths/min, T 39.2°C, BP 88/54 mmHg, O₂ saturation 92% on 2 L/min nasal cannula. WBC 18,000 cells/µL. Inspection of the surgical wound reveals purulent drainage at the incision site.',
    conditions: [
      { id: 'pe', text: 'Pulmonary embolism' },
      { id: 'dehydration', text: 'Dehydration' },
      { id: 'septic-shock', text: 'Septic shock' },
      { id: 'adrenal-crisis', text: 'Adrenal crisis' },
    ],
    actions: [
      { id: 'blood-cultures', text: 'Obtain two sets of blood cultures before antibiotics' },
      { id: 'antibiotics', text: 'Administer prescribed broad-spectrum IV antibiotics' },
      { id: 'trendelenburg', text: 'Place patient in Trendelenburg position' },
      { id: 'restrict-iv', text: 'Restrict IV fluid administration' },
      { id: 'acetaminophen', text: 'Administer oral acetaminophen for fever' },
    ],
    parameters: [
      { id: 'map', text: 'Mean arterial pressure (MAP)' },
      { id: 'lactate', text: 'Lactate level' },
      { id: 'urine-output', text: 'Urine output' },
      { id: 'wound-culture', text: 'Wound culture result' },
      { id: 'temperature', text: 'Temperature' },
    ],
    correctConditionId: 'septic-shock',
    correctActionIds: ['blood-cultures', 'antibiotics'],
    correctParameterIds: ['map', 'lactate'],
    rationale:
      'The post-operative patient meets criteria for septic shock: a clear infection source (wound infection after bowel surgery), hypotension (BP 88/54), tachycardia, fever, altered mentation, and elevated WBC. Blood cultures must be obtained before the first antibiotic dose to avoid sterilising the sample and losing diagnostic information. Broad-spectrum IV antibiotics should then be administered within one hour. Mean arterial pressure (MAP) ≥ 65 mmHg is the primary haemodynamic goal in septic shock management, and serum lactate reflects tissue perfusion and is the gold-standard parameter for guiding resuscitation and predicting mortality.',
  },
];

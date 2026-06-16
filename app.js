/* ==========================================================================
   FoCUS Preoperative Training Module
   Single-page app logic: navigation, content data, scoring, export
   ========================================================================== */
(function () {
  'use strict';

  /* ============================================================
     DEV MODE
     Set to false (or delete the dev tools section near the bottom of
     this file, plus the #devBar block in index.html) before
     distributing the site to participants.
     ============================================================ */
  const DEV_MODE = true;

  /* ============================================================
     CONTENT DATA
     ============================================================ */

  const CONFIDENCE_ITEMS = [
    "I can identify the basic FoCUS views (PLAX, A4C, and subcostal).",
    "I can recognize severely reduced left ventricular systolic function on a focused cardiac ultrasound.",
    "I can identify a clinically significant pericardial effusion.",
    "I can recognize a FoCUS finding that should prompt delaying surgery or requesting a formal echocardiogram.",
    "Overall, I feel confident in my ability to perform and interpret a basic preoperative FoCUS exam."
  ];

  const USABILITY_ITEMS = [
    "The training content was easy to understand.",
    "The training modules were well organized and easy to navigate.",
    "The case scenarios helped me apply the concepts to clinical decision-making.",
    "I would recommend this training module to a colleague.",
    "After this training, I am more likely to consider FoCUS as part of my preoperative assessment."
  ];

  // Knowledge test - Form A (pre-training)
  const KNOWLEDGE_PRE = [
    { q: "What is the primary purpose of a focused preoperative cardiac ultrasound (FoCUS) exam?",
      o: ["To replace comprehensive transthoracic echocardiography (TTE)",
          "To answer a limited set of targeted clinical questions relevant to anesthetic management",
          "To formally grade valve stenosis severity for surgical planning",
          "To diagnose coronary artery disease"], c: 1 },
    { q: "Approximately how long does a focused preoperative TTE typically take to perform?",
      o: ["1–2 minutes", "8–12 minutes", "45–60 minutes", "2–3 hours"], c: 1 },
    { q: "Which of the following is a recognized limitation of the Revised Cardiac Risk Index (RCRI)?",
      o: ["It requires advanced imaging equipment to calculate",
          "It cannot identify subclinical structural cardiac abnormalities",
          "It can only be used in cardiac surgery patients",
          "It requires a cardiology consult to calculate"], c: 1 },
    { q: "The parasternal long-axis (PLAX) view is primarily used to assess:",
      o: ["Abdominal aortic aneurysm screening",
          "LV size/function, mitral and aortic valves, aortic root, and pericardial space",
          "Right ventricular strain only",
          "Carotid artery flow"], c: 1 },
    { q: "In the apical 4-chamber (A4C) view, a right ventricle that appears equal to or larger than the left ventricle most strongly suggests:",
      o: ["A normal anatomic variant in all patients",
          "Severe aortic stenosis",
          "RV dilation/dysfunction, which may indicate pulmonary hypertension or PE",
          "Hypovolemia"], c: 2 },
    { q: "On FoCUS, a large pericardial effusion with right ventricular diastolic collapse is most consistent with:",
      o: ["A normal incidental finding requiring no action",
          "Tamponade physiology — a red-flag finding warranting prompt communication",
          "Severe mitral stenosis",
          "Volume depletion"], c: 1 },
    { q: "Which finding on FoCUS would be considered a \"red flag\" warranting further evaluation before proceeding with an elective case?",
      o: ["Mild left atrial enlargement",
          "Trace mitral regurgitation",
          "A new, large pericardial effusion with signs of tamponade physiology",
          "Mildly hyperdynamic LV function"], c: 2 },
    { q: "The subcostal (subxiphoid) view is particularly useful for:",
      o: ["Assessing the aortic arch",
          "Identifying pericardial effusion and serving as an alternative four-chamber view",
          "Measuring carotid intima-media thickness",
          "Visualizing the pulmonary veins"], c: 1 },
    { q: "A CRNA performs a preoperative FoCUS on a patient scheduled for an elective hip replacement and notes a heavily calcified aortic valve with markedly reduced leaflet excursion. The most appropriate next step is:",
      o: ["Proceed with the case as planned with no further action",
          "Document the finding and discuss with the team regarding further cardiac evaluation before proceeding",
          "Cancel all future surgeries for this patient",
          "Administer additional sedation to compensate"], c: 1 },
    { q: "Which of the following best describes the appropriate scope of FoCUS for a CRNA?",
      o: ["A definitive diagnostic tool that replaces cardiology evaluation",
          "A screening adjunct to existing clinical risk assessment that identifies findings warranting further workup",
          "A tool used only in the ICU, never preoperatively",
          "A billing requirement for all surgical patients"], c: 1 },
    { q: "Global LV systolic function that appears severely reduced (visually estimated EF <30%) on a focused exam should prompt the CRNA to:",
      o: ["Disregard the finding if the patient appears clinically well",
          "Communicate the finding to the care team and consider further cardiac evaluation before elective surgery",
          "Increase the planned dose of induction agents without further discussion",
          "Repeat the scan only after induction"], c: 1 },
    { q: "According to the AANA, point-of-care ultrasound (POCUS), including FoCUS, is best described as:",
      o: ["Outside the scope of CRNA practice entirely",
          "An advancing competency for evidence-based nurse anesthesia practice",
          "A required certification for all CRNAs as of this year",
          "Equivalent in scope to a cardiology fellowship"], c: 1 }
  ];

  // Knowledge test - Form B (post-training, parallel form)
  const KNOWLEDGE_POST = [
    { q: "The main goal of a focused preoperative TTE (FoCUS) is best described as:",
      o: ["Performing a complete structural and functional echocardiographic survey",
          "Targeting specific, clinically relevant questions that influence the anesthetic plan",
          "Establishing a definitive cardiology diagnosis",
          "Replacing the need for any preoperative risk-stratification tool"], c: 1 },
    { q: "A focused cardiac ultrasound exam is generally designed to be completed within:",
      o: ["Under 1 minute", "About 8–12 minutes", "Roughly 1 hour", "A full afternoon"], c: 1 },
    { q: "A key limitation of relying solely on the RCRI for preoperative risk stratification is that it:",
      o: ["Is too time-consuming to calculate",
          "Does not capture structural cardiac disease such as valvular pathology or LV dysfunction",
          "Can only be applied to outpatient procedures",
          "Requires an echocardiogram to complete"], c: 1 },
    { q: "Which structures are best evaluated using the parasternal long-axis (PLAX) window?",
      o: ["Renal artery flow",
          "LV chamber size/function, mitral and aortic valves, and the pericardium",
          "Carotid bifurcation",
          "Pulmonary artery branches only"], c: 1 },
    { q: "On apical 4-chamber view, finding the right ventricle similar in size to or larger than the left ventricle should raise concern for:",
      o: ["A technically normal variant requiring no further thought",
          "Severe mitral stenosis",
          "RV dilation/dysfunction, possibly from pulmonary hypertension or pulmonary embolism",
          "Volume depletion"], c: 2 },
    { q: "Which finding on FoCUS would most strongly suggest pericardial tamponade physiology?",
      o: ["A trace pericardial effusion with no chamber collapse",
          "A large pericardial effusion with right ventricular diastolic collapse",
          "Mild left ventricular hypertrophy",
          "A normal-appearing aortic root"], c: 1 },
    { q: "Which of these would be considered an unexpected, high-acuity finding on a preoperative FoCUS that should prompt further discussion before an elective procedure?",
      o: ["Mildly thickened aortic valve leaflets with normal excursion",
          "A new, large pericardial effusion with evidence of tamponade physiology",
          "Trace tricuspid regurgitation",
          "Normal global LV systolic function"], c: 1 },
    { q: "The subcostal window is especially valuable because it:",
      o: ["Is the best view for assessing the aortic arch",
          "Can detect pericardial effusion and serve as a backup four-chamber view",
          "Provides the clearest image of the carotid arteries",
          "Is used primarily to measure blood pressure"], c: 1 },
    { q: "During a preoperative FoCUS for an elective procedure, a CRNA identifies a severely calcified aortic valve with markedly limited leaflet motion. The best next step is to:",
      o: ["Proceed without mentioning the finding",
          "Document and communicate the finding to the team for consideration of further cardiac workup",
          "Cancel the patient's surgery permanently",
          "Give extra fluids to compensate"], c: 1 },
    { q: "The most accurate description of FoCUS within CRNA practice is that it functions as:",
      o: ["A complete replacement for cardiology-performed echocardiography",
          "An adjunct screening tool that flags findings needing additional evaluation",
          "A tool restricted to postoperative ICU use only",
          "A mandatory billing code for every anesthetic"], c: 1 },
    { q: "If a focused exam reveals what appears to be severely reduced global LV systolic function in a patient scheduled for elective surgery, the CRNA should:",
      o: ["Ignore it if vital signs are currently stable",
          "Report the finding to the care team and consider further evaluation before proceeding",
          "Proceed and plan to address it only if hypotension occurs intraoperatively",
          "Repeat the scan only after the patient is under anesthesia"], c: 1 },
    { q: "The AANA's current position on POCUS (including FoCUS) for CRNAs is that it represents:",
      o: ["A practice that falls outside CRNA scope",
          "An advancing competency supporting evidence-based practice",
          "A skill required only for CRNAs in cardiac subspecialty practice",
          "Training equivalent to a full echocardiography fellowship"], c: 1 }
  ];

  // Case-based scenarios - Form A (pre-training)
  const CASES_PRE = [
    { v: "A 74-year-old patient with a history of hypertension is scheduled for an elective total hip arthroplasty. Preoperative FoCUS reveals a heavily calcified aortic valve with severely reduced leaflet excursion and a hyperdynamic LV. There is no echocardiogram on file, and the patient reports increasing fatigue over the past 3 months.",
      q: "What is the most appropriate next step?",
      o: ["Proceed with the planned anesthetic without further action",
          "Document the findings and discuss with the team regarding further cardiac evaluation before the elective procedure",
          "Administer a fluid bolus and proceed",
          "Cancel all future surgeries for this patient permanently"], c: 1 },
    { v: "A 58-year-old patient is scheduled for an elective laparoscopic cholecystectomy. Preoperative FoCUS shows normal LV size and function, no pericardial effusion, and normal RV size.",
      q: "Based on these findings, the most appropriate next step is:",
      o: ["Proceed with the planned anesthetic; findings are reassuring and consistent with the existing risk assessment",
          "Cancel the case pending cardiology clearance",
          "Order an urgent formal TTE before proceeding",
          "Repeat the FoCUS exam multiple times to confirm"], c: 0 },
    { v: "A 66-year-old patient with COPD presents for an elective inguinal hernia repair. FoCUS reveals a dilated right ventricle that appears larger than the left ventricle, with flattening of the interventricular septum.",
      q: "This finding is most consistent with which process, and what is the most appropriate action?",
      o: ["Hypovolemia; administer additional IV fluids and proceed",
          "Possible pulmonary hypertension or RV strain; communicate the finding to the team and consider further workup before proceeding",
          "A normal finding in COPD patients; no action needed",
          "Severe mitral stenosis; proceed with the case as planned"], c: 1 },
    { v: "A 45-year-old trauma patient requires urgent surgery. FoCUS reveals a large, new pericardial effusion with right ventricular diastolic collapse and a small, hyperdynamic left ventricle.",
      q: "These findings are most consistent with:",
      o: ["Volume overload; restrict fluids and proceed",
          "Tamponade physiology; communicate the finding immediately and discuss the risk/benefit of proceeding with the team",
          "A normal finding in trauma patients; no action needed",
          "Severe mitral stenosis; proceed with the case as planned"], c: 1 }
  ];

  // Case-based scenarios - Form B (post-training, parallel form)
  const CASES_POST = [
    { v: "A 71-year-old patient with a history of exertional dyspnea is scheduled for an elective total knee arthroplasty. Preoperative FoCUS demonstrates a thickened, heavily calcified aortic valve with markedly reduced leaflet motion. No prior echocardiogram is on file.",
      q: "What is the most appropriate next step?",
      o: ["Proceed with the case without documenting or discussing the finding",
          "Document the finding and discuss with the team regarding further cardiac evaluation before the elective procedure",
          "Give a vasopressor bolus prophylactically and proceed",
          "Permanently cancel all future procedures for the patient"], c: 1 },
    { v: "A 52-year-old patient is scheduled for an elective umbilical hernia repair. FoCUS demonstrates normal LV size/function, no pericardial effusion, and normal RV size.",
      q: "Based on these findings, the most appropriate next step is:",
      o: ["Proceed with the planned anesthetic; findings support the existing risk assessment",
          "Delay the case for cardiology evaluation",
          "Order an emergent formal TTE",
          "Repeat the FoCUS multiple times before making a decision"], c: 0 },
    { v: "A 69-year-old patient with known COPD presents for an elective umbilical hernia repair. FoCUS shows the right ventricle appears dilated, equal to or larger than the left ventricle, with septal flattening.",
      q: "This finding most likely reflects which process, and what should the CRNA do?",
      o: ["Hypovolemia; give fluids and proceed without further discussion",
          "Possible RV strain/pulmonary hypertension; communicate the finding and consider further evaluation before proceeding",
          "A normal finding for COPD; no further action",
          "Severe aortic regurgitation; proceed as planned"], c: 1 },
    { v: "A 39-year-old trauma patient requires emergent surgery. FoCUS shows a large pericardial effusion with right ventricular diastolic collapse and a small, vigorously contracting left ventricle.",
      q: "These findings most likely indicate:",
      o: ["Volume overload; restrict fluids and consider diuresis",
          "Tamponade physiology; this is a red-flag finding that should be communicated immediately",
          "A normal finding; no further consideration needed",
          "Severe systolic heart failure; begin inotropic support immediately"], c: 1 }
  ];

  /* ============================================================
     SVG DIAGRAMS
     ============================================================ */

  // Probe-position diagram on a torso outline
  function bodyDiagram(px, py, rot, color, label) {
    return `<svg viewBox="0 0 200 220" class="diagram" style="max-width:180px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;">
      <ellipse cx="100" cy="115" rx="65" ry="92" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="100" y1="22" x2="100" y2="205" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="100" y="14" fill="#94a3b8" font-size="9" text-anchor="middle">HEAD</text>
      <g transform="translate(${px},${py}) rotate(${rot})">
        <rect x="-9" y="-5" width="18" height="10" rx="2" fill="${color}"/>
        <path d="M0,5 L-16,34 L16,34 Z" fill="${color}" opacity="0.22"/>
      </g>
      <text x="100" y="216" fill="#94a3b8" font-size="9" text-anchor="middle">${label}</text>
    </svg>`;
  }

  function viewWrap(label, sub, inner) {
    return `<div class="view-display">
      <div class="view-label">${label}</div>
      ${inner}
      <div class="view-sub">${sub}</div>
    </div>`;
  }

  const VIEWS = [
    {
      id: 'plax', name: 'Parasternal Long-Axis (PLAX)',
      probe: bodyDiagram(82, 70, 20, '#7CD4FF', 'Left sternal border, 3rd–4th ICS'),
      subText: 'LV • LA • Aortic root • MV/AV • Pericardium',
      svg: `<svg viewBox="0 0 200 200" class="diagram" style="max-width:220px;">
          <path d="M20,40 Q10,120 60,170 L160,170 Q190,120 170,40 Q100,10 20,40 Z" fill="none" stroke="#3a4a5c" stroke-width="2"/>
          <ellipse cx="120" cy="120" rx="55" ry="45" fill="none" stroke="#7CD4FF" stroke-width="2"/>
          <text x="120" y="125" fill="#7CD4FF" font-size="13" text-anchor="middle">LV</text>
          <ellipse cx="150" cy="55" rx="30" ry="25" fill="none" stroke="#FFD479" stroke-width="2"/>
          <text x="150" y="60" fill="#FFD479" font-size="12" text-anchor="middle">LA</text>
          <path d="M118,75 L150,75 L150,38" fill="none" stroke="#FFD479" stroke-width="2"/>
          <path d="M65,78 Q48,98 65,122 L97,110 Q86,90 97,75 Z" fill="none" stroke="#9fe6b0" stroke-width="2"/>
          <text x="73" y="100" fill="#9fe6b0" font-size="12" text-anchor="middle">RV</text>
          <line x1="97" y1="80" x2="118" y2="78" stroke="#fff" stroke-width="2"/>
          <text x="108" y="70" fill="#fff" font-size="10" text-anchor="middle">MV</text>
        </svg>`,
      get view() { return viewWrap('PLAX', this.subText, this.svg); },
      assesses: "LV size and global systolic function, septal and posterior wall motion, mitral and aortic valves, aortic root diameter, pericardial space (effusion)."
    },
    {
      id: 'a4c', name: 'Apical 4-Chamber (A4C)',
      probe: bodyDiagram(70, 138, -40, '#FFD479', 'Cardiac apex, 5th–6th ICS'),
      subText: 'Apex up • LV/RV size comparison • AV valves',
      svg: `<svg viewBox="0 0 200 205" class="diagram" style="max-width:220px;">
          <text x="100" y="14" fill="#fff" font-size="9" text-anchor="middle">APEX</text>
          <line x1="100" y1="20" x2="100" y2="178" stroke="#3a4a5c" stroke-width="1" stroke-dasharray="3 3"/>
          <path d="M100,28 Q160,42 154,108 Q150,158 100,164 Z" fill="none" stroke="#7CD4FF" stroke-width="2"/>
          <text x="134" y="100" fill="#7CD4FF" font-size="13" text-anchor="middle">LV</text>
          <path d="M100,28 Q44,46 54,108 Q60,150 100,164 Z" fill="none" stroke="#9fe6b0" stroke-width="2"/>
          <text x="74" y="100" fill="#9fe6b0" font-size="13" text-anchor="middle">RV</text>
          <ellipse cx="135" cy="178" rx="34" ry="20" fill="none" stroke="#FFD479" stroke-width="2"/>
          <text x="135" y="182" fill="#FFD479" font-size="11" text-anchor="middle">LA</text>
          <ellipse cx="65" cy="178" rx="34" ry="20" fill="none" stroke="#f3a6c1" stroke-width="2"/>
          <text x="65" y="182" fill="#f3a6c1" font-size="11" text-anchor="middle">RA</text>
        </svg>`,
      get view() { return viewWrap('A4C', this.subText, this.svg); },
      assesses: "Side-by-side comparison of RV vs. LV size (RV should normally appear smaller), atrioventricular valve regurgitation, global biventricular function."
    },
    {
      id: 'subcostal', name: 'Subcostal (Subxiphoid)',
      probe: bodyDiagram(100, 188, 165, '#f3a6c1', 'Below xiphoid, shallow angle toward left shoulder'),
      subText: 'Liver near field • 4 chambers • Pericardium',
      svg: `<svg viewBox="0 0 200 200" class="diagram" style="max-width:220px;">
          <rect x="10" y="8" width="180" height="36" fill="none" stroke="#cbd5e1" stroke-width="2"/>
          <text x="100" y="30" fill="#cbd5e1" font-size="10" text-anchor="middle">LIVER (near field)</text>
          <path d="M28,50 Q18,138 90,178 L130,178 Q178,138 168,50 Q100,26 28,50 Z" fill="none" stroke="#3a4a5c" stroke-width="2"/>
          <ellipse cx="122" cy="118" rx="42" ry="38" fill="none" stroke="#7CD4FF" stroke-width="2"/>
          <text x="122" y="123" fill="#7CD4FF" font-size="12" text-anchor="middle">LV</text>
          <ellipse cx="68" cy="118" rx="34" ry="38" fill="none" stroke="#9fe6b0" stroke-width="2"/>
          <text x="68" y="123" fill="#9fe6b0" font-size="12" text-anchor="middle">RV</text>
          <text x="100" y="195" fill="#9fb4c7" font-size="9" text-anchor="middle">pericardial space outlined in dark</text>
        </svg>`,
      get view() { return viewWrap('SUBCOSTAL', this.subText, this.svg); },
      assesses: "Pericardial effusion (often the best view for this), and a backup four-chamber view when parasternal/apical windows are limited."
    }
  ];

  // Views used by the virtual probe simulator (matches blueprint: PLAX, A4C, Subcostal 4CH)
  const PROBE_VIEW_IDS = ['plax', 'a4c', 'subcostal'];
  function getViewById(id) { return VIEWS.find(v => v.id === id); }
  function probeShortLabel(v) {
    if (v.id === 'subcostal') return 'SUBCOSTAL 4CH';
    const m = v.name.match(/\(([^)]+)\)/);
    return m ? m[1] : v.name;
  }

  function clampNum(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  /* ============================================================
     TRAINING MODULES
     ============================================================ */

  const MODULES = [
    {
      title: "Module 1 of 5: Why Preoperative FoCUS?",
      html: `
        <p>Perioperative hemodynamic instability — including intraoperative hypotension, hypertensive crises, and dysrhythmias — complicates a substantial proportion of noncardiac surgical procedures and is independently associated with myocardial injury, acute kidney injury, cerebrovascular events, and prolonged hospital stays.</p>
        <p>The Revised Cardiac Risk Index (RCRI) remains the most widely used preoperative cardiac risk tool. It assigns one point each for six clinical variables: high-risk surgery, ischemic heart disease, congestive heart failure, cerebrovascular disease, insulin-dependent diabetes, and creatinine &gt; 2.0 mg/dL. However, the RCRI relies <i>exclusively</i> on clinical history — it cannot detect subclinical ventricular dysfunction, valvular disease, or other structural abnormalities that meaningfully raise perioperative risk.</p>
        <p>Focused cardiac ultrasound (FoCUS) — also called point-of-care ultrasound (POCUS) or focused TTE — is a goal-directed bedside exam that takes roughly <b>8–12 minutes</b>. It is not meant to replace clinical risk tools; it adds a layer of structural information that clinical scoring alone cannot provide.</p>
        <h3 style="margin-top:14px;">FoCUS is designed to answer four targeted questions</h3>
        <ul class="content-list">
          <li>Is global left ventricular systolic function preserved or reduced?</li>
          <li>Is there a clinically significant pericardial effusion?</li>
          <li>Is right ventricular size and function normal?</li>
          <li>Is there severe valvular pathology that would change the anesthetic plan?</li>
        </ul>
        <p>The American Association of Nurse Anesthesiology (AANA) recognizes POCUS as an <b>advancing competency</b> for evidence-based nurse anesthesia practice. When a FoCUS finding raises concern, the appropriate response is not to make a definitive diagnosis — it is to <b>communicate the finding</b> and integrate it into the existing risk-assessment and decision-making process alongside the surgical and anesthesia team.</p>
      `
    },
    {
      title: "Module 2 of 5: Core FoCUS Views",
      html: `
        <p>This training focuses on three core windows. For each, note the probe position shown on the body diagram and the structures highlighted on the simulated screen.</p>
        ${VIEWS.map(v => `
          <div class="view-card">
            <h4>${v.name}</h4>
            <div class="view-grid">
              <div>${v.probe}</div>
              <div>${v.view}</div>
            </div>
            <p style="margin-bottom:0;">${v.assesses}</p>
          </div>
        `).join('')}
      `
    },
    {
      title: "Module 3 of 5: Red-Flag Findings",
      html: `
        <p>The following findings represent <b>unexpected, high-acuity results</b> on a preoperative FoCUS that should prompt the CRNA to pause, document, and communicate before proceeding with an elective case.</p>
        <div class="flag-box"><b>Severely reduced LV systolic function</b> — Visually estimated EF &lt; 30%, global hypokinesis. May indicate undiagnosed cardiomyopathy or decompensated heart failure.</div>
        <div class="flag-box"><b>Significant pericardial effusion with tamponade physiology</b> — Large effusion with right ventricular diastolic collapse.</div>
        <div class="flag-box"><b>Severe valvular pathology</b> — e.g., a heavily calcified aortic valve with markedly reduced leaflet excursion (severe AS), or a flail mitral leaflet with severe MR.</div>
        <div class="flag-box"><b>RV dilation/dysfunction</b> — RV approaching or exceeding LV size, with septal flattening. Raises concern for pulmonary hypertension or pulmonary embolism.</div>
        <p class="muted" style="margin-top:14px;">A red-flag finding does not automatically mean a case should be cancelled. It means the finding should be <b>documented and discussed</b> with the team so the risks and benefits of proceeding can be weighed with full information.</p>
      `
    },
    {
      title: "Module 4 of 5: The Decision Pathway",
      html: `
        <p>Use the pathway below to translate FoCUS findings into action. This is a communication and triage framework — not a substitute for clinical judgment.</p>
        <div class="flow-box"><b>1. Perform FoCUS</b>Integrate findings with existing history, exam, and RCRI/clinical risk assessment.</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-box go"><b>2. Findings normal or expected</b>No new structural concerns, or consistent with documented history.<br><b>→ Proceed</b> with the planned anesthetic.</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-box"><b>3. New, non-life-threatening finding</b>e.g., mild–moderate valve disease, mild LV dysfunction.<br><b>→ Document</b>, communicate to the team, correlate clinically, and consider further workup if time allows &mdash; proceeding is often still appropriate.</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-box alert"><b>4. Red-flag finding</b>Severe LV dysfunction, tamponade physiology, severe valve disease, or significant RV dysfunction.<br><b>→ Document and communicate immediately</b>; discuss the risk/benefit of proceeding vs. delaying with the team, and consider formal TTE or cardiology consultation.</div>
      `
    },
    {
      title: "Module 5 of 5: Limitations of FoCUS",
      html: `
        <p>FoCUS is a powerful adjunct, but it has real boundaries that every operator should keep in mind.</p>
        <ul class="content-list">
          <li><b>Not a substitute for comprehensive TTE.</b> A focused exam answers a narrow set of questions — it does not rule out all cardiac pathology.</li>
          <li><b>Operator- and training-dependent.</b> Image quality and interpretation accuracy depend on the skill of the person scanning.</li>
          <li><b>Cannot definitively grade valve severity.</b> Findings such as "severe-appearing AS" should prompt referral, not be used alone for surgical planning.</li>
          <li><b>Should not be used in isolation to "clear" high-risk patients.</b> A reassuring FoCUS does not override clinical concern from history or exam.</li>
          <li><b>Absence of an obvious finding does not exclude pathology.</b> Always correlate with the clinical picture and existing risk-assessment tools (e.g., RCRI).</li>
          <li><b>Communication is the deliverable.</b> The clinical value of FoCUS comes from sharing findings with the team — not from acting on them unilaterally.</li>
        </ul>
        <p style="margin-top:14px;">This concludes the training content. Next, you'll have the option to try a brief hands-on probe simulation before completing the post-training assessment.</p>
      `
    }
  ];

  /* ============================================================
     STATE
     ============================================================ */

  function genId() {
    return 'P-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  const STATE = {
    participantId: genId(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    demo: { role: null, yearsExp: null, pocusTraining: null, focusExp: null, comfortBaseline: null },
    pre: { knowledge: {}, confidence: {}, cases: {} },
    post: { knowledge: {}, confidence: {}, cases: {} },
    usability: {},
    openFeedback: ''
  };

  /* ============================================================
     FLOW / NAVIGATION
     ============================================================ */

  const FLOW = [
    { screen: 'welcome' },
    { screen: 'demo' },
    { screen: 'pretest-intro' },
    { screen: 'knowledge', phase: 'pre' },
    { screen: 'confidence', phase: 'pre' },
    { screen: 'cases', phase: 'pre' },
    { screen: 'module', index: 0 },
    { screen: 'module', index: 1 },
    { screen: 'module', index: 2 },
    { screen: 'module', index: 3 },
    { screen: 'module', index: 4 },
    { screen: 'probe' },
    { screen: 'knowledge', phase: 'post' },
    { screen: 'confidence', phase: 'post' },
    { screen: 'cases', phase: 'post' },
    { screen: 'usability' },
    { screen: 'results' }
  ];
  let currentStep = 0;

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function setProgress() {
    const pct = Math.round((currentStep / (FLOW.length - 1)) * 100);
    $('#progressBar').style.width = Math.max(pct, 2) + '%';
  }

  function updateStepIndicator(step) {
    const labels = {
      welcome: 'Welcome', demo: 'About You', 'pretest-intro': 'Pre-Assessment',
      probe: 'Probe Sim', usability: 'Feedback', results: 'Results'
    };
    let text;
    if (step.screen === 'knowledge' || step.screen === 'confidence' || step.screen === 'cases') {
      text = (step.phase === 'pre' ? 'Pre-' : 'Post-') + 'Assessment';
    } else if (step.screen === 'module') {
      text = `Training ${step.index + 1}/5`;
    } else {
      text = labels[step.screen] || '';
    }
    $('#stepIndicator').textContent = text;
  }

  function goToStep(n) {
    currentStep = Math.max(0, Math.min(FLOW.length - 1, n));
    renderStep();
  }
  function nextStep() { goToStep(currentStep + 1); }
  function prevStep() { goToStep(currentStep - 1); }

  function renderStep() {
    const step = FLOW[currentStep];
    $$('.screen').forEach(s => s.classList.remove('active'));
    $('#screen-' + step.screen).classList.add('active');
    setProgress();
    updateStepIndicator(step);

    if (step.screen !== 'probe') stopPlaxSim();

    if (step.screen === 'knowledge') renderKnowledge(step.phase);
    else if (step.screen === 'confidence') renderConfidence(step.phase);
    else if (step.screen === 'cases') renderCases(step.phase);
    else if (step.screen === 'module') renderModule(step.index);
    else if (step.screen === 'probe') initProbe();
    else if (step.screen === 'usability') renderUsability();
    else if (step.screen === 'results') renderResults();

    refreshEditableScreen();

    window.scrollTo(0, 0);
  }

  /* ============================================================
     RENDER: KNOWLEDGE
     ============================================================ */

  function renderKnowledge(phase) {
    const items = phase === 'pre' ? KNOWLEDGE_PRE : KNOWLEDGE_POST;
    const answers = STATE[phase].knowledge;
    $('#knowledgePill').textContent = (phase === 'pre' ? 'Step 2 of 6 — Pre-Assessment' : 'Step 5 of 6 — Post-Assessment');
    $('#knowledgeTitle').textContent = (phase === 'pre' ? 'Knowledge Check (Before Training)' : 'Knowledge Check (After Training)');

    const html = items.map((item, i) => `
      <div class="q-block">
        <div class="q-num">Question ${i + 1} of ${items.length}</div>
        <div class="q-text">${item.q}</div>
        ${item.o.map((opt, oi) => `
          <div class="radio-row ${answers[i] === oi ? 'selected' : ''}" data-kq="${i}" data-val="${oi}">
            <input type="radio" name="kq${i}" ${answers[i] === oi ? 'checked' : ''}>
            <span><b>${String.fromCharCode(65 + oi)}.</b> ${opt}</span>
          </div>
        `).join('')}
      </div>
    `).join('');
    $('#knowledgeContainer').innerHTML = html;
    updateKnowledgeNext(phase);
  }

  function updateKnowledgeNext(phase) {
    const items = phase === 'pre' ? KNOWLEDGE_PRE : KNOWLEDGE_POST;
    const answers = STATE[phase].knowledge;
    const complete = items.every((_, i) => answers[i] !== undefined);
    $('#btnKnowledgeNext').disabled = !complete;
  }

  /* ============================================================
     RENDER: CONFIDENCE
     ============================================================ */

  function renderConfidence(phase) {
    const answers = STATE[phase].confidence;
    $('#confidencePill').textContent = (phase === 'pre' ? 'Step 2 of 6 — Pre-Assessment' : 'Step 5 of 6 — Post-Assessment');
    $('#confidenceTitle').textContent = (phase === 'pre' ? 'Confidence Survey (Before Training)' : 'Confidence Survey (After Training)');

    const html = CONFIDENCE_ITEMS.map((stmt, i) => `
      <div class="likert">
        <div class="stmt">${i + 1}. ${stmt}</div>
        <div class="likert-scale">
          ${[1,2,3,4,5].map(v => `
            <div class="likert-opt ${answers[i] === v ? 'selected' : ''}" data-cq="${i}" data-val="${v}">
              <span class="num">${v}</span>
            </div>
          `).join('')}
        </div>
        <div class="likert-labels"><span>Strongly Disagree</span><span>Strongly Agree</span></div>
      </div>
    `).join('');
    $('#confidenceContainer').innerHTML = html;
    updateConfidenceNext(phase);
  }

  function updateConfidenceNext(phase) {
    const answers = STATE[phase].confidence;
    const complete = CONFIDENCE_ITEMS.every((_, i) => answers[i] !== undefined);
    $('#btnConfidenceNext').disabled = !complete;
  }

  /* ============================================================
     RENDER: CASES
     ============================================================ */

  function renderCases(phase) {
    const items = phase === 'pre' ? CASES_PRE : CASES_POST;
    const answers = STATE[phase].cases;
    $('#casesPill').textContent = (phase === 'pre' ? 'Step 2 of 6 — Pre-Assessment' : 'Step 5 of 6 — Post-Assessment');
    $('#casesTitle').textContent = (phase === 'pre' ? 'Case Scenarios (Before Training)' : 'Case Scenarios (After Training)');

    const html = items.map((item, i) => `
      <div class="q-block">
        <div class="q-num">Case ${i + 1} of ${items.length}</div>
        <div class="case-vignette">${item.v}</div>
        <div class="q-text">${item.q}</div>
        ${item.o.map((opt, oi) => `
          <div class="radio-row ${answers[i] === oi ? 'selected' : ''}" data-caseq="${i}" data-val="${oi}">
            <input type="radio" name="caseq${i}" ${answers[i] === oi ? 'checked' : ''}>
            <span><b>${String.fromCharCode(65 + oi)}.</b> ${opt}</span>
          </div>
        `).join('')}
      </div>
    `).join('');
    $('#casesContainer').innerHTML = html;
    updateCasesNext(phase);
  }

  function updateCasesNext(phase) {
    const items = phase === 'pre' ? CASES_PRE : CASES_POST;
    const answers = STATE[phase].cases;
    const complete = items.every((_, i) => answers[i] !== undefined);
    $('#btnCasesNext').disabled = !complete;
  }

  /* ============================================================
     RENDER: MODULES
     ============================================================ */

  function renderModule(index) {
    $('#moduleTitle').textContent = MODULES[index].title;
    $('#moduleContainer').innerHTML = MODULES[index].html;
    $('#modDots').innerHTML = MODULES.map((_, i) =>
      `<div class="mod-dot ${i === index ? 'active' : ''}"></div>`
    ).join('');
    $('#btnModuleNext').textContent = (index === MODULES.length - 1) ? 'Continue' : 'Next';
  }

  /* ============================================================
     RENDER: USABILITY
     ============================================================ */

  function renderUsability() {
    const answers = STATE.usability;
    const html = USABILITY_ITEMS.map((stmt, i) => `
      <div class="likert">
        <div class="stmt">${i + 1}. ${stmt}</div>
        <div class="likert-scale">
          ${[1,2,3,4,5].map(v => `
            <div class="likert-opt ${answers[i] === v ? 'selected' : ''}" data-uq="${i}" data-val="${v}">
              <span class="num">${v}</span>
            </div>
          `).join('')}
        </div>
        <div class="likert-labels"><span>Strongly Disagree</span><span>Strongly Agree</span></div>
      </div>
    `).join('');
    $('#usabilityContainer').innerHTML = html;
    $('#openFeedback').value = STATE.openFeedback || '';
    updateUsabilityNext();
  }

  function updateUsabilityNext() {
    const complete = USABILITY_ITEMS.every((_, i) => STATE.usability[i] !== undefined);
    $('#btnUsabilityNext').disabled = !complete;
  }

  /* ============================================================
     RENDER: RESULTS
     ============================================================ */

  function score(items, answers) {
    let correct = 0;
    items.forEach((item, i) => { if (answers[i] === item.c) correct++; });
    return { correct, total: items.length, pct: Math.round((correct / items.length) * 100) };
  }

  function avgConfidence(answers) {
    const vals = CONFIDENCE_ITEMS.map((_, i) => answers[i]).filter(v => v !== undefined);
    if (!vals.length) return 0;
    return (vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  function deltaSpan(diff, suffix) {
    if (diff > 0) return `<span class="delta-up">+${diff}${suffix}</span>`;
    if (diff < 0) return `<span class="delta-down">${diff}${suffix}</span>`;
    return `<span>0${suffix}</span>`;
  }

  function renderResults() {
    STATE.completedAt = new Date().toISOString();

    const kPre = score(KNOWLEDGE_PRE, STATE.pre.knowledge);
    const kPost = score(KNOWLEDGE_POST, STATE.post.knowledge);
    const cPre = score(CASES_PRE, STATE.pre.cases);
    const cPost = score(CASES_POST, STATE.post.cases);
    const confPre = avgConfidence(STATE.pre.confidence);
    const confPost = avgConfidence(STATE.post.confidence);

    const html = `
      <div class="results-row"><span>Knowledge score (pre)</span><span class="val">${kPre.correct}/${kPre.total} (${kPre.pct}%)</span></div>
      <div class="results-row"><span>Knowledge score (post)</span><span class="val">${kPost.correct}/${kPost.total} (${kPost.pct}%) &nbsp; ${deltaSpan(kPost.pct - kPre.pct, ' pts')}</span></div>
      <div class="results-row"><span>Case-based score (pre)</span><span class="val">${cPre.correct}/${cPre.total} (${cPre.pct}%)</span></div>
      <div class="results-row"><span>Case-based score (post)</span><span class="val">${cPost.correct}/${cPost.total} (${cPost.pct}%) &nbsp; ${deltaSpan(cPost.pct - cPre.pct, ' pts')}</span></div>
      <div class="results-row"><span>Average confidence (pre)</span><span class="val">${confPre.toFixed(1)} / 5</span></div>
      <div class="results-row"><span>Average confidence (post)</span><span class="val">${confPost.toFixed(1)} / 5 &nbsp; ${deltaSpan(Math.round((confPost - confPre) * 10) / 10, '')}</span></div>
    `;
    $('#resultsContainer').innerHTML = html;
  }

  /* ============================================================
     EXPORT
     ============================================================ */

  function downloadResults() {
    const kPre = score(KNOWLEDGE_PRE, STATE.pre.knowledge);
    const kPost = score(KNOWLEDGE_POST, STATE.post.knowledge);
    const cPre = score(CASES_PRE, STATE.pre.cases);
    const cPost = score(CASES_POST, STATE.post.cases);

    const payload = {
      participantId: STATE.participantId,
      startedAt: STATE.startedAt,
      completedAt: STATE.completedAt,
      demographics: STATE.demo,
      knowledge: {
        pre: { answers: STATE.pre.knowledge, ...kPre },
        post: { answers: STATE.post.knowledge, ...kPost }
      },
      confidence: {
        pre: STATE.pre.confidence,
        post: STATE.post.confidence,
        preAverage: avgConfidence(STATE.pre.confidence),
        postAverage: avgConfidence(STATE.post.confidence)
      },
      cases: {
        pre: { answers: STATE.pre.cases, ...cPre },
        post: { answers: STATE.post.cases, ...cPost }
      },
      usability: STATE.usability,
      openFeedback: STATE.openFeedback
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-training-${STATE.participantId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ============================================================
     EVENT WIRING
     ============================================================ */

  // Welcome / consent
  $('#consentRow').addEventListener('click', () => {
    const cb = $('#consentCheck');
    cb.checked = !cb.checked;
    $('#consentRow').classList.toggle('selected', cb.checked);
    $('#btnStart').disabled = !cb.checked;
  });
  $('#btnStart').addEventListener('click', () => { if (!$('#btnStart').disabled) nextStep(); });

  // Demographics
  function checkDemoComplete() {
    const d = STATE.demo;
    const complete = d.role && d.pocusTraining && d.focusExp && d.comfortBaseline;
    $('#btnDemoNext').disabled = !complete;
  }
  $('#btnDemoBack').addEventListener('click', prevStep);
  $('#btnDemoNext').addEventListener('click', () => { if (!$('#btnDemoNext').disabled) nextStep(); });

  // Pretest intro
  $('#btnPreIntroBack').addEventListener('click', prevStep);
  $('#btnPreIntroNext').addEventListener('click', nextStep);

  // Knowledge nav
  $('#btnKnowledgeBack').addEventListener('click', prevStep);
  $('#btnKnowledgeNext').addEventListener('click', () => { if (!$('#btnKnowledgeNext').disabled) nextStep(); });

  // Confidence nav
  $('#btnConfidenceBack').addEventListener('click', prevStep);
  $('#btnConfidenceNext').addEventListener('click', () => { if (!$('#btnConfidenceNext').disabled) nextStep(); });

  // Cases nav
  $('#btnCasesBack').addEventListener('click', prevStep);
  $('#btnCasesNext').addEventListener('click', () => { if (!$('#btnCasesNext').disabled) nextStep(); });

  // Module nav
  $('#btnModuleBack').addEventListener('click', prevStep);
  $('#btnModuleNext').addEventListener('click', nextStep);

  // Probe nav
  $('#btnProbeBack').addEventListener('click', prevStep);
  $('#btnProbeNext').addEventListener('click', nextStep);

  // Usability nav
  $('#btnUsabilityBack').addEventListener('click', prevStep);
  $('#btnUsabilityNext').addEventListener('click', () => { if (!$('#btnUsabilityNext').disabled) nextStep(); });
  $('#openFeedback').addEventListener('input', e => { STATE.openFeedback = e.target.value; });

  // Results
  $('#btnDownload').addEventListener('click', downloadResults);
  $('#btnRestart').addEventListener('click', () => {
    if (!confirm('Start over? This will clear all your responses.')) return;
    Object.assign(STATE, {
      participantId: genId(),
      startedAt: new Date().toISOString(),
      completedAt: null,
      demo: { role: null, yearsExp: null, pocusTraining: null, focusExp: null, comfortBaseline: null },
      pre: { knowledge: {}, confidence: {}, cases: {} },
      post: { knowledge: {}, confidence: {}, cases: {} },
      usability: {},
      openFeedback: ''
    });
    $$('.radio-row, .check-row, .likert-opt').forEach(el => el.classList.remove('selected'));
    $('#consentCheck').checked = false;
    $('#btnStart').disabled = true;
    goToStep(0);
  });

  // Delegated click handler for dynamically rendered options
  document.addEventListener('click', (e) => {
    // Demographics radio rows (static markup with data-name/data-value)
    const demoRow = e.target.closest('[data-name]');
    if (demoRow) {
      const name = demoRow.getAttribute('data-name');
      const value = demoRow.getAttribute('data-value');
      STATE.demo[name === 'role' ? 'role' : name] = value;
      $$(`[data-name="${name}"]`).forEach(el => el.classList.remove('selected'));
      demoRow.classList.add('selected');
      const input = demoRow.querySelector('input');
      if (input) input.checked = true;
      checkDemoComplete();
      return;
    }

    // Demographics comfort-baseline likert (static markup)
    const comfortOpt = e.target.closest('.likert-scale[data-likert="comfortBaseline"] .likert-opt');
    if (comfortOpt) {
      const val = parseInt(comfortOpt.getAttribute('data-val'), 10);
      STATE.demo.comfortBaseline = val;
      $$('.likert-scale[data-likert="comfortBaseline"] .likert-opt').forEach(el => el.classList.remove('selected'));
      comfortOpt.classList.add('selected');
      checkDemoComplete();
      return;
    }

    // Knowledge MCQ
    const kOpt = e.target.closest('[data-kq]');
    if (kOpt) {
      const phase = FLOW[currentStep].phase;
      const qi = parseInt(kOpt.getAttribute('data-kq'), 10);
      const val = parseInt(kOpt.getAttribute('data-val'), 10);
      STATE[phase].knowledge[qi] = val;
      $$(`[data-kq="${qi}"]`).forEach(el => el.classList.remove('selected'));
      kOpt.classList.add('selected');
      updateKnowledgeNext(phase);
      return;
    }

    // Confidence Likert
    const cOpt = e.target.closest('[data-cq]');
    if (cOpt) {
      const phase = FLOW[currentStep].phase;
      const qi = parseInt(cOpt.getAttribute('data-cq'), 10);
      const val = parseInt(cOpt.getAttribute('data-val'), 10);
      STATE[phase].confidence[qi] = val;
      $$(`[data-cq="${qi}"]`).forEach(el => el.classList.remove('selected'));
      cOpt.classList.add('selected');
      updateConfidenceNext(phase);
      return;
    }

    // Case MCQ
    const caseOpt = e.target.closest('[data-caseq]');
    if (caseOpt) {
      const phase = FLOW[currentStep].phase;
      const qi = parseInt(caseOpt.getAttribute('data-caseq'), 10);
      const val = parseInt(caseOpt.getAttribute('data-val'), 10);
      STATE[phase].cases[qi] = val;
      $$(`[data-caseq="${qi}"]`).forEach(el => el.classList.remove('selected'));
      caseOpt.classList.add('selected');
      updateCasesNext(phase);
      return;
    }

    // Usability Likert
    const uOpt = e.target.closest('[data-uq]');
    if (uOpt) {
      const qi = parseInt(uOpt.getAttribute('data-uq'), 10);
      const val = parseInt(uOpt.getAttribute('data-val'), 10);
      STATE.usability[qi] = val;
      $$(`[data-uq="${qi}"]`).forEach(el => el.classList.remove('selected'));
      uOpt.classList.add('selected');
      updateUsabilityNext();
      return;
    }
  });

  /* ============================================================
     ECHO LOOP ENGINE — real, CC-licensed cine loops
     Loads clips/manifest.json and crossfades the three view loops by the
     phone's blend weights. Never blanks (the weights sum to 1, so the
     nearest view always shows); off-window the image blurs and darkens
     like poor probe contact, then re-sharpens as accuracy rises.
     ============================================================ */
  const ECHO = {
    manifest: null,
    videos: {},
    opacity: { plax: 0, a4c: 0, subcostal: 0 },
    targetOp: { plax: 0, a4c: 0, subcostal: 0 },
    raf: null,
    showCaption: true,
    acc: 0
  };

  function loadEchoManifest() {
    if (ECHO.manifest) return Promise.resolve(ECHO.manifest);
    return fetch('clips/manifest.json')
      .then(r => r.json())
      .then(m => { ECHO.manifest = m; return m; })
      .catch(() => { ECHO.manifest = null; return null; });
  }

  function echoSrc(id) {
    if (ECHO.manifest && ECHO.manifest.views[id] && ECHO.manifest.views[id].src) {
      return ECHO.manifest.views[id].src;
    }
    return 'clips/' + id + '.webm';
  }

  function setupEchoVideos() {
    PROBE_VIEW_IDS.forEach(id => {
      const v = $('#echo-' + id);
      if (!v) return;
      ECHO.videos[id] = v;
      ECHO.opacity[id] = 0;
      ECHO.targetOp[id] = 0;
      const src = echoSrc(id);
      if (v.getAttribute('src') !== src) v.setAttribute('src', src);
      v.muted = true; v.loop = true; v.playsInline = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
    renderEchoCredits();
  }

  function renderEchoCredits() {
    const el = $('#echoCredits');
    if (!el || !ECHO.manifest) return;
    const lines = PROBE_VIEW_IDS
      .map(id => ECHO.manifest.views[id] && ECHO.manifest.views[id].citation)
      .filter(Boolean);
    if (lines.length) el.innerHTML = '<b>Image credits</b><br>' + lines.join('<br>');
  }

  function startEchoLoop() {
    if (ECHO.raf) return;
    const tick = () => {
      PROBE_VIEW_IDS.forEach(id => {
        const cur = ECHO.opacity[id], tgt = ECHO.targetOp[id];
        ECHO.opacity[id] = cur + (tgt - cur) * 0.18;
        const v = ECHO.videos[id];
        if (v) v.style.opacity = ECHO.opacity[id].toFixed(3);
      });
      const acc = clampNum(ECHO.acc / 100, 0, 1);
      const stack = $('#echoStack');
      if (stack) {
        stack.style.filter =
          'blur(' + ((1 - acc) * 2.2).toFixed(2) + 'px) ' +
          'brightness(' + (0.55 + 0.45 * acc).toFixed(2) + ') ' +
          'contrast(' + (0.9 + 0.2 * acc).toFixed(2) + ')';
      }
      const haze = $('#echoHaze');
      if (haze) haze.style.opacity = ((1 - acc) * 0.55).toFixed(2);
      ECHO.raf = requestAnimationFrame(tick);
    };
    ECHO.raf = requestAnimationFrame(tick);
  }

  // Kept under the old name so renderStep() can pause the sim on screen exit.
  function stopPlaxSim() {
    if (ECHO.raf) { cancelAnimationFrame(ECHO.raf); ECHO.raf = null; }
    Object.keys(ECHO.videos).forEach(id => {
      const v = ECHO.videos[id];
      if (v) { try { v.pause(); } catch (e) {} }
    });
  }

  function setEchoState(matchId, acc, locked, targetId) {
    const labelEl = $('#probeViewLabel');
    const accEl = $('#echoAcc');
    const stEl = $('#echoState');
    const subEl = $('#probeViewSub');
    const capEl = $('#echoCaption');
    const id = matchId || targetId || null;
    const view = id ? getViewById(id) : null;
    const info = (ECHO.manifest && id) ? ECHO.manifest.views[id] : null;
    if (labelEl) labelEl.textContent = view ? probeShortLabel(view) : 'SEARCHING…';
    if (accEl) accEl.textContent = acc ? (acc + '%') : '';
    if (stEl) {
      stEl.textContent = locked ? 'LOCKED' : (acc >= 60 ? 'ACQUIRING' : 'SEARCHING');
      stEl.className = 'echo-state' + (locked ? ' locked' : '');
    }
    if (subEl) subEl.textContent = view ? ('Target: ' + view.name) : 'Move your phone to a probe position.';
    if (capEl) {
      if (ECHO.showCaption && info && info.structures) { capEl.hidden = false; capEl.textContent = info.structures; }
      else capEl.hidden = true;
    }
  }

  /* ============================================================
     PROBE SIMULATOR
     ============================================================ */
  const PROBE = {
    peer: null,
    conn: null,
    hostId: null,
    connected: false,
    lastViewId: undefined,
    toggleBound: false
  };

  function setProbeStatus(state, text) {
    const dot = $('#probeStatusDot');
    const label = $('#probeStatusText');
    if (dot) dot.className = 'status-dot' + (state ? ' ' + state : '');
    if (label) label.textContent = text;
  }

  function buildProbeUrl(hostId) {
    const base = location.href.replace(/[^/]*$/, '');
    return base + 'probe.html?host=' + encodeURIComponent(hostId);
  }

  function renderQr(url) {
    const wrap = $('#qrcode');
    if (!wrap || typeof qrcode === 'undefined') return;
    try {
      const qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      wrap.innerHTML = qr.createSvgTag({ scalable: true });
    } catch (e) {
      wrap.innerHTML = '';
    }
  }

  function renderProbeTargets(activeId) {
    const row = $('#probeTargetRow');
    if (!row) return;
    row.innerHTML = PROBE_VIEW_IDS.map(id => {
      const v = getViewById(id);
      const cls = 'probe-target' + (id === activeId ? ' matched' : '');
      return `<div class="${cls}">${probeShortLabel(v)}</div>`;
    }).join('');
  }

  // updateProbeView() removed — the echo engine handles the display (see setEchoState).

  function handleProbeData(data) {
    if (!data || typeof data !== 'object') return;
    if (data.type === 'calibrating') {
      setProbeStatus('busy', `Calibrating phone — pose ${data.step} of ${data.total}…`);
    } else if (data.type === 'ready') {
      PROBE.connected = true;
      setProbeStatus('live', 'Connected — hold your phone like a probe');
      const connectCard = $('#probeConnectCard');
      const scanCard = $('#probeScanCard');
      if (connectCard) connectCard.style.display = 'none';
      if (scanCard) scanCard.style.display = '';
      renderProbeTargets(null);
      setupEchoVideos();
      startEchoLoop();
      setEchoState(null, 0, false, null);
    } else if (data.type === 'pose') {
      let sum = 0;
      PROBE_VIEW_IDS.forEach(id => { sum += (data.blend && data.blend[id]) || 0; });
      PROBE_VIEW_IDS.forEach(id => {
        let w = (data.blend && data.blend[id]) || 0;
        if (sum > 0) w = w / sum;
        ECHO.targetOp[id] = w;
      });
      ECHO.acc = (typeof data.accuracy === 'number') ? data.accuracy : 0;
      const locked = !!data.matchId && ECHO.acc >= 90;
      setEchoState(data.matchId || null, ECHO.acc, locked, data.target || null);
      renderProbeTargets(locked ? data.matchId : (data.target || null));
    }
  }

  function createProbePeer(attempt) {
    attempt = attempt || 1;
    if (attempt > 5) {
      setProbeStatus('error', 'Could not start the connection. Check your internet connection, or skip this step.');
      return;
    }
    if (typeof Peer === 'undefined') {
      setProbeStatus('error', 'Could not load the connection library. Check your internet connection, or skip this step.');
      return;
    }
    setProbeStatus('busy', 'Starting connection…');
    const id = 'focus-' + Math.random().toString(36).slice(2, 8);
    const peer = new Peer(id, { debug: 0 });
    PROBE.peer = peer;

    peer.on('open', hostId => {
      PROBE.hostId = hostId;
      setProbeStatus('busy', 'Ready — scan the code with your phone');
      const urlEl = $('#probeUrl');
      const url = buildProbeUrl(hostId);
      if (urlEl) urlEl.textContent = url;
      renderQr(url);
    });

    peer.on('connection', conn => {
      PROBE.conn = conn;
      conn.on('open', () => {
        setProbeStatus('busy', 'Phone connected — calibrating…');
      });
      conn.on('data', handleProbeData);
      conn.on('close', () => {
        PROBE.conn = null;
        PROBE.connected = false;
        const connectCard = $('#probeConnectCard');
        const scanCard = $('#probeScanCard');
        if (connectCard) connectCard.style.display = '';
        if (scanCard) scanCard.style.display = 'none';
        setProbeStatus('busy', 'Phone disconnected — scan the code again to reconnect');
      });
    });

    peer.on('error', err => {
      if (err && err.type === 'unavailable-id') {
        peer.destroy();
        createProbePeer(attempt + 1);
        return;
      }
      if (err && err.type === 'peer-unavailable') return;
      setProbeStatus('error', 'Connection error. You can skip this step and continue.');
    });

    peer.on('disconnected', () => {
      if (peer.destroyed) return;
      peer.reconnect();
    });
  }

  function initProbe() {
    renderProbeTargets(null);
    loadEchoManifest().then(renderEchoCredits);
    const toggle = $('#probeLabelToggle');
    if (toggle && !PROBE.toggleBound) {
      PROBE.toggleBound = true;
      ECHO.showCaption = toggle.checked;
      toggle.addEventListener('change', () => { ECHO.showCaption = toggle.checked; });
    }
    if (PROBE.peer && !PROBE.peer.destroyed) return;
    createProbePeer();
  }

  /* ============================================================
     DEV TOOLS — step jumper + inline content editing
     Remove this whole section (and #devBar in index.html) before
     distributing the site, or just leave DEV_MODE = false.
     ============================================================ */
  const EDIT_OVERRIDES_KEY = 'focusDevContentOverrides_v1';
  let EDIT_MODE = false;

  function loadOverrides() {
    try {
      return JSON.parse(localStorage.getItem(EDIT_OVERRIDES_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveOverrides(obj) {
    try {
      localStorage.setItem(EDIT_OVERRIDES_KEY, JSON.stringify(obj));
    } catch (e) { /* ignore (private browsing, quota, etc.) */ }
  }

  function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    return (h >>> 0).toString(36);
  }

  const EDIT_INLINE_TAGS = new Set(['B', 'STRONG', 'EM', 'I', 'SPAN', 'BR', 'SMALL', 'SUP', 'SUB', 'U', 'CODE']);
  const EDIT_SKIP_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTION', 'LABEL', 'SCRIPT', 'STYLE', 'SVG', 'CANVAS']);

  function isLeafishEditable(el) {
    if (!el || !el.tagName) return false;
    if (EDIT_SKIP_TAGS.has(el.tagName)) return false;
    if (!el.textContent || !el.textContent.trim()) return false;
    for (const child of el.children) {
      if (!EDIT_INLINE_TAGS.has(child.tagName)) return false;
    }
    return true;
  }

  // Finds the "outermost" leaf-ish text elements within root — i.e. elements
  // whose visible content is just text (plus inline formatting) with no
  // nested block-level structure, and whose parent doesn't already qualify.
  function getEditableElements(root) {
    const out = [];
    root.querySelectorAll('*').forEach(el => {
      if (el.closest('#devBar')) return;
      if (!isLeafishEditable(el)) return;
      const parent = el.parentElement;
      if (parent && parent !== root && isLeafishEditable(parent)) return;
      out.push(el);
    });
    return out;
  }

  // Tags editable elements with stable keys (based on original content) and
  // applies any saved overrides. Returns the list of editable elements.
  function applyContentOverrides(screenEl) {
    if (!screenEl) return [];
    const overrides = loadOverrides();
    const editable = getEditableElements(screenEl);
    editable.forEach((el, idx) => {
      if (!el.hasAttribute('data-orig-text')) {
        el.setAttribute('data-orig-text', el.textContent.trim().slice(0, 80));
      }
      const key = screenEl.id + '#' + idx + '#' + simpleHash(el.getAttribute('data-orig-text'));
      el.setAttribute('data-edit-key', key);
      if (Object.prototype.hasOwnProperty.call(overrides, key) && el.innerHTML !== overrides[key]) {
        el.innerHTML = overrides[key];
      }
    });
    return editable;
  }

  // Re-applies overrides for the active screen and (re)marks its elements
  // editable if Edit Mode is on. Call after every render.
  function refreshEditableScreen() {
    if (!DEV_MODE) return;
    const screenEl = $('.screen.active');
    if (!screenEl) return;
    const editable = applyContentOverrides(screenEl);
    editable.forEach(el => {
      if (EDIT_MODE) {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('dev-editable');
      } else {
        el.removeAttribute('contenteditable');
        el.classList.remove('dev-editable');
      }
    });
  }

  function setEditMode(on) {
    EDIT_MODE = !!on;
    refreshEditableScreen();
  }

  function flowStepLabel(step, i) {
    const labels = {
      welcome: 'Welcome', demo: 'About You', 'pretest-intro': 'Pre-Assessment Intro',
      probe: 'Virtual Probe Simulation', usability: 'Feedback / Usability', results: 'Results'
    };
    let text;
    if (step.screen === 'knowledge' || step.screen === 'confidence' || step.screen === 'cases') {
      const names = { knowledge: 'Knowledge Test', confidence: 'Confidence Survey', cases: 'Case Vignettes' };
      text = (step.phase === 'pre' ? 'Pre' : 'Post') + ' – ' + names[step.screen];
    } else if (step.screen === 'module') {
      const m = MODULES[step.index];
      text = m ? m.title.replace(/^Module \d+ of \d+: /, `Module ${step.index + 1}: `) : `Training Module ${step.index + 1}`;
    } else {
      text = labels[step.screen] || step.screen;
    }
    return (i + 1) + '. ' + text;
  }

  function initDevTools() {
    if (!DEV_MODE) return;
    const bar = $('#devBar');
    const panel = $('#devBarPanel');
    const toggleBtn = $('#devBarToggle');
    const jump = $('#devStepJump');
    const editToggle = $('#devEditToggle');
    const exportBtn = $('#devExportBtn');
    const clearBtn = $('#devClearBtn');
    if (!bar || !panel || !toggleBtn || !jump) return;

    jump.innerHTML = FLOW.map((step, i) =>
      `<option value="${i}">${flowStepLabel(step, i)}</option>`
    ).join('');

    toggleBtn.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) jump.value = String(currentStep);
    });

    jump.addEventListener('change', () => {
      goToStep(parseInt(jump.value, 10));
    });

    if (editToggle) {
      editToggle.addEventListener('change', () => setEditMode(editToggle.checked));
    }

    // Save edits as they're typed
    document.addEventListener('input', e => {
      const el = e.target;
      if (!el || el.getAttribute('contenteditable') !== 'true') return;
      const key = el.getAttribute('data-edit-key');
      if (!key) return;
      const overrides = loadOverrides();
      overrides[key] = el.innerHTML;
      saveOverrides(overrides);
    }, true);

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const json = JSON.stringify(loadOverrides(), null, 2);
        const finish = ok => {
          exportBtn.textContent = ok ? 'Copied!' : 'Copy failed';
          setTimeout(() => { exportBtn.textContent = 'Copy edits'; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(json).then(() => finish(true), () => finish(false));
        } else {
          finish(false);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (!confirm('Clear all saved page edits in this browser?')) return;
        saveOverrides({});
        renderStep();
      });
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  renderStep();
  initDevTools();

})();

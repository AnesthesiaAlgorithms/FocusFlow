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
  // Case-based scenarios - Form A (pre-training). Distractors are all clinically
  // plausible (no give-aways). Items marked "image-ready" are written so a real
  // TTE still/loop can be dropped in later via an `img:` field (see caseMediaHTML).
  const CASES_PRE = [
    { v: "A 74-year-old is scheduled for an elective total hip arthroplasty and reports worsening fatigue and exertional dyspnea over 3 months. Preoperative FoCUS shows a heavily calcified aortic valve with severely reduced leaflet excursion and a hyperdynamic, normal-sized LV. There is no echocardiogram on file.",
      q: "What is the most appropriate next step?",
      o: ["Proceed; FoCUS is only a qualitative screen and cannot diagnose valve disease, so the finding can be set aside",
          "Document the finding and discuss with the team; obtain formal echocardiography and reassess the risk/benefit before this elective case",
          "Proceed with an arterial line and vasopressors available — an isolated calcified valve does not justify delaying surgery",
          "Attribute the fatigue to deconditioning and proceed; a calcified valve is an expected age-related change"], c: 1 },
    { v: "A 58-year-old with good exercise tolerance and no cardiac symptoms is scheduled for an elective laparoscopic cholecystectomy. FoCUS shows normal LV size and function, no pericardial effusion, normal RV size, and an IVC with normal respiratory variation.",
      q: "Should a formal transthoracic echocardiogram (TTE) be obtained before proceeding?",
      o: ["Yes — a formal TTE should follow every FoCUS exam to confirm the findings",
          "No — with a reassuring FoCUS and no other cardiac indication, proceed; FoCUS supports the existing risk assessment but does not replace formal echo if symptoms later develop",
          "Yes — FoCUS cannot evaluate systolic function, so a confirmatory TTE is required before any anesthetic",
          "No — a normal FoCUS definitively rules out all valvular and structural heart disease"], c: 1 },
    { v: "A 66-year-old with COPD presents for an elective inguinal hernia repair. On the apical 4-chamber view the right ventricle appears equal to or larger than the left ventricle, with flattening of the interventricular septum.",
      q: "This finding is most consistent with which process, and what is the most appropriate action?",
      o: ["Right ventricular pressure/volume overload (e.g., pulmonary hypertension or acute PE); communicate the finding and consider further evaluation before proceeding",
          "Left ventricular underfilling from hypovolemia — the RV only looks large by comparison; give fluids and proceed",
          "Elevated left-heart filling pressures from LV failure; diurese and proceed",
          "An off-axis, foreshortened A4C distorting the RV:LV ratio; re-center the view and disregard the finding"], c: 0 },
    { v: "A 45-year-old trauma patient who has received minimal fluids requires urgent surgery. FoCUS shows a small, vigorously contracting (hyperdynamic) left ventricle and an IVC that nearly fully collapses with inspiration.",
      q: "These findings are most consistent with — and the best response is:",
      o: ["Hypovolemia / volume responsiveness; incorporate volume resuscitation into the anesthetic plan and seek the source",
          "Normal euvolemic findings; a small hyperdynamic LV is expected in a young patient and needs no action",
          "Cardiogenic shock from LV failure; begin inotropes before induction",
          "Early tamponade; the small LV reflects external compression — restrict fluids"], c: 0 },
    { v: "A 70-year-old scheduled for an elective ventral hernia repair reports two months of worsening exertional dyspnea. FoCUS suggests at least moderately reduced LV systolic function with global hypokinesis. No prior echocardiogram is on file.",
      q: "For this elective procedure, the most appropriate next step is:",
      o: ["Proceed; visual ('eyeball') EF estimation on FoCUS is too unreliable to change management",
          "Document and discuss with the team; obtain formal echocardiography and optimize the patient before this elective case",
          "Proceed with inotropes prepared — reduced function alone does not warrant delaying surgery",
          "Cancel and refer directly for coronary angiography"], c: 1 }
  ];

  // Case-based scenarios - Form B (post-training, parallel form). Same constructs
  // as Form A in the same order; correct answers sit in different positions.
  const CASES_POST = [
    { v: "A 71-year-old scheduled for an elective total knee arthroplasty reports several months of exertional dyspnea. FoCUS shows a thickened, heavily calcified aortic valve with markedly reduced leaflet motion and a hyperdynamic LV. No prior echocardiogram is on file.",
      q: "What is the most appropriate next step?",
      o: ["Document the finding and discuss with the team; obtain formal echocardiography and reassess before this elective case",
          "Proceed; FoCUS cannot diagnose valve disease, so the appearance can be disregarded",
          "Proceed with invasive arterial monitoring and vasopressors ready — the valve finding alone does not warrant delay",
          "Attribute the dyspnea to age and proceed without further evaluation"], c: 0 },
    { v: "A 52-year-old with no cardiac symptoms and good functional capacity is scheduled for an elective umbilical hernia repair. FoCUS shows normal LV size/function, no pericardial effusion, normal RV size, and normal IVC respiratory variation.",
      q: "Should a formal TTE be obtained before proceeding?",
      o: ["No — a normal FoCUS conclusively excludes all valvular and structural heart disease",
          "Yes — FoCUS does not assess systolic function, so a confirmatory TTE is mandatory",
          "No — with a reassuring FoCUS and no other indication, proceed; FoCUS supports the existing risk assessment but does not replace formal echo if symptoms arise",
          "Yes — every FoCUS should be confirmed with a formal TTE before anesthesia"], c: 2 },
    { v: "A 69-year-old with known COPD presents for an elective umbilical hernia repair. On the apical 4-chamber view the right ventricle appears dilated — equal to or larger than the LV — with septal flattening.",
      q: "This most likely reflects which process, and what should the CRNA do?",
      o: ["An off-axis A4C exaggerating the RV; re-center the view and disregard the finding",
          "Right ventricular strain / pulmonary hypertension (or acute PE); communicate the finding and consider further evaluation before proceeding",
          "Hypovolemia with LV underfilling; administer fluids and proceed",
          "Left ventricular failure with elevated filling pressures; proceed after diuresis"], c: 1 },
    { v: "A 39-year-old trauma patient who has had minimal resuscitation requires urgent surgery. FoCUS shows a small, hyperdynamic LV and an IVC that collapses almost completely with inspiration.",
      q: "These findings are most consistent with — and the best response is:",
      o: ["Cardiogenic shock; start inotropes before induction",
          "Early tamponade; restrict fluids",
          "Normal euvolemic findings requiring no action",
          "Hypovolemia / volume responsiveness; plan for volume resuscitation and identify the source"], c: 3 },
    { v: "A 68-year-old scheduled for an elective ventral hernia repair reports several weeks of worsening dyspnea on exertion. FoCUS suggests at least moderately reduced LV systolic function with global hypokinesis; no prior echocardiogram is available.",
      q: "For this elective procedure, the most appropriate next step is:",
      o: ["Cancel and refer directly for coronary angiography",
          "Proceed with inotropes available — reduced function alone does not justify delay",
          "Document and discuss with the team; obtain formal echocardiography and optimize before this elective case",
          "Proceed; qualitative FoCUS EF is too unreliable to act on"], c: 2 }
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

  // Real, CC-licensed cine loop for a view (webm + mp4 source for cross-browser
  // playback, incl. Safari/iOS). Autoplays muted + looped wherever it's shown.
  function echoLoopHTML(id, label, sub) {
    return `<div class="view-display">
      <div class="view-label">${label}</div>
      <video class="echo-loop" autoplay muted loop playsinline preload="metadata">
        <source src="clips/${id}.webm" type="video/webm">
        <source src="clips/${id}.mp4" type="video/mp4">
      </video>
      <div class="view-sub">${sub}</div>
    </div>`;
  }

  // Videos inserted via innerHTML don't honor the autoplay attribute, so kick
  // them off explicitly (muted -> allowed to autoplay).
  function playEchoLoops(root) {
    (root || document).querySelectorAll('video.echo-loop').forEach(v => {
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
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
      get view() { return echoLoopHTML('plax', 'PLAX', this.subText); },
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
      get view() { return echoLoopHTML('a4c', 'A4C', this.subText); },
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
      get view() { return echoLoopHTML('subcostal', 'SUBCOSTAL', this.subText); },
      assesses: "Pericardial effusion (often the best view for this), and a backup four-chamber view when parasternal/apical windows are limited."
    }
  ];

  // Views used by the virtual probe simulator (matches blueprint: PLAX, A4C, Subcostal 4CH)
  const PROBE_VIEW_IDS = ['plax', 'a4c', 'subcostal'];

  // Where to place the probe for each window (shown in the clickable view explorer).
  const VIEW_PLACEMENT = {
    plax: {
      where: "Left of the breastbone, in the 3rd–4th intercostal space (rib gap), with the patient supine or slightly left-side down.",
      marker: "Probe marker toward the patient's RIGHT shoulder (~10–11 o'clock)."
    },
    a4c: {
      where: "At the cardiac apex — lower-left chest, around the 5th–6th intercostal space near the nipple line (where you feel the strongest heartbeat).",
      marker: "Marker toward the patient's LEFT (~2–3 o'clock); aim the beam up toward the right shoulder."
    },
    subcostal: {
      where: "Just below the tip of the breastbone (subxiphoid), probe laid nearly FLAT against the upper abdomen.",
      marker: "Marker toward the patient's LEFT; angle the beam up under the ribs toward the heart, using the liver as a window."
    }
  };

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
        <p>This training focuses on three core windows. <b>Tap a view below</b> to see exactly where to place the probe and the real echo it produces.</p>
        <div class="ve-tabs" id="veTabs">
          ${VIEWS.map((v, i) => `<button class="ve-tab${i === 0 ? ' active' : ''}" data-ve="${v.id}">${probeShortLabel(v)}</button>`).join('')}
        </div>
        <div id="veContent"></div>
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

  // After the droplet is deployed, set this to the server address, e.g.
  // 'https://203-0-113-45.sslip.io'. When set, results upload AUTOMATICALLY on
  // completion (no button). Left '' it falls back to a manual download.
  const FOCUSFLOW_SERVER = 'https://142-93-192-209.sslip.io';

  const STATE = {
    participantId: genId(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    submitted: false,
    participantNumber: null,
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

  // Optional echo image/loop for a case scenario. To attach one, add to any
  // CASES_PRE/CASES_POST item:  img: 'clips/case_rv.jpg'  (or a .webm/.mp4 loop),
  // and optionally  imgcap: 'Apical 4-chamber'.
  function caseMediaHTML(item) {
    const src = item.img;
    const cap = item.imgcap ? `<figcaption class="case-media-cap">${item.imgcap}</figcaption>` : '';
    const media = /\.(webm|mp4|ogv)$/i.test(src)
      ? `<video class="case-media-el" autoplay muted loop playsinline preload="metadata"><source src="${src}"></video>`
      : `<img class="case-media-el" src="${src}" alt="Echocardiography image for this case scenario">`;
    return `<figure class="case-media">${media}${cap}</figure>`;
  }

  function renderCases(phase) {
    const items = phase === 'pre' ? CASES_PRE : CASES_POST;
    const answers = STATE[phase].cases;
    $('#casesPill').textContent = (phase === 'pre' ? 'Step 2 of 6 — Pre-Assessment' : 'Step 5 of 6 — Post-Assessment');
    $('#casesTitle').textContent = (phase === 'pre' ? 'Case Scenarios (Before Training)' : 'Case Scenarios (After Training)');

    const html = items.map((item, i) => `
      <div class="q-block">
        <div class="q-num">Case ${i + 1} of ${items.length}</div>
        <div class="case-vignette">${item.v}</div>
        ${item.img ? caseMediaHTML(item) : ''}
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
    $('#casesContainer').querySelectorAll('video').forEach(v => {
      v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {});
    });
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

  let currentVeView = 'plax';
  function renderViewExplorer(id) {
    const host = $('#veContent');
    if (!host) return;
    const v = getViewById(id);
    const p = VIEW_PLACEMENT[id] || {};
    currentVeView = id;
    $$('.ve-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-ve') === id));
    host.innerHTML = `
      <div class="view-card" style="margin-bottom:0;">
        <h4>${v.name}</h4>
        <div class="ve-place">
          <div><span class="ve-pin">📍 Where</span> ${p.where || ''}</div>
          <div><span class="ve-pin">↗ Marker</span> ${p.marker || ''}</div>
        </div>
        <div class="view-grid">
          <div>${v.probe}</div>
          <div>${v.view}</div>
        </div>
        <p style="margin-bottom:0;"><b>What it shows:</b> ${v.assesses}</p>
      </div>`;
    playEchoLoops(host);
  }

  function renderModule(index) {
    $('#moduleTitle').textContent = MODULES[index].title;
    $('#moduleContainer').innerHTML = MODULES[index].html;
    playEchoLoops($('#moduleContainer'));
    if ($('#veContent')) renderViewExplorer(currentVeView);  // clickable view explorer
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

  // One rationale per construct; CASES_PRE and CASES_POST test the same
  // construct at the same index, so the review (post form) reuses these.
  const CASE_RATIONALES = [
    "Symptomatic severe aortic stenosis (heavily calcified valve, reduced leaflet excursion, exertional symptoms) found on a screening FoCUS is a red flag before an elective case. FoCUS does not grade stenosis severity, so the correct step is to document, communicate, and obtain formal echocardiography to reassess risk — not to disregard it or rely on monitoring alone.",
    "A reassuring FoCUS in a patient with no symptoms and no other cardiac indication supports proceeding — a formal TTE is not required after every FoCUS. The nuance: FoCUS supports but does not replace formal echo, and it does not 'rule out all structural disease.' It does give a qualitative look at systolic function.",
    "A right ventricle equal to or larger than the LV with septal flattening reflects RV pressure/volume overload — chronic pulmonary hypertension or acute strain such as PE — not LV failure or simple hypovolemia. An off-axis A4C can distort the ratio, but a reproducible finding should be communicated and evaluated before proceeding.",
    "A small, hyperdynamic LV with a near-fully collapsing IVC indicates hypovolemia / volume responsiveness, especially in a trauma patient with minimal resuscitation. The plan should incorporate volume resuscitation and a search for the source — not fluid restriction, inotropes, or assuming the picture is normal.",
    "A new, symptomatic reduction in LV systolic function with no prior echo warrants formal evaluation and optimization before an elective procedure. FoCUS EF is qualitative, but a symptomatic finding should prompt workup — not be dismissed as unreliable, and proceeding straight to angiography is premature before echocardiography."
  ];

  // One rationale per knowledge construct (KNOWLEDGE_PRE/POST share the order).
  const KNOWLEDGE_RATIONALES = [
    "FoCUS is a goal-directed, time-limited exam that answers a few specific questions relevant to the anesthetic — it does not replace comprehensive echocardiography or grade disease severity.",
    "A focused preoperative cardiac ultrasound is meant to be brief — on the order of 8–12 minutes — which is what distinguishes it from a complete study.",
    "The RCRI is based on history and comorbidities; it does not detect subclinical structural disease such as valvular pathology or LV dysfunction — a gap that FoCUS can help fill.",
    "The parasternal long-axis (PLAX) window shows LV size and function, the mitral and aortic valves, the aortic root, and the pericardial space.",
    "An RV that appears equal to or larger than the LV (often with septal flattening) suggests RV dilation/dysfunction — concerning for pulmonary hypertension or acute PE — not a normal variant, aortic stenosis, or hypovolemia.",
    "A large pericardial effusion with right ventricular diastolic collapse indicates tamponade physiology — a red-flag finding that warrants prompt communication.",
    "Of the options, only a new, large pericardial effusion with tamponade signs is a high-acuity red flag; mild/trace findings and normal or hyperdynamic function are not.",
    "The subcostal (subxiphoid) view is excellent for detecting pericardial effusion and serves as a backup four-chamber view when parasternal/apical windows are limited.",
    "A heavily calcified aortic valve with markedly reduced leaflet excursion suggests significant aortic stenosis; the correct response is to document and communicate for possible further cardiac evaluation — not to ignore it or cancel care.",
    "FoCUS is a screening adjunct to existing clinical risk assessment that flags findings needing further workup — it is not a replacement for cardiology evaluation.",
    "Visually severe LV dysfunction (estimated EF <30%) should be communicated and prompt consideration of further evaluation before elective surgery — not disregarded or managed by simply changing drug doses.",
    "The AANA describes POCUS, including FoCUS, as an advancing competency for evidence-based nurse anesthesia practice."
  ];

  // Generic review block: marks each item correct/incorrect, shows the best
  // answer and a one-line rationale. Used for both the case and knowledge reviews.
  function reviewItemsHTML(items, answers, rationales, label) {
    return items.map((item, i) => {
      const ans = answers[i];
      const got = (ans === item.c);
      const userLine = (typeof ans === 'number')
        ? `${String.fromCharCode(65 + ans)}. ${item.o[ans]}`
        : '(no answer recorded)';
      const correctLine = `${String.fromCharCode(65 + item.c)}. ${item.o[item.c]}`;
      return `
        <div class="review-item">
          <div class="review-q"><b>${label} ${i + 1}.</b> ${item.q}</div>
          <div class="review-ans ${got ? 'ok' : 'no'}">${got ? '✓ Correct' : '✗ Your answer: ' + userLine}</div>
          ${got ? '' : `<div class="review-correct">Best answer: ${correctLine}</div>`}
          <div class="review-why"><b>Why:</b> ${rationales[i]}</div>
        </div>`;
    }).join('');
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
      <details class="review-block">
        <summary>Review the case answers &amp; rationale</summary>
        <p class="muted" style="margin-top:8px;">Shown only here, after completion, so it does not affect your scores. Based on the post-training scenarios.</p>
        ${reviewItemsHTML(CASES_POST, STATE.post.cases, CASE_RATIONALES, 'Case')}
      </details>
      <details class="review-block">
        <summary>Review the knowledge answers &amp; rationale</summary>
        <p class="muted" style="margin-top:8px;">Based on the post-training knowledge questions.</p>
        ${reviewItemsHTML(KNOWLEDGE_POST, STATE.post.knowledge, KNOWLEDGE_RATIONALES, 'Question')}
      </details>
    `;
    $('#resultsContainer').innerHTML = html;
    submitResults();
  }

  /* ============================================================
     EXPORT
     ============================================================ */

  function buildPayload() {
    const kPre = score(KNOWLEDGE_PRE, STATE.pre.knowledge);
    const kPost = score(KNOWLEDGE_POST, STATE.post.knowledge);
    const cPre = score(CASES_PRE, STATE.pre.cases);
    const cPost = score(CASES_POST, STATE.post.cases);
    return {
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
  }

  // Manual download — kept only as a fallback if auto-upload can't reach the server.
  function downloadResults() {
    const blob = new Blob([JSON.stringify(buildPayload(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-training-${STATE.participantId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Auto-upload on completion — no button, no manual step. Runs once.
  function submitResults() {
    if (STATE.submitted) return;
    STATE.submitted = true;
    const statusEl = $('#submitStatus');
    const fallbackBtn = $('#btnDownload');
    const showFallback = (msg) => {
      if (statusEl) statusEl.innerHTML = `<p class="muted">${msg}</p>`;
      if (fallbackBtn) fallbackBtn.style.display = '';
    };

    if (!FOCUSFLOW_SERVER) {
      showFallback('Tap below to save your results file and share it with the project lead.');
      return;
    }
    if (statusEl) statusEl.innerHTML = '<p>Submitting your responses&hellip;</p>';

    const attempt = (n) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      fetch(FOCUSFLOW_SERVER + '/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
        signal: ctrl.signal
      })
        .then(r => r.json().then(d => ({ ok: r.ok, status: r.status, d })))
        .then(({ ok, status, d }) => {
          clearTimeout(timer);
          if (ok && d && typeof d.participantNumber === 'number') {
            STATE.participantNumber = d.participantNumber;
            if (statusEl) statusEl.innerHTML =
              '<p style="font-weight:600;color:var(--green);">&#10003; Your responses have been submitted automatically &mdash; thank you.</p>' +
              '<p>Your participant number is <b style="font-size:1.35rem;color:var(--navy);">' + d.participantNumber + '</b>.</p>' +
              '<p class="muted">You\'re all done. You may close this page.</p>';
          } else if (status === 403) {
            if (statusEl) statusEl.innerHTML = '<p style="color:var(--red);font-weight:600;">' +
              ((d && d.message) || 'This study has reached its participant limit and is now closed.') + '</p>';
          } else {
            throw new Error('unexpected response');
          }
        })
        .catch(() => {
          clearTimeout(timer);
          if (n < 3) { setTimeout(() => attempt(n + 1), 1500 * n); }
          else { showFallback('We couldn\'t upload automatically. Please tap below to save your results and send the file to the project lead.'); }
        });
    };
    attempt(1);
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
  // Clickable view explorer tabs (Module 2)
  document.addEventListener('click', e => {
    const tab = e.target.closest && e.target.closest('.ve-tab');
    if (tab && tab.getAttribute('data-ve')) renderViewExplorer(tab.getAttribute('data-ve'));
  });

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
      submitted: false,
      participantNumber: null,
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
    layers: {},        // view id -> array of <video> (one per sweep clip)
    op: {},            // "id#idx" -> current opacity
    targetOp: {},      // "id#idx" -> target opacity
    built: false,
    raf: null,
    showCaption: true,
    acc: 0
  };
  const FAN_RANGE = 12;  // degrees of fan/tilt that span a view's full clip sweep (lower = more sensitive slide)

  function loadEchoManifest() {
    if (ECHO.manifest) return Promise.resolve(ECHO.manifest);
    // cache-bust the tiny manifest so clip/citation updates always take effect
    return fetch('clips/manifest.json?v=' + Date.now())
      .then(r => r.json())
      .then(m => { ECHO.manifest = m; return m; })
      .catch(() => { ECHO.manifest = null; return null; });
  }

  function viewSweep(id) {
    const v = ECHO.manifest && ECHO.manifest.views[id];
    if (v && Array.isArray(v.sweep) && v.sweep.length) return v.sweep;
    return [(v && v.src) || ('clips/' + id + '.webm')];
  }
  function viewOptimal(id) {
    const v = ECHO.manifest && ECHO.manifest.views[id];
    const N = viewSweep(id).length;
    return (v && typeof v.optimalIndex === 'number') ? v.optimalIndex : (N - 1) / 2;
  }

  // One <video> per sweep clip, so fanning the probe crossfades smoothly through
  // the real clips of that window (the "slide" that trains fine dexterity).
  function buildEchoLayers() {
    if (ECHO.built) return;
    const stack = $('#echoStack');
    if (!stack) return;
    const haze = $('#echoHaze');
    PROBE_VIEW_IDS.forEach(id => {
      ECHO.layers[id] = viewSweep(id).map((src, i) => {
        const v = document.createElement('video');
        v.className = 'echo-layer';
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
        v.setAttribute('playsinline', '');
        v.innerHTML = '<source src="' + src + '" type="video/webm">' +
                      '<source src="' + src.replace(/\.webm$/, '.mp4') + '" type="video/mp4">';
        v.style.opacity = '0';
        ECHO.op[id + '#' + i] = 0;
        ECHO.targetOp[id + '#' + i] = 0;
        stack.insertBefore(v, haze || null);
        return v;
      });
    });
    ECHO.built = true;
  }

  function setupEchoVideos() {
    // Ensure the manifest (with sweep arrays) is loaded BEFORE building layers,
    // so we build all the sweep clips rather than a single-clip fallback.
    return loadEchoManifest().then(function () { buildEchoLayers(); renderEchoCredits(); });
  }

  function renderEchoCredits() {
    const el = $('#echoCredits');
    if (!el || !ECHO.manifest) return;
    const lines = PROBE_VIEW_IDS
      .map(id => ECHO.manifest.views[id] && ECHO.manifest.views[id].citation)
      .filter(Boolean);
    if (lines.length) el.innerHTML = '<b>Image credits</b><br>' + lines.join('<br>');
  }

  // Map a pose (view blend weights + fan angle) to a target opacity per clip.
  function updateEchoFromPose(data) {
    let sum = 0;
    PROBE_VIEW_IDS.forEach(id => { sum += (data.blend && data.blend[id]) || 0; });
    const w = {};
    PROBE_VIEW_IDS.forEach(id => { const x = (data.blend && data.blend[id]) || 0; w[id] = sum > 0 ? x / sum : 0; });
    const active = data.nearestId || data.matchId || data.target || null;
    const fan = (typeof data.fan === 'number') ? data.fan : 0;

    Object.keys(ECHO.targetOp).forEach(k => { ECHO.targetOp[k] = 0; });
    PROBE_VIEW_IDS.forEach(id => {
      const layers = ECHO.layers[id];
      if (!layers || !layers.length) return;
      const N = layers.length;
      if (N === 1) { ECHO.targetOp[id + '#0'] = w[id]; return; }
      const opt = viewOptimal(id);
      let pos = (id === active)
        ? opt + (fan / FAN_RANGE) * ((N - 1) / 2)  // fan sweeps around the optimal cut
        : opt;                                     // inactive views rest at their best cut
      pos = clampNum(pos, 0, N - 1);
      const lo = Math.floor(pos), hi = Math.min(lo + 1, N - 1), frac = pos - lo;
      ECHO.targetOp[id + '#' + lo] += w[id] * (1 - frac);
      ECHO.targetOp[id + '#' + hi] += w[id] * frac;
    });
  }

  function startEchoLoop() {
    if (ECHO.raf) return;
    const tick = () => {
      PROBE_VIEW_IDS.forEach(id => {
        const layers = ECHO.layers[id]; if (!layers) return;
        layers.forEach((v, i) => {
          const key = id + '#' + i;
          const cur = ECHO.op[key] || 0, tgt = ECHO.targetOp[key] || 0;
          const nv = cur + (tgt - cur) * 0.2;
          ECHO.op[key] = nv;
          v.style.opacity = nv.toFixed(3);
          if (nv > 0.02) { if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } }
          else if (!v.paused) { try { v.pause(); } catch (e) {} }
        });
      });
      const acc = clampNum(ECHO.acc / 100, 0, 1);
      // Focus curve: ease toward crisp — the image visibly sharpens as accuracy
      // rises and "snaps" into focus near the optimal cut (like a real exam,
      // where the picture cleans up as the probe angle is dialed in).
      const focus = acc * acc; // 40%->0.16 hazy, 80%->0.64 clearing, 100%->1 crisp
      const stack = $('#echoStack');
      if (stack) {
        stack.style.filter =
          'blur(' + ((1 - focus) * 4.0).toFixed(2) + 'px) ' +
          'brightness(' + (0.55 + 0.45 * focus).toFixed(2) + ') ' +
          'contrast(' + (0.85 + 0.25 * focus).toFixed(2) + ')';
      }
      const haze = $('#echoHaze');
      if (haze) haze.style.opacity = ((1 - focus) * 0.5).toFixed(2);
      ECHO.raf = requestAnimationFrame(tick);
    };
    ECHO.raf = requestAnimationFrame(tick);
  }

  // Kept under the old name so renderStep() can pause the sim on screen exit.
  function stopPlaxSim() {
    if (ECHO.raf) { cancelAnimationFrame(ECHO.raf); ECHO.raf = null; }
    Object.keys(ECHO.layers).forEach(id => {
      (ECHO.layers[id] || []).forEach(v => { try { v.pause(); } catch (e) {} });
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
    ws: null,
    sessionCode: null,
    connected: false,
    toggleBound: false
  };

  function setProbeStatus(state, text) {
    const dot = $('#probeStatusDot');
    const label = $('#probeStatusText');
    if (dot) dot.className = 'status-dot' + (state ? ' ' + state : '');
    if (label) label.textContent = text;
  }

  function buildProbeUrl(sessionCode) {
    const base = location.href.replace(/[^/]*$/, '');
    return base + 'probe.html?session=' + encodeURIComponent(sessionCode);
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
      setupEchoVideos().then(function () {
        // Show a real view immediately so the display is never black before the
        // first pose arrives (and as a fallback if a clip is slow to decode).
        ECHO.targetOp['plax#0'] = 1;
        ECHO.op['plax#0'] = 1;
      });
      startEchoLoop();
      setEchoState(null, 0, false, 'plax');
    } else if (data.type === 'pose') {
      updateEchoFromPose(data);   // per-clip opacities: view blend + fan sweep
      ECHO.acc = (typeof data.accuracy === 'number') ? data.accuracy : 0;
      const locked = !!data.locked;
      setEchoState(data.matchId || null, ECHO.acc, locked, data.target || null);
      renderProbeTargets(locked ? data.matchId : (data.target || null));
    }
  }

  // The phone pairs with this screen through a WebSocket RELAY on our own server
  // (wss://…/ws). It rides port 443 like a normal web page, so it works on
  // locked-down hospital WiFi where peer-to-peer WebRTC could not connect.
  function wsRelayBase() {
    return FOCUSFLOW_SERVER.replace(/^http/, 'ws') + '/ws';
  }

  function createProbePeer() {
    if (!FOCUSFLOW_SERVER) {
      setProbeStatus('error', 'The probe simulation is not configured yet. You can skip this step.');
      return;
    }
    setProbeStatus('busy', 'Starting connection…');
    let ws;
    try { ws = new WebSocket(wsRelayBase() + '?role=host'); }
    catch (e) { setProbeStatus('error', 'Connection error. You can skip this step and continue.'); return; }
    PROBE.ws = ws;

    ws.onmessage = ev => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg.type === 'session') {
        PROBE.sessionCode = msg.code;
        setProbeStatus('busy', 'Ready — scan the code with your phone');
        const url = buildProbeUrl(msg.code);
        const urlEl = $('#probeUrl');
        if (urlEl) urlEl.textContent = url;
        renderQr(url);
      } else if (msg.type === 'probe-connected') {
        setProbeStatus('busy', 'Phone connected — calibrating…');
      } else if (msg.type === 'peer-disconnected') {
        PROBE.connected = false;
        const connectCard = $('#probeConnectCard');
        const scanCard = $('#probeScanCard');
        if (connectCard) connectCard.style.display = '';
        if (scanCard) scanCard.style.display = 'none';
        setProbeStatus('busy', 'Phone disconnected — scan the code again to reconnect');
      } else {
        handleProbeData(msg);   // relayed app messages: calibrating / ready / pose
      }
    };
    ws.onerror = () => setProbeStatus('error', 'Connection error. You can skip this step and continue.');
    ws.onclose = () => { PROBE.ws = null; };
  }

  function initProbe() {
    renderProbeTargets(null);
    loadEchoManifest().then(renderEchoCredits);
    const prev = $('#echoPreview');
    if (prev && !prev.childElementCount) {
      prev.innerHTML = PROBE_VIEW_IDS.map(id => {
        const v = getViewById(id);
        return echoLoopHTML(id, probeShortLabel(v), v.subText);
      }).join('');
      playEchoLoops(prev);
    }
    const toggle = $('#probeLabelToggle');
    if (toggle && !PROBE.toggleBound) {
      PROBE.toggleBound = true;
      ECHO.showCaption = toggle.checked;
      toggle.addEventListener('change', () => { ECHO.showCaption = toggle.checked; });
    }
    if (PROBE.ws && PROBE.ws.readyState <= 1) return;  // already connecting/open
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

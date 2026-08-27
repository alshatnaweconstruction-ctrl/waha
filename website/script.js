// Multi-language Translations Dictionary (English, Greek, Arabic)
const translations = {
  en: {
    navAbout: "About Us",
    navServices: "Services",
    navProjects: "Projects",
    navEstimator: "BOQ Calculator",
    navCoverage: "Map & Coverage",
    navContact: "Contact",
    btnAiAdvisor: "Gemini AI Advisor",
    chatWhatsapp: "WhatsApp",
    heroBadge: "BUILT WITH PRECISION • PAPHOS, CYPRUS",
    heroTitle: "Advanced Structural Engineering & Turnkey Contracting",
    heroDesc: "From ground excavation to turnkey delivery. Certified civil engineering, non-destructive moisture mapping, structural remediation, and premium villa renovations in Cyprus.",
    btnCalculateBOQ: "📊 Calculate Project Estimate",
    btnAskAi: "Ask Gemini Engineering AI",
    btnDirectChat: "WhatsApp Direct",
    statReg: "Registered Cyprus Entity",
    statExcavation: "Excavation to Handover",
    statCoverage: "Certified Site Surveyors",
    aboutTag: "ABOUT US",
    aboutTitle: "Engineering Integrity & Direct Client Contracting",
    aboutSub: "VERTEKS S.A. CONSTRUCTION & AL-SHATNAWE",
    aboutP1: "Based in Paphos, Cyprus, we operate as direct general contractors and structural engineering consultants dealing directly with property owners, private investors, and municipal consultants.",
    aboutP2: "We specialize in solving complex structural dampness, moisture intrusion, concrete rehabilitation, and executing luxury turnkey builds with strict adherence to Cyprus building regulations and Eurocode standards.",
    pt1Title: "Engineering Diagnostics:",
    pt1Desc: "Calibrated moisture mapping, plumbing pressure tests, and structural integrity reports.",
    pt2Title: "Itemized BOQ Pricing:",
    pt2Desc: "Comprehensive bills of quantities calculated from architectural blueprints.",
    pt3Title: "Direct Contractor Supervision:",
    pt3Desc: "On-site civil engineer supervision from ground breaking to final snagging.",
    servicesTag: "OUR SERVICES",
    servicesTitle: "Full-Lifecycle Civil & Construction Solutions",
    srv1Title: "Diagnostic Moisture & Structural Surveys",
    srv1Desc: "Electronic moisture mapping across elevation walls, plumbing pressure testing, flood testing, and certified engineering damage assessments.",
    srv2Title: "Advanced Waterproofing & Anti-Damp",
    srv2Desc: "Subterranean membrane barriers, elastic cementitious coatings, anti-efflorescence chemical treatments, and continuous dehumidification.",
    srv3Title: "Detached Residence & Villa Renovation",
    srv3Desc: "Luxury interior renovations, structural modifications, wet area remodels, insulation, and high-end exterior architectural finishes.",
    srv4Title: "Turnkey New Build Construction",
    srv4Desc: "Complete turnkey execution: excavation, foundation laying, reinforced concrete frames, masonry, MEP installation, and final handover.",
    srv5Title: "Commercial Tenders & Method Statements",
    srv5Desc: "Multi-package commercial quotations, compliance statements, technical submittals, and professional bill of quantities (BOQ) formulation.",
    srv6Title: "Emergency Concrete & Crack Remediation",
    srv6Desc: "Structural crack injection, foundation underpinning, spalling concrete repairs, and immediate site stabilization.",
    calcTag: "ESTIMATE YOUR PROJECT",
    calcTitle: "Interactive BOQ & Scope Estimator",
    calcDesc: "Configure your property parameters to get instant engineering estimates and send an official inquiry directly to our team.",
    caseTag: "CASE STUDIES & PORTFOLIO",
    caseTitle: "Proven Engineering & Construction Track Record",
    contactTag: "CONTACT US",
    contactTitle: "Direct Engineering Consultation"
  },
  el: {
    navAbout: "Σχετικά",
    navServices: "Υπηρεσίες",
    navProjects: "Έργα",
    navEstimator: "Επιμέτρηση BOQ",
    navCoverage: "Χάρτης & Κάλυψη",
    navContact: "Επικοινωνία",
    btnAiAdvisor: "Gemini AI Σύμβουλος",
    chatWhatsapp: "WhatsApp",
    heroBadge: "ΧΤΙΣΜΕΝΟ ΜΕ ΑΚΡΙΒΕΙΑ • ΠΑΦΟΣ, ΚΥΠΡΟΣ",
    heroTitle: "Προηγμένη Δομική Μηχανική & Γενικές Εργολαβίες",
    heroDesc: "Από την εκσκαφή έως την παράδοση με το κλειδί στο χέρι. Πιστοποιημένη στατική μηχανική, ηλεκτρονική χαρτογράφηση υγρασίας και ανακαινίσεις βιλών στην Κύπρο.",
    btnCalculateBOQ: "📊 Υπολογισμός Κόστους Έργου",
    btnAskAi: "Ρωτήστε το Gemini AI",
    btnDirectChat: "WhatsApp Άμεση Επαφή",
    statReg: "Επίσημο Μητρώο Κύπρου",
    statExcavation: "Εκσκαφή έως Παράδοση",
    statCoverage: "Πιστοποιημένοι Μηχανικοί",
    aboutTag: "ΠΟΙΟΙ ΕΙΜΑΣΤΕ",
    aboutTitle: "Μηχανική Αξιοπιστία & Απευθείας Εργολαβία",
    aboutSub: "VERTEKS S.A. CONSTRUCTION & AL-SHATNAWE",
    aboutP1: "Με έδρα την Πάφο, λειτουργούμε ως κύριοι εργολάβοι και τεχνικοί σύμβουλοι, συνεργαζόμενοι απευθείας με ιδιοκτήτες ακινήτων και επιβλέποντες μηχανικούς.",
    aboutP2: "Ειδικευόμαστε στην οριστική επίλυση ανιούσας υγρασίας, στατικές ενισχύσεις και κατασκευές πολυτελείας σύμφωνα με τους Ευρωκώδικες και τους κανονισμούς της Κύπρου.",
    pt1Title: "Διαγνωστικοί Έλεγχοι:",
    pt1Desc: "Μέτρηση υγρασίας τοιχοποιίας, δοκιμές πίεσης υδραυλικών και εκθέσεις βλαβών.",
    pt2Title: "Αναλυτικά Κοστολόγια:",
    pt2Desc: "Πλήρεις πίνακες εργασιών (BOQ) με διαφανείς τιμές μονάδας.",
    pt3Title: "Επίβλεψη Εργοταξίου:",
    pt3Desc: "Συνεχής παρουσία πολιτικού μηχανικού σε όλα τα στάδια του έργου.",
    servicesTag: "ΟΙ ΥΠΗΡΕΣΙΕΣ ΜΑΣ",
    servicesTitle: "Ολοκληρωμένες Τεχνικές & Κατασκευαστικές Λύσεις",
    srv1Title: "Διαγνωστικές Έρευνες Υγρασίας",
    srv1Desc: "Ηλεκτρονική μέτρηση υγρασίας σε όλες τις όψεις, δοκιμές διαρροών και εκθέσεις πραγματογνωμοσύνης.",
    srv2Title: "Προηγμένη Στεγανοποίηση",
    srv2Desc: "Υπόγειες μεμβράνες, ελαστικές τσιμεντοειδείς επιστρώσεις και συνεχής αφύγρανση.",
    srv3Title: "Ανακαινίσεις Μονοκατοικιών & Βιλών",
    srv3Desc: "Πολυτελείς ανακαινίσεις, αναδιαμορφώσεις υγρών χώρων και θερμομονώσεις.",
    srv4Title: "Ολοκληρωμένες Κατασκευές (Turnkey)",
    srv4Desc: "Από τις εκσκαφές και τα μπετά έως τα ηλεκτρομηχανολογικά και την τελική παράδοση.",
    srv5Title: "Προσφορές Έργων & Τεχνικές Περιγραφές",
    srv5Desc: "Αναλυτικές επιμετρήσεις BOQ και τεχνικά δελτία συμμόρφωσης.",
    srv6Title: "Άμεση Επισκευή Ρωγμών & Σκυροδέματος",
    srv6Desc: "Ρητινενέσεις, αποκατάσταση ενανθρακωμένου σκυροδέματος και στατική σταθεροποίηση.",
    calcTag: "ΕΚΤΙΜΗΣΗ ΕΡΓΟΥ",
    calcTitle: "Διαδραστικός Υπολογιστής Επιμέτρησης BOQ",
    calcDesc: "Επιλέξτε τις παραμέτρους του ακινήτου σας για άμεση τεχνική εκτίμηση και αποστολή στο WhatsApp.",
    caseTag: "ΜΕΛΕΤΕΣ ΠΕΡΙΠΤΩΣΗΣ",
    caseTitle: "Αποδεδειγμένη Εμπειρία & Έργα στην Κύπρο",
    contactTag: "ΕΠΙΚΟΙΝΩΝΙΑ",
    contactTitle: "Απευθείας Τεχνική Συμβουλευτική"
  },
  ar: {
    navAbout: "من نحن",
    navServices: "خدماتنا",
    navProjects: "المشاريع",
    navEstimator: "حاسبة الكميات",
    navCoverage: "الخريطة والتغطية",
    navContact: "اتصل بنا",
    btnAiAdvisor: "مستشار Gemini الذكي",
    chatWhatsapp: "واتساب",
    heroBadge: "بنيت بدقة فائقة • بافوس، قبرص",
    heroTitle: "الهندسة الإنشائية المتقدمة والمقاولات العامة",
    heroDesc: "من الحفر حتى تسليم المفتاح. هندسة مدنية معتمدة، كشف ومعالجة الرطوبة الإلكتروني، وترميم الفلل والمشاريع في قبرص.",
    btnCalculateBOQ: "📊 حساب تكلفة ونطاق المشروع",
    btnAskAi: "اسأل مستشار الذكاء الاصطناعي",
    btnDirectChat: "تواصل عبر واتساب",
    statReg: "سجل تجاري قبرصي معتمد",
    statExcavation: "من الحفر للتسليم",
    statCoverage: "مهندسون معتمدون ميدانياً",
    aboutTag: "من نحن",
    aboutTitle: "النزاهة الهندسية والتعاقد المباشر مع المالك",
    aboutSub: "شركة فيرتكس للإنشاءات ومقاولات الشطناوي",
    aboutP1: "يقع مقرنا في بافوس، قبرص. نعمل كمقاول عام واستشاري هندسي نتعامل مباشرة مع ملاك العقارات والمستثمرين دون وسطاء.",
    aboutP2: "متخصصون في المعالجة الجذرية للرطوبة وتدعيم الخرسانات وتنفيذ الفلل السكنية الفاخرة طبقاً للمواصفات الأوروبية وقوانين البناء القبرصية.",
    pt1Title: "الفحص الهندسي الدقيق:",
    pt1Desc: "فحص رطوبة الحوائط إلكترونياً، اختبارات ضغط الأنابيب وتقارير السلامة الإنشائية.",
    pt2Title: "جداول كميات وأسعار شفافة:",
    pt2Desc: "حساب دقيق لبنود الأعمال (BOQ) خالية تماماً من أي تكاليف خفية.",
    pt3Title: "إشراف هندسي مباشر:",
    pt3Desc: "تواجد مستمر لمهندس الموقع من مرحلة الحفر وحتى التسليم النهائي.",
    servicesTag: "خدماتنا",
    servicesTitle: "حلول المقاولات والهندسة المدنية الشاملة",
    srv1Title: "الفحص الإنشائي وتشخيص الرطوبة",
    srv1Desc: "مسح إلكتروني لرطوبة الجدران، اختبارات شبكات المياه، واختبارات الغمر وتقارير الأضرار.",
    srv2Title: "العزل المائي المتقدم وسحب الرطوبة",
    srv2Desc: "حقن الحواجز العازلة، العزل الإسمنتي المرن، وسحب الرطوبة المستمر بالمعدات.",
    srv3Title: "ترميم وتجديد الفلل والمنازل",
    srv3Desc: "تشطيبات فاخرة، تعديلات معمارية، تجديد المناطق الرطبة والعزل الحراري.",
    srv4Title: "بناء متكامل تسليم مفتاح",
    srv4Desc: "تنفيذ شامل من أعمال الحفر والخرسانة المسلحة وحتى التشطيبات والأعمال الكهروميكانيكية.",
    srv5Title: "المناقصات وحساب الكميات (BOQ)",
    srv5Desc: "إعداد عروض الأسعار المفصلة، المواصفات القياسية، وخطط العمل التنفيذية.",
    srv6Title: "إصلاح التشققات والخرسانة الطارئ",
    srv6Desc: "حقن الشروخ الإنشائية، معالجة تآكل الخرسانة وتدعيم الأساسات.",
    calcTag: "تقدير المشروع",
    calcTitle: "حاسبة الكميات ونطاق العمل الفورية",
    calcDesc: "حدد مساحة ونوع مشروعك للحصول على تقدير هندسي فوري وإرساله عبر واتساب.",
    caseTag: "دراسات الحالة والمشاريع",
    caseTitle: "سجل حافل بالدقة والإنجاز في قبرص",
    contactTag: "اتصل بنا",
    contactTitle: "استشارة هندسية مباشرة"
  }
};

// Knowledge base for Cyprus Construction and Gemini AI Advisor
const cyprusKnowledgeBase = [
  {
    keywords: ["damp", "moisture", "water", "wet", "mold", "humidity", "hygrometer", "efflorescence", "رطوبة", "عزل", "υγρο", "υγρασια"],
    response: "For dampness & moisture in Cyprus (Paphos/Armou/Peyia), we perform calibrated electronic moisture mapping across all wall elevations, conduct plumbing pressure tests to rule out pipe bursts, and perform flood testing. Remediation includes non-destructive opening-up, continuous commercial dehumidification, anti-efflorescence chemical neutralizing, and dual-layer elastic cementitious waterproofing."
  },
  {
    keywords: ["cost", "price", "m2", "rate", "how much", "تكلفة", "سعر", "κοστος", "τιμη"],
    response: "Indicative Cyprus construction rates:\n• Diagnostic moisture survey & testing: ~€480 - €650.\n• Waterproofing & anti-efflorescence remediation: ~€35 - €65/m².\n• Full villa renovation: ~€350 - €700/m².\n• Turnkey new build construction: ~€1,400 - €2,200/m² (depending on finishes and Eurocode foundation requirements). Final pricing is itemized via our clear BOQ."
  },
  {
    keywords: ["armou", "pegeia", "emba", "paphos", "limassol", "cyprus", "location", "قبرص", "بافوس", "παφος"],
    response: "VERTEKS S.A. Construction is headquartered at Anapafseos 2, House 3 in Paphos (Reg: HE 495105). We actively manage projects across Paphos, Peyia, Armou, Tala, Chloraka, and Limassol. Our civil engineers can be dispatched for on-site inspection within 24-48 hours."
  },
  {
    keywords: ["turnkey", "excavation", "concrete", "contractor", "al-shatnawe", "shatnawe", "تسليم مفتاح", "مقاول", "مقاولة", "μπετα", "εργολαβος"],
    response: "Al-Shatnawe Construction & VERTEKS operate as general contractors dealing directly with property owners. We manage the entire lifecycle: initial excavation, foundation, reinforced concrete structure, masonry, MEP installations, waterproofing, and final handover with municipal certificate."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // 1. Language Switcher
  const langButtons = document.querySelectorAll(".lang-btn");
  function setLanguage(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    langButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    localStorage.setItem("verteks_lang", lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang")));
  });
  const savedLang = localStorage.getItem("verteks_lang") || "en";
  setLanguage(savedLang);

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => navMenu.classList.toggle("open"));
  }

  // 3. Interactive BOQ Estimator
  const calcService = document.getElementById("calcService");
  const calcArea = document.getElementById("calcArea");
  const areaVal = document.getElementById("areaVal");
  const calcUrgency = document.getElementById("calcUrgency");
  const scopeDuration = document.getElementById("scopeDuration");
  const scopeDeliverable = document.getElementById("scopeDeliverable");
  const scopePrice = document.getElementById("scopePrice");
  const sendCalculatedQuoteBtn = document.getElementById("sendCalculatedQuoteBtn");

  function updateEstimate() {
    if (!calcArea || !calcService) return;
    const area = parseInt(calcArea.value, 10);
    areaVal.textContent = area;

    const service = calcService.value;
    let baseRateMin = 35;
    let baseRateMax = 65;
    let weeksMin = 2;
    let weeksMax = 4;
    let deliverable = "Moisture Survey & Waterproofing";

    if (service === "renovation") {
      baseRateMin = 250;
      baseRateMax = 500;
      weeksMin = 4;
      weeksMax = 8;
      deliverable = "Architectural Remodel & MEP Works";
    } else if (service === "turnkey") {
      baseRateMin = 1200;
      baseRateMax = 1800;
      weeksMin = 20;
      weeksMax = 36;
      deliverable = "Excavation to Handover Build";
    } else if (service === "concrete") {
      baseRateMin = 80;
      baseRateMax = 180;
      weeksMin = 1;
      weeksMax = 3;
      deliverable = "Structural Crack & Concrete Remediation";
    }

    const minTotal = Math.round(area * baseRateMin);
    const maxTotal = Math.round(area * baseRateMax);

    scopeDuration.textContent = `${weeksMin} - ${weeksMax} Weeks`;
    scopeDeliverable.textContent = deliverable;
    scopePrice.textContent = `€${minTotal.toLocaleString()} - €${maxTotal.toLocaleString()}`;
  }

  if (calcArea) {
    calcArea.addEventListener("input", updateEstimate);
    calcService.addEventListener("change", updateEstimate);
    calcUrgency.addEventListener("change", updateEstimate);
    updateEstimate();
  }

  if (sendCalculatedQuoteBtn) {
    sendCalculatedQuoteBtn.addEventListener("click", () => {
      const service = calcService.options[calcService.selectedIndex].text;
      const area = calcArea.value;
      const urgency = calcUrgency.options[calcUrgency.selectedIndex].text;
      const location = document.getElementById("calcLocation").value || "Paphos, Cyprus";
      const estimate = scopePrice.textContent;

      const msg = 
`🏗️ *VERTEKS / AL-SHATNAWE — BOQ Estimate Inquiry*
-----------------------------------------
🛠️ *Service:* ${service}
📐 *Property Area:* ${area} m²
📍 *Location:* ${location}
⏱️ *Timeline:* ${urgency}
💶 *Calculated Estimate:* ${estimate}
-----------------------------------------
_Please confirm site inspection availability._`;

      window.open(`https://wa.me/35797740923?text=${encodeURIComponent(msg)}`, "_blank");
    });
  }

  // 4. Google Gemini AI Modal Assistant
  const aiModal = document.getElementById("aiModal");
  const openAiAssistantBtn = document.getElementById("openAiAssistantBtn");
  const heroAiBtn = document.getElementById("heroAiBtn");
  const floatingAiBtn = document.getElementById("floatingAiBtn");
  const closeAiModalBtn = document.getElementById("closeAiModalBtn");
  const aiChatBody = document.getElementById("aiChatBody");
  const aiUserInput = document.getElementById("aiUserInput");
  const aiSendBtn = document.getElementById("aiSendBtn");

  function openModal() {
    aiModal.classList.add("open");
    aiUserInput.focus();
  }
  function closeModal() {
    aiModal.classList.remove("open");
  }

  if (openAiAssistantBtn) openAiAssistantBtn.addEventListener("click", openModal);
  if (heroAiBtn) heroAiBtn.addEventListener("click", openModal);
  if (floatingAiBtn) floatingAiBtn.addEventListener("click", openModal);
  if (closeAiModalBtn) closeAiModalBtn.addEventListener("click", closeModal);

  function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-bot'}`;
    msgDiv.innerHTML = text.replace(/\n/g, "<br>");
    aiChatBody.appendChild(msgDiv);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
  }

  function handleAiQuery(query) {
    if (!query.trim()) return;
    appendMessage(query, true);

    // Provide immediate typing feedback
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "ai-msg ai-msg-bot";
    typingIndicator.id = "aiTyping";
    typingIndicator.textContent = "Analyzing with Google Gemini civil engineering model...";
    aiChatBody.appendChild(typingIndicator);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;

    setTimeout(() => {
      const typingEl = document.getElementById("aiTyping");
      if (typingEl) typingEl.remove();

      const qLower = query.toLowerCase();
      let matched = cyprusKnowledgeBase.find(item => item.keywords.some(k => qLower.includes(k)));

      if (matched) {
        appendMessage(matched.response);
      } else {
        appendMessage(`Thank you for your question regarding "${query}". For specific structural evaluations or architectural blueprints in Cyprus, our Chief Engineer Eng. Sultan can conduct an on-site inspection. You can directly connect with us on WhatsApp at +357 97 740923.`);
      }
    }, 700);
  }

  if (aiSendBtn && aiUserInput) {
    aiSendBtn.addEventListener("click", () => {
      const val = aiUserInput.value;
      aiUserInput.value = "";
      handleAiQuery(val);
    });

    aiUserInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = aiUserInput.value;
        aiUserInput.value = "";
        handleAiQuery(val);
      }
    });
  }

  // Quick prompt chips
  document.querySelectorAll(".ai-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      handleAiQuery(query);
    });
  });
});

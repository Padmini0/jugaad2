import { useState, useRef, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

const LANG = {
  en: {
    appSub:"ASHA Worker Tool", ashaApp:"ASHA App", phcView:"PHC View",
    pregnancyBtn:"Pregnancy", helpBtn:"Help",
    newPatient:"New Patient", patientName:"Patient Name (optional)",
    enterName:"Enter name", age:"Age", sex:"Sex",
    male:"Male", female:"Female", village:"Village", ashaWorker:"ASHA Worker",
    next:"Next →", selectSymptoms:"Select Symptoms", tapAll:"Tap all that apply",
    speakBtn:"Speak Symptoms", stopBtn:"Stop Recording",
    vitals:"Vitals (if available)", temp:"Temp (°F)",
    analyseBtn:"Analyse Now", analysing:"Analysing...",
    mockBtn:"Use Mock Result (Testing)",
    emergency:"EMERGENCY", referPhc:"REFER TO PHC", treatLocal:"TREAT LOCALLY",
    aiConf:"AI Confidence", checkFor:"Check for", toIncrease:"to increase confidence",
    call108:"CALL 108 NOW", ambulance:"National Ambulance Service",
    immediateSteps:"Immediate Steps:", phcNotified:"PHC Notified",
    newPatientBtn:"New Patient", phcDash:"PHC Dashboard →",
    outbreakAlert:"Outbreak Alert", outbreakMsg:"3+ cases from",
    possibleCluster:"— possible cluster. Investigate.",
    todayCases:"Today's Cases", resolved:"Resolved",
    ashaActive:"ASHA Workers Active Today", noCases:"No activity yet", casesLogged:"case(s) logged",
    imageTab:"Image Check", scanRash:"Scan Skin / Rash",
    uploadImg:"Upload Photo or Take Picture", analysingImg:"Analysing image...", imgResult:"Image Analysis",
    chatTab:"Doctor Chat", chatPlaceholder:"Type your question...", chatSend:"Send",
    chatConnected:"Dr. Meena Singh · Online", voiceOutput:"Read Aloud",
    pregTitle:"Pregnancy Triage", pregSub:"Maternal Health Assessment",
    pregName:"Mother's Name", pregAge:"Age", pregWeeks:"Weeks Pregnant",
    pregWeeksHint:"e.g. 28", pregParity:"Previous Deliveries", pregLMP:"Last Menstrual Period",
    pregSymptoms:"Select Symptoms", pregAnalyse:"Assess Pregnancy",
    pregAnalysing:"Assessing...", pregRisk:"Risk Level",
    pregCondition:"Likely Condition", pregNextStep:"Next Step",
    pregANC:"ANC Visit Due", pregBack:"Back",
    pregDangerSigns:"Danger Signs Present",
    helpTitle:"ASHA Copilot", helpSub:"Your AI assistant — ask anything",
    helpPlaceholder:"Describe the problem you're facing...",
    helpSend:"Ask", helpSuggested:"Quick Questions",
    helpTyping:"Thinking...",
  },
  hi: {
    appSub:"आशा वर्कर टूल", ashaApp:"आशा ऐप", phcView:"PHC व्यू",
    pregnancyBtn:"गर्भावस्था", helpBtn:"सहायता",
    newPatient:"नया मरीज़", patientName:"मरीज़ का नाम (वैकल्पिक)",
    enterName:"नाम लिखें", age:"उम्र", sex:"लिंग",
    male:"पुरुष", female:"महिला", village:"गाँव", ashaWorker:"आशा वर्कर",
    next:"आगे बढ़ें →", selectSymptoms:"लक्षण चुनें", tapAll:"सभी लागू लक्षण चुनें",
    speakBtn:"बोलकर बताएं", stopBtn:"रिकॉर्डिंग बंद करें",
    vitals:"वाइटल्स (अगर हों)", temp:"तापमान (°F)",
    analyseBtn:"अभी जाँचें", analysing:"जाँच हो रही है...",
    mockBtn:"मॉक रिज़ल्ट देखें (टेस्टिंग)",
    emergency:"आपातकाल", referPhc:"PHC भेजें", treatLocal:"यहीं इलाज करें",
    aiConf:"AI विश्वास", checkFor:"जाँचें", toIncrease:"से विश्वास बढ़ेगा",
    call108:"अभी 108 बुलाएं", ambulance:"राष्ट्रीय एम्बुलेंस सेवा",
    immediateSteps:"तुरंत करें:", phcNotified:"PHC को सूचित किया",
    newPatientBtn:"नया मरीज़", phcDash:"PHC डैशबोर्ड →",
    outbreakAlert:"प्रकोप चेतावनी", outbreakMsg:"3+ केस मिले",
    possibleCluster:"— संभावित क्लस्टर। जाँच करें।",
    todayCases:"आज के केस", resolved:"ठीक हो गए",
    ashaActive:"आज सक्रिय आशा वर्कर", noCases:"कोई गतिविधि नहीं", casesLogged:"केस दर्ज",
    imageTab:"फोटो जाँच", scanRash:"त्वचा / चकत्ते जाँचें",
    uploadImg:"फोटो अपलोड करें या खींचें", analysingImg:"फोटो जाँची जा रही है...", imgResult:"फोटो विश्लेषण",
    chatTab:"डॉक्टर चैट", chatPlaceholder:"सवाल लिखें...", chatSend:"भेजें",
    chatConnected:"डॉ. मीना सिंह · ऑनलाइन", voiceOutput:"सुनें",
    pregTitle:"गर्भावस्था जाँच", pregSub:"मातृ स्वास्थ्य मूल्यांकन",
    pregName:"माँ का नाम", pregAge:"उम्र", pregWeeks:"गर्भ के सप्ताह",
    pregWeeksHint:"जैसे 28", pregParity:"पहले के प्रसव", pregLMP:"आखिरी माहवारी",
    pregSymptoms:"लक्षण चुनें", pregAnalyse:"गर्भावस्था जाँचें",
    pregAnalysing:"जाँच हो रही है...", pregRisk:"जोखिम स्तर",
    pregCondition:"संभावित स्थिति", pregNextStep:"अगला कदम",
    pregANC:"ANC विज़िट आवश्यक", pregBack:"वापस",
    pregDangerSigns:"खतरे के संकेत",
    helpTitle:"आशा कोपायलट", helpSub:"आपका AI सहायक — कुछ भी पूछें",
    helpPlaceholder:"समस्या बताएं...",
    helpSend:"पूछें", helpSuggested:"जल्दी सवाल",
    helpTyping:"सोच रहा हूँ...",
  },
  mr: {
    appSub:"आशा कारकर टूल", ashaApp:"आशा ऐप", phcView:"PHC व्यू",
    pregnancyBtn:"गर्भावस्था", helpBtn:"मदद",
    newPatient:"नयो मरीज़", patientName:"मरीज़ रो नाम (वैकल्पिक)",
    enterName:"नाम लिखो", age:"उमर", sex:"जाति",
    male:"मरद", female:"लुगाई", village:"गाँव", ashaWorker:"आशा कारकर",
    next:"आगे चालो →", selectSymptoms:"बीमारी चुनो", tapAll:"सगळी बीमारी चुनो",
    speakBtn:"बोलकर बताओ", stopBtn:"बंद करो",
    vitals:"वाइटल्स (जे होवे)", temp:"तापमान (°F)",
    analyseBtn:"अभी जाँचो", analysing:"जाँच हो री है...",
    mockBtn:"मॉक रिज़ल्ट देखो (टेस्टिंग)",
    emergency:"जरूरी इलाज", referPhc:"PHC भेजो", treatLocal:"थाणे इलाज करो",
    aiConf:"AI भरोसो", checkFor:"देखो", toIncrease:"सूं भरोसो बढ़सी",
    call108:"अभी 108 बुलाओ", ambulance:"राष्ट्रीय एम्बुलेंस सेवा",
    immediateSteps:"तुरत करो:", phcNotified:"PHC नै खबर दी",
    newPatientBtn:"नयो मरीज़", phcDash:"PHC डैशबोर्ड →",
    outbreakAlert:"बीमारी फैलावट", outbreakMsg:"3+ केस मिल्या",
    possibleCluster:"— फैलावट हो सकै। जाँचो।",
    todayCases:"आज रा केस", resolved:"ठीक हो ग्यो",
    ashaActive:"आज रा आशा कारकर", noCases:"कोई काम नहीं", casesLogged:"केस दर्ज",
    imageTab:"फोटो जाँच", scanRash:"चाम / दाग जाँचो",
    uploadImg:"फोटो अपलोड करो या खींचो", analysingImg:"फोटो जाँची जा री है...", imgResult:"फोटो विश्लेषण",
    chatTab:"डॉक्टर बात", chatPlaceholder:"सवाल लिखो...", chatSend:"भेजो",
    chatConnected:"डॉ. मीना सिंह · ऑनलाइन", voiceOutput:"सुणो",
    pregTitle:"गर्भावस्था जाँच", pregSub:"माँ री सेहत जाँच",
    pregName:"माँ रो नाम", pregAge:"उमर", pregWeeks:"गर्भ रा हफ्ता",
    pregWeeksHint:"जियां 28", pregParity:"पेला री डिलीवरी", pregLMP:"आखरी माहवारी",
    pregSymptoms:"बीमारी चुनो", pregAnalyse:"गर्भावस्था जाँचो",
    pregAnalysing:"जाँच हो री है...", pregRisk:"खतरो",
    pregCondition:"संभावित हालत", pregNextStep:"आगलो कदम",
    pregANC:"ANC विज़िट जरूरी", pregBack:"वापस",
    pregDangerSigns:"खतरे रा संकेत",
    helpTitle:"आशा कोपायलट", helpSub:"थारो AI सहायक — कुछ भी पूछो",
    helpPlaceholder:"समस्या बताओ...",
    helpSend:"पूछो", helpSuggested:"जल्दी सवाल",
    helpTyping:"सोच रियो हूँ...",
  }
};

const SYMPTOMS = [
  { id:"chest_pain",     en:"Chest Pain",            hi:"सीने में दर्द",       mr:"छाती रो दरद" },
  { id:"fever",          en:"Fever",                  hi:"बुखार",               mr:"तावड़ो" },
  { id:"breathlessness", en:"Breathlessness",         hi:"सांस लेने में तकलीफ", mr:"सांस री तकलीफ" },
  { id:"unconscious",    en:"Unconscious / Fainting", hi:"बेहोशी",              mr:"बेभान" },
  { id:"vomiting",       en:"Vomiting",               hi:"उल्टी",               mr:"उलटी" },
  { id:"diarrhoea",      en:"Diarrhoea",              hi:"दस्त",                mr:"दस्त" },
  { id:"headache",       en:"Severe Headache",        hi:"तेज सिरदर्द",         mr:"मोटो माथो दरद" },
  { id:"arm_pain",       en:"Left Arm Pain",          hi:"बाएं हाथ में दर्द",   mr:"खब्बे हाथ रो दरद" },
  { id:"sweating",       en:"Excessive Sweating",     hi:"ज़्यादा पसीना",       mr:"घणो पसीनो" },
  { id:"bleeding",       en:"Bleeding",               hi:"खून आना",             mr:"लोही आवणो" },
  { id:"convulsions",    en:"Convulsions",            hi:"दौरा पड़ना",           mr:"झटको आवणो" },
  { id:"jaundice",       en:"Jaundice",               hi:"पीलिया",              mr:"कमला" },
  { id:"rash",           en:"Skin Rash",              hi:"त्वचा पर चकत्ते",     mr:"चाम पर दाग" },
];

const PREG_SYMPTOMS = [
  { id:"p_bleeding",    en:"Vaginal Bleeding",         hi:"योनि से खून",           mr:"खून आवणो" },
  { id:"p_headache",    en:"Severe Headache",          hi:"तेज सिरदर्द",           mr:"मोटो माथो दरद" },
  { id:"p_swelling",    en:"Swelling (face/hands/feet)",hi:"चेहरे/हाथ/पैर पर सूजन",mr:"सूजन" },
  { id:"p_vision",      en:"Blurred Vision",           hi:"धुंधला दिखना",          mr:"धुंधलो दीखणो" },
  { id:"p_pain",        en:"Severe Abdominal Pain",    hi:"पेट में तेज दर्द",      mr:"पेट में मोटो दरद" },
  { id:"p_fever",       en:"High Fever",               hi:"तेज बुखार",             mr:"मोटो तावड़ो" },
  { id:"p_fetal",       en:"Baby Not Moving",          hi:"बच्चे की हलचल नहीं",    mr:"बच्चो नहीं हिलतो" },
  { id:"p_convulsions", en:"Convulsions / Fits",       hi:"दौरा पड़ना",            mr:"झटको आवणो" },
  { id:"p_breathless",  en:"Breathlessness",           hi:"सांस लेने में तकलीफ",   mr:"सांस री तकलीफ" },
  { id:"p_discharge",   en:"Foul Discharge",           hi:"बदबूदार स्राव",         mr:"बदबूदार स्राव" },
  { id:"p_nausea",      en:"Excessive Nausea/Vomiting",hi:"ज़्यादा उल्टी/मतली",    mr:"घणी उलटी" },
  { id:"p_anaemia",     en:"Pale/Yellow Skin (Anaemia)",hi:"पीली त्वचा (खून की कमी)",mr:"पीली चाम" },
  { id:"p_contractions",en:"Contractions (before 37w)",hi:"प्रसव पीड़ा (37 हफ्ते से पहले)",mr:"दरद (37 हफ्ते सूं पेला)" },
  { id:"p_urine",       en:"Reduced Urine / No Urine", hi:"पेशाब कम होना",         mr:"पेशाब घटणो" },
];

const MOCK_CASES = [
  { id:1, name:"Ramesh Kumar", age:58, sex:"M", village:"Ramgarh", asha:"Sunita Devi", symptoms:["chest_pain","sweating","arm_pain"], spo2:93, temp:99.1, level:"RED",    condition:"Suspected Acute MI",  time:"08:42 AM", resolved:false },
  { id:2, name:"Priya Bai",    age:28, sex:"F", village:"Nathara", asha:"Kamla Devi",  symptoms:["fever","vomiting","headache"],     spo2:98, temp:103.2,level:"YELLOW", condition:"Dengue / Typhoid",    time:"09:15 AM", resolved:false },
  { id:3, name:"Sunita Bai",   age:24, sex:"F", village:"Ramgarh", asha:"Sunita Devi", symptoms:["p_swelling","p_headache"],          spo2:97, temp:100.2,level:"RED",    condition:"Pre-eclampsia Risk",  time:"09:50 AM", resolved:false },
  { id:4, name:"Geeta Sharma", age:32, sex:"F", village:"Bichun",  asha:"Meena Kumari",symptoms:["vomiting","diarrhoea"],             spo2:99, temp:100.1,level:"GREEN",  condition:"Gastroenteritis",     time:"10:20 AM", resolved:true  },
  { id:5, name:"Bhura Lal",    age:67, sex:"M", village:"Ramgarh", asha:"Sunita Devi", symptoms:["convulsions","unconscious"],        spo2:91, temp:98.6, level:"RED",    condition:"Suspected Stroke",    time:"11:05 AM", resolved:false },
];

const VILLAGES = ["Ramgarh","Nathara","Bichun","Khetri","Mundwa","Degana"];
const ASHAS    = ["Sunita Devi","Kamla Devi","Meena Kumari","Rekha Bai","Pushpa Devi"];

const SYMPTOM_KEYWORDS = {
  chest_pain:    { hi:["सीने","सीना","छाती"], en:["chest","chest pain"] },
  fever:         { hi:["बुखार","तापमान"],      en:["fever","temperature"] },
  breathlessness:{ hi:["सांस","दम घुटना"],     en:["breath","breathless"] },
  unconscious:   { hi:["बेहोश","बेहोशी"],      en:["unconscious","faint"] },
  vomiting:      { hi:["उल्टी","मतली"],        en:["vomit","vomiting","nausea"] },
  diarrhoea:     { hi:["दस्त","पेट खराब"],     en:["diarrhoea","diarrhea"] },
  headache:      { hi:["सिरदर्द"],             en:["headache"] },
  arm_pain:      { hi:["हाथ में दर्द"],         en:["arm pain"] },
  sweating:      { hi:["पसीना"],               en:["sweat","sweating"] },
  bleeding:      { hi:["खून","रक्त"],          en:["bleed","bleeding"] },
  convulsions:   { hi:["दौरा","झटका"],         en:["convulsion","seizure","fit"] },
  jaundice:      { hi:["पीलिया","पीला"],        en:["jaundice","yellow"] },
  rash:          { hi:["चकत्ते","दाने"],        en:["rash","itching"] },
};

const levelColor = l => l==="RED" ? {bg:"#fff1f0",border:"#ff4d4f",text:"#a8071a",badge:"#ff4d4f"}
                      : l==="YELLOW" ? {bg:"#fffbe6",border:"#faad14",text:"#874d00",badge:"#faad14"}
                      : {bg:"#f6ffed",border:"#52c41a",text:"#135200",badge:"#52c41a"};

const pinkColor = l => l==="RED" ? {bg:"#fff0f6",border:"#eb2f96",text:"#780650",badge:"#eb2f96"}
                      : l==="YELLOW" ? {bg:"#fff7e6",border:"#fa8c16",text:"#612500",badge:"#fa8c16"}
                      : {bg:"#f6ffed",border:"#52c41a",text:"#135200",badge:"#52c41a"};

function speak(text, lang) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang==="en" ? "en-IN" : "hi-IN";
  utt.rate = 0.88; utt.pitch = 1;
  window.speechSynthesis.speak(utt);
}

const HELP_QUICK = {
  en: ["Baby not moving — what to do?","Signs of pre-eclampsia?","How to handle postpartum bleeding?","When to call 108?","Newborn not crying — steps?","Patient is unconscious — first aid?"],
  hi: ["बच्चा नहीं हिल रहा — क्या करें?","प्री-एक्लेम्पसिया के लक्षण?","प्रसव के बाद खून — क्या करें?","108 कब बुलाएं?","नवजात रो नहीं रहा — क्या करें?","मरीज़ बेहोश है — क्या करें?"],
  mr: ["बच्चो नहीं हिलतो — क्या करां?","प्री-एक्लेम्पसिया रा संकेत?","सूवावड़ रे बाद खून — क्या करां?","108 कद बुलावां?","नवजात रो नहीं रियो — क्या करां?","मरीज़ बेभान — क्या करां?"],
};

export default function App() {
  const [view, setView] = useState("landing");
  const [lang, setLang] = useState("hi");
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("symptoms");
  const [patient, setPatient] = useState({ name:"", age:"", sex:"M", village:VILLAGES[0], asha:ASHAS[0] });
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [vitals, setVitals] = useState({ spo2:"", temp:"" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState(MOCK_CASES);
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const imgInputRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    { role:"assistant", text:"Namaskar! Main Dr. Meena Singh, Barmer PHC. Koi bhi sawaal pooch sakte hain — mareez, davai, ya triage ke baare mein. 🙏" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [pregPatient, setPregPatient] = useState({ name:"", age:"", weeks:"", parity:"0", lmp:"", village:VILLAGES[0], asha:ASHAS[0] });
  const [pregSymptoms, setPregSymptoms] = useState([]);
  const [pregBP, setPregBP] = useState({ systolic:"", diastolic:"" });
  const [pregResult, setPregResult] = useState(null);
  const [pregLoading, setPregLoading] = useState(false);
  const [pregStep, setPregStep] = useState(1);

  const [helpMessages, setHelpMessages] = useState([
    { role:"assistant", text:"Namaskar ASHA didi! 🙏 Main aapka AI Copilot hoon. Koi bhi mushkil aayi ho — patient ke baare mein, davai ke baare mein, ya koi bhi emergency — mujhse poochho. Main seedhi aur simple Hindi mein bataoonga." }
  ]);
  const [helpInput, setHelpInput] = useState("");
  const [helpLoading, setHelpLoading] = useState(false);
  const helpEndRef = useRef(null);

  const T = k => LANG[lang]?.[k] || LANG["en"][k];

  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [chatMessages]);
  useEffect(() => { helpEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [helpMessages]);

  const toggleSymptom = id => setSelectedSymptoms(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id]);
  const togglePregSymptom = id => setPregSymptoms(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id]);

  const stopVoice = () => { recognitionRef.current?.stop(); recognitionRef.current=null; setListening(false); };
  const startVoice = () => {
    if (listening) { stopVoice(); return; }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) { setVoiceStatus("❌ Voice not supported. Use Chrome."); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang==="en"?"en-IN":"hi-IN"; rec.continuous=true; rec.interimResults=false; rec.maxAlternatives=3;
    rec.onstart = () => { setListening(true); setVoiceStatus("🎙 बोलिए..."); };
    rec.onresult = e => {
      const ts = []; for(let i=e.resultIndex;i<e.results.length;i++) for(let j=0;j<e.results[i].length;j++) ts.push(e.results[i][j].transcript);
      const matched=[]; ts.forEach(raw=>{ const lo=raw.toLowerCase(); Object.entries(SYMPTOM_KEYWORDS).forEach(([id,kw])=>{ if(kw.hi.some(w=>raw.includes(w))||kw.en.some(w=>lo.includes(w))) matched.push(id); }); });
      const u=[...new Set(matched)]; if(u.length){ setSelectedSymptoms(p=>[...new Set([...p,...u])]); setVoiceStatus(`✅ ${u.map(id=>SYMPTOMS.find(s=>s.id===id)?.[lang==="mr"?"mr":lang==="hi"?"hi":"en"]).join(", ")}`); } else setVoiceStatus("⚠️ कोई लक्षण नहीं मिला।");
    };
    rec.onerror=e=>{setListening(false);setVoiceStatus(`❌ ${e.error}`);}; rec.onend=()=>setListening(false);
    recognitionRef.current=rec; try{rec.start();}catch{setVoiceStatus("❌ Mic error.");}
  };

  const speakResult = res => {
    if (!res) return;
    const lbl = {RED:T("emergency"),YELLOW:T("referPhc"),GREEN:T("treatLocal")}[res.level];
    speak(`${lbl}. ${res.condition}. ${res.first_aid?.join(". ")}. ${res.call_108?T("call108"):""}`, lang);
    setSpeaking(true); setTimeout(()=>setSpeaking(false), 8000);
  };

  const handleImageUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImgPreview(ev.target.result);
    reader.readAsDataURL(file);
    setImgResult(null);
  };

  const analyseImage = async () => {
    if (!imgPreview) return;
    setImgLoading(true);
    setImgResult(null);
    try {
      const base64 = imgPreview.split(",")[1];
      const mediaType = imgFile?.type || "image/jpeg";
      const res = await fetch(`${API}/api/claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Analyze this medical skin image for rural India triage", image: base64, mediaType }),
      });
      const data = await res.json();
      const result = {
        triage: data?.triage || "PHC",
        diagnosis: data?.diagnosis || ["Unable to detect condition"],
        steps: data?.steps || ["Consult PHC doctor"],
        red_flags: data?.red_flags || [],
        confidence: data?.confidence || 0,
        explanation: data?.explanation || "No explanation available",
      };
      setImgResult(result);
      speak(result.diagnosis?.[0] || result.explanation || "Image analysis complete", lang);
    } catch {
      setImgResult({ triage:"PHC", diagnosis:["Image analysis failed"], steps:["Retake image","Ensure good lighting","Try again"], red_flags:[], confidence:0, explanation:"Network or processing error" });
    }
    setImgLoading(false);
  };

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatMessages(p => [...p, { role:"user", text:msg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/api/claude`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ message:msg }) });
      const data = await res.json();
      const reply = data?.explanation || "No response";
      setChatMessages(prev => [...prev, { role:"assistant", text:reply }]);
      speak(reply, lang);
    } catch {
      setChatMessages(prev => [...prev, { role:"assistant", text:"Network error. Please try again." }]);
    }
    setChatLoading(false);
  };

  const analysePregWith = async () => {
    const symptomList = pregSymptoms.map(id=>PREG_SYMPTOMS.find(s=>s.id===id)?.en).join(", ");
    const bpStr = pregBP.systolic&&pregBP.diastolic ? `BP: ${pregBP.systolic}/${pregBP.diastolic} mmHg` : "";
    setPregLoading(true);
    try {
      const res = await fetch(`${API}/api/claude`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:`You are a maternal health triage assistant for rural India ASHA workers. Patient:
Name: ${pregPatient.name||"Unknown"}, Age: ${pregPatient.age}, Weeks Pregnant: ${pregPatient.weeks||"Unknown"}, Previous Deliveries: ${pregPatient.parity}
${bpStr}
Symptoms: ${symptomList||"None reported"}
Respond JSON only (no markdown):
{
  "risk":"HIGH"|"MEDIUM"|"LOW",
  "condition":"likely condition in 4-6 words",
  "danger_signs":["list only present danger signs"],
  "call_108":true|false,
  "next_steps":["step1","step2","step3"],
  "anc_note":"short ANC visit note",
  "jssk_benefit":"relevant JSSK/PM-JAY benefit if any (short)"
}`}]})});
      const d=await res.json(); const t=d.content?.[0]?.text||"{}"; const p=JSON.parse(t.replace(/```json|```/g,"").trim());
      setPregResult(p); setPregStep(3);
      const lvl=p.risk==="HIGH"?"RED":p.risk==="MEDIUM"?"YELLOW":"GREEN";
      setCases(prev=>[{id:prev.length+1,name:pregPatient.name||"Unknown",age:parseInt(pregPatient.age)||0,sex:"F",village:pregPatient.village,asha:pregPatient.asha,symptoms:pregSymptoms,spo2:98,temp:98.6,level:lvl,condition:`🤰 ${p.condition}`,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),resolved:false},...prev]);
      speak(`${p.condition}. ${p.next_steps?.join(". ")}. ${p.call_108?T("call108"):""}`,lang);
    } catch { setPregResult({risk:"MEDIUM",condition:"Unable to assess",danger_signs:[],call_108:false,next_steps:["Contact PHC doctor","Monitor vitals","Note any changes"],anc_note:"Visit PHC for complete assessment",jssk_benefit:""}); setPregStep(3); }
    setPregLoading(false);
  };

  const sendHelp = async (msg) => {
    const m = (msg || helpInput).trim();
    if (!m || helpLoading) return;
    setHelpMessages(p => [...p, { role:"user", text:m }]);
    setHelpInput("");
    setHelpLoading(true);
    try {
      const res = await fetch(`${API}/api/claude`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ message:m }) });
      const data = await res.json();
      const reply = data?.explanation || "Try again";
      setHelpMessages(prev => [...prev, { role:"assistant", text:reply }]);
      speak(reply, lang);
    } catch {
      setHelpMessages(prev => [...prev, { role:"assistant", text:"Network error. Please try again." }]);
    }
    setHelpLoading(false);
  };

  const analyzeWithClaude = async () => {
    setLoading(true);
    const symptomList = selectedSymptoms.map(id => SYMPTOMS.find(s => s.id === id)?.en).join(", ");
    try {
      const res = await fetch(`${API}/api/claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `\nAge: ${patient.age}\nSex: ${patient.sex}\nSymptoms: ${symptomList || "None reported"}\nSpO2: ${vitals.spo2}\nTemp: ${vitals.temp}\n        ` })
      });
      const data = await res.json();
      const level = data?.triage || data?.level || "PHC";
      const condition = data?.diagnosis?.[0] || data?.condition || data?.explanation || "Unknown condition";
      setResult(data);
      setStep(3);
      speakResult(data);
      setCases(p => [{
        id: p.length + 1,
        name: patient.name || "Unknown",
        age: parseInt(patient.age) || 0,
        sex: patient.sex,
        village: patient.village,
        asha: patient.asha,
        symptoms: selectedSymptoms,
        spo2: vitals.spo2 ? parseFloat(vitals.spo2) : 98,
        temp: vitals.temp ? parseFloat(vitals.temp) : 98.6,
        level,
        condition,
        time: new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }),
        resolved: false
      }, ...p]);
    } catch {
      setResult({ triage:"PHC", diagnosis:["Unable to analyze"], steps:["Check vitals","Contact PHC doctor"], red_flags:[], confidence:0, explanation:"Network or server error" });
      setStep(3);
    }
    setLoading(false);
  };

  const useMockResult = () => {
    const mock={level:"RED",condition:"Suspected Cardiac Event",confidence:85,first_aid:["Lay flat, loosen clothes","Do not give food or water","Keep patient calm and still"],call_108:true,extra_symptom:"jaw pain or numbness"};
    setResult(mock); setStep(3); speakResult(mock);
    setCases(p=>[{id:p.length+1,name:patient.name||"Unknown",age:parseInt(patient.age)||30,sex:patient.sex,village:patient.village,asha:patient.asha,symptoms:selectedSymptoms,spo2:93,temp:99.1,level:"RED",condition:mock.condition,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),resolved:false},...p]);
  };

  const resetForm = () => { setStep(1); setPatient({name:"",age:"",sex:"M",village:VILLAGES[0],asha:ASHAS[0]}); setSelectedSymptoms([]); setVitals({spo2:"",temp:""}); setResult(null); setImgFile(null); setImgPreview(null); setImgResult(null); setActiveTab("symptoms"); };
  const resetPreg = () => { setPregStep(1); setPregPatient({name:"",age:"",weeks:"",parity:"0",lmp:"",village:VILLAGES[0],asha:ASHAS[0]}); setPregSymptoms([]); setPregBP({systolic:"",diastolic:""}); setPregResult(null); };

  const redCases=cases.filter(c=>c.level==="RED"&&!c.resolved).length;
  const yellowCases=cases.filter(c=>c.level==="YELLOW"&&!c.resolved).length;
  const greenCases=cases.filter(c=>c.level==="GREEN").length;
  const vg=cases.reduce((a,c)=>{(a[c.village]=a[c.village]||[]).push(c);return a;},{});
  const outbreakVillages=Object.entries(vg).filter(([,cs])=>cs.length>=3).map(([v])=>v);

  const S = {
    app:   {fontFamily:"'Noto Sans','Noto Sans Devanagari',sans-serif",minHeight:"100vh",background:"#f4f3ee",color:"#1a1a1a"},
    topBar:{background:"#1a472a",padding:"0 12px",display:"flex",alignItems:"center",justifyContent:"space-between",height:90,position:"sticky",top:0,zIndex:100,flexWrap:"wrap",gap:2},
    topTitle:{color:"#fff",fontWeight:700,fontSize:16},
    topSub:{color:"#86efac",fontSize:10},
    navBtn:(a)=>({background:a?"#fff":"transparent",color:a?"#1a472a":"#fff",border:a?"none":"1px solid rgba(255,255,255,0.3)",borderRadius:18,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:a?700:400,whiteSpace:"nowrap"}),
    pinkBtn:(a)=>({background:a?"#fce4ec":"transparent",color:a?"#880e4f":"#fce4ec",border:a?"none":"1px solid rgba(252,228,236,0.5)",borderRadius:18,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:a?700:400,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}),
    helpNavBtn:(a)=>({background:a?"#fff9c4":"transparent",color:a?"#f57f17":"#fff9c4",border:a?"none":"1px solid rgba(255,249,196,0.5)",borderRadius:18,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:a?700:400,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}),
    langBtn:(a)=>({background:a?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.1)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",borderRadius:12,padding:"3px 8px",fontSize:10,cursor:"pointer",fontWeight:a?700:400}),
    card:{background:"#fff",borderRadius:12,padding:18,marginBottom:14,border:"1px solid #e5e3db"},
    label:{fontSize:12,color:"#666",marginBottom:4,display:"block",fontWeight:500},
    input:{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #d4d2ca",fontSize:14,boxSizing:"border-box",fontFamily:"inherit",background:"#fff"},
    select:{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #d4d2ca",fontSize:14,background:"#fff",fontFamily:"inherit"},
    btnGreen:{background:"#1a472a",color:"#fff",border:"none",borderRadius:8,padding:"12px 24px",fontSize:15,cursor:"pointer",fontWeight:700,width:"100%"},
    btnPink:{background:"#880e4f",color:"#fff",border:"none",borderRadius:8,padding:"12px 24px",fontSize:15,cursor:"pointer",fontWeight:700,width:"100%"},
    btnOutline:{background:"transparent",color:"#1a472a",border:"2px solid #1a472a",borderRadius:8,padding:"10px 24px",fontSize:14,cursor:"pointer",fontWeight:600},
    btnMock:{background:"transparent",color:"#999",border:"1.5px dashed #ccc",borderRadius:8,padding:"10px 24px",fontSize:13,cursor:"pointer",width:"100%"},
    chip:(sel,col="#1a472a")=>({display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:20,border:sel?`2px solid ${col}`:"1.5px solid #d4d2ca",background:sel?`${col}18`:"#fff",cursor:"pointer",fontSize:12,margin:"3px",fontWeight:sel?600:400,color:sel?col:"#333"}),
    stepDot:(a,d)=>({width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,background:d?"#1a472a":a?"#e8f5e9":"#f0f0f0",color:d?"#fff":a?"#1a472a":"#999",border:d||a?"2px solid #1a472a":"2px solid #ddd"}),
    pregStepDot:(a,d)=>({width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,background:d?"#880e4f":a?"#fce4ec":"#f0f0f0",color:d?"#fff":a?"#880e4f":"#999",border:d||a?"2px solid #880e4f":"2px solid #ddd"}),
    tab:(a)=>({flex:1,padding:"10px 4px",background:a?"#fff":"transparent",border:"none",borderBottom:a?"3px solid #1a472a":"3px solid transparent",cursor:"pointer",fontSize:12,fontWeight:a?700:400,color:a?"#1a472a":"#888"}),
    mc:(col)=>({background:col.bg,border:`1.5px solid ${col.border}`,borderRadius:10,padding:"12px 10px",textAlign:"center"}),
  };

  if (view==="landing") return (
    <div style={{fontFamily:"'Noto Sans','Noto Sans Devanagari',sans-serif",minHeight:"100vh",background:"#0d2b1a",color:"#fff",overflow:"hidden",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=DM+Serif+Display:ital@0;1&family=Noto+Sans:wght@400;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse108{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,77,79,0.4)}50%{transform:scale(1.03);box-shadow:0 0 0 8px rgba(255,77,79,0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .land-fade1{animation:fadeUp 0.7s ease both;animation-delay:0.1s}
        .land-fade2{animation:fadeUp 0.7s ease both;animation-delay:0.3s}
        .land-fade3{animation:fadeUp 0.7s ease both;animation-delay:0.5s}
        .land-fade4{animation:fadeUp 0.7s ease both;animation-delay:0.7s}
        .land-fade5{animation:fadeUp 0.7s ease both;animation-delay:0.9s}
        .land-hero{animation:float 5s ease-in-out infinite}
        .cta-asha:hover{background:#2d6a3f!important;transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,71,42,0.5)!important}
        .cta-phc:hover{background:#0f3d6e!important;transform:translateY(-2px);box-shadow:0 8px 24px rgba(24,95,165,0.5)!important}
        .cta-asha,.cta-phc{transition:all 0.2s ease}
        .stat-card:hover{background:rgba(255,255,255,0.12)!important}
        .stat-card{transition:background 0.2s ease}
      `}</style>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:-120,left:"50%",transform:"translateX(-50%)",width:600,height:300,background:"radial-gradient(ellipse,rgba(52,211,153,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#34d399,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚕</div>
          <div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,color:"#fff",letterSpacing:0.3}}>Jugaad Diagnostics</div>
            <div style={{fontSize:10,color:"#6ee7b7",letterSpacing:1}}>जुगाड़ डायग्नोस्टिक्स</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["hi","en","mr"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{background:lang===l?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.06)",color:"#fff",border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,padding:"4px 10px",fontSize:11,cursor:"pointer",fontWeight:lang===l?700:400}}>
              {l==="hi"?"हि":l==="mr"?"मर":"EN"}
            </button>
          ))}
        </div>
      </div>
      <div style={{position:"relative",zIndex:5,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 24px 0",textAlign:"center"}}>
        <div className="land-fade1" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(52,211,153,0.12)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:20,padding:"5px 16px",fontSize:12,color:"#6ee7b7",marginBottom:24,letterSpacing:0.5}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block"}}/>
          Rajasthan · Rural Health Initiative
        </div>
        <h1 className="land-fade2" style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(28px,6vw,52px)",lineHeight:1.15,margin:"0 0 6px",maxWidth:640,background:"linear-gradient(135deg,#fff 40%,#6ee7b7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {lang==="hi" ? "हर गाँव में एक\nडिजिटल डॉक्टर" : lang==="mr" ? "हर गाँव में एक\nडिजिटल वैद्य" : "A Digital Doctor\nfor Every Village"}
        </h1>
        <p className="land-fade2" style={{fontFamily:"'Tiro Devanagari Hindi',serif",fontSize:14,color:"rgba(255,255,255,0.55)",margin:"8px 0 32px",maxWidth:440,lineHeight:1.7}}>
          {lang==="hi" ? "भारत के 6 लाख गाँवों में — जहाँ कोई डॉक्टर नहीं — वहाँ आशा की जेब में AI" : lang==="mr" ? "6 लाख गाँवां में — जठे कोई डॉक्टर नहीं — थे आशा री जेब में AI" : "Putting AI-powered triage in the pocket of every ASHA worker across India's 600,000 villages"}
        </p>
        <div className="land-hero land-fade3" style={{width:"100%",maxWidth:420,margin:"0 auto 32px"}}>
          <svg viewBox="0 0 420 360" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"auto",filter:"drop-shadow(0 20px 40px rgba(0,0,0,0.5))"}}>
            <ellipse cx="210" cy="280" rx="200" ry="40" fill="rgba(52,211,153,0.06)"/>
            <ellipse cx="210" cy="330" rx="130" ry="14" fill="rgba(0,0,0,0.35)"/>
            <ellipse cx="210" cy="295" rx="72" ry="48" fill="#0d5c4a"/>
            <path d="M148 270 Q155 310 165 335 Q185 345 210 345 Q235 345 255 335 Q265 310 272 270 Q245 255 210 253 Q175 255 148 270Z" fill="#0f6b55"/>
            <path d="M150 275 Q155 308 163 330 Q183 342 210 342 Q237 342 257 330 Q265 308 270 275" fill="none" stroke="#d4a017" strokeWidth="2.5" strokeDasharray="5,3"/>
            <path d="M178 222 Q180 248 188 260 Q200 268 210 268 Q220 268 232 260 Q240 248 242 222 Q230 215 210 214 Q190 215 178 222Z" fill="#0e7a60"/>
            <rect x="203" y="200" width="14" height="18" rx="6" fill="#c68642"/>
            <ellipse cx="210" cy="178" rx="34" ry="38" fill="#c68642"/>
            <path d="M176 168 Q178 130 210 126 Q242 130 244 168 Q230 155 210 154 Q190 155 176 168Z" fill="#1a1a1a"/>
            <circle cx="220" cy="130" r="15" fill="#1a1a1a"/>
            <circle cx="210" cy="160" r="3.5" fill="#eb2f96"/>
            <path d="M205 200 Q210 210 215 200" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
            <ellipse cx="200" cy="175" rx="4" ry="5" fill="#8b5e3c"/>
            <ellipse cx="220" cy="175" rx="4" ry="5" fill="#8b5e3c"/>
            <ellipse cx="200" cy="174" rx="2.5" ry="3" fill="#1a1a1a"/>
            <ellipse cx="220" cy="174" rx="2.5" ry="3" fill="#1a1a1a"/>
            <path d="M203 190 Q210 196 217 190" fill="none" stroke="#8b4513" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M195 168 Q200 165 205 168" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
            <path d="M215 168 Q220 165 225 168" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
            <path d="M178 232 Q162 248 155 270 Q152 282 158 288" fill="none" stroke="#c68642" strokeWidth="13" strokeLinecap="round"/>
            <path d="M242 232 Q260 245 270 260 Q278 270 272 278" fill="none" stroke="#c68642" strokeWidth="13" strokeLinecap="round"/>
            <rect x="130" y="270" width="44" height="72" rx="8" fill="#1a1a2e" stroke="#34d399" strokeWidth="2"/>
            <rect x="134" y="278" width="36" height="52" rx="4" fill="#0d2b1a"/>
            <rect x="137" y="282" width="30" height="8" rx="3" fill="#34d399" opacity="0.9"/>
            <rect x="137" y="294" width="20" height="5" rx="2" fill="rgba(255,255,255,0.4)"/>
            <rect x="137" y="303" width="24" height="5" rx="2" fill="rgba(255,255,255,0.3)"/>
            <rect x="137" y="313" width="30" height="10" rx="3" fill="#ff4d4f"/>
            <text x="152" y="321" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">EMERGENCY</text>
            <circle cx="152" cy="338" r="3" fill="#333" stroke="#555" strokeWidth="1"/>
            <path d="M174 275 Q182 265 195 268" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.7"/>
            <circle cx="196" cy="268" r="2.5" fill="#34d399" opacity="0.8"/>
            <path d="M196 210 Q190 220 188 232 Q187 240 192 243" fill="none" stroke="#b0b0b0" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M224 210 Q230 220 232 232 Q233 240 228 243" fill="none" stroke="#b0b0b0" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M192 243 Q210 252 228 243" fill="none" stroke="#b0b0b0" strokeWidth="2.5"/>
            <circle cx="210" cy="253" r="5" fill="#9e9e9e" stroke="#b0b0b0" strokeWidth="1.5"/>
            <rect x="196" y="230" width="28" height="16" rx="4" fill="#e53935"/>
            <text x="210" y="241" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold">ASHA</text>
            <circle cx="90" cy="160" r="4" fill="#34d399" opacity="0.6"/>
            <circle cx="330" cy="140" r="3" fill="#34d399" opacity="0.4"/>
            <circle cx="80" cy="230" r="2.5" fill="#6ee7b7" opacity="0.5"/>
            <circle cx="350" cy="220" r="3.5" fill="#6ee7b7" opacity="0.35"/>
            <circle cx="310" cy="290" r="2" fill="#34d399" opacity="0.5"/>
            <line x1="174" y1="295" x2="95" y2="220" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" opacity="0.3"/>
            <line x1="174" y1="295" x2="340" y2="200" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" opacity="0.3"/>
          </svg>
        </div>
        <div className="land-fade4" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,maxWidth:420,width:"100%",marginBottom:36}}>
          {[
            {num:"1M+", label:lang==="hi"?"आशा कारकर":lang==="mr"?"आशा कारकर":"ASHA Workers"},
            {num:"6L",  label:lang==="hi"?"गाँव":lang==="mr"?"गाँव":"Villages"},
            {num:"52%", label:lang==="hi"?"मृत्यु रोकी जा सकती":lang==="mr"?"मृत्यु रोकी जा सकै":"Deaths Preventable"},
          ].map((s,i)=>(
            <div key={i} className="stat-card" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:800,color:"#34d399",fontFamily:"'DM Serif Display',serif"}}>{s.num}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginTop:3,lineHeight:1.4}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="land-fade5" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:420,width:"100%",marginBottom:20}}>
          <button className="cta-asha" onClick={()=>setView("home")} style={{background:"#1a472a",color:"#fff",border:"2px solid #34d399",borderRadius:14,padding:"16px 12px",fontSize:15,cursor:"pointer",fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:6,boxShadow:"0 4px 16px rgba(26,71,42,0.4)"}}>
            <span style={{fontSize:28}}>🩺</span>
            <span>{lang==="hi"?"आशा ऐप":lang==="mr"?"आशा ऐप":"ASHA App"}</span>
            <span style={{fontSize:11,fontWeight:400,color:"#6ee7b7",lineHeight:1.4}}>{lang==="hi"?"मरीज़ जाँचें":lang==="mr"?"मरीज़ जाँचो":"Triage Patients"}</span>
          </button>
          <button className="cta-phc" onClick={()=>setView("phc")} style={{background:"#0c2340",color:"#fff",border:"2px solid #378add",borderRadius:14,padding:"16px 12px",fontSize:15,cursor:"pointer",fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:6,boxShadow:"0 4px 16px rgba(12,35,64,0.4)"}}>
            <span style={{fontSize:28}}>🏥</span>
            <span>{lang==="hi"?"PHC डैशबोर्ड":lang==="mr"?"PHC डैशबोर्ड":"PHC Dashboard"}</span>
            <span style={{fontSize:11,fontWeight:400,color:"#85b7eb",lineHeight:1.4}}>{lang==="hi"?"डॉक्टर व्यू":lang==="mr"?"डॉक्टर व्यू":"Doctor View"}</span>
          </button>
        </div>
        <div className="land-fade5" style={{display:"flex",gap:16,marginBottom:36}}>
          <button onClick={()=>{setView("pregnancy");}} style={{background:"transparent",color:"#f9a8d4",border:"1px solid rgba(249,168,212,0.3)",borderRadius:20,padding:"7px 16px",fontSize:12,cursor:"pointer",fontWeight:500}}>🤰 {lang==="hi"?"गर्भावस्था जाँच":lang==="mr"?"गर्भावस्था जाँच":"Pregnancy"}</button>
          <button onClick={()=>setView("help")} style={{background:"transparent",color:"#fde68a",border:"1px solid rgba(253,230,138,0.3)",borderRadius:20,padding:"7px 16px",fontSize:12,cursor:"pointer",fontWeight:500}}>💡 {lang==="hi"?"सहायता":lang==="mr"?"मदद":"Help"}</button>
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginBottom:24,letterSpacing:0.5}}>
          Built for Bharat · Powered by AI · Made with ❤ for ASHA workers by team CitiZen
        </div>
      </div>
    </div>
  );

  if (view==="phc") return (
    <div style={S.app}>
      <div style={S.topBar}>
        <div><div style={S.topTitle}>PHC Dashboard</div><div style={S.topSub}>Dr. Meena Singh · Barmer Block</div></div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <button style={{...S.navBtn(false),borderColor:"rgba(255,255,255,0.5)"}} onClick={()=>setView("landing")}>⌂</button>
          <button style={S.navBtn(false)} onClick={()=>setView("home")}>{T("ashaApp")}</button>
          <button style={S.navBtn(true)}>{T("phcView")}</button>
          <button style={S.pinkBtn(false)} onClick={()=>{setView("pregnancy");resetPreg();}}>🤰 {T("pregnancyBtn")}</button>
          <button style={S.helpNavBtn(false)} onClick={()=>setView("help")}>💡 {T("helpBtn")}</button>
          <div style={{display:"flex",gap:1}}>{["hi","en","mr"].map(l=><button key={l} style={S.langBtn(lang===l)} onClick={()=>setLang(l)}>{l==="hi"?"हि":l==="mr"?"मर":"EN"}</button>)}</div>
        </div>
      </div>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"18px 14px"}}>
        {outbreakVillages.length>0&&<div style={{background:"#fff7e6",border:"2px solid #fa8c16",borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}><span>⚠️</span><div><div style={{fontWeight:700,color:"#873800",fontSize:14}}>{T("outbreakAlert")}</div><div style={{fontSize:13,color:"#874d00"}}>{T("outbreakMsg")}: <strong>{outbreakVillages.join(", ")}</strong> {T("possibleCluster")}</div></div></div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:18}}>
          {[{label:"Emergency",value:redCases,...levelColor("RED")},{label:"Refer to PHC",value:yellowCases,...levelColor("YELLOW")},{label:"Treated Locally",value:greenCases,...levelColor("GREEN")},{label:"Total Today",value:cases.length,bg:"#f0f4ff",border:"#597ef7",text:"#1d39c4"}].map((m,i)=>(
            <div key={i} style={S.mc(m)}><div style={{fontSize:26,fontWeight:700,color:m.text}}>{m.value}</div><div style={{fontSize:11,color:m.text,opacity:0.8,marginTop:2}}>{m.label}</div></div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>{T("todayCases")}</div>
          {cases.map(c=>{const col=levelColor(c.level);return(
            <div key={c.id} style={{display:"flex",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f0f0ee",gap:10}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:col.badge,flexShrink:0}}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{c.name} <span style={{fontWeight:400,color:"#888",fontSize:12}}>· {c.age}y {c.sex} · {c.village}</span></div><div style={{fontSize:11,color:"#666"}}>{c.condition} · {c.asha} · {c.time}</div></div>
              <div style={{fontSize:10,background:col.bg,color:col.text,border:`1px solid ${col.border}`,borderRadius:10,padding:"2px 8px",fontWeight:600}}>{c.level}</div>
              {c.resolved&&<div style={{fontSize:10,background:"#f6ffed",color:"#135200",border:"1px solid #b7eb8f",borderRadius:10,padding:"2px 8px"}}>{T("resolved")}</div>}
            </div>
          );})}
        </div>
        <div style={S.card}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>{T("ashaActive")}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {ASHAS.map((a,i)=>{const ac=cases.filter(c=>c.asha===a);const active=ac.length>0;return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:8,background:active?"#f6ffed":"#fafaf8",border:`1px solid ${active?"#b7eb8f":"#e5e3db"}`}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:active?"#1a472a":"#d4d2ca",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>{a.split(" ").map(x=>x[0]).join("")}</div>
                <div><div style={{fontWeight:600,fontSize:13}}>{a}</div><div style={{fontSize:11,color:"#888"}}>{active?`${ac.length} ${T("casesLogged")}`:T("noCases")}</div></div>
                <div style={{marginLeft:"auto",width:8,height:8,borderRadius:"50%",background:active?"#52c41a":"#d4d2ca"}}/>
              </div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );

  if (view==="pregnancy") return (
    <div style={S.app}>
      <div style={S.topBar}>
        <div><div style={S.topTitle}>🤰 {T("pregTitle")}</div><div style={S.topSub}>{T("pregSub")}</div></div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <button style={{...S.navBtn(false),borderColor:"rgba(255,255,255,0.5)"}} onClick={()=>setView("landing")}>⌂</button>
          <button style={S.navBtn(false)} onClick={()=>setView("home")}>{T("ashaApp")}</button>
          <button style={S.navBtn(false)} onClick={()=>setView("phc")}>{T("phcView")}</button>
          <button style={S.pinkBtn(true)}>🤰 {T("pregnancyBtn")}</button>
          <button style={S.helpNavBtn(false)} onClick={()=>setView("help")}>💡 {T("helpBtn")}</button>
          <div style={{display:"flex",gap:3}}>{["hi","en","mr"].map(l=><button key={l} style={S.langBtn(lang===l)} onClick={()=>setLang(l)}>{l==="hi"?"हि":l==="mr"?"मर":"EN"}</button>)}</div>
        </div>
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"18px 14px"}}>
        {pregStep<3&&(
          <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
            {[1,2].map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",flex:i<1?"1":"0"}}>
                <div style={S.pregStepDot(pregStep===s,pregStep>s)}>{pregStep>s?"✓":s}</div>
                {i<1&&<div style={{flex:1,height:2,background:pregStep>1?"#880e4f":"#ddd",margin:"0 8px"}}/>}
              </div>
            ))}
            <div style={{marginLeft:8,fontSize:12,color:"#666"}}>{pregStep===1?"माँ की जानकारी":"लक्षण जाँचें"}</div>
          </div>
        )}
        {pregStep===1&&(
          <div style={S.card}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:14,color:"#880e4f"}}>🤱 {T("pregName")}</div>
            <div style={{marginBottom:12}}><label style={S.label}>{T("pregName")}</label><input style={S.input} value={pregPatient.name} onChange={e=>setPregPatient(p=>({...p,name:e.target.value}))} placeholder={T("enterName")}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div><label style={S.label}>{T("pregAge")}</label><input style={S.input} type="number" value={pregPatient.age} onChange={e=>setPregPatient(p=>({...p,age:e.target.value}))} placeholder="e.g. 24"/></div>
              <div><label style={S.label}>{T("pregWeeks")}</label><input style={S.input} type="number" value={pregPatient.weeks} onChange={e=>setPregPatient(p=>({...p,weeks:e.target.value}))} placeholder={T("pregWeeksHint")}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div><label style={S.label}>{T("pregParity")}</label>
                <select style={S.select} value={pregPatient.parity} onChange={e=>setPregPatient(p=>({...p,parity:e.target.value}))}>
                  {["0","1","2","3","4+"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div><label style={S.label}>BP (mmHg)</label>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input style={{...S.input,padding:"10px 8px"}} type="number" value={pregBP.systolic} onChange={e=>setPregBP(p=>({...p,systolic:e.target.value}))} placeholder="120"/>
                  <span style={{color:"#888",fontWeight:600}}>/</span>
                  <input style={{...S.input,padding:"10px 8px"}} type="number" value={pregBP.diastolic} onChange={e=>setPregBP(p=>({...p,diastolic:e.target.value}))} placeholder="80"/>
                </div>
              </div>
            </div>
            <div style={{marginBottom:12}}><label style={S.label}>{T("village")}</label><select style={S.select} value={pregPatient.village} onChange={e=>setPregPatient(p=>({...p,village:e.target.value}))}>{VILLAGES.map(v=><option key={v}>{v}</option>)}</select></div>
            <div style={{marginBottom:18}}><label style={S.label}>{T("ashaWorker")}</label><select style={S.select} value={pregPatient.asha} onChange={e=>setPregPatient(p=>({...p,asha:e.target.value}))}>{ASHAS.map(a=><option key={a}>{a}</option>)}</select></div>
            <button style={{...S.btnPink,opacity:!pregPatient.age?0.5:1}} onClick={()=>setPregStep(2)} disabled={!pregPatient.age}>{T("next")}</button>
          </div>
        )}
        {pregStep===2&&(
          <div style={S.card}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:4,color:"#880e4f"}}>{T("pregSymptoms")}</div>
            <div style={{fontSize:12,color:"#888",marginBottom:14}}>सभी लागू लक्षण चुनें</div>
            <div style={{display:"flex",flexWrap:"wrap",marginBottom:18}}>
              {PREG_SYMPTOMS.map(s=>(
                <div key={s.id} style={S.chip(pregSymptoms.includes(s.id),"#880e4f")} onClick={()=>togglePregSymptom(s.id)}>
                  {pregSymptoms.includes(s.id)?"✓ ":""}
                  {lang==="mr"?s.mr:lang==="hi"?s.hi:s.en}
                </div>
              ))}
            </div>
            {["p_bleeding","p_convulsions","p_vision","p_fetal"].some(id=>pregSymptoms.includes(id))&&(
              <div style={{background:"#fff0f6",border:"2px solid #eb2f96",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:20}}>🚨</span>
                <div style={{fontWeight:600,fontSize:13,color:"#780650"}}>{T("pregDangerSigns")} — Call 108 immediately!</div>
              </div>
            )}
            <button style={{...S.btnPink,opacity:pregLoading?0.6:1}} onClick={analysePregWith} disabled={pregLoading}>
              {pregLoading?T("pregAnalysing"):("🤰 "+T("pregAnalyse"))}
            </button>
          </div>
        )}
        {pregStep===3&&pregResult&&(()=>{
          const col=pinkColor(pregResult.risk==="HIGH"?"RED":pregResult.risk==="MEDIUM"?"YELLOW":"GREEN");
          const riskLabel={HIGH:"HIGH RISK 🚨",MEDIUM:"MODERATE RISK ⚠️",LOW:"LOW RISK ✅"}[pregResult.risk];
          return(
            <div>
              <div style={{background:col.bg,border:`2px solid ${col.border}`,borderRadius:14,padding:18,marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <span style={{fontSize:32}}>🤰</span>
                  <div>
                    <div style={{fontWeight:800,fontSize:20,color:col.text}}>{riskLabel}</div>
                    <div style={{fontSize:14,color:col.text,opacity:0.85}}>{pregResult.condition}</div>
                  </div>
                  <button onClick={()=>speak(`${pregResult.condition}. ${pregResult.next_steps?.join(". ")}`,lang)} style={{marginLeft:"auto",background:"rgba(255,255,255,0.7)",border:`1px solid ${col.border}`,borderRadius:8,padding:"6px 10px",fontSize:11,cursor:"pointer",color:col.text}}>🔊</button>
                </div>
                {pregResult.danger_signs?.length>0&&(
                  <div style={{background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                    <div style={{fontWeight:700,fontSize:12,color:col.text,marginBottom:6}}>⚠️ {T("pregDangerSigns")}:</div>
                    {pregResult.danger_signs.map((s,i)=><div key={i} style={{fontSize:13,color:col.text,marginBottom:3}}>• {s}</div>)}
                  </div>
                )}
                {pregResult.call_108&&(
                  <div style={{background:"#ff4d4f",borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>📞</span>
                    <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{T("call108")}</div><div style={{color:"rgba(255,255,255,0.85)",fontSize:12}}>{T("ambulance")}</div></div>
                  </div>
                )}
                <div>
                  <div style={{fontWeight:700,fontSize:12,color:col.text,marginBottom:7}}>{T("immediateSteps")}</div>
                  {pregResult.next_steps?.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:9,marginBottom:7,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:col.border,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
                      <div style={{fontSize:13,color:col.text,lineHeight:1.5}}>{s}</div>
                    </div>
                  ))}
                </div>
                {pregResult.anc_note&&<div style={{marginTop:10,padding:"8px 12px",background:"rgba(255,255,255,0.7)",borderRadius:8,fontSize:12,color:col.text}}>📋 <strong>ANC:</strong> {pregResult.anc_note}</div>}
                {pregResult.jssk_benefit&&<div style={{marginTop:6,padding:"8px 12px",background:"rgba(255,255,255,0.7)",borderRadius:8,fontSize:12,color:"#1a472a"}}>💚 <strong>JSSK/PM-JAY:</strong> {pregResult.jssk_benefit}</div>}
              </div>
              <div style={{...S.card,borderLeft:"4px solid #eb2f96",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:15}}>📲</span>
                  <div style={{fontWeight:600,fontSize:13,color:"#780650"}}>{T("phcNotified")}</div>
                  <div style={{marginLeft:"auto",background:"#fff0f6",color:"#eb2f96",fontSize:10,padding:"2px 8px",borderRadius:10,border:"1px solid #ffadd2"}}>✓ Sent</div>
                </div>
                <div style={{fontSize:12,color:"#555"}}>Dr. Meena Singh · Barmer PHC · {new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <button style={S.btnOutline} onClick={resetPreg}>नई माँ</button>
                <button style={S.btnPink} onClick={()=>setView("phc")}>{T("phcDash")}</button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  if (view==="help") return (
    <div style={S.app}>
      <div style={S.topBar}>
        <div><div style={S.topTitle}>💡 {T("helpTitle")}</div><div style={S.topSub}>{T("helpSub")}</div></div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <button style={{...S.navBtn(false),borderColor:"rgba(255,255,255,0.5)"}} onClick={()=>setView("landing")}>⌂</button>
          <button style={S.navBtn(false)} onClick={()=>setView("home")}>{T("ashaApp")}</button>
          <button style={S.navBtn(false)} onClick={()=>setView("phc")}>{T("phcView")}</button>
          <button style={S.pinkBtn(false)} onClick={()=>{setView("pregnancy");resetPreg();}}>🤰 {T("pregnancyBtn")}</button>
          <button style={S.helpNavBtn(true)}>💡 {T("helpBtn")}</button>
          <div style={{display:"flex",gap:3}}>{["hi","en","mr"].map(l=><button key={l} style={S.langBtn(lang===l)} onClick={()=>setLang(l)}>{l==="hi"?"हि":l==="mr"?"मर":"EN"}</button>)}</div>
        </div>
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"18px 14px"}}>
        <div style={S.card}>
          <div style={{fontWeight:600,fontSize:13,color:"#f57f17",marginBottom:10}}>⚡ {T("helpSuggested")}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {(HELP_QUICK[lang]||HELP_QUICK["hi"]).map((q,i)=>(
              <button key={i} onClick={()=>sendHelp(q)} style={{background:"#fff9c4",color:"#e65100",border:"1px solid #ffe082",borderRadius:16,padding:"5px 12px",fontSize:12,cursor:"pointer",fontWeight:500}}>{q}</button>
            ))}
          </div>
        </div>
        <div style={{...S.card,padding:0,overflow:"hidden"}}>
          <div style={{background:"#f57f17",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"#fff9c4",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#e65100"}}>🤖</div>
            <div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>{T("helpTitle")}</div><div style={{color:"#fff9c4",fontSize:11}}>● {T("ashaWorker")} AI Assistant</div></div>
          </div>
          <div style={{height:320,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10,background:"#fffde7"}}>
            {helpMessages.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",background:"#f57f17",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:6,alignSelf:"flex-end"}}>🤖</div>}
                <div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",background:m.role==="user"?"#1a472a":"#fff",color:m.role==="user"?"#fff":"#1a1a1a",fontSize:13,lineHeight:1.6,border:m.role==="assistant"?"1px solid #ffe082":"none"}}>
                  {m.text}
                  {m.role==="assistant"&&<button onClick={()=>speak(m.text,lang)} style={{display:"block",marginTop:5,background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#f57f17",padding:0}}>🔊 {T("voiceOutput")}</button>}
                </div>
              </div>
            ))}
            {helpLoading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:"#fff",borderRadius:"12px 12px 12px 2px",padding:"10px 14px",fontSize:13,color:"#888",border:"1px solid #ffe082"}}>{T("helpTyping")}</div></div>}
            <div ref={helpEndRef}/>
          </div>
          <div style={{borderTop:"1px solid #ffe082",padding:"10px 12px",display:"flex",gap:8,background:"#fffde7"}}>
            <input value={helpInput} onChange={e=>setHelpInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendHelp()} placeholder={T("helpPlaceholder")} style={{...S.input,flex:1,padding:"8px 12px",fontSize:13,background:"#fff",borderColor:"#ffe082"}}/>
            <button onClick={()=>sendHelp()} disabled={!helpInput.trim()||helpLoading} style={{background:"#f57f17",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:700,opacity:!helpInput.trim()||helpLoading?0.5:1}}>{T("helpSend")}</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.app}>
      <div style={S.topBar}>
        <div><div style={S.topTitle}>Jugaad Diagnostics</div><div style={S.topSub}>जुगाड़ डायग्नोस्टिक्स · {T("appSub")}</div></div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <button style={{...S.navBtn(false),borderColor:"rgba(255,255,255,0.5)"}} onClick={()=>setView("landing")}>⌂</button>
          <button style={S.navBtn(true)}>{T("ashaApp")}</button>
          <button style={S.navBtn(false)} onClick={()=>setView("phc")}>{T("phcView")}</button>
          <button style={S.pinkBtn(false)} onClick={()=>{setView("pregnancy");resetPreg();}}>🤰 {T("pregnancyBtn")}</button>
          <button style={S.helpNavBtn(false)} onClick={()=>setView("help")}>💡 {T("helpBtn")}</button>
          <div style={{display:"flex",gap:3}}>{["hi","en","mr"].map(l=><button key={l} style={S.langBtn(lang===l)} onClick={()=>setLang(l)}>{l==="hi"?"हि":l==="mr"?"मर":"EN"}</button>)}</div>
        </div>
      </div>
      <div style={{maxWidth:520,margin:"0 auto",padding:"18px 14px"}}>
        {step<3&&(
          <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
            {[1,2].map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",flex:i<1?"1":"0"}}>
                <div style={S.stepDot(step===s,step>s)}>{step>s?"✓":s}</div>
                {i<1&&<div style={{flex:1,height:2,background:step>1?"#1a472a":"#ddd",margin:"0 8px"}}/>}
              </div>
            ))}
            <div style={{marginLeft:8,fontSize:12,color:"#666"}}>{step===1?T("newPatient"):T("selectSymptoms")}</div>
          </div>
        )}
        {step===1&&(
          <div style={S.card}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:14,color:"#1a472a"}}>{T("newPatient")}</div>
            <div style={{marginBottom:12}}><label style={S.label}>{T("patientName")}</label><input style={S.input} value={patient.name} onChange={e=>setPatient(p=>({...p,name:e.target.value}))} placeholder={T("enterName")}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div><label style={S.label}>{T("age")}</label><input style={S.input} type="number" value={patient.age} onChange={e=>setPatient(p=>({...p,age:e.target.value}))} placeholder="e.g. 45"/></div>
              <div><label style={S.label}>{T("sex")}</label>
                <div style={{display:"flex",gap:6,marginTop:4}}>
                  {["M","F"].map(s=><button key={s} onClick={()=>setPatient(p=>({...p,sex:s}))} style={{flex:1,padding:9,borderRadius:8,border:`2px solid ${patient.sex===s?"#1a472a":"#d4d2ca"}`,background:patient.sex===s?"#e8f5e9":"#fff",fontWeight:600,cursor:"pointer",color:patient.sex===s?"#1a472a":"#666",fontSize:13}}>{s==="M"?T("male"):T("female")}</button>)}
                </div>
              </div>
            </div>
            <div style={{marginBottom:12}}><label style={S.label}>{T("village")}</label><select style={S.select} value={patient.village} onChange={e=>setPatient(p=>({...p,village:e.target.value}))}>{VILLAGES.map(v=><option key={v}>{v}</option>)}</select></div>
            <div style={{marginBottom:18}}><label style={S.label}>{T("ashaWorker")}</label><select style={S.select} value={patient.asha} onChange={e=>setPatient(p=>({...p,asha:e.target.value}))}>{ASHAS.map(a=><option key={a}>{a}</option>)}</select></div>
            <button style={{...S.btnGreen,opacity:!patient.age?0.5:1}} onClick={()=>setStep(2)} disabled={!patient.age}>{T("next")}</button>
          </div>
        )}
        {step===2&&(
          <div>
            <div style={{display:"flex",background:"#fff",borderRadius:"12px 12px 0 0",border:"1px solid #e5e3db",borderBottom:"none"}}>
              <button style={S.tab(activeTab==="symptoms")} onClick={()=>setActiveTab("symptoms")}>🩺 {T("selectSymptoms")}</button>
              <button style={S.tab(activeTab==="image")}    onClick={()=>setActiveTab("image")}>📷 {T("imageTab")}</button>
              <button style={S.tab(activeTab==="chat")}     onClick={()=>setActiveTab("chat")}>💬 {T("chatTab")}</button>
            </div>
            {activeTab==="symptoms"&&(
              <div style={{...S.card,borderRadius:"0 0 12px 12px",marginTop:0}}>
                <div style={{fontSize:12,color:"#888",marginBottom:12}}>{T("tapAll")}</div>
                <button onClick={startVoice} style={{...S.btnOutline,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8,borderColor:listening?"#ff4d4f":"#1a472a",color:listening?"#ff4d4f":"#1a472a",background:listening?"#fff1f0":"transparent"}}>
                  <span style={{fontSize:16}}>{listening?"⏹":"🎙"}</span>{listening?T("stopBtn"):T("speakBtn")}
                </button>
                {voiceStatus&&<div style={{fontSize:12,marginBottom:10,padding:"6px 10px",borderRadius:6,background:voiceStatus.startsWith("✅")?"#f6ffed":voiceStatus.startsWith("❌")?"#fff1f0":"#fffbe6",color:voiceStatus.startsWith("✅")?"#135200":voiceStatus.startsWith("❌")?"#a8071a":"#874d00",border:`1px solid ${voiceStatus.startsWith("✅")?"#b7eb8f":voiceStatus.startsWith("❌")?"#ffa39e":"#ffe58f"}`}}>{voiceStatus}</div>}
                <div style={{display:"flex",flexWrap:"wrap",marginBottom:12}}>{SYMPTOMS.map(s=><div key={s.id} style={S.chip(selectedSymptoms.includes(s.id))} onClick={()=>toggleSymptom(s.id)}>{selectedSymptoms.includes(s.id)?"✓ ":""}{lang==="mr"?s.mr:lang==="hi"?s.hi:s.en}</div>)}</div>
                <div style={{borderTop:"1px solid #f0f0ee",paddingTop:12,marginBottom:12}}>
                  <div style={{fontWeight:600,fontSize:12,marginBottom:10,color:"#555"}}>{T("vitals")}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><label style={S.label}>SpO2 (%)</label><input style={S.input} type="number" value={vitals.spo2} onChange={e=>setVitals(v=>({...v,spo2:e.target.value}))} placeholder="e.g. 96"/></div>
                    <div><label style={S.label}>{T("temp")}</label><input style={S.input} type="number" value={vitals.temp} onChange={e=>setVitals(v=>({...v,temp:e.target.value}))} placeholder="e.g. 101"/></div>
                  </div>
                </div>
                <button style={{...S.btnGreen,opacity:selectedSymptoms.length===0||loading?0.55:1}} onClick={analyzeWithClaude} disabled={selectedSymptoms.length===0||loading}>{loading?T("analysing"):T("analyseBtn")}</button>
                <div style={{marginTop:8}}><button style={S.btnMock} onClick={useMockResult}>🧪 {T("mockBtn")}</button></div>
              </div>
            )}
            {activeTab==="image"&&(
              <div style={{...S.card,borderRadius:"0 0 12px 12px",marginTop:0}}>
                <div style={{fontWeight:600,fontSize:14,marginBottom:12,color:"#1a472a"}}>{T("scanRash")}</div>
                <input ref={imgInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{display:"none"}}/>
                <button onClick={()=>imgInputRef.current.click()} style={{...S.btnOutline,width:"100%",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{fontSize:16}}>📷</span>{T("uploadImg")}</button>
                {imgPreview&&<div style={{marginBottom:14}}><img src={imgPreview} alt="skin" style={{width:"100%",borderRadius:10,maxHeight:200,objectFit:"cover",border:"1px solid #e5e3db"}}/><button style={{...S.btnGreen,marginTop:10,opacity:imgLoading?0.6:1}} onClick={analyseImage} disabled={imgLoading}>{imgLoading?T("analysingImg"):"🔬 "+T("imgResult")}</button></div>}
                {imgResult&&(()=>{
                  const col=levelColor(imgResult.triage==="EMERGENCY"?"RED":imgResult.triage==="PHC"?"YELLOW":"GREEN");
                  return(
                    <div style={{background:col.bg,border:`2px solid ${col.border}`,borderRadius:10,padding:14}}>
                      <div style={{fontWeight:700,fontSize:15,color:col.text,marginBottom:6}}>{imgResult.diagnosis?.[0]||"Analysis complete"}</div>
                      <div style={{fontSize:12,background:"rgba(255,255,255,0.7)",borderRadius:6,padding:"6px 10px",marginBottom:10,color:"#333"}}>{imgResult.explanation}</div>
                      {imgResult.steps?.map((s,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}><div style={{width:18,height:18,borderRadius:"50%",background:col.border,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</div><div style={{fontSize:12,color:col.text}}>{s}</div></div>)}
                      <button onClick={()=>speak(`${imgResult.diagnosis?.[0]}. ${imgResult.explanation}`,lang)} style={{marginTop:8,background:"rgba(255,255,255,0.7)",border:`1px solid ${col.border}`,borderRadius:6,padding:"5px 10px",fontSize:11,cursor:"pointer",color:col.text}}>🔊 {T("voiceOutput")}</button>
                    </div>
                  );
                })()}
              </div>
            )}
            {activeTab==="chat"&&(
              <div style={{...S.card,borderRadius:"0 0 12px 12px",marginTop:0,padding:0,overflow:"hidden"}}>
                <div style={{background:"#1a472a",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"#86efac",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#1a472a"}}>MS</div>
                  <div><div style={{color:"#fff",fontWeight:600,fontSize:14}}>Dr. Meena Singh</div><div style={{color:"#86efac",fontSize:11}}>● {T("chatConnected")}</div></div>
                </div>
                <div style={{height:260,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
                  {chatMessages.map((m,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                      <div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",background:m.role==="user"?"#1a472a":"#f4f3ee",color:m.role==="user"?"#fff":"#1a1a1a",fontSize:13,lineHeight:1.6}}>
                        {m.text}{m.role==="assistant"&&<button onClick={()=>speak(m.text,lang)} style={{display:"block",marginTop:5,background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#888",padding:0}}>🔊 {T("voiceOutput")}</button>}
                      </div>
                    </div>
                  ))}
                  {chatLoading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:"#f4f3ee",borderRadius:"12px 12px 12px 2px",padding:"10px 14px",fontSize:13,color:"#888"}}>Typing...</div></div>}
                  <div ref={chatEndRef}/>
                </div>
                <div style={{borderTop:"1px solid #e5e3db",padding:"10px 12px",display:"flex",gap:8}}>
                  <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder={T("chatPlaceholder")} style={{...S.input,flex:1,padding:"8px 12px",fontSize:13}}/>
                  <button onClick={sendChat} disabled={!chatInput.trim()||chatLoading} style={{background:"#1a472a",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600,opacity:!chatInput.trim()||chatLoading?0.5:1}}>{T("chatSend")}</button>
                </div>
              </div>
            )}
          </div>
        )}
        {step===3&&result&&(()=>{
          const col=levelColor(result.level);
          const levelLabel={RED:T("emergency"),YELLOW:T("referPhc"),GREEN:T("treatLocal")}[result.level];
          const levelIcon={RED:"🚨",YELLOW:"⚠️",GREEN:"✅"}[result.level];
          return(
            <div>
              <div style={{background:col.bg,border:`2px solid ${col.border}`,borderRadius:14,padding:18,marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <span style={{fontSize:32}}>{levelIcon}</span>
                  <div><div style={{fontWeight:800,fontSize:20,color:col.text}}>{levelLabel}</div><div style={{fontSize:14,color:col.text,opacity:0.85}}>{result.condition}</div></div>
                  <button onClick={()=>speakResult(result)} style={{marginLeft:"auto",background:"rgba(255,255,255,0.7)",border:`1px solid ${col.border}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,color:col.text}}>{speaking?"⏹ Stop":"🔊 "+T("voiceOutput")}</button>
                </div>
                <div style={{background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"9px 12px",marginBottom:10}}>
                  <div style={{fontSize:11,color:"#666",marginBottom:4}}>{T("aiConf")}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:7,background:"#e0e0e0",borderRadius:4,overflow:"hidden"}}><div style={{width:`${result.confidence}%`,height:"100%",background:col.badge,borderRadius:4}}/></div><span style={{fontWeight:700,color:col.text,fontSize:14}}>{result.confidence}%</span></div>
                  {result.extra_symptom&&<div style={{fontSize:11,color:"#666",marginTop:5}}>{T("checkFor")}: <strong>{result.extra_symptom}</strong> → {T("toIncrease")}</div>}
                </div>
                {result.call_108&&<div style={{background:"#ff4d4f",borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>📞</span><div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>{T("call108")}</div><div style={{color:"rgba(255,255,255,0.85)",fontSize:12}}>{T("ambulance")}</div></div></div>}
                <div>
                  <div style={{fontWeight:700,fontSize:12,color:col.text,marginBottom:7}}>{T("immediateSteps")}</div>
                  {result.first_aid?.map((s,i)=><div key={i} style={{display:"flex",gap:9,marginBottom:7,alignItems:"flex-start"}}><div style={{width:20,height:20,borderRadius:"50%",background:col.border,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div><div style={{fontSize:13,color:col.text,lineHeight:1.5}}>{s}</div></div>)}
                </div>
              </div>
              <div style={{...S.card,borderLeft:"4px solid #52c41a",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:15}}>📲</span><div style={{fontWeight:600,fontSize:13,color:"#135200"}}>{T("phcNotified")}</div><div style={{marginLeft:"auto",background:"#f6ffed",color:"#52c41a",fontSize:10,padding:"2px 8px",borderRadius:10,border:"1px solid #b7eb8f"}}>✓ Sent</div></div>
                <div style={{fontSize:12,color:"#555"}}>Dr. Meena Singh · Barmer PHC · {new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <button style={S.btnOutline} onClick={resetForm}>{T("newPatientBtn")}</button>
                <button style={S.btnGreen} onClick={()=>setView("phc")}>{T("phcDash")}</button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ==========================================================
   Clinic data. Everything here is PLACEHOLDER content:
   replace doctors, fees, address and phone with real details.
   ========================================================== */

export const CLINIC = {
  name: "DOCTOR'S CLINIC",
  sub: "OPD & Diagnostics",
  address: "12, Health Avenue, Sector 21, Dwarka, New Delhi 110075",
  addressShort: "Sector 21, Dwarka, New Delhi",
  phone: "+91 11 2345 6789",
  phoneHref: "tel:+911123456789",
  emergency: "+91 98100 00108",
  emergencyHref: "tel:+919810000108",
  email: "care@doctorsclinic.example",
  hours: "Mon – Sat, 08:00 AM – 08:00 PM",
};

const U = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: U("1519494026892-80bbd2d6fd0d", 1600),
  lab: U("1579154204601-01588f351e67", 1000),
  xray: U("1516549655169-df83a0774514", 1000),
  pharmacy: U("1587854692152-cbe660dbde88", 1000),
  suites: U("1631217868264-e5b90bb7e133", 1000),
  emergency: U("1538108149393-fbbd81895907", 1000),
  checkup: U("1586773860418-d37222d8fce3", 1000),
};

export const SPECIALTIES = [
  { key: "General Medicine", icon: "Stethoscope", blurb: "Fever, infections, diabetes, blood pressure and everyday illness." },
  { key: "Cardiology", icon: "HeartPulse", blurb: "Chest pain, palpitations, hypertension and heart-health checks." },
  { key: "Orthopedics", icon: "Bone", blurb: "Joint pain, back and neck pain, fractures and sports injuries." },
  { key: "Dermatology", icon: "ScanFace", blurb: "Skin rashes, acne, allergies, hair loss and nail conditions." },
  { key: "Pediatrics", icon: "Baby", blurb: "Newborn care, vaccinations, growth and childhood illness." },
  { key: "Neurology", icon: "Brain", blurb: "Headache, migraine, dizziness, numbness and seizures." },
];

/* Slot sessions */
export const MORNING = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"];
export const EVENING = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"];

/* days: 0 = Sunday … 6 = Saturday; sessions: which slot grids the doctor runs */
export const DOCTORS = [
  {
    id: "arjun-mehta", name: "Dr. Arjun Mehta", qual: "MBBS, MD (Internal Medicine)", specialty: "General Medicine",
    exp: 18, languages: ["English", "Hindi", "Punjabi"], days: [1, 2, 3, 4, 5, 6], sessions: ["morning", "evening"],
    fee: 600, featured: true,
    conditions: ["fever", "cold", "cough", "diabetes", "blood pressure", "thyroid", "infection", "fatigue"],
    bio: "Dr. Mehta leads the general medicine OPD and manages long-term conditions such as diabetes, hypertension and thyroid disorders. He is known for clear explanations and practical treatment plans.",
    education: ["MBBS, Maulana Azad Medical College, New Delhi", "MD (Internal Medicine), PGIMER Chandigarh", "Fellowship in Diabetology, Royal College of Physicians (UK)"],
  },
  {
    id: "sunita-kapoor", name: "Dr. Sunita Kapoor", qual: "MBBS, DNB (Family Medicine)", specialty: "General Medicine",
    exp: 11, languages: ["English", "Hindi"], days: [1, 2, 3, 4, 5, 6], sessions: ["evening"],
    fee: 500,
    conditions: ["fever", "cough", "allergy", "gastric", "acidity", "headache", "women's health"],
    bio: "Dr. Kapoor runs the evening family-medicine clinic, with a focus on preventive care, women's health and lifestyle conditions.",
    education: ["MBBS, Lady Hardinge Medical College, New Delhi", "DNB (Family Medicine), National Board of Examinations"],
  },
  {
    id: "vikram-rao", name: "Dr. Vikram Rao", qual: "MBBS, MD, DM (Cardiology)", specialty: "Cardiology",
    exp: 21, languages: ["English", "Hindi", "Telugu"], days: [1, 3, 5], sessions: ["morning", "evening"],
    fee: 1200, featured: true,
    conditions: ["chest pain", "palpitations", "hypertension", "breathlessness", "cholesterol", "heart"],
    bio: "Dr. Rao is an interventional cardiologist with two decades of experience in preventive cardiology, heart-failure care and post-angioplasty follow-up.",
    education: ["MBBS, Osmania Medical College, Hyderabad", "MD (Medicine), AIIMS New Delhi", "DM (Cardiology), AIIMS New Delhi"],
  },
  {
    id: "harpreet-singh", name: "Dr. Harpreet Singh", qual: "MBBS, MS (Orthopaedics)", specialty: "Orthopedics",
    exp: 16, languages: ["English", "Hindi", "Punjabi"], days: [2, 4, 6], sessions: ["morning", "evening"],
    fee: 900, featured: true,
    conditions: ["joint pain", "knee pain", "back pain", "fracture", "sports injury", "arthritis", "neck pain"],
    bio: "Dr. Singh treats joint, spine and sports injuries, preferring physiotherapy-led recovery and surgery only when it is truly needed.",
    education: ["MBBS, Government Medical College, Amritsar", "MS (Orthopaedics), KGMU Lucknow", "Fellowship in Arthroscopy, Singapore General Hospital"],
  },
  {
    id: "priya-nair", name: "Dr. Priya Nair", qual: "MBBS, MD (Dermatology)", specialty: "Dermatology",
    exp: 10, languages: ["English", "Hindi", "Malayalam"], days: [1, 2, 3, 4, 5], sessions: ["evening"],
    fee: 800,
    conditions: ["skin rash", "acne", "eczema", "psoriasis", "hair loss", "allergy", "pigmentation"],
    bio: "Dr. Nair specialises in medical dermatology, including eczema, psoriasis, acne and hair disorders, for adults and children.",
    education: ["MBBS, Government Medical College, Thiruvananthapuram", "MD (Dermatology, Venereology & Leprosy), JIPMER Puducherry"],
  },
  {
    id: "kavya-iyer", name: "Dr. Kavya Iyer", qual: "MBBS, MD (Paediatrics)", specialty: "Pediatrics",
    exp: 13, languages: ["English", "Hindi", "Tamil"], days: [1, 2, 3, 4, 5, 6], sessions: ["morning"],
    fee: 700,
    conditions: ["child fever", "vaccination", "growth", "newborn", "asthma", "cough", "diarrhoea"],
    bio: "Dr. Iyer cares for newborns through teenagers, from routine vaccinations and growth checks to childhood asthma and infections.",
    education: ["MBBS, Madras Medical College, Chennai", "MD (Paediatrics), Christian Medical College, Vellore"],
  },
  {
    id: "rohan-desai", name: "Dr. Rohan Desai", qual: "MBBS, MD, DM (Neurology)", specialty: "Neurology",
    exp: 15, languages: ["English", "Hindi", "Marathi", "Gujarati"], days: [2, 4, 6], sessions: ["morning"],
    fee: 1100,
    conditions: ["headache", "migraine", "dizziness", "numbness", "seizure", "epilepsy", "stroke", "memory"],
    bio: "Dr. Desai is a clinical neurologist with a special interest in headache, epilepsy and stroke prevention.",
    education: ["MBBS, Seth GS Medical College, Mumbai", "MD (Medicine), Grant Medical College, Mumbai", "DM (Neurology), NIMHANS Bengaluru"],
  },
  {
    id: "meera-joshi", name: "Dr. Meera Joshi", qual: "MBBS, MD, DM (Cardiology)", specialty: "Cardiology",
    exp: 9, languages: ["English", "Hindi", "Marathi"], days: [2, 4, 6], sessions: ["evening"],
    fee: 1000,
    conditions: ["chest pain", "palpitations", "hypertension", "ecg", "heart", "cholesterol"],
    bio: "Dr. Joshi focuses on women's heart health, hypertension and cardiac rehabilitation, with evening clinics for working patients.",
    education: ["MBBS, BJ Medical College, Pune", "MD (Medicine), KEM Hospital, Mumbai", "DM (Cardiology), SCTIMST Thiruvananthapuram"],
  },
];

export const FACILITIES = [
  { title: "Automated Pathology & Blood Lab", img: "lab", desc: "Fully automated analysers for blood, urine, hormone and diabetes panels. Most reports ready the same day.", location: "Ground Floor, Wing A", hours: "Open 24/7", icon: "FlaskConical" },
  { title: "Digital X-Ray & ECG Suite", img: "xray", desc: "Low-dose digital radiography and 12-lead ECG, reported by our physicians within the hour.", location: "Ground Floor, Wing B", hours: "Mon – Sat, 08:00 AM – 08:00 PM", icon: "ScanLine" },
  { title: "24/7 In-House Pharmacy", img: "pharmacy", desc: "Genuine, correctly stored medicines, so prescriptions are filled before you leave the building.", location: "Ground Floor, Main Lobby", hours: "Open 24/7", icon: "Pill" },
  { title: "Outpatient Consultation Suites", img: "suites", desc: "Eight private, sound-insulated rooms, one for each specialist, beside a calm waiting lounge.", location: "First Floor, Wings A & B", hours: "Mon – Sat, 08:00 AM – 08:00 PM", icon: "DoorOpen" },
  { title: "Emergency & Triage Unit", img: "emergency", desc: "Rapid triage with an on-call doctor, oxygen, defibrillator and ambulance coordination.", location: "Ground Floor, Rear Entrance", hours: "Open 24/7", icon: "Siren" },
  { title: "Preventive Health Checkup Wing", img: "checkup", desc: "Annual and executive health packages: bloods, ECG, X-ray and a doctor review in one morning.", location: "Second Floor, Wing A", hours: "Mon – Sat, 07:30 AM – 11:30 AM", icon: "ClipboardCheck" },
];

export const SYMPTOM_TAGS = ["Fever", "Cough", "Chest Pain", "Skin Rash", "Joint Pain", "Headache", "Back Pain", "Breathlessness"];

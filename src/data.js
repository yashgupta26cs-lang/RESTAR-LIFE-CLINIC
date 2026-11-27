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

/* Local images are crops of the two reference images the clinic supplied. */
export const LOCAL = {
  heart: "./images/clinic-heart-showcase.jpg",
  specialist: "./images/specialist-portrait.jpg",
};

export const IMAGES = {
  hero: LOCAL.heart,
  lobby: U("1519494026892-80bbd2d6fd0d", 1600),
  corridor: U("1586773860418-d37222d8fce3", 1400),
  lab: U("1579154204601-01588f351e67", 1000),
  xray: U("1516549655169-df83a0774514", 1000),
  pharmacy: U("1587854692152-cbe660dbde88", 1000),
  suites: U("1631217868264-e5b90bb7e133", 1000),
  emergency: U("1538108149393-fbbd81895907", 1000),
  checkup: U("1576091160550-2173dba999ef", 1000),
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
    id: "arjun-mehta", photo: U("1612349317150-e413f6a5b16d", 600), name: "Dr. Arjun Mehta", qual: "MBBS, MD (Internal Medicine)", specialty: "General Medicine",
    exp: 18, languages: ["English", "Hindi", "Punjabi"], days: [1, 2, 3, 4, 5, 6], sessions: ["morning", "evening"],
    fee: 600, featured: true,
    conditions: ["fever", "cold", "cough", "diabetes", "blood pressure", "thyroid", "infection", "fatigue"],
    bio: "Dr. Mehta leads the general medicine OPD and manages long-term conditions such as diabetes, hypertension and thyroid disorders. He is known for clear explanations and practical treatment plans.",
    education: ["MBBS, Maulana Azad Medical College, New Delhi", "MD (Internal Medicine), PGIMER Chandigarh", "Fellowship in Diabetology, Royal College of Physicians (UK)"],
  },
  {
    id: "sunita-kapoor", photo: U("1594824476967-48c8b964273f", 600), name: "Dr. Sunita Kapoor", qual: "MBBS, DNB (Family Medicine)", specialty: "General Medicine",
    exp: 11, languages: ["English", "Hindi"], days: [1, 2, 3, 4, 5, 6], sessions: ["evening"],
    fee: 500,
    conditions: ["fever", "cough", "allergy", "gastric", "acidity", "headache", "women's health"],
    bio: "Dr. Kapoor runs the evening family-medicine clinic, with a focus on preventive care, women's health and lifestyle conditions.",
    education: ["MBBS, Lady Hardinge Medical College, New Delhi", "DNB (Family Medicine), National Board of Examinations"],
  },
  {
    id: "vikram-rao", photo: U("1622253692010-333f2da6031d", 600), name: "Dr. Vikram Rao", qual: "MBBS, MD, DM (Cardiology)", specialty: "Cardiology",
    exp: 21, languages: ["English", "Hindi", "Telugu"], days: [1, 3, 5], sessions: ["morning", "evening"],
    fee: 1200, featured: true,
    conditions: ["chest pain", "palpitations", "hypertension", "breathlessness", "cholesterol", "heart"],
    bio: "Dr. Rao is an interventional cardiologist with two decades of experience in preventive cardiology, heart-failure care and post-angioplasty follow-up.",
    education: ["MBBS, Osmania Medical College, Hyderabad", "MD (Medicine), AIIMS New Delhi", "DM (Cardiology), AIIMS New Delhi"],
  },
  {
    id: "harpreet-singh", photo: U("1537368910025-700350fe46c7", 600), name: "Dr. Harpreet Singh", qual: "MBBS, MS (Orthopaedics)", specialty: "Orthopedics",
    exp: 16, languages: ["English", "Hindi", "Punjabi"], days: [2, 4, 6], sessions: ["morning", "evening"],
    fee: 900, featured: true,
    conditions: ["joint pain", "knee pain", "back pain", "fracture", "sports injury", "arthritis", "neck pain"],
    bio: "Dr. Singh treats joint, spine and sports injuries, preferring physiotherapy-led recovery and surgery only when it is truly needed.",
    education: ["MBBS, Government Medical College, Amritsar", "MS (Orthopaedics), KGMU Lucknow", "Fellowship in Arthroscopy, Singapore General Hospital"],
  },
  {
    id: "priya-nair", photo: U("1559839734-2b71ea197ec2", 600), name: "Dr. Priya Nair", qual: "MBBS, MD (Dermatology)", specialty: "Dermatology",
    exp: 10, languages: ["English", "Hindi", "Malayalam"], days: [1, 2, 3, 4, 5], sessions: ["evening"],
    fee: 800,
    conditions: ["skin rash", "acne", "eczema", "psoriasis", "hair loss", "allergy", "pigmentation"],
    bio: "Dr. Nair specialises in medical dermatology, including eczema, psoriasis, acne and hair disorders, for adults and children.",
    education: ["MBBS, Government Medical College, Thiruvananthapuram", "MD (Dermatology, Venereology & Leprosy), JIPMER Puducherry"],
  },
  {
    id: "kavya-iyer", photo: U("1651008376811-b90baee60c1f", 600), name: "Dr. Kavya Iyer", qual: "MBBS, MD (Paediatrics)", specialty: "Pediatrics",
    exp: 13, languages: ["English", "Hindi", "Tamil"], days: [1, 2, 3, 4, 5, 6], sessions: ["morning"],
    fee: 700,
    conditions: ["child fever", "vaccination", "growth", "newborn", "asthma", "cough", "diarrhoea"],
    bio: "Dr. Iyer cares for newborns through teenagers, from routine vaccinations and growth checks to childhood asthma and infections.",
    education: ["MBBS, Madras Medical College, Chennai", "MD (Paediatrics), Christian Medical College, Vellore"],
  },
  {
    id: "rohan-desai", photo: U("1582750433449-648ed127bb54", 600), name: "Dr. Rohan Desai", qual: "MBBS, MD, DM (Neurology)", specialty: "Neurology",
    exp: 15, languages: ["English", "Hindi", "Marathi", "Gujarati"], days: [2, 4, 6], sessions: ["morning"],
    fee: 1100,
    conditions: ["headache", "migraine", "dizziness", "numbness", "seizure", "epilepsy", "stroke", "memory"],
    bio: "Dr. Desai is a clinical neurologist with a special interest in headache, epilepsy and stroke prevention.",
    education: ["MBBS, Seth GS Medical College, Mumbai", "MD (Medicine), Grant Medical College, Mumbai", "DM (Neurology), NIMHANS Bengaluru"],
  },
  {
    id: "meera-joshi", photo: LOCAL.specialist, name: "Dr. Meera Joshi", qual: "MBBS, MD, DM (Cardiology)", specialty: "Cardiology",
    exp: 9, languages: ["English", "Hindi", "Marathi"], days: [2, 4, 6], sessions: ["evening"],
    fee: 1000,
    conditions: ["chest pain", "palpitations", "hypertension", "ecg", "heart", "cholesterol"],
    bio: "Dr. Joshi focuses on women's heart health, hypertension and cardiac rehabilitation, with evening clinics for working patients.",
    education: ["MBBS, BJ Medical College, Pune", "MD (Medicine), KEM Hospital, Mumbai", "DM (Cardiology), SCTIMST Thiruvananthapuram"],
  },
];

export const FACILITIES = [
  { title: "Automated Pathology Lab", img: "lab", icon: "FlaskConical", location: "Ground Floor, Wing A", hours: "Open 24/7",
    desc: "Fully automated analysers for blood, urine, hormone and diabetes panels.",
    features: ["Same-day reports for 200+ tests", "Home sample collection", "NABL-standard quality checks"] },
  { title: "Digital X-Ray & ECG Suite", img: "xray", icon: "ScanLine", location: "Ground Floor, Wing B", hours: "Mon – Sat, 08:00 AM – 08:00 PM",
    desc: "Low-dose digital radiography and 12-lead ECG, reported by our physicians.",
    features: ["Reports within 60 minutes", "Low-dose digital imaging", "Images shared on WhatsApp"] },
  { title: "24/7 In-House Pharmacy", img: "pharmacy", icon: "Pill", location: "Ground Floor, Main Lobby", hours: "Open 24/7",
    desc: "Genuine, correctly stored medicines, so prescriptions are filled before you leave.",
    features: ["Cold-chain storage", "Generic alternatives explained", "Refill reminders"] },
  { title: "Modern Outpatient Suites", img: "suites", icon: "DoorOpen", location: "First Floor, Wings A & B", hours: "Mon – Sat, 08:00 AM – 08:00 PM",
    desc: "Private, sound-insulated consultation rooms beside a calm, air-purified waiting lounge.",
    features: ["8 private consultation rooms", "Live token display board", "Wheelchair accessible"] },
  { title: "Emergency & Triage Care", img: "emergency", icon: "Siren", location: "Ground Floor, Rear Entrance", hours: "Open 24/7",
    desc: "Rapid triage with an on-call doctor, oxygen, defibrillator and ambulance coordination.",
    features: ["Doctor on call round the clock", "Oxygen & cardiac monitor", "Ambulance tie-ups"] },
  { title: "Preventive Health Checkups", img: "checkup", icon: "ClipboardCheck", location: "Second Floor, Wing A", hours: "Mon – Sat, 07:30 AM – 11:30 AM",
    desc: "Annual and executive packages: bloods, ECG, X-ray and a doctor review in one morning.",
    features: ["Packages from ₹1,499", "Done in under 3 hours", "Doctor review included"] },
];

export const SYMPTOM_TAGS = ["Fever", "Chest Pain", "Skin Allergy", "Back Pain", "General Checkup", "Headache", "Cough", "Joint Pain"];

export const TESTIMONIALS = [
  { name: "Ritika Sharma", meta: "Cardiology patient · Dwarka", rating: 5,
    text: "I booked Dr. Rao's 9:30 slot from my phone the night before, walked in with the token and was seen within ten minutes. The ECG report was ready before I left." },
  { name: "Mohammed Irfan", meta: "Parent · Pediatrics", rating: 5,
    text: "Dr. Iyer was so patient with my four-year-old. The waiting area is clean and calm, and the pharmacy downstairs had everything on the prescription." },
  { name: "Suresh Venkat", meta: "Orthopedics patient · Janakpuri", rating: 5,
    text: "Clear explanation of my knee X-ray, no unnecessary tests, and a physiotherapy plan that actually works. Booking online saved me a morning of waiting." },
];

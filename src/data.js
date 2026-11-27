/* ==========================================================
   Clinic data. Everything here is PLACEHOLDER content:
   doctors, registration numbers, fees, address, phone numbers
   and the accreditation badge must be replaced with the
   clinic's real, verified details before real use.
   ========================================================== */

export const CLINIC = {
  name: "DOCTOR'S CLINIC",
  sub: "OPD & Diagnostics",
  address: "Plot No. 7, Sector 12 Market Road, Dwarka, New Delhi 110078",
  addressShort: "Sector 12, Dwarka, New Delhi",
  landmark: "Opposite Dwarka Sector 12 Metro Station, Gate 2",
  phone: "011-4568 2200",
  phoneHref: "tel:+911145682200",
  phoneLabel: "Reception",
  emergency: "+91 98110 47247",
  emergencyHref: "tel:+919811047247",
  email: "care@doctorsclinic.example",
  hours: "Mon – Sat, 08:00 AM – 08:00 PM",
  establishmentReg: "DL/CEA/2019/04712",
  accreditation: { title: "NABH Entry-Level Certified", sub: "Small Healthcare Organisation", hygiene: "Infection-control audit passed, Oct 2026" },
};

/** Unsplash image with an explicit crop size, so every card gets a sharp, correctly framed photo. */
const U = (id, w, h, extra = "") => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80${extra}`;
/** Doctor portrait: 5:6 crop centred on the face. */
const P = (id) => U(id, 600, 720, "&crop=faces,top");

/* Local images are crops of the two reference images the clinic supplied. */
export const LOCAL = {
  heart: "./images/clinic-heart-showcase.jpg",
  specialist: "./images/specialist-portrait.jpg",
};

export const IMAGES = {
  hero: U("1519494026892-80bbd2d6fd0d", 1100, 1375),     // modern reception desk
  reception: U("1764727291644-5dcb0b1a0375", 900, 700),  // registration counter
  lounge: U("1629909614456-6b1c5c94cecc", 1400, 1000),   // waiting lounge
  consult: U("1758691462878-6edc3d3da1be", 900, 700),    // consultation room
  cardiac: LOCAL.heart,
  about: U("1758691462123-8a17ae95d203", 1200, 960),     // doctor checking blood pressure
  lab: U("1579154204601-01588f351e67", 800, 520),        // pathology lab
  labTubes: U("1606206591513-adbfbdd7a177", 900, 700),   // sample tubes
  xray: U("1760872703636-f8d643a2b510", 800, 520),       // digital X-ray room
  pharmacy: U("1789108978116-2763682414a4", 800, 520),   // pharmacy aisles
  suites: U("1519494140681-8b17d830a3e9", 800, 520),     // OPD corridor & seating
  emergency: U("1758404958502-44f156617bae", 800, 520),  // emergency entrance sign
  checkup: U("1666887360680-9dc27a1d2753", 800, 520),    // blood pressure check
};

export const SPECIALTIES = [
  { key: "General Medicine", icon: "Stethoscope", blurb: "Fever, infections, diabetes, blood pressure and everyday illness." },
  { key: "Cardiology", icon: "HeartPulse", blurb: "Chest pain, palpitations, hypertension and heart-health checks." },
  { key: "Orthopedics", icon: "Bone", blurb: "Joint pain, back and neck pain, fractures and sports injuries." },
  { key: "Dermatology", icon: "ScanFace", blurb: "Skin rashes, acne, allergies, hair loss and nail conditions." },
  { key: "Pediatrics", icon: "Baby", blurb: "Newborn care, vaccinations, growth and childhood illness." },
  { key: "Neurology", icon: "Brain", blurb: "Headache, migraine, dizziness, numbness and seizures." },
];

/* Slot sessions (30-minute slots) */
export const MORNING = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"];
export const EVENING = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"];
export const SESSION_HOURS = { morning: "09:00 AM – 12:30 PM", evening: "04:00 PM – 08:00 PM" };

/* days: 0 = Sunday … 6 = Saturday; sessions: which slot grids the doctor runs.
   Fees: General Medicine ₹800, Pediatrics ₹900, Dermatology ₹1,000,
   Orthopedics ₹1,200, Cardiology ₹1,500, Neurology ₹1,600. */
export const DOCTORS = [
  {
    id: "arjun-mehta", photo: P("1637059824899-a441006a6875"),
    name: "Dr. Arjun Mehta", qual: "MBBS, MD (Internal Medicine)", designation: "Senior Consultant, Internal Medicine",
    specialty: "General Medicine", regNo: "MCI-48291", exp: 18, fee: 800, room: "OPD Room 2, First Floor",
    languages: ["English", "Hindi", "Punjabi"], days: [1, 2, 3, 4, 5, 6], sessions: ["morning", "evening"], featured: true,
    conditions: ["Fever & viral infections", "Type 2 diabetes", "High blood pressure", "Thyroid disorders", "Cough, cold & flu", "Fatigue & anaemia", "Preventive health checks"],
    affiliations: ["Former Consultant Physician, Sir Ganga Ram Hospital, New Delhi", "Ex-Senior Resident, Department of Medicine, AIIMS New Delhi"],
    bio: "Dr. Mehta leads the general medicine OPD and manages long-term conditions such as diabetes, hypertension and thyroid disorders. Patients know him for clear explanations, sensible test advice and practical treatment plans they can follow at home.",
    education: ["MBBS, Maulana Azad Medical College, New Delhi (2004)", "MD (Internal Medicine), PGIMER Chandigarh (2008)", "CCEBDM (Diabetes Management), Public Health Foundation of India (2012)"],
  },
  {
    id: "sunita-kapoor", photo: P("1659353888906-adb3e0041693"),
    name: "Dr. Sunita Kapoor", qual: "MBBS, DNB (Family Medicine)", designation: "Family Physician",
    specialty: "General Medicine", regNo: "MCI-62158", exp: 11, fee: 800, room: "OPD Room 3, First Floor",
    languages: ["English", "Hindi"], days: [1, 2, 3, 4, 5, 6], sessions: ["evening"],
    conditions: ["Fever & seasonal flu", "Acidity & gastric problems", "Allergies", "Headache", "Women's health", "PCOS & thyroid", "Lifestyle counselling"],
    affiliations: ["Former Family Physician, Max Super Speciality Hospital, Saket", "Ex-Medical Officer, Safdarjung Hospital, New Delhi"],
    bio: "Dr. Kapoor runs the evening family-medicine clinic, so working patients can be seen after office hours. Her focus is preventive care, women's health and lifestyle conditions, with time set aside to talk through diet, sleep and stress.",
    education: ["MBBS, Lady Hardinge Medical College, New Delhi (2010)", "DNB (Family Medicine), National Board of Examinations (2015)"],
  },
  {
    id: "vikram-rao", photo: P("1678940805950-73f2127f9d4e"),
    name: "Dr. Vikram Rao", qual: "MBBS, MD (Medicine), DM (Cardiology)", designation: "Senior Interventional Cardiologist",
    specialty: "Cardiology", regNo: "MCI-31476", exp: 21, fee: 1500, room: "Cardiac OPD, Room 6, First Floor",
    languages: ["English", "Hindi", "Telugu"], days: [1, 3, 5], sessions: ["morning", "evening"], featured: true,
    conditions: ["Chest pain & angina", "Palpitations", "Hypertension", "Heart failure", "High cholesterol", "Breathlessness", "Post-angioplasty follow-up"],
    affiliations: ["Former Associate Director, Cardiology, Fortis Escorts Heart Institute, New Delhi", "Ex-Senior Resident, Cardiology, AIIMS New Delhi"],
    bio: "Dr. Rao is an interventional cardiologist with over two decades in preventive cardiology, heart-failure care and post-angioplasty follow-up. He reviews ECG and echo findings with patients in the same visit and keeps medication plans simple.",
    education: ["MBBS, Osmania Medical College, Hyderabad (1998)", "MD (Medicine), AIIMS New Delhi (2002)", "DM (Cardiology), AIIMS New Delhi (2005)"],
  },
  {
    id: "harpreet-singh", photo: P("1622253694238-3b22139576c6"),
    name: "Dr. Harpreet Singh", qual: "MBBS, MS (Orthopaedics), FIAS", designation: "Consultant Orthopaedic & Arthroscopy Surgeon",
    specialty: "Orthopedics", regNo: "MCI-55902", exp: 16, fee: 1200, room: "OPD Room 5, First Floor",
    languages: ["English", "Hindi", "Punjabi"], days: [2, 4, 6], sessions: ["morning", "evening"], featured: true,
    conditions: ["Knee pain & arthritis", "Back & neck pain", "Fractures", "Sports injuries (ACL, meniscus)", "Frozen shoulder", "Osteoporosis", "Joint pain"],
    affiliations: ["Former Consultant, Indian Spinal Injuries Centre, New Delhi", "Ex-Registrar, Orthopaedics, Dayanand Medical College & Hospital, Ludhiana"],
    bio: "Dr. Singh treats joint, spine and sports injuries and prefers physiotherapy-led recovery, recommending surgery only when it is truly needed. He explains every X-ray on screen so patients understand their own scans.",
    education: ["MBBS, Government Medical College, Amritsar (2005)", "MS (Orthopaedics), King George's Medical University, Lucknow (2010)", "Fellowship in Arthroscopy & Sports Medicine (FIAS), Singapore General Hospital (2012)"],
  },
  {
    id: "priya-nair", photo: P("1757125736482-328a3cdd9743"),
    name: "Dr. Priya Nair", qual: "MBBS, MD (Dermatology, Venereology & Leprosy)", designation: "Consultant Dermatologist",
    specialty: "Dermatology", regNo: "MCI-70334", exp: 10, fee: 1000, room: "Skin OPD, Room 7, First Floor",
    languages: ["English", "Hindi", "Malayalam"], days: [1, 2, 3, 4, 5], sessions: ["evening"],
    conditions: ["Acne & acne scars", "Eczema", "Psoriasis", "Hair loss", "Skin rash & allergy", "Pigmentation & melasma", "Fungal infections"],
    affiliations: ["Former Senior Resident, Dermatology, JIPMER Puducherry", "Ex-Consultant Dermatologist, Apollo Clinic, Gurugram"],
    bio: "Dr. Nair specialises in medical dermatology for adults and children, including eczema, psoriasis, acne and hair disorders. She favours evidence-based treatment over expensive cosmetic add-ons.",
    education: ["MBBS, Government Medical College, Thiruvananthapuram (2011)", "MD (Dermatology, Venereology & Leprosy), JIPMER Puducherry (2016)"],
  },
  {
    id: "kavya-iyer", photo: P("1623854767648-e7bb8009f0db"),
    name: "Dr. Kavya Iyer", qual: "MBBS, MD (Paediatrics)", designation: "Consultant Paediatrician",
    specialty: "Pediatrics", regNo: "MCI-58817", exp: 13, fee: 900, room: "Child Care OPD, Room 1, Ground Floor",
    languages: ["English", "Hindi", "Tamil", "Kannada"], days: [1, 2, 3, 4, 5, 6], sessions: ["morning"],
    conditions: ["Child fever & infections", "Vaccinations", "Growth & development", "Newborn care", "Childhood asthma", "Cough & cold", "Diarrhoea & nutrition"],
    affiliations: ["Former Consultant Paediatrician, Rainbow Children's Hospital, Bengaluru", "Ex-Senior Resident, Paediatrics, St. John's Medical College Hospital, Bengaluru"],
    bio: "Dr. Iyer cares for newborns through teenagers, from routine vaccinations and growth checks to childhood asthma and infections. Parents value her calm manner and the written care plan she gives after every visit.",
    education: ["MBBS, Madras Medical College, Chennai (2007)", "MD (Paediatrics), Bangalore Medical College & Research Institute (2013)"],
  },
  {
    id: "rohan-desai", photo: P("1712215544003-af10130f8eb3"),
    name: "Dr. Rohan Desai", qual: "MBBS, MD (Medicine), DM (Neurology)", designation: "Consultant Neurologist",
    specialty: "Neurology", regNo: "MCI-44620", exp: 15, fee: 1600, room: "Neuro OPD, Room 8, First Floor",
    languages: ["English", "Hindi", "Marathi", "Gujarati"], days: [2, 4, 6], sessions: ["morning"],
    conditions: ["Migraine & headache", "Epilepsy & seizures", "Dizziness & vertigo", "Numbness & neuropathy", "Stroke prevention", "Memory problems", "Parkinson's disease"],
    affiliations: ["Former Consultant Neurologist, Kokilaben Dhirubhai Ambani Hospital, Mumbai", "Ex-Senior Resident, Neurology, NIMHANS Bengaluru"],
    bio: "Dr. Desai is a clinical neurologist with a special interest in headache, epilepsy and stroke prevention. He keeps a headache diary programme for migraine patients and coordinates EEG and MRI referrals.",
    education: ["MBBS, Seth GS Medical College & KEM Hospital, Mumbai (2003)", "MD (Medicine), Grant Government Medical College, Mumbai (2007)", "DM (Neurology), NIMHANS Bengaluru (2011)"],
  },
  {
    id: "meera-joshi", photo: LOCAL.specialist,
    name: "Dr. Meera Joshi", qual: "MBBS, MD (Medicine), DM (Cardiology)", designation: "Consultant Cardiologist",
    specialty: "Cardiology", regNo: "MCI-77105", exp: 9, fee: 1500, room: "Cardiac OPD, Room 6, First Floor",
    languages: ["English", "Hindi", "Marathi"], days: [2, 4, 6], sessions: ["evening"],
    conditions: ["Women's heart health", "Hypertension", "Palpitations", "Chest pain", "ECG & echo review", "Cardiac rehabilitation", "High cholesterol"],
    affiliations: ["Former Consultant, Non-Invasive Cardiology, Jupiter Hospital, Pune", "Ex-Senior Resident, Cardiology, SCTIMST Thiruvananthapuram"],
    bio: "Dr. Joshi focuses on women's heart health, hypertension and cardiac rehabilitation, with evening clinics for working patients. She pairs every treatment plan with a practical exercise and diet routine.",
    education: ["MBBS, BJ Government Medical College, Pune (2008)", "MD (Medicine), Seth GS Medical College & KEM Hospital, Mumbai (2012)", "DM (Cardiology), SCTIMST Thiruvananthapuram (2017)"],
  },
];

/* open: null = 24/7, else days (0 = Sunday) and minutes from midnight. */
export const FACILITIES = [
  { id: "lab", title: "Automated Pathology Lab", img: "lab", icon: "FlaskConical", location: "Ground Floor, Wing A", hours: "Open 24/7", hoursShort: "Open 24/7", open: null,
    price: "CBC from ₹350", desc: "Fully automated analysers for blood, urine, hormone and diabetes panels.",
    summary: "Blood, urine, hormone and diabetes tests with same-day reports.",
    features: ["Same-day reports for 200+ tests", "Home sample collection", "NABL-standard quality checks"] },
  { id: "xray", title: "Digital X-Ray & ECG Suite", img: "xray", icon: "ScanLine", location: "Ground Floor, Wing B", hours: "Mon – Sat, 08:00 AM – 08:00 PM", hoursShort: "Mon – Sat · 8 AM – 8 PM", open: { days: [1, 2, 3, 4, 5, 6], from: 480, to: 1200 },
    price: "Chest X-ray ₹500 · ECG ₹300", desc: "Low-dose digital radiography and 12-lead ECG, reported by our physicians.",
    summary: "Low-dose digital X-ray and 12-lead ECG, reported within the hour.",
    features: ["Reports within 60 minutes", "Low-dose digital imaging", "Reports shared on WhatsApp"] },
  { id: "pharmacy", title: "24/7 In-House Pharmacy", img: "pharmacy", icon: "Pill", location: "Ground Floor, Main Lobby", hours: "Open 24/7", hoursShort: "Open 24/7", open: null,
    price: "Generic options on request", desc: "Genuine, correctly stored medicines, so prescriptions are filled before you leave.",
    summary: "Genuine, cold-chain stored medicines, so prescriptions are filled before you leave.",
    features: ["Cold-chain storage", "Generic alternatives explained", "Refill reminders"] },
  { id: "suites", title: "Modern Outpatient Suites", img: "suites", icon: "DoorOpen", location: "First Floor, Wings A & B", hours: "Mon – Sat, 08:00 AM – 08:00 PM", hoursShort: "Mon – Sat · 8 AM – 8 PM", open: { days: [1, 2, 3, 4, 5, 6], from: 480, to: 1200 },
    price: "Consultations from ₹800", desc: "Private, sound-insulated consultation rooms beside a calm, air-purified waiting lounge.",
    summary: "Eight private consultation rooms beside an air-purified waiting lounge.",
    features: ["8 private consultation rooms", "Live token display board", "Wheelchair accessible"] },
  { id: "emergency", title: "Emergency & Triage Care", img: "emergency", icon: "Siren", location: "Ground Floor, Rear Entrance", hours: "Open 24/7", hoursShort: "Open 24/7", open: null,
    price: "Walk in, no booking", desc: "Rapid triage with an on-call doctor, oxygen, defibrillator and ambulance coordination.",
    summary: "Rapid triage with an on-call doctor, oxygen, defibrillator and ambulance support.",
    features: ["Doctor on call round the clock", "Oxygen & cardiac monitor", "Ambulance tie-ups"] },
  { id: "checkup", title: "Preventive Health Checkups", img: "checkup", icon: "ClipboardCheck", location: "Second Floor, Wing A", hours: "Mon – Sat, 07:30 AM – 11:30 AM", hoursShort: "Mon – Sat · 7:30 – 11:30 AM", open: { days: [1, 2, 3, 4, 5, 6], from: 450, to: 690 },
    price: "Packages from ₹1,499", desc: "Annual and executive packages: bloods, ECG, X-ray and a doctor review in one morning.",
    summary: "Bloods, ECG, X-ray and a doctor review in one morning, in under 3 hours.",
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

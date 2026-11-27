import { DOCTORS, MORNING, EVENING, SESSION_HOURS } from "./data.js";

export const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
export const doctorById = (id) => DOCTORS.find((d) => d.id === id) || null;
export const initials = (n) => n.replace(/^Dr\.\s*/, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const pad = (n) => String(n).padStart(2, "0");
export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const todayISO = () => isoDate(new Date());
export const prettyDate = (s) => parseISO(s).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
export const slotMinutes = (s) => { const m = s.match(/(\d+):(\d+)\s*(AM|PM)/); return ((+m[1] % 12) + (m[3] === "PM" ? 12 : 0)) * 60 + +m[2]; };
export const cleanPhone = (p) => p.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
export const formatPhone = (p) => { const c = cleanPhone(p); return `+91 ${c.slice(0, 5)} ${c.slice(5)}`; };

/** "Mon, Wed, Fri" or "Mon – Sat" */
export function daysText(days) {
  const s = [...days].sort();
  const contiguous = s.every((d, i) => i === 0 || d === s[i - 1] + 1);
  return contiguous && s.length > 2 ? `${DAY_SHORT[s[0]]} – ${DAY_SHORT[s[s.length - 1]]}` : s.map((d) => DAY_SHORT[d]).join(", ");
}
export function hoursText(d) {
  return d.sessions.map((x) => SESSION_HOURS[x]).join(" · ");
}
/** Mon → Sun rows: { day, short, morning, evening } with the hours string or null when there is no OPD. */
export function weeklySchedule(d) {
  return [1, 2, 3, 4, 5, 6, 0].map((i) => {
    const on = d.days.includes(i);
    return { i, day: DAY[i], short: DAY_SHORT[i],
      morning: on && d.sessions.includes("morning") ? SESSION_HOURS.morning : null,
      evening: on && d.sessions.includes("evening") ? SESSION_HOURS.evening : null };
  });
}

/* ---------------- Slip metadata (derived, so it is stable on re-print) ---------------- */
const tokenNum = (t) => String(t).replace(/\D/g, "").padStart(6, "0");
/** Receipt number: OPD/RCPT/2026/000101 */
export const receiptNo = (b) => `OPD/RCPT/${new Date(b.createdAt).getFullYear()}/${tokenNum(b.token)}`;
/** Patient ID (UHID) derived from the phone number, so repeat visits share one ID. */
export const patientId = (b) => { let h = 11; for (const c of cleanPhone(b.phone)) h = (h * 33 + c.charCodeAt(0)) % 1000000; return `DC-UH-${String(h).padStart(6, "0")}`; };
/** Reporting time: 15 minutes before the slot. */
export function reportingTime(slot) {
  const m = slotMinutes(slot) - 15, h = Math.floor(m / 60), mm = m % 60;
  return `${pad(((h + 11) % 12) + 1)}:${pad(mm)} ${h >= 12 ? "PM" : "AM"}`;
}
export function slotsFor(d) {
  return { morning: d.sessions.includes("morning") ? MORNING : [], evening: d.sessions.includes("evening") ? EVENING : [] };
}

/* ---------------- localStorage ---------------- */
const K_BOOKINGS = "dc3_bookings";
const K_SEQ = "dc3_token_seq";
const K_SEEDED = "dc3_seeded";
const TOKEN_START = 101;

function read(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
}

export const getBookings = () => read(K_BOOKINGS, []);

/** Sample "already booked" slots so the grid looks live, fixed per doctor + date. */
function sampleBooked(doctorId, date) {
  const d = doctorById(doctorId); if (!d) return [];
  const all = [...slotsFor(d).morning, ...slotsFor(d).evening];
  let h = 7; for (const c of doctorId + date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = h % all.length, b = (a + 3 + ((h >>> 5) % (all.length - 3))) % all.length;
  return [all[a], all[b]];
}

/** Seed 3 real sample bookings into localStorage once (tokens DC-098 … DC-100). */
export function seedOnce() {
  if (read(K_SEEDED, false)) return;
  const existing = getBookings();
  const base = new Date();
  const next = (dow) => { const x = new Date(base); do { x.setDate(x.getDate() + 1); } while (!dow.includes(x.getDay())); return isoDate(x); };
  const samples = [
    { token: "DC-098", doctorId: "arjun-mehta", date: next([1, 2, 3, 4, 5, 6]), slot: "10:00 AM", name: "Anil Sharma", age: "52", gender: "Male", phone: "9811122233", symptoms: "Follow-up for blood sugar" },
    { token: "DC-099", doctorId: "vikram-rao", date: next([1, 3, 5]), slot: "09:30 AM", name: "Neha Gupta", age: "41", gender: "Female", phone: "9899988877", symptoms: "Palpitations on climbing stairs" },
    { token: "DC-100", doctorId: "kavya-iyer", date: next([1, 2, 3, 4, 5, 6]), slot: "11:00 AM", name: "Aarav Malhotra", age: "4", gender: "Male", phone: "9876501234", symptoms: "Fever and cough for 2 days" },
  ].map((b) => ({ ...b, createdAt: new Date().toISOString(), sample: true }));
  write(K_BOOKINGS, [...samples, ...existing]);
  write(K_SEEDED, true);
}

export function bookedSlots(doctorId, date) {
  const set = new Set(sampleBooked(doctorId, date));
  getBookings().forEach((b) => { if (b.doctorId === doctorId && b.date === date) set.add(b.slot); });
  return set;
}

export function nextAvailable(doctor, from = new Date()) {
  const now = new Date(from);
  for (let i = 0; i < 21; i++) {
    const day = new Date(now); day.setDate(now.getDate() + i);
    if (!doctor.days.includes(day.getDay())) continue;
    const date = isoDate(day);
    const taken = bookedSlots(doctor.id, date);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const { morning, evening } = slotsFor(doctor);
    const free = [...morning, ...evening].find((s) => !taken.has(s) && (i > 0 || slotMinutes(s) > nowMin));
    if (free) return { date, slot: free, label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : parseISO(date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" }) };
  }
  return null;
}

export function createBooking(data) {
  const seq = read(K_SEQ, TOKEN_START - 1);
  const n = Math.max(seq, TOKEN_START - 1) + 1;
  const booking = { ...data, token: `DC-${n}`, createdAt: new Date().toISOString() };
  write(K_SEQ, n);
  write(K_BOOKINGS, [...getBookings(), booking]);
  return booking;
}

export function findBookings(query) {
  const q = query.trim().toUpperCase().replace(/^#/, "");
  if (!q) return [];
  const all = getBookings();
  const tokenQ = /^DC-?\d+$/.test(q) ? q.replace(/^DC-?/, "DC-") : /^\d{1,4}$/.test(q) ? `DC-${q}` : null;
  if (tokenQ) return all.filter((b) => b.token === tokenQ);
  const phone = cleanPhone(q);
  if (/^\d{10}$/.test(phone)) return all.filter((b) => cleanPhone(b.phone) === phone).reverse();
  return [];
}

/* ---------------- Code 39 barcode (real, scannable) ---------------- */
const C39 = {
  "0": "000110100", "1": "100100001", "2": "001100001", "3": "101100000", "4": "000110001",
  "5": "100110000", "6": "001110000", "7": "000100101", "8": "100100100", "9": "001100100",
  C: "101001000", D: "000011001", "-": "010000101", "*": "010010100",
};
/** Returns [{x, w}] bars for the given text, with narrow = 1 unit and wide = 3 units. */
export function code39Bars(text) {
  const chars = `*${text}*`.split("");
  const bars = []; let x = 0;
  chars.forEach((ch, ci) => {
    const p = C39[ch]; if (!p) return;
    for (let i = 0; i < 9; i++) {
      const w = p[i] === "1" ? 3 : 1;
      if (i % 2 === 0) bars.push({ x, w });
      x += w;
    }
    if (ci < chars.length - 1) x += 1; // inter-character gap
  });
  return { bars, width: x };
}

/* ---------------- Facility status ---------------- */
/** { label: "Open 24/7" | "Open now" | "Closed now", tone } for a facility at the given time. */
export function facilityStatus(f, now = new Date()) {
  if (!f.open) return { label: "Open 24/7", tone: "coral" };
  const m = now.getHours() * 60 + now.getMinutes();
  const on = f.open.days.includes(now.getDay()) && m >= f.open.from && m < f.open.to;
  return { label: on ? "Open now" : "Closed now", tone: on ? "mint" : "muted" };
}
/** "Ground Floor" from "Ground Floor, Wing A". */
export const floorOf = (f) => f.location.split(",")[0];

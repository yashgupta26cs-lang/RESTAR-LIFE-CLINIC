# DOCTOR'S CLINIC website

Open `index.html` in any browser. No build step and no frameworks. The three files must stay in the same folder.

## Placeholder details to replace
These are invented for the demo. Change them before going live.
- **Doctors** (in `script.js`, the `DOCTORS` list): names, qualifications, fees (₹500 to ₹1,000), days and time slots.
- **Address, phone, email** (in `index.html`): 12, Health Avenue, Sector 21, New Delhi, +91 11 2345 6789, care@doctorsclinic.example.
- **Clinic timings** (in `index.html`): Mon to Sat 09:00 AM to 01:00 PM and 04:00 PM to 08:00 PM, Sunday emergency only.
- **Stats** on the home page (6 doctors, 15+ years and so on).
- **Photos**: Unsplash stock URLs, all checked to load. If one ever fails, a black-bordered box with the image's label shows instead.

## How booking works
- Tokens start at DC-101 and go up by one per booking. The counter and booked slots are saved in the browser's localStorage, so they are per-device only. A real clinic would need a server to share tokens across devices.
- Each doctor and date has 1 or 2 sample slots marked "Booked". Slots you book also become "Booked". Past slots on today's date show "Passed".
- Dates are limited to today through 60 days ahead, and to the doctor's working days.
- Phone validation expects a 10-digit Indian mobile number (starts with 6 to 9; +91 or a leading 0 is accepted).
- "Print / Save Sheet (PDF)" prints only the slip, on one A4 page.

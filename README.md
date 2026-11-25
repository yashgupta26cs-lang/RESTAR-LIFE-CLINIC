# DOCTOR'S CLINIC website

Live site: https://yashgupta26cs-lang.github.io/RESTAR-LIFE-CLINIC/

Open `index.html` in any browser. It needs no build step and no frameworks. Keep `index.html`, `styles.css` and `script.js` in the same folder.

## Placeholder details to replace
These are invented for the demo:
- **Doctors** (the `DOCTORS` list at the top of `script.js`): names, qualifications, years of experience, days, timings and fees.
- **Address, phone, email** (in `index.html`): 12, Health Avenue, Sector 21, Dwarka, New Delhi 110075; +91 11 2345 6789; care@doctorsclinic.example.
- **Hours and quick stats**: Mon–Sat 08:00 AM–08:00 PM, 06+ specialists, 24/7 lab, 15 min average wait.
- **Photos**: Unsplash stock images. If one fails to load, a plain #EAEAEA box shows instead of a broken-image icon.

## How booking works
- Tokens start at DC-101 and go up by one per booking. The counter and booked slots are saved in this browser's localStorage only, so they are not shared between devices. A real clinic needs a server for this.
- Each doctor and date has 2 sample slots marked BOOKED. Slots already past on today's date show PASSED.
- Dates are limited to today through 60 days ahead, Monday to Saturday, and to the chosen doctor's consulting days.
- Phone numbers must be 10-digit Indian mobile numbers (+91 or a leading 0 is accepted).
- "Print / Save Copy Sheet (PDF)" prints only the slip, on one A4 page.

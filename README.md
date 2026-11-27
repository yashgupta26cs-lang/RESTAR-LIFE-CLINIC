# DOCTOR'S CLINIC: OPD & Diagnostics portal

Live site: https://yashgupta26cs-lang.github.io/RESTAR-LIFE-CLINIC/

A React, Tailwind CSS and Lucide React app with four views: Home, Overview / Explore, Take Appointment and Find My Token. It uses a warm cream and deep emerald design (Plus Jakarta Sans, Inter and JetBrains Mono), a custom inline SVG logo, rounded cards and subtle 200 ms transitions.

## Run locally
```bash
npm install
npm run dev      # development server
npm run build    # production build in dist/
```

## Publishing
The `main` branch holds the source code. The `gh-pages` branch holds the built `dist/` folder, which GitHub Pages serves. Pages use hash URLs such as `#/explore`, so refreshing a page never gives a 404.

## Placeholder content (replace before real use)
Everything below is invented demo content. Replace it with the clinic's real, verified details before the site goes in front of patients.
- **Doctors** (`DOCTORS` in `src/data.js`): all 8 doctors, their qualifications, medical registration numbers (`MCI-xxxxx`), past hospital affiliations, biographies, languages, schedules and consultation rooms. Real doctors' registration numbers should match the National Medical Commission or State Medical Council register.
- **Fees**: General Medicine ₹800, Pediatrics ₹900, Dermatology ₹1,000, Orthopedics ₹1,200, Cardiology ₹1,500, Neurology ₹1,600. There is a ₹0 online booking charge; the fee is paid at reception.
- **Clinic details** (`CLINIC` in `src/data.js`): street address, landmark, reception landline, 24/7 emergency number, email and Clinical Establishment registration number.
- **Accreditation badge** (`CLINIC.accreditation`): "NABH Entry-Level Certified" and the hygiene-audit line. Keep these only if the clinic actually holds that certification.
- **Facility prices** (`FACILITIES[].price`), such as "CBC from ₹350".
- **Statistics and testimonials** on the home page.
- **Photos**: Unsplash stock images requested at fixed crop sizes, plus `public/images/` crops of the two reference images the clinic supplied (the 3D heart, and the portrait used for Dr. Meera Joshi). If a photo fails to load, a branded placeholder (or the doctor's initials) shows instead of a broken-image icon.

## Doctor info popup
Clicking a doctor card, its photo, name or "View Profile" (Home and Overview), or "View Full Info" (booking page, on each doctor option and in the live summary) opens one shared popup. It shows the portrait, qualifications, registration number, experience, fee, languages, biography, education, affiliations, conditions treated and a weekly OPD schedule. It closes with the X, the Esc key or a click outside. Its "Book Appointment with Dr. ..." button opens the booking page with that doctor selected; on the booking page it selects the doctor in place, so the form keeps what was typed.

## Hover preview card (desktop)
`src/components/HoverPreview.jsx` provides `useHoverPreview()` and `<HoverPreviewCard />`: a 230 x 280 px photo card that follows the mouse over the Overview doctor and facility rows and the doctor rows on the booking page. It glides after the cursor with `requestAnimationFrame` and a 0.14 lerp, stays inside the viewport, never takes clicks (`pointer-events: none`), preloads every photo so rows swap instantly, and fades out when the cursor leaves the list. It is only switched on when `(hover: hover) and (pointer: fine)` matches, so phones and tablets get plain tap-to-open rows with small photos instead.

The Home page "Meet our senior doctors" section uses the same doctor rows and hover card. Overview rows open the doctor popup or the facility popup (`src/components/FacilityModal.jsx`); each doctor row also has a direct Book button. On the booking page, clicking a row selects the doctor and the info button opens the doctor popup without losing what was typed.

## Bookings and tokens
- Bookings are saved in the browser's `localStorage`, so they stay on that device only. A clinic running this for real needs a server to share them across devices.
- On first visit the app adds 3 sample bookings, DC-098 to DC-100. Each doctor and date also shows 2 sample BOOKED slots so the grid looks in use.
- Real bookings start at DC-101. A booked slot stays marked BOOKED for that doctor and date, even after a reload.
- Find My Token looks up a booking by token number or phone number and can print the slip again.
- The slip is laid out like a hospital OPD slip cum receipt: letterhead with clinic registration and accreditation, token number with a Code 39 barcode, receipt number, patient ID (UHID), booking channel, appointment date, time, reporting time and room, patient and doctor details (with the doctor's registration number), and a fee table (Consultation Fee + ₹0 Online Booking Charge = Total Payable at Reception). Print / Save as PDF prints only the slip, on one A4 page.

## Previous version
The earlier plain HTML/CSS/JS version is kept in `legacy-static/`.

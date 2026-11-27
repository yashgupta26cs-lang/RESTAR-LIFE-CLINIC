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
- **Doctors** (`src/data.js`): all 8 doctors are invented, along with their qualifications, biographies, languages, schedules and fees.
- **Clinic details** (`CLINIC` in `src/data.js`): address, phone, emergency number and email.
- **Statistics and testimonials** on the home page.
- **Photos**: Unsplash stock images, plus `public/images/` crops of the two reference images the clinic supplied (the 3D heart, and the portrait used for Dr. Meera Joshi). If a photo fails to load, a branded placeholder (or the doctor's initials) shows instead of a broken-image icon.

## Bookings and tokens
- Bookings are saved in the browser's `localStorage`, so they stay on that device only. A clinic running this for real needs a server to share them across devices.
- On first visit the app adds 3 sample bookings, DC-098 to DC-100. Each doctor and date also shows 2 sample BOOKED slots so the grid looks in use.
- Real bookings start at DC-101. A booked slot stays marked BOOKED for that doctor and date, even after a reload.
- Find My Token looks up a booking by token number or phone number and can print the slip again.
- The slip carries a Code 39 barcode of the token number. Print / Save as PDF prints only the slip, on one A4 page.

## Previous version
The earlier plain HTML/CSS/JS version is kept in `legacy-static/`.

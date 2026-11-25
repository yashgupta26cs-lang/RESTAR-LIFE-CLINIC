/* =========================================================
   DOCTOR'S CLINIC: views, doctors, booking form, token slip
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  // Days: 0 = Sunday ... 6 = Saturday
  var DOCTORS = [
    {
      id: "dr-sharma", name: "Dr. Rajesh Sharma", specialty: "General Physician",
      qual: "MBBS, MD (Medicine) · 18 yrs experience", fee: 500,
      days: [1, 2, 3, 4, 5, 6], daysText: "Mon – Sat", timeText: "09:00 AM – 01:00 PM, 04:00 PM – 06:00 PM",
      slots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"]
    },
    {
      id: "dr-mehta", name: "Dr. Ananya Mehta", specialty: "Cardiologist",
      qual: "MBBS, MD, DM (Cardiology) · 14 yrs experience", fee: 1000,
      days: [1, 3, 5], daysText: "Mon, Wed, Fri", timeText: "10:00 AM – 01:00 PM",
      slots: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]
    },
    {
      id: "dr-nair", name: "Dr. Priya Nair", specialty: "Dermatologist",
      qual: "MBBS, MD (Dermatology) · 10 yrs experience", fee: 700,
      days: [1, 2, 3, 4, 5], daysText: "Mon – Fri", timeText: "04:00 PM – 07:00 PM",
      slots: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"]
    },
    {
      id: "dr-singh", name: "Dr. Vikram Singh", specialty: "Orthopedic Surgeon",
      qual: "MBBS, MS (Orthopaedics) · 16 yrs experience", fee: 800,
      days: [2, 4, 6], daysText: "Tue, Thu, Sat", timeText: "09:00 AM – 12:00 PM, 04:00 PM – 06:00 PM",
      slots: ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM"]
    },
    {
      id: "dr-kapoor", name: "Dr. Arjun Kapoor", specialty: "Pediatrician",
      qual: "MBBS, MD (Paediatrics) · 12 yrs experience", fee: 600,
      days: [1, 2, 3, 4, 5, 6], daysText: "Mon – Sat", timeText: "09:00 AM – 12:00 PM",
      slots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]
    },
    {
      id: "dr-iyer", name: "Dr. Sneha Iyer", specialty: "Gynecologist",
      qual: "MBBS, MS (Obstetrics & Gynaecology) · 11 yrs experience", fee: 800,
      days: [1, 3, 5, 6], daysText: "Mon, Wed, Fri, Sat", timeText: "11:00 AM – 01:00 PM, 05:00 PM – 07:00 PM",
      slots: ["11:00 AM", "11:30 AM", "12:00 PM", "05:00 PM", "05:30 PM", "06:00 PM"]
    }
  ];

  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var TOKEN_START = 101;
  var STORE_TOKEN = "dc_last_token";
  var STORE_BOOKINGS = "dc_bookings";

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fee(n) { return "₹" + n.toLocaleString("en-IN"); }
  function initials(name) {
    return name.replace(/^Dr\.\s*/, "").split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }
  function findDoctor(id) {
    for (var i = 0; i < DOCTORS.length; i++) if (DOCTORS[i].id === id) return DOCTORS[i];
    return null;
  }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toISO(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseISO(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function prettyDate(s) {
    var d = parseISO(s);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  }
  // "04:30 PM" -> minutes since midnight
  function slotMinutes(slot) {
    var m = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    var h = +m[1] % 12;
    if (m[3] === "PM") h += 12;
    return h * 60 + +m[2];
  }
  // Small deterministic hash, so sample "booked" slots stay the same for a doctor + date
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- View switching ---------- */
  var VIEWS = ["home", "overview", "appointment"];

  function showView(name, opts) {
    if (VIEWS.indexOf(name) === -1) name = "home";
    $all(".view").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== name; });
    $all(".nav-link").forEach(function (a) {
      var on = a.getAttribute("data-view-link") === name;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (!opts || !opts.keepScroll) window.scrollTo(0, 0);
  }

  function currentHashView() {
    var h = (location.hash || "#home").slice(1);
    return VIEWS.indexOf(h) === -1 ? "home" : h;
  }

  window.addEventListener("hashchange", function () { showView(currentHashView()); });

  /* ---------- Image fallback (if a stock photo fails to load) ---------- */
  function wireImageFallbacks() {
    $all("img.mono-img").forEach(function (img) {
      function swap() {
        var box = document.createElement("div");
        box.className = "img-fallback " + (img.className.replace("mono-img", "").trim());
        box.setAttribute("role", "img");
        box.setAttribute("aria-label", img.alt);
        box.textContent = img.getAttribute("data-fallback") || img.alt;
        img.replaceWith(box);
      }
      if (img.complete && img.naturalWidth === 0 && img.src) swap();
      else img.addEventListener("error", swap, { once: true });
    });
  }

  /* ---------- Overview: doctor cards ---------- */
  function renderDoctorCards() {
    var grid = $("#doctor-grid");
    grid.innerHTML = DOCTORS.map(function (d) {
      return (
        '<article class="card doctor-card">' +
          '<div class="doc-top">' +
            '<span class="doc-initials" aria-hidden="true">' + initials(d.name) + "</span>" +
            "<div>" +
              '<h3 class="card-title">' + d.name + "</h3>" +
              '<span class="doc-specialty">' + d.specialty + "</span>" +
            "</div>" +
          "</div>" +
          '<div class="card-body">' +
            '<p class="doc-qual">' + d.qual + "</p>" +
            '<dl class="doc-meta">' +
              "<div><dt>Consultation Fee</dt><dd><strong>" + fee(d.fee) + "</strong></dd></div>" +
              "<div><dt>Days</dt><dd>" + d.daysText + "</dd></div>" +
              "<div><dt>Timings</dt><dd>" + d.timeText + "</dd></div>" +
            "</dl>" +
            '<button type="button" class="btn btn-solid" data-book="' + d.id + '">Book Appointment</button>' +
          "</div>" +
        "</article>"
      );
    }).join("");

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-book]");
      if (!btn) return;
      openBookingWith(btn.getAttribute("data-book"));
    });
  }

  function openBookingWith(doctorId) {
    showBookingPanel();
    selectDoctor(doctorId);
    if (location.hash !== "#appointment") location.hash = "#appointment";
    else showView("appointment");
    var input = $('input[name="doctor"][value="' + doctorId + '"]');
    if (input) input.focus({ preventScroll: true });
  }

  /* ---------- Booking form ---------- */
  var form, slotGrid, dateInput;
  var state = { doctorId: null, slot: null };

  function renderDoctorOptions() {
    $("#doctor-options").innerHTML = DOCTORS.map(function (d) {
      return (
        '<label class="doc-option">' +
          '<input type="radio" name="doctor" value="' + d.id + '">' +
          '<span class="doc-option-box">' +
            '<span class="doc-option-name">' + d.name + "</span>" +
            '<span class="doc-option-spec">' + d.specialty + "</span>" +
            '<span class="doc-option-fee">' + fee(d.fee) + "</span>" +
            '<span class="doc-option-days">' + d.daysText + " · " + d.timeText + "</span>" +
          "</span>" +
        "</label>"
      );
    }).join("");
  }

  function selectDoctor(id) {
    var d = findDoctor(id);
    state.doctorId = d ? d.id : null;
    state.slot = null;
    $all('input[name="doctor"]').forEach(function (r) { r.checked = r.value === state.doctorId; });
    $("#fee-amount").textContent = d ? fee(d.fee) + "  (" + d.name + ")" : "Select a doctor";
    clearError("doctor");
    updateDateHint();
    renderSlots();
  }

  function updateDateHint() {
    var d = findDoctor(state.doctorId);
    $("#date-hint").textContent = d ? d.name + " is available on " + d.daysText + "." : "";
  }

  function getBookings() { return store(STORE_BOOKINGS) || {}; }

  function bookedSlotsFor(doctor, dateStr) {
    var booked = {};
    // Two sample "already booked" slots, fixed per doctor + date
    var n = doctor.slots.length;
    var h = hash(doctor.id + "|" + dateStr);
    booked[doctor.slots[h % n]] = true;
    booked[doctor.slots[(h >> 3) % n]] = true;
    // Plus slots booked from this browser
    var key = doctor.id + "|" + dateStr;
    (getBookings()[key] || []).forEach(function (s) { booked[s] = true; });
    return booked;
  }

  function renderSlots() {
    var d = findDoctor(state.doctorId);
    var dateStr = dateInput.value;

    if (!d) { slotGrid.innerHTML = '<p class="slot-empty">Select a doctor to see available time slots.</p>'; return; }
    if (!dateStr) { slotGrid.innerHTML = '<p class="slot-empty">Choose an appointment date to see available time slots.</p>'; return; }

    var date = parseISO(dateStr);
    if (d.days.indexOf(date.getDay()) === -1) {
      slotGrid.innerHTML = '<p class="slot-empty">' + d.name + " is not available on " + DAY_NAMES[date.getDay()] +
        "s. Available: " + d.daysText + ". Please pick another date.</p>";
      state.slot = null;
      return;
    }

    var booked = bookedSlotsFor(d, dateStr);
    var now = new Date();
    var isToday = toISO(now) === dateStr;
    var nowMin = now.getHours() * 60 + now.getMinutes();

    var html = "";
    var lastGroup = "";
    d.slots.forEach(function (s) {
      var group = slotMinutes(s) < 12 * 60 ? "Morning" : (slotMinutes(s) < 16 * 60 ? "Afternoon" : "Evening");
      if (group !== lastGroup) { html += '<p class="slot-group-label">' + group + "</p>"; lastGroup = group; }
      var isBooked = !!booked[s];
      var isPast = isToday && slotMinutes(s) <= nowMin;
      var disabled = isBooked || isPast;
      if (disabled && state.slot === s) state.slot = null;
      var selected = !disabled && state.slot === s;
      html += '<button type="button" class="slot' + (selected ? " is-selected" : "") + '" data-slot="' + s + '" role="radio" aria-checked="' + selected + '"' +
        (disabled ? " disabled" : "") + ">" +
        '<span class="slot-time">' + s + "</span>" +
        (isBooked ? '<span class="slot-tag">Booked</span>' : isPast ? '<span class="slot-tag">Passed</span>' : "") +
        "</button>";
    });
    slotGrid.innerHTML = html;
  }

  /* ---------- Validation ---------- */
  var FIELDS = {
    name: "#patient-name", age: "#patient-age", phone: "#patient-phone",
    symptoms: "#patient-symptoms", date: "#appt-date"
  };

  function setError(key, msg) {
    var el = $("#err-" + key);
    if (el) el.textContent = msg;
    if (FIELDS[key]) { $(FIELDS[key]).classList.add("is-invalid"); $(FIELDS[key]).setAttribute("aria-invalid", "true"); }
    if (key === "gender") $(".segmented").classList.add("is-invalid-group");
    if (key === "doctor") $("#doctor-options").classList.add("is-invalid-group");
  }
  function clearError(key) {
    var el = $("#err-" + key);
    if (el) el.textContent = "";
    if (FIELDS[key]) { $(FIELDS[key]).classList.remove("is-invalid"); $(FIELDS[key]).removeAttribute("aria-invalid"); }
    if (key === "gender") $(".segmented").classList.remove("is-invalid-group");
    if (key === "doctor") $("#doctor-options").classList.remove("is-invalid-group");
  }

  function collect() {
    var g = $('input[name="gender"]:checked');
    return {
      name: $("#patient-name").value.trim().replace(/\s+/g, " "),
      age: $("#patient-age").value.trim(),
      gender: g ? g.value : "",
      phone: $("#patient-phone").value.trim(),
      symptoms: $("#patient-symptoms").value.trim(),
      doctorId: state.doctorId,
      date: dateInput.value,
      slot: state.slot
    };
  }

  function validate(v) {
    var errors = {};

    if (!v.name) errors.name = "Please enter the patient's name.";
    else if (v.name.length < 2) errors.name = "Name must be at least 2 characters.";
    else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v.name)) errors.name = "Name can contain letters, spaces, dots, hyphens and apostrophes only.";

    if (v.age === "") errors.age = "Please enter the age.";
    else if (!/^\d{1,3}$/.test(v.age) || +v.age < 0 || +v.age > 120) errors.age = "Enter a valid age between 0 and 120.";

    if (!v.gender) errors.gender = "Please select a gender.";

    var digits = v.phone.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
    if (!v.phone) errors.phone = "Please enter a phone number.";
    else if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = "Enter a valid 10-digit mobile number (starting with 6, 7, 8 or 9).";

    if (!v.symptoms) errors.symptoms = "Please describe the disease or symptoms.";
    else if (v.symptoms.length < 3) errors.symptoms = "Please add a little more detail (at least 3 characters).";

    var d = findDoctor(v.doctorId);
    if (!d) errors.doctor = "Please select a doctor.";

    if (!v.date) errors.date = "Please choose an appointment date.";
    else {
      var chosen = parseISO(v.date);
      var today = parseISO(toISO(new Date()));
      var max = new Date(today); max.setDate(max.getDate() + 60);
      if (chosen < today) errors.date = "The date cannot be in the past.";
      else if (chosen > max) errors.date = "Appointments can be booked up to 60 days in advance.";
      else if (d && d.days.indexOf(chosen.getDay()) === -1) errors.date = d.name + " is not available on " + DAY_NAMES[chosen.getDay()] + "s (" + d.daysText + ").";
    }

    if (!v.slot) errors.slot = "Please select an available time slot.";

    return errors;
  }

  var LABELS = { name: "Patient Name", age: "Age", gender: "Gender", phone: "Phone Number", symptoms: "Disease / Symptoms", doctor: "Doctor", date: "Appointment Date", slot: "Time Slot" };
  var ORDER = ["name", "age", "gender", "phone", "symptoms", "doctor", "date", "slot"];

  function showErrors(errors) {
    ORDER.forEach(function (k) { if (errors[k]) setError(k, errors[k]); else clearError(k); });
    var keys = ORDER.filter(function (k) { return errors[k]; });
    var summary = $("#form-error-summary");
    if (!keys.length) { summary.hidden = true; summary.innerHTML = ""; return; }
    summary.innerHTML = "<strong>Please fix " + keys.length + " field" + (keys.length > 1 ? "s" : "") + ":</strong><ul>" +
      keys.map(function (k) { return "<li>" + LABELS[k] + ": " + errors[k] + "</li>"; }).join("") + "</ul>";
    summary.hidden = false;
    summary.scrollIntoView({ block: "start" });
    var first = keys[0];
    var focusEl = FIELDS[first] ? $(FIELDS[first]) :
      first === "gender" ? $('input[name="gender"]') :
      first === "doctor" ? $('input[name="doctor"]') :
      $(".slot:not(:disabled)");
    if (focusEl) focusEl.focus({ preventScroll: true });
  }

  /* ---------- Token + slip ---------- */
  function nextToken() {
    var last = store(STORE_TOKEN);
    var n = (typeof last === "number" && last >= TOKEN_START) ? last + 1 : TOKEN_START;
    store(STORE_TOKEN, n);
    return "DC-" + n;
  }

  function saveBooking(v) {
    var all = getBookings();
    var key = v.doctorId + "|" + v.date;
    all[key] = (all[key] || []).concat(v.slot);
    store(STORE_BOOKINGS, all);
  }

  function fillSlip(v, token) {
    var d = findDoctor(v.doctorId);
    var digits = v.phone.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
    $("#slip-token").textContent = token;
    $("#slip-name").textContent = v.name;
    $("#slip-age").textContent = v.age + (+v.age === 1 ? " year" : " years");
    $("#slip-gender").textContent = v.gender;
    $("#slip-phone").textContent = "+91 " + digits.slice(0, 5) + " " + digits.slice(5);
    $("#slip-symptoms").textContent = v.symptoms;
    $("#slip-doctor").textContent = d.name;
    $("#slip-specialty").textContent = d.specialty;
    $("#slip-fee").textContent = fee(d.fee);
    $("#slip-date").textContent = prettyDate(v.date);
    $("#slip-time").textContent = v.slot;
    $("#slip-issued").textContent = new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    document.title = "Appointment " + token + " · DOCTOR'S CLINIC";
  }

  function showSlipPanel() {
    $("#booking-panel").hidden = true;
    $("#slip-panel").hidden = false;
    window.scrollTo(0, 0);
  }
  function showBookingPanel() {
    $("#slip-panel").hidden = true;
    $("#booking-panel").hidden = false;
    document.title = "DOCTOR'S CLINIC";
  }

  function resetForm() {
    form.reset();
    state.doctorId = null;
    state.slot = null;
    ORDER.forEach(clearError);
    $("#form-error-summary").hidden = true;
    $("#fee-amount").textContent = "Select a doctor";
    updateDateHint();
    renderSlots();
  }

  /* ---------- Wire up ---------- */
  function init() {
    form = $("#booking-form");
    slotGrid = $("#slot-grid");
    dateInput = $("#appt-date");

    var today = new Date();
    var max = new Date(); max.setDate(max.getDate() + 60);
    dateInput.min = toISO(today);
    dateInput.max = toISO(max);

    wireImageFallbacks();
    renderDoctorCards();
    renderDoctorOptions();
    renderSlots();

    // Any link to a view: also reset the slip back to the form when "Take Appointment" is clicked
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-view-link]");
      if (!a) return;
      var view = a.getAttribute("data-view-link");
      if (view === "appointment" && !$("#slip-panel").hidden) { showBookingPanel(); resetForm(); }
      if (location.hash === "#" + view) { e.preventDefault(); showView(view); }
    });

    $("#doctor-options").addEventListener("change", function (e) {
      if (e.target.name === "doctor") selectDoctor(e.target.value);
    });

    slotGrid.addEventListener("click", function (e) {
      var b = e.target.closest(".slot");
      if (!b || b.disabled) return;
      state.slot = b.getAttribute("data-slot");
      $all(".slot", slotGrid).forEach(function (s) {
        var on = s === b;
        s.classList.toggle("is-selected", on);
        s.setAttribute("aria-checked", on ? "true" : "false");
      });
      clearError("slot");
    });

    dateInput.addEventListener("change", function () {
      clearError("date");
      renderSlots();
    });

    // Clear an error as soon as the field is corrected
    ["name", "age", "phone", "symptoms"].forEach(function (k) {
      $(FIELDS[k]).addEventListener("input", function () { clearError(k); });
    });
    $all('input[name="gender"]').forEach(function (r) {
      r.addEventListener("change", function () { clearError("gender"); });
    });
    // Phone: digits, spaces, + and - only
    $("#patient-phone").addEventListener("input", function (e) {
      var cleaned = e.target.value.replace(/[^\d+\s-]/g, "");
      if (cleaned !== e.target.value) e.target.value = cleaned;
    });

    form.addEventListener("reset", function () {
      setTimeout(resetForm, 0);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = collect();
      var errors = validate(v);
      // Guard against a slot that became unavailable
      if (!errors.slot && !errors.date && !errors.doctor) {
        var d = findDoctor(v.doctorId);
        if (bookedSlotsFor(d, v.date)[v.slot]) errors.slot = "That slot has just been booked. Please choose another.";
      }
      showErrors(errors);
      if (Object.keys(errors).length) { if (errors.slot) renderSlots(); return; }

      var token = nextToken();
      saveBooking(v);
      fillSlip(v, token);
      showSlipPanel();
    });

    $("#btn-print").addEventListener("click", function () { window.print(); });
    $("#btn-new").addEventListener("click", function () {
      showBookingPanel();
      resetForm();
      window.scrollTo(0, 0);
    });

    showView(currentHashView(), { keepScroll: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* ==========================================================
   DOCTOR'S CLINIC: views, directory search, booking, OPD slip
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Data (placeholder doctors: replace with real ones) ---------- */
  var DOCTORS = [
    { id: "mehta",  name: "Dr. Arjun Mehta",   qual: "MBBS, MD (Internal Medicine)",       specialty: "General Medicine", exp: 18, timings: "Mon – Sat · 09:00 AM – 05:00 PM", fee: 600 },
    { id: "kapoor", name: "Dr. Sunita Kapoor", qual: "MBBS, MD (Medicine)",                specialty: "General Medicine", exp: 11, timings: "Mon – Sat · 09:00 AM – 05:00 PM", fee: 500 },
    { id: "rao",    name: "Dr. Vikram Rao",    qual: "MBBS, MD, DM (Cardiology)",          specialty: "Cardiology",       exp: 21, timings: "Mon, Wed, Fri · 10:00 AM – 05:00 PM", fee: 1200, days: [1, 3, 5] },
    { id: "singh",  name: "Dr. Harpreet Singh",qual: "MBBS, MS (Orthopaedics)",            specialty: "Orthopedics",      exp: 16, timings: "Tue, Thu, Sat · 09:00 AM – 05:00 PM", fee: 900, days: [2, 4, 6] },
    { id: "nair",   name: "Dr. Priya Nair",    qual: "MBBS, MD (Dermatology, Venereology)",specialty: "Dermatology",      exp: 10, timings: "Mon – Fri · 09:00 AM – 05:00 PM", fee: 800, days: [1, 2, 3, 4, 5] },
    { id: "iyer",   name: "Dr. Kavya Iyer",    qual: "MBBS, MD (Paediatrics)",             specialty: "Pediatrics",       exp: 13, timings: "Mon – Sat · 09:00 AM – 05:00 PM", fee: 700 }
  ];
  var SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "04:00 PM", "04:30 PM", "05:00 PM"];
  var DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var CLINIC_DAYS = [1, 2, 3, 4, 5, 6];
  var TOKEN_START = 101;
  var K_TOKEN = "dc2_last_token", K_BOOKED = "dc2_booked";

  /* ---------- Helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function inr(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function byId(id) { for (var i = 0; i < DOCTORS.length; i++) if (DOCTORS[i].id === id) return DOCTORS[i]; return null; }
  function daysOf(d) { return d.days || CLINIC_DAYS; }
  function initials(n) { return n.replace(/^Dr\.\s*/, "").split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseISO(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function longDate(s) { return parseISO(s).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }); }
  function mins(slot) { var m = slot.match(/(\d+):(\d+)\s*(AM|PM)/); var h = +m[1] % 12 + (m[3] === "PM" ? 12 : 0); return h * 60 + +m[2]; }
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(k));
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function cleanPhone(p) { return p.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""); }

  /* ---------- Views ---------- */
  var VIEWS = ["home", "overview", "appointment"];
  function viewFromHash() { var h = location.hash.slice(1); return VIEWS.indexOf(h) > -1 ? h : "home"; }
  function showView(name) {
    $$(".view").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== name; });
    $$(".nav-link").forEach(function (a) {
      var on = a.getAttribute("data-view-link") === name;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }
  function go(name, scrollId) {
    if (location.hash !== "#" + name) history.pushState(null, "", "#" + name);
    showView(name);
    if (scrollId) {
      var el = document.getElementById(scrollId);
      if (el) {
        var top = el.getBoundingClientRect().top + window.pageYOffset - $(".site-header").offsetHeight;
        window.scrollTo(0, top);
      }
    }
  }
  window.addEventListener("popstate", function () { showView(viewFromHash()); });
  window.addEventListener("hashchange", function () { showView(viewFromHash()); });

  /* ---------- Image fallback: grey box, never a broken icon ---------- */
  function wireImages() {
    $$(".media img").forEach(function (img) {
      function broken() { img.parentNode.classList.add("is-broken"); }
      if (img.complete && img.naturalWidth === 0) broken();
      img.addEventListener("error", broken);
    });
  }

  /* ---------- Directory ---------- */
  var filter = { text: "", spec: "All" };

  function renderDirectory() {
    var q = filter.text.trim().toLowerCase();
    var list = DOCTORS.filter(function (d) {
      var specOk = filter.spec === "All" || d.specialty === filter.spec;
      var textOk = !q || (d.name + " " + d.specialty + " " + d.qual).toLowerCase().indexOf(q) > -1;
      return specOk && textOk;
    });
    $("#doctor-grid").innerHTML = list.map(function (d) {
      return '<article class="doctor-card">' +
        '<div class="doc-head">' +
          '<span class="doc-mono" aria-hidden="true">' + initials(d.name) + "</span>" +
          "<div>" +
            '<span class="badge">' + esc(d.specialty) + "</span>" +
            '<h3 class="doc-name">' + esc(d.name) + "</h3>" +
            '<p class="doc-qual">' + esc(d.qual) + "</p>" +
          "</div>" +
        "</div>" +
        '<div class="doc-body">' +
          '<dl class="doc-facts">' +
            "<div><dt>Experience</dt><dd>" + d.exp + " years</dd></div>" +
            "<div><dt>Available</dt><dd>" + esc(d.timings) + "</dd></div>" +
            '<div><dt>Consultation Fee</dt><dd class="doc-fee">' + inr(d.fee) + "</dd></div>" +
          "</dl>" +
          '<button type="button" class="btn btn-primary" data-book="' + d.id + '">Book Appointment</button>' +
        "</div>" +
      "</article>";
    }).join("");
    $("#doctor-empty").hidden = list.length > 0;
    $("#result-count").textContent = "Showing " + list.length + " of " + DOCTORS.length + " doctors";
  }

  function setSpec(spec) {
    filter.spec = spec;
    $$("#filter-tabs .tab").forEach(function (t) {
      var on = t.getAttribute("data-filter") === spec;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    renderDirectory();
  }

  /* ---------- Booking state ---------- */
  var state = { doctorId: null, slot: null };
  var dateEl;

  function renderDocOptions() {
    $("#doc-options").innerHTML = DOCTORS.map(function (d) {
      return '<label class="doc-opt">' +
        '<input type="radio" name="doctor" value="' + d.id + '">' +
        '<span class="doc-opt-box">' +
          '<span class="doc-opt-name">' + esc(d.name) + "</span>" +
          '<span class="doc-opt-fee">' + inr(d.fee) + "</span>" +
          '<span class="doc-opt-spec">' + esc(d.specialty) + "</span>" +
        "</span></label>";
    }).join("");
  }

  function selectDoctor(id) {
    state.doctorId = byId(id) ? id : null;
    $$('input[name="doctor"]').forEach(function (r) { r.checked = r.value === state.doctorId; });
    clearErr("doctor");
    var d = byId(state.doctorId);
    $("#date-hint").textContent = d
      ? d.name + " consults " + d.timings.split(" · ")[0] + "."
      : "OPD runs Monday to Saturday. Sunday is closed.";
    renderSlots();
    updateSummary();
  }

  function bookedSet(doctorId, date) {
    var set = {};
    // Two sample "BOOKED" slots, fixed for each doctor + date
    var h = hash(doctorId + "|" + date);
    var a = h % SLOTS.length, b = (a + 1 + (h >>> 4) % (SLOTS.length - 1)) % SLOTS.length;
    set[SLOTS[a]] = true; set[SLOTS[b]] = true;
    var mine = (store(K_BOOKED) || {})[doctorId + "|" + date] || [];
    mine.forEach(function (s) { set[s] = true; });
    return set;
  }

  function renderSlots() {
    var grid = $("#slot-grid");
    var d = byId(state.doctorId);
    var date = dateEl.value;
    if (!d) { grid.innerHTML = '<p class="slot-empty">Select a doctor in step 02 to see available time slots.</p>'; return; }
    if (!date) { grid.innerHTML = '<p class="slot-empty">Choose a date to see available time slots.</p>'; return; }
    var day = parseISO(date).getDay();
    if (daysOf(d).indexOf(day) === -1) {
      state.slot = null;
      grid.innerHTML = '<p class="slot-empty">' + esc(d.name) + " does not consult on " + DAY[day] + "s (" +
        esc(d.timings.split(" · ")[0]) + "). Please choose another date.</p>";
      updateSummary();
      return;
    }
    var booked = bookedSet(d.id, date);
    var now = new Date(), today = iso(now) === date, nowM = now.getHours() * 60 + now.getMinutes();
    grid.innerHTML = SLOTS.map(function (s) {
      var isB = !!booked[s], isP = !isB && today && mins(s) <= nowM;
      var off = isB || isP;
      if (off && state.slot === s) state.slot = null;
      var sel = !off && state.slot === s;
      return '<button type="button" class="slot' + (sel ? " is-selected" : "") + '" data-slot="' + s + '" role="radio" aria-checked="' + sel + '"' + (off ? " disabled" : "") + ">" +
        '<span class="slot-time">' + s + "</span>" +
        (isB ? '<span class="slot-tag">BOOKED</span>' : isP ? '<span class="slot-tag">PASSED</span>' : "") +
        "</button>";
    }).join("");
    updateSummary();
  }

  /* ---------- Live summary ---------- */
  function setSum(id, val, empty) {
    var el = $("#" + id);
    el.textContent = val || empty;
    el.classList.toggle("is-empty", !val);
  }
  function collect() {
    var g = $('input[name="gender"]:checked');
    return {
      name: $("#f-name").value.trim().replace(/\s+/g, " "),
      age: $("#f-age").value.trim(),
      gender: g ? g.value : "",
      phone: $("#f-phone").value.trim(),
      symptoms: $("#f-symptoms").value.trim(),
      doctorId: state.doctorId,
      date: dateEl.value,
      slot: state.slot
    };
  }
  function updateSummary() {
    var v = collect(), d = byId(v.doctorId);
    setSum("s-patient", v.name, "Not entered");
    var ag = [v.age ? v.age + " yrs" : "", v.gender].filter(Boolean).join(" / ");
    setSum("s-agegender", ag, "Not entered");
    setSum("s-phone", v.phone, "Not entered");
    setSum("s-doctor", d && d.name, "Not selected");
    setSum("s-specialty", d && d.specialty, "Not selected");
    setSum("s-date", v.date && longDate(v.date), "Not selected");
    setSum("s-slot", v.slot, "Not selected");
    $("#s-fee").textContent = d ? inr(d.fee) : "₹—";
    var done = [v.name, v.age, v.gender, v.phone, v.symptoms, v.doctorId, v.date, v.slot].filter(Boolean).length;
    $("#s-progress").textContent = done + " of 8 details complete";
    $("#s-bar").style.width = (done / 8 * 100) + "%";
  }

  /* ---------- Validation ---------- */
  var INPUTS = { name: "#f-name", age: "#f-age", phone: "#f-phone", symptoms: "#f-symptoms", date: "#f-date" };
  var GROUPS = { gender: "#gender-group", doctor: "#doc-options" };
  var LABEL = { name: "Full Name", age: "Age", gender: "Gender", phone: "Phone Number", symptoms: "Disease / Symptoms", doctor: "Doctor", date: "Appointment Date", slot: "Time Slot" };
  var ORDER = ["name", "age", "phone", "gender", "symptoms", "doctor", "date", "slot"];

  function setErr(k, msg) {
    $("#err-" + k).textContent = msg;
    if (INPUTS[k]) { $(INPUTS[k]).classList.add("is-invalid"); $(INPUTS[k]).setAttribute("aria-invalid", "true"); }
    if (GROUPS[k]) $(GROUPS[k]).classList.add("is-invalid-group");
  }
  function clearErr(k) {
    $("#err-" + k).textContent = "";
    if (INPUTS[k]) { $(INPUTS[k]).classList.remove("is-invalid"); $(INPUTS[k]).removeAttribute("aria-invalid"); }
    if (GROUPS[k]) $(GROUPS[k]).classList.remove("is-invalid-group");
  }

  function validate(v) {
    var e = {};
    if (!v.name) e.name = "Enter the patient's full name.";
    else if (v.name.length < 2) e.name = "Name must be at least 2 characters.";
    else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v.name)) e.name = "Use letters, spaces, dots, hyphens or apostrophes only.";

    if (v.age === "") e.age = "Enter the patient's age.";
    else if (!/^\d{1,3}$/.test(v.age) || +v.age > 120) e.age = "Enter an age between 0 and 120.";

    if (!v.gender) e.gender = "Select a gender.";

    if (!v.phone) e.phone = "Enter a phone number.";
    else if (!/^[6-9]\d{9}$/.test(cleanPhone(v.phone))) e.phone = "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.";

    if (!v.symptoms) e.symptoms = "Describe the disease or symptoms.";
    else if (v.symptoms.length < 3) e.symptoms = "Add a little more detail.";

    var d = byId(v.doctorId);
    if (!d) e.doctor = "Select a doctor.";

    if (!v.date) e.date = "Choose an appointment date.";
    else {
      var c = parseISO(v.date), t = parseISO(iso(new Date()));
      var max = new Date(t); max.setDate(max.getDate() + 60);
      if (c < t) e.date = "The date cannot be in the past.";
      else if (c > max) e.date = "Appointments open up to 60 days ahead.";
      else if (CLINIC_DAYS.indexOf(c.getDay()) === -1) e.date = "The clinic OPD is closed on Sundays.";
      else if (d && daysOf(d).indexOf(c.getDay()) === -1) e.date = d.name + " does not consult on " + DAY[c.getDay()] + "s.";
    }

    if (!v.slot) e.slot = "Select an available time slot.";
    else if (d && v.date && bookedSet(d.id, v.date)[v.slot]) e.slot = "That slot was just booked. Please pick another.";
    return e;
  }

  function showErrors(e) {
    ORDER.forEach(function (k) { if (e[k]) setErr(k, e[k]); else clearErr(k); });
    var keys = ORDER.filter(function (k) { return e[k]; });
    var box = $("#error-summary");
    if (!keys.length) { box.hidden = true; box.innerHTML = ""; return; }
    box.innerHTML = "<strong>Please correct " + keys.length + " field" + (keys.length > 1 ? "s" : "") + " to continue</strong><ul>" +
      keys.map(function (k) { return '<li><a href="#err-' + k + '" data-jump="' + k + '">' + LABEL[k] + "</a>: " + esc(e[k]) + "</li>"; }).join("") + "</ul>";
    box.hidden = false;
    var y = box.getBoundingClientRect().top + window.pageYOffset - $(".site-header").offsetHeight - 16;
    window.scrollTo(0, y);
    box.focus({ preventScroll: true });
  }

  function focusField(k) {
    var el = INPUTS[k] ? $(INPUTS[k]) : k === "gender" ? $('input[name="gender"]') : k === "doctor" ? $('input[name="doctor"]') : $(".slot:not(:disabled)") || $("#f-date");
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - $(".site-header").offsetHeight - 80;
    window.scrollTo(0, y);
    el.focus({ preventScroll: true });
  }

  /* ---------- Token & slip ---------- */
  function nextToken() {
    var last = store(K_TOKEN);
    var n = typeof last === "number" && last >= TOKEN_START ? last + 1 : TOKEN_START;
    store(K_TOKEN, n);
    return "DC-" + n;
  }
  function remember(v) {
    var all = store(K_BOOKED) || {};
    var k = v.doctorId + "|" + v.date;
    all[k] = (all[k] || []).concat(v.slot);
    store(K_BOOKED, all);
  }
  function fillSlip(v, token) {
    var d = byId(v.doctorId), p = cleanPhone(v.phone);
    $("#slip-token").textContent = "#" + token;
    $("#t-name").textContent = v.name;
    $("#t-agegender").textContent = v.age + " yrs / " + v.gender;
    $("#t-phone").textContent = "+91 " + p.slice(0, 5) + " " + p.slice(5);
    $("#t-symptoms").textContent = v.symptoms;
    $("#t-doctor").textContent = d.name + ", " + d.qual;
    $("#t-specialty").textContent = d.specialty;
    $("#t-fee").textContent = inr(d.fee);
    $("#t-date").textContent = longDate(v.date);
    $("#t-slot").textContent = v.slot;
    $("#slip-stamp").textContent = "Issued " + new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    document.title = "OPD Token " + token + " | DOCTOR'S CLINIC";
  }

  function defaultDate() {
    var d = new Date();
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Sunday closed: default to Monday
    return iso(d);
  }

  function resetBooking() {
    $("#booking-form").reset();
    state.doctorId = null; state.slot = null;
    $$('input[name="doctor"]').forEach(function (r) { r.checked = false; });
    ORDER.forEach(clearErr);
    $("#error-summary").hidden = true;
    dateEl.value = defaultDate();
    $("#date-hint").textContent = "OPD runs Monday to Saturday. Sunday is closed.";
    renderSlots();
    updateSummary();
    $("#slip-panel").hidden = true;
    $("#booking-panel").hidden = false;
    document.title = "DOCTOR'S CLINIC | Multispecialty Outpatient Care";
  }

  /* ---------- Init ---------- */
  function init() {
    dateEl = $("#f-date");
    var t = new Date(), max = new Date(); max.setDate(max.getDate() + 60);
    dateEl.min = iso(t); dateEl.max = iso(max); dateEl.value = defaultDate();
    $("#year").textContent = t.getFullYear();

    wireImages();
    renderDirectory();
    renderDocOptions();
    renderSlots();
    updateSummary();

    // View links
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-view-link]");
      if (!a) return;
      e.preventDefault();
      var v = a.getAttribute("data-view-link");
      if (v === "appointment" && !$("#slip-panel").hidden) resetBooking();
      go(v, a.getAttribute("data-scroll-to"));
    });

    // Directory
    $("#doctor-search").addEventListener("input", function (e) { filter.text = e.target.value; renderDirectory(); });
    $("#filter-tabs").addEventListener("click", function (e) {
      var b = e.target.closest(".tab"); if (b) setSpec(b.getAttribute("data-filter"));
    });
    $("#clear-search").addEventListener("click", function () { $("#doctor-search").value = ""; filter.text = ""; setSpec("All"); });
    $("#doctor-grid").addEventListener("click", function (e) {
      var b = e.target.closest("[data-book]"); if (!b) return;
      resetBooking();
      selectDoctor(b.getAttribute("data-book"));
      go("appointment");
    });

    // Form
    $("#doc-options").addEventListener("change", function (e) { if (e.target.name === "doctor") selectDoctor(e.target.value); });
    $("#slot-grid").addEventListener("click", function (e) {
      var b = e.target.closest(".slot"); if (!b || b.disabled) return;
      state.slot = b.getAttribute("data-slot");
      $$(".slot").forEach(function (s) { var on = s === b; s.classList.toggle("is-selected", on); s.setAttribute("aria-checked", on); });
      clearErr("slot");
      updateSummary();
    });
    dateEl.addEventListener("change", function () { clearErr("date"); renderSlots(); });
    ["name", "age", "phone", "symptoms"].forEach(function (k) {
      $(INPUTS[k]).addEventListener("input", function () { clearErr(k); updateSummary(); });
    });
    $("#f-phone").addEventListener("input", function (e) {
      var c = e.target.value.replace(/[^\d+\s-]/g, ""); if (c !== e.target.value) e.target.value = c;
    });
    $$('input[name="gender"]').forEach(function (r) { r.addEventListener("change", function () { clearErr("gender"); updateSummary(); }); });
    $("#error-summary").addEventListener("click", function (e) {
      var a = e.target.closest("[data-jump]"); if (!a) return;
      e.preventDefault(); focusField(a.getAttribute("data-jump"));
    });

    $("#booking-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = collect(), errs = validate(v);
      if (errs.slot) renderSlots();
      showErrors(errs);
      if (Object.keys(errs).length) return;
      var token = nextToken();
      remember(v);
      fillSlip(v, token);
      $("#booking-panel").hidden = true;
      $("#slip-panel").hidden = false;
      window.scrollTo(0, 0);
    });

    $("#btn-print").addEventListener("click", function () { window.print(); });
    $("#btn-new").addEventListener("click", function () { resetBooking(); window.scrollTo(0, 0); });

    showView(viewFromHash());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

/* ==========================================================================
   BundaCare - Main Application Logic & Pregnancy Tracker Engine
   ========================================================================== */

// --- Initial Mock Data & LocalStorage Engine ---
const DEFAULT_STATE = {
  profile: {
    name: "Aulia Cantik",
    email: "aulia.cantik@example.com",
    hpht: "2026-02-16", // 16 Feb 2026 -> ~24 weeks at Aug 2026
    goldar: "O+",
    bbAwal: 55,
    bbSekarang: 62,
    tb: 162,
    emergency: "Budi Santoso (0812-3456-7890)",
    doctor: "dr. Anisa Sp.OG (RS Permata)",
    allergy: "Alergi Obat Penisilin, Riwayat Asma Ringan"
  },
  medicines: [
    { id: 1, name: "Asam Folat (Acid Folic)", dosage: "400 mcg", time: "08:00", freq: "1x Sehari", note: "Diminum sesudah sarapan pagi", taken: true },
    { id: 2, name: "Sangobion Iron Supplement", dosage: "1 Kapsul", time: "12:30", freq: "1x Sehari", note: "Diminum bersama jus jeruk (vitamin C)", taken: false },
    { id: 3, name: "Calcium Lactate (Kalsium)", dosage: "500 mg", time: "20:00", freq: "1x Sehari", note: "Diminum malam sebelum tidur", taken: false },
    { id: 4, name: "DHA Folamil Genio", dosage: "1 Softgel", time: "08:00", freq: "1x Sehari", note: "Suplemen nutrisi otak janin", taken: true }
  ],
  ancRecords: [
    {
      id: 101,
      date: "2026-07-28",
      week: 23,
      bp: "110/70",
      weight: 61.2,
      djj: "145 bpm",
      tfu: "21 cm",
      note: "Posisi janin kepala di bawah (presentasi kepala). Detak jantung janin kuat dan teratur. Ibu disarankan tetap aktif jalan pagi.",
      hasUsg: true,
      usgImg: "assets/ultrasound.png"
    },
    {
      id: 102,
      date: "2026-06-25",
      week: 19,
      bp: "115/75",
      weight: 58.5,
      djj: "148 bpm",
      tfu: "17 cm",
      note: "Pemeriksaan USG Anomaly Scan. Struktur organ janin normal. Cairan ketuban cukup.",
      hasUsg: true,
      usgImg: "assets/ultrasound.png"
    }
  ],
  diaryLogs: [
    { id: 201, date: "03 Agu 2026", moodEmoji: "😄", moodLabel: "Sangat Bahagia", complaint: "Tidak ada keluhan", note: "Si kecil aktif banget nendang-nendang jam 8 malam tadi! Suami senang banget ikut rasain tendangannya." },
    { id: 202, date: "02 Agu 2026", moodEmoji: "😊", moodLabel: "Tenang", complaint: "Pegal di pinggang bawah", note: "Sudah mulai stretching yoga hamil ringan. Rasanya lebih rileks." }
  ]
};

// Load or Initialize State
let appState = JSON.parse(localStorage.getItem('bundacare_state')) || DEFAULT_STATE;

if (!appState.profile.name || appState.profile.name === "Sarah Pertiwi") {
  appState.profile.name = "Aulia Cantik";
  appState.profile.email = "aulia.cantik@example.com";
}

function saveState() {
  localStorage.setItem('bundacare_state', JSON.stringify(appState));
}

// --- Fetal Growth Database (Weeks 1 to 40) ---
const FETAL_DATABASE = {
  4: { fruit: "Biji Wijen (Sesame Seed)", size: "0.2 cm", weight: "0.1 gram", desc: "Embriogenesis awal. Tabung saraf dan plasenta mulai terbentuk." },
  8: { fruit: "Buah Kismis (Raisin)", size: "1.6 cm", weight: "1.0 gram", desc: "Jari-jari tangan dan kaki mulai terbentuk. Jantung berdetak cepat." },
  12: { fruit: "Buah Jeruk Nipis (Lime)", size: "5.4 cm", weight: "14 gram", desc: "Organ vital sudah terbentuk lengkap. Janin mulai bisa mengepalkan tangan." },
  16: { fruit: "Buah Alpukat (Avocado)", size: "11.6 cm", weight: "100 gram", desc: "Mata janin peka terhadap cahaya. Otot punggung semakin kuat." },
  20: { fruit: "Buah Pisang (Banana)", size: "25.6 cm", weight: "300 gram", desc: "Lapisan vernix caseosa melindungi kulit janin dari cairan ketuban." },
  24: { fruit: "Buah Terung (Eggplant)", size: "30.0 cm", weight: "600 gram", desc: "Pendengaran janin sangat peka. Janin mulai membentuk refleks mengisap jempol." },
  28: { fruit: "Buah Kelapa Muda (Coconut)", size: "37.6 cm", weight: "1000 gram", desc: "Mata janin bisa membuka dan memejam. Otak berkembang pesat." },
  32: { fruit: "Buah Melon (Cantaloupe)", size: "42.4 cm", weight: "1700 gram", desc: "Kuku dan rambut halus janin tumbuh sempurna. Ruang gerak semakin sempit." },
  36: { fruit: "Buah Pepaya (Papaya)", size: "47.4 cm", weight: "2600 gram", desc: "Paru-paru hampir matang sempurna. Janin bersiap dalam posisi siap lahir." },
  40: { fruit: "Buah Semangka (Watermelon)", size: "51.2 cm", weight: "3400 gram", desc: "Janin sudah siap menyapa dunia! Selamat menantikan persalinan." }
};

// Helper for weeks fallback
function getFetalData(weekNum) {
  if (FETAL_DATABASE[weekNum]) return FETAL_DATABASE[weekNum];
  const keys = Object.keys(FETAL_DATABASE).map(Number).sort((a,b) => a-b);
  let closest = keys[0];
  for (let k of keys) {
    if (weekNum >= k) closest = k;
  }
  return FETAL_DATABASE[closest];
}

// --- Pregnancy Calculation Engine ---
function calculatePregnancyDetails(hphtStr) {
  const hpht = new Date(hphtStr);
  const today = new Date("2026-08-03"); // Standard system anchor date
  
  const diffMs = today - hpht;
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  
  // Naegele's rule: HPL = HPHT + 280 days
  const hpl = new Date(hpht.getTime() + (280 * 24 * 60 * 60 * 1000));
  const daysLeft = Math.max(0, Math.floor((hpl - today) / (1000 * 60 * 60 * 24)));
  
  let trimester = 1;
  let trimesterLabel = "Trimester 1 (Awal Kehamilan)";
  if (weeks >= 14 && weeks <= 27) {
    trimester = 2;
    trimesterLabel = `Trimester 2 (Bulan ${Math.ceil(weeks / 4.33)})`;
  } else if (weeks >= 28) {
    trimester = 3;
    trimesterLabel = `Trimester 3 (Bulan ${Math.ceil(weeks / 4.33)})`;
  }
  
  const progressPercent = Math.min(100, Math.round((weeks / 40) * 100));

  return {
    weeks,
    days,
    totalDays,
    hplFormatted: formatDateIndo(hpl),
    hphtFormatted: formatDateIndo(hpht),
    daysLeft,
    trimester,
    trimesterLabel,
    progressPercent
  };
}

function formatDateIndo(dateObj) {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

// --- Core UI Update Functions ---
function updateDashboard() {
  const p = appState.profile;
  const calc = calculatePregnancyDetails(p.hpht);
  const fetal = getFetalData(calc.weeks);

  // Update Hero Card
  document.getElementById('heroWeekText').innerText = `Minggu ${calc.weeks}`;
  document.getElementById('heroHphtText').innerText = calc.hphtFormatted;
  document.getElementById('heroHplText').innerText = calc.hplFormatted;
  document.getElementById('heroTrimesterBadge').innerText = calc.trimesterLabel;
  document.getElementById('heroDaysLeftText').innerText = `${calc.daysLeft} Hari Menuju Persalinan 🎉`;
  document.getElementById('heroProgressFill').style.width = `${calc.progressPercent}%`;

  // Stats
  document.getElementById('statWeekVal').innerText = `${calc.weeks} W ${calc.days} D`;
  document.getElementById('statSizeVal').innerText = `~${fetal.size}`;
  document.getElementById('statWeightVal').innerText = `~${fetal.weight}`;
  const diffBb = (p.bbSekarang - p.bbAwal).toFixed(1);
  document.getElementById('statMotherBbVal').innerText = `${diffBb >= 0 ? '+' : ''}${diffBb} kg`;

  // Fetal Growth Card
  document.getElementById('fetalFruitText').innerText = fetal.fruit;
  document.getElementById('fetalDescText').innerText = fetal.desc;

  // Sidebar / Header
  document.getElementById('sidebarName').innerText = p.name;
  document.getElementById('sidebarAgeBadge').innerText = `Usia: ${calc.weeks} W | Trimester ${calc.trimester}`;
  document.getElementById('pageSubtitle').innerText = `Selamat datang kembali, ${p.name} 💕`;

  // Render Dashboard Medicines Checklist
  renderDashboardMedList();

  // Update Profile Tab Details
  document.getElementById('profNameDisplay').innerText = p.name;
  document.getElementById('profEmailDisplay').innerText = p.email;
  document.getElementById('profGoldarDisplay').innerText = `Golongan Darah: ${p.goldar}`;
  document.getElementById('profHpht').innerText = calc.hphtFormatted;
  document.getElementById('profHpl').innerText = calc.hplFormatted;
  document.getElementById('profBb').innerText = `${p.bbAwal} kg ➔ ${p.bbSekarang} kg (+${diffBb} kg)`;
  document.getElementById('profTb').innerText = `${p.tb} cm`;
  document.getElementById('profEmergency').innerText = p.emergency;
  document.getElementById('profDoctor').innerText = p.doctor;
  document.getElementById('profAllergy').innerText = p.allergy;
}

// Render Dashboard Short Medicine List
function renderDashboardMedList() {
  const container = document.getElementById('dashMedList');
  container.innerHTML = '';

  if (appState.medicines.length === 0) {
    container.innerHTML = '<p style="font-size:13px; color:var(--text-muted);">Belum ada jadwal obat yang dicatat.</p>';
    return;
  }

  appState.medicines.slice(0, 3).forEach(med => {
    const card = document.createElement('div');
    card.className = `med-card ${med.taken ? 'taken' : ''}`;
    card.innerHTML = `
      <div class="med-left">
        <div class="med-icon"><i class="fa-solid fa-capsules"></i></div>
        <div class="med-info">
          <h5>${med.name} (${med.dosage})</h5>
          <p><i class="fa-regular fa-clock"></i> ${med.time} • ${med.freq}</p>
        </div>
      </div>
      <button class="checkbox-custom" onclick="toggleMedTaken(${med.id})">
        ${med.taken ? '<i class="fa-solid fa-check"></i>' : ''}
      </button>
    `;
    container.appendChild(card);
  });
}

// Render Full Medicines Tab List
function renderFullMedList() {
  const container = document.getElementById('fullMedList');
  container.innerHTML = '';

  appState.medicines.forEach(med => {
    const card = document.createElement('div');
    card.className = `med-card ${med.taken ? 'taken' : ''}`;
    card.innerHTML = `
      <div class="med-left">
        <div class="med-icon"><i class="fa-solid fa-pills"></i></div>
        <div class="med-info">
          <h5>${med.name} - ${med.dosage}</h5>
          <p><i class="fa-regular fa-clock"></i> Jam: <strong>${med.time}</strong> | Frekuensi: ${med.freq} | <em>${med.note}</em></p>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span class="glass-pill" style="font-size:11px; font-weight:700; color:${med.taken ? 'var(--accent-teal)' : 'var(--accent-pink)'};">
          ${med.taken ? '✓ Diminum' : 'Belum Diminum'}
        </span>
        <button class="checkbox-custom" onclick="toggleMedTaken(${med.id})">
          ${med.taken ? '<i class="fa-solid fa-check"></i>' : ''}
        </button>
        <button class="icon-btn" style="width:32px; height:32px; font-size:14px; color:#ff1744;" onclick="deleteMed(${med.id})" title="Hapus Obat">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function toggleMedTaken(id) {
  const med = appState.medicines.find(m => m.id === id);
  if (med) {
    med.taken = !med.taken;
    saveState();
    updateDashboard();
    renderFullMedList();
    showToast(med.taken ? `Status ${med.name} diperbarui: Diminum! 👏` : `Status ${med.name} diubah.`);
  }
}

function deleteMed(id) {
  appState.medicines = appState.medicines.filter(m => m.id !== id);
  saveState();
  updateDashboard();
  renderFullMedList();
  showToast("Jadwal obat berhasil dihapus.");
}

function saveNewMedicine(e) {
  e.preventDefault();
  const name = document.getElementById('newMedName').value;
  const dosage = document.getElementById('newMedDosage').value;
  const time = document.getElementById('newMedTime').value;
  const freq = document.getElementById('newMedFreq').value;
  const note = document.getElementById('newMedNote').value;

  const newMed = {
    id: Date.now(),
    name,
    dosage,
    time,
    freq,
    note: note || "Catatan minum biasa",
    taken: false
  };

  appState.medicines.push(newMed);
  saveState();
  updateDashboard();
  renderFullMedList();
  closeModal('modalAddMed');
  showToast(`Obat ${name} berhasil ditambahkan! 💊`);
  e.target.reset();
}

// --- ANC Records & USG Renderer ---
function renderAncList() {
  const container = document.getElementById('ancListContainer');
  container.innerHTML = '';

  appState.ancRecords.forEach(anc => {
    const card = document.createElement('div');
    card.className = 'anc-record-card glass-panel';
    card.innerHTML = `
      ${anc.hasUsg ? `
        <div class="usg-thumb-wrapper" onclick="openModal('modalUsgZoom')">
          <img src="${anc.usgImg}" alt="Foto USG">
        </div>
      ` : `
        <div class="med-icon" style="width:110px; height:110px; border-radius:var(--radius-md); font-size:32px;">
          <i class="fa-solid fa-stethoscope"></i>
        </div>
      `}
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:16px; font-weight:800;">Pemeriksaan Minggu Ke-${anc.week}</h4>
          <span class="glass-pill" style="font-size:12px; font-weight:700;"><i class="fa-regular fa-calendar"></i> ${anc.date}</span>
        </div>
        <div style="display:flex; gap:16px; margin:10px 0; font-size:13px; font-weight:700; color:var(--text-main);">
          <span><i class="fa-solid fa-heart-pulse" style="color:var(--accent-pink);"></i> TD: ${anc.bp}</span>
          <span><i class="fa-solid fa-weight-scale" style="color:var(--primary);"></i> BB: ${anc.weight} kg</span>
          <span><i class="fa-solid fa-wave-square" style="color:var(--accent-teal);"></i> DJJ: ${anc.djj}</span>
          <span><i class="fa-solid fa-ruler-vertical"></i> TFU: ${anc.tfu}</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">${anc.note}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function saveNewAnc(e) {
  e.preventDefault();
  const date = document.getElementById('ancDate').value;
  const week = Number(document.getElementById('ancWeek').value);
  const bp = document.getElementById('ancBp').value;
  const weight = Number(document.getElementById('ancWeight').value);
  const djj = document.getElementById('ancDjj').value || "140 bpm";
  const tfu = document.getElementById('ancTfu').value || "20 cm";
  const note = document.getElementById('ancNote').value || "Hasil pemeriksaan normal.";

  const newRecord = {
    id: Date.now(),
    date,
    week,
    bp,
    weight,
    djj,
    tfu,
    note,
    hasUsg: true,
    usgImg: "assets/ultrasound.png"
  };

  appState.ancRecords.unshift(newRecord);
  saveState();
  renderAncList();
  closeModal('modalAddAnc');
  showToast("Catatan hasil ANC berhasil disimpan! 🩺");
  e.target.reset();
}

// --- Profile Update Logic ---
function saveProfile(e) {
  e.preventDefault();
  appState.profile.name = document.getElementById('editName').value;
  appState.profile.hpht = document.getElementById('editHpht').value;
  appState.profile.goldar = document.getElementById('editGoldar').value;
  appState.profile.bbAwal = Number(document.getElementById('editBbAwal').value);
  appState.profile.bbSekarang = Number(document.getElementById('editBbSekarang').value);
  appState.profile.emergency = document.getElementById('editEmergency').value;

  saveState();
  updateDashboard();
  closeModal('modalEditProfile');
  showToast("Profil Bunda berhasil diperbarui! ✨");
}

function populateProfileModal() {
  document.getElementById('editName').value = appState.profile.name;
  document.getElementById('editHpht').value = appState.profile.hpht;
  document.getElementById('editGoldar').value = appState.profile.goldar;
  document.getElementById('editBbAwal').value = appState.profile.bbAwal;
  document.getElementById('editBbSekarang').value = appState.profile.bbSekarang;
  document.getElementById('editEmergency').value = appState.profile.emergency;
}

// --- Calendar Logic ---
let calDate = new Date(2026, 7, 1); // August 2026

function renderCalendar() {
  const monthYearEl = document.getElementById('calMonthYear');
  const daysGrid = document.getElementById('calendarDaysGrid');
  
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  monthYearEl.innerText = `${months[calDate.getMonth()]} ${calDate.getFullYear()}`;

  daysGrid.innerHTML = '';
  
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Blank cells for previous month
  for (let i = 0; i < firstDayIndex; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-date-cell';
    blank.style.opacity = '0.3';
    daysGrid.appendChild(blank);
  }

  // Days of month
  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement('div');
    cell.className = 'cal-date-cell';
    if (day === 3 && month === 7 && year === 2026) {
      cell.classList.add('today');
    }

    // Add dots for mock events
    let dotsHtml = '';
    if (day % 2 === 0) dotsHtml += '<span class="dot-event dot-med"></span>';
    if (day === 6 || day === 20) dotsHtml += '<span class="dot-event dot-doctor"></span>';
    if (day === 28) dotsHtml += '<span class="dot-event dot-anc"></span>';

    cell.innerHTML = `
      <span class="num">${day}</span>
      <div class="cal-dots">${dotsHtml}</div>
    `;

    cell.onclick = () => {
      showToast(`Tanggal ${day} ${months[month]} selected.`);
    };

    daysGrid.appendChild(cell);
  }
}

function prevMonth() {
  calDate.setMonth(calDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  calDate.setMonth(calDate.getMonth() + 1);
  renderCalendar();
}

// --- Weekly Education Module ---
function initEducationSelect() {
  const select = document.getElementById('eduWeekSelect');
  select.innerHTML = '';
  for (let w = 1; w <= 40; w++) {
    const opt = document.createElement('option');
    opt.value = w;
    opt.innerText = `Minggu Ke-${w}`;
    if (w === 24) opt.selected = true;
    select.appendChild(opt);
  }
  loadEducationForWeek(24);
}

function loadEducationForWeek(w) {
  const weekNum = Number(w);
  const fetal = getFetalData(weekNum);
  const container = document.getElementById('eduContentArea');

  // Retrieve cached AI Daily Tip for this week or default
  const cacheKey = `bundacare_ai_tip_week_${weekNum}`;
  const savedAiTip = localStorage.getItem(cacheKey);

  container.innerHTML = `
    <div class="glass-panel" style="padding:24px; margin-bottom:20px; background:linear-gradient(135deg, rgba(124, 77, 255, 0.15) 0%, rgba(255, 64, 129, 0.15) 100%);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <h4 style="font-size:20px; font-weight:800; color:var(--primary);">Panduan Kehamilan Minggu Ke-${weekNum}</h4>
          <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Ukuran Janin: <strong>${fetal.fruit}</strong> (${fetal.size} | ${fetal.weight})</p>
        </div>
        <button class="btn-submit" style="width:auto; padding:10px 18px; margin:0; font-size:13px;" onclick="generateAiDailyTip(${weekNum})">
          <i class="fa-solid fa-wand-magic-sparkles"></i> ✨ Perbarui Tips Harian via AI
        </button>
      </div>
      <p style="font-size:14px; color:var(--text-main); margin-top:12px; line-height:1.6;">${fetal.desc}</p>
    </div>

    <!-- AI Daily Highlight Card -->
    <div class="glass-panel" style="padding:20px; margin-bottom:20px; border-left:4px solid var(--primary);" id="aiDailyTipCard">
      <h5 style="font-size:15px; font-weight:800; color:var(--primary); margin-bottom:8px; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-sparkles"></i> Tips Harian Terkini Dari AI Gemini (Minggu Ke-${weekNum})
      </h5>
      <div id="aiDailyTipBody" style="font-size:13.5px; color:var(--text-main); line-height:1.7;">
        ${savedAiTip || `• <strong>Hidrasi Cukup:</strong> Minum air putih 2.5L per hari untuk menjaga cairan ketuban yang cukup.<br>• <strong>Fokus Nutrisi:</strong> Konsumsi bayam dan zat besi untuk suplai eritrosit janin.<br>• <strong>Afirmasi Hari Ini:</strong> <em>"Tubuhku kuat, sehat, dan siap mendampingi tumbuh kembang buah hatiku setiap hari."</em>`}
      </div>
    </div>

    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:20px;">
      <div class="glass-panel" style="padding:20px;">
        <h5 style="font-size:15px; font-weight:800; color:var(--accent-teal); margin-bottom:10px;">
          <i class="fa-solid fa-apple-whole"></i> Gizi & Nutrisi Rekomendasi
        </h5>
        <ul style="padding-left:18px; font-size:13px; color:var(--text-muted); line-height:1.8;">
          <li>Asupan Zat Besi (Daging merah, bayam) untuk mencegah anemia.</li>
          <li>Kalsium (Susu hamil, keju, yoghurt) untuk pembentukan tulang & gigi.</li>
          <li>Asam Lemak Omega-3 (Ikan salmon, telur) untuk perkembangan otak janin.</li>
        </ul>
      </div>

      <div class="glass-panel" style="padding:20px;">
        <h5 style="font-size:15px; font-weight:800; color:var(--primary); margin-bottom:10px;">
          <i class="fa-solid fa-person-walking"></i> Aktivitas Sehat
        </h5>
        <ul style="padding-left:18px; font-size:13px; color:var(--text-muted); line-height:1.8;">
          <li>Jalan santai pagi 20-30 menit secara teratur.</li>
          <li>Senam yoga hamil (Prenatal Yoga) fokus pada pernapasan.</li>
          <li>Istirahat tidur miring ke kiri untuk memperlancar sirkulasi darah ke plasenta.</li>
        </ul>
      </div>

      <div class="glass-panel" style="padding:20px; grid-column: span 2; border-left:4px solid #ff1744;">
        <h5 style="font-size:15px; font-weight:800; color:#ff1744; margin-bottom:10px;">
          <i class="fa-solid fa-triangle-exclamation"></i> Tanda Bahaya Yang Perlu Diwaspadai!
        </h5>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.6;">
          Segera hubungi dokter atau RS jika Bunda mengalami: Perdarahan jalan lahir, sakit kepala hebat terus-menerus, pandangan kabur, demam tinggi, atau gerakan janin terasa berkurang secara signifikan.
        </p>
      </div>
    </div>
  `;
}

async function generateAiDailyTip(weekNum) {
  const bodyEl = document.getElementById('aiDailyTipBody');
  if (bodyEl) {
    bodyEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--primary);"></i> <span style="color:var(--text-muted);">Meminta tips harian terbaru dari Gemini AI untuk Minggu ke-${weekNum}...</span>`;
  }

  const savedKey = localStorage.getItem('bundacare_gemini_key');
  let resultText = "";

  if (savedKey && savedKey.startsWith('AIzaSy')) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${savedKey}`;
      const promptText = `Berikan 2 tips kesehatan harian terbaru, 1 rekomendasi nutrisi penting, dan 1 kalimat afirmasi positif untuk Ibu hamil pada Minggu Ke-${weekNum}. Tulis dalam format ringkas bullet points HTML dengan nada ramah dan hangat.`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          resultText = data.candidates[0].content.parts[0].text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        }
      }
    } catch (err) {
      console.warn("Error fetching AI daily tip:", err);
    }
  }

  if (!resultText) {
    // Dynamic generated offline fallback
    const tipsList = [
      `• <strong>Stretching Ringan:</strong> Lakukan peregangan kaki & panggul selama 10 menit pagi hari.<br>• <strong>Nutrisi Hari Ini:</strong> Konsumsi buah alpukat atau kacang almond untuk asupan lemak sehat otak janin.<br>• <strong>Afirmasi:</strong> <em>"Setiap detak jantung buah hatiku membawa kebahagiaan dan ketenangan di hatiku."</em>`,
      `• <strong>Kebutuhan Cairan:</strong> Siapkan botol minum 2 Liter agar hidrasi ketuban selalu terjaga teratur.<br>• <strong>Nutrisi Hari Ini:</strong> Susu tinggi kalsium & vitamin D untuk pembentukan kuku dan tulang si kecil.<br>• <strong>Afirmasi:</strong> <em>"Tubuhku adalah tempat terbaik, tersafe, dan tersayang untuk tumbuh kembang buah hatiku."</em>`
    ];
    resultText = tipsList[Math.floor(Math.random() * tipsList.length)];
  }

  // Save to Cache LocalStorage
  localStorage.setItem(`bundacare_ai_tip_week_${weekNum}`, resultText);
  if (bodyEl) bodyEl.innerHTML = resultText;
  showToast(`Tips harian AI Minggu ke-${weekNum} berhasil diperbarui! ✨`);
}

// --- Diary & Mood Tracker Engine ---
function selectMood(emoji, label) {
  document.getElementById('diaryMoodVal').value = emoji;
  document.getElementById('diaryMoodLabel').value = label;
  showToast(`Mood dipilih: ${emoji} ${label}`);
}

function renderDiaryHistory() {
  const container = document.getElementById('diaryHistoryList');
  container.innerHTML = '';

  appState.diaryLogs.forEach(log => {
    const card = document.createElement('div');
    card.className = 'glass-panel';
    card.style.padding = '14px';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:14px; font-weight:800;">${log.moodEmoji} ${log.moodLabel}</span>
        <span style="font-size:11px; color:var(--text-muted);">${log.date}</span>
      </div>
      ${log.complaint ? `<p style="font-size:12px; color:var(--accent-pink); font-weight:600;">Keluhan: ${log.complaint}</p>` : ''}
      <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">${log.note}</p>
    `;
    container.appendChild(card);
  });
}

function saveDiaryEntry(e) {
  e.preventDefault();
  const emoji = document.getElementById('diaryMoodVal').value;
  const label = document.getElementById('diaryMoodLabel').value;
  const complaint = document.getElementById('diaryComplaint').value;
  const note = document.getElementById('diaryNote').value;

  if (!note.trim()) {
    showToast("Silakan tulis catatan harian Bunda terlebih dahulu.");
    return;
  }

  const newLog = {
    id: Date.now(),
    date: "03 Agu 2026",
    moodEmoji: emoji,
    moodLabel: label,
    complaint,
    note
  };

  appState.diaryLogs.unshift(newLog);
  saveState();
  renderDiaryHistory();
  e.target.reset();
  showToast("Catatan harian Bunda berhasil disimpan! 💕");
}

// --- AI Chatbot Assistant ---
function saveCustomApiKey() {
  const input = document.getElementById('customApiKeyInput');
  const val = input ? input.value.trim() : '';
  if (!val) {
    showToast("Masukkan API Key Gemini yang valid (dimulai dengan AIzaSy...).");
    return;
  }
  localStorage.setItem('bundacare_gemini_key', val);
  showToast("API Key Gemini berhasil disimpan! 🔑");
  updateAiStatusBadge();
}

function updateAiStatusBadge() {
  const badge = document.getElementById('aiStatusBadge');
  const key = localStorage.getItem('bundacare_gemini_key');
  if (badge) {
    if (key && key.startsWith('AIzaSy')) {
      badge.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-teal);"></i> Gemini API Connected`;
    } else {
      badge.innerHTML = `<i class="fa-solid fa-heart-pulse" style="color:var(--primary);"></i> BundaCare Health Engine`;
    }
  }
}

async function sendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const query = input.value.trim();
  if (!query) return;

  const messagesBox = document.getElementById('chatMessages');

  // Append User message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerText = query;
  messagesBox.appendChild(userBubble);
  input.value = '';

  // Append Typing Indicator
  const botBubble = document.createElement('div');
  botBubble.className = 'chat-bubble bot';
  botBubble.id = 'aiTypingIndicator';
  botBubble.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--primary);"></i> <span style="color:var(--text-muted);">Asisten AI sedang berpikir...</span>`;
  messagesBox.appendChild(botBubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Fetch Response from Gemini API or Smart Fallback Engine
  const aiAnswer = await fetchGeminiAiResponse(query);
  botBubble.innerHTML = aiAnswer;
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

async function fetchGeminiAiResponse(query) {
  const savedKey = localStorage.getItem('bundacare_gemini_key');
  const apiKey = (savedKey && savedKey.trim()) ? savedKey.trim() : "";

  if (apiKey && apiKey.startsWith('AIzaSy')) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const promptText = `Anda adalah Asisten Medis Kehamilan BundaCare. Berikan jawaban yang hangat, ramah, empati, ilmiah, dan praktis untuk ibu hamil di Indonesia. Jika pertanyaan berhubungan dengan sholat/rukuk/puasa/ibadah, jelaskan sudut pandang kesehatan dan kemudahan (rukhshah) dalam Islam. Pertanyaan Ibu Hamil: "${query}"`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          let text = data.candidates[0].content.parts[0].text;
          return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, switching to local health knowledge engine:", err);
    }
  }

  // Fallback to comprehensive local maternal health knowledge engine
  return getAiFallbackResponse(query);
}

function getAiFallbackResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('rukuk') || q.includes('sholat') || q.includes('solat') || q.includes('sujud') || q.includes('ibadah')) {
    return "<strong>Boleh dan aman, Bunda!</strong> Ibu hamil yang sehat secara umum <strong>sangat diperbolehkan melakukan gerakan rukuk dan sujud saat sholat</strong>. Gerakan sholat bahkan dapat membantu melatih kelenturan panggul.<br><br>💡 <em>Tips Penting:</em><br>• Jika perut semakin membesar, posisi berdiri pusing, atau terasa kram/pegal pada pinggang, Agama Islam memberikan kemudahan (<em>rukhshah</em>) untuk <strong>sholat sambil duduk di kursi</strong>.<br>• Lakukan gerakan rukuk dan sujud secara perlahan tanpa terburu-buru.";
  } 
  else if (q.includes('puasa') || q.includes('ramadhan')) {
    return "Ibu hamil diperbolehkan berpuasa jika kondisi kesehatan ibu & janin dinyatakan baik oleh dokter/bidan. Namun, jika Bunda merasa lemas hebat, pusing berkunang-kunang, mual muntah, atau pergerakan janin berkurang, disarankan untuk segera membatalkan puasa demi keselamatan buah hati.";
  } 
  else if (q.includes('nanas') || q.includes('durian') || q.includes('nangka') || q.includes('pedas') || q.includes('makanan')) {
    return "Buah nanas matang atau durian dalam jumlah sedikit (1-2 potong kecil) umumnya tidak berbahaya bagi ibu hamil yang sehat. Namun, hindari mengonsumsinya secara berlebihan karena dapat merangsang asam lambung tinggi atau memicu rasa tidak nyaman di perut.";
  } 
  else if (q.includes('es') || q.includes('dingin')) {
    return "Air es atau minuman dingin tidak menyebabkan janin menjadi besar atau flu, Bunda. Yang perlu diperhatikan adalah kandungan gula di dalam minuman tersebut. Minum air putih dingin saat cuaca panas sangat aman dan menyegarkan!";
  } 
  else if (q.includes('mual') || q.includes('muntah') || q.includes('morning sickness')) {
    return "Untuk meredakan mual saat hamil:<br>1. Makan porsi kecil tapi sering (setiap 2-3 jam).<br>2. Minum seduhan jahe hangat.<br>3. Hindari makanan berlemak, berminyak, atau berbau menyengat.<br>4. Sediakan biskuit krakers kering di samping tempat tidur untuk dimakan sebelum bangun.";
  } 
  else if (q.includes('tidur') || q.includes('posisi')) {
    return "Posisi tidur paling direkomendasikan pada trimester 2 & 3 adalah <strong>miring ke sebelah kiri (SOS Position)</strong>. Posisi ini memaksimalkan aliran darah dan pasokan oksigen serta nutrisi menuju plasenta si kecil.";
  } 
  else if (q.includes('kram') || q.includes('pegal') || q.includes('kaki') || q.includes('pinggang')) {
    return "Kram kaki dan pegal pinggang terjadi karena perubahan berat badan dan sirkulasi darah. Bunda bisa meluruskan pergelangan kaki perlahan, memijat lembut dengan minyak hangat, mengonsumsi asupan kalsium, dan menjaga cairan minum air putih (minimal 2.5 L/hari).";
  } 
  else if (q.includes('olahraga') || q.includes('jalan') || q.includes('yoga') || q.includes('senam')) {
    return "Olahraga ringan seperti jalan santai pagi (20-30 menit), berenang, dan prenatal yoga sangat dianjurkan untuk memperlancar sirkulasi darah serta mempersiapkan otot panggul menjelang persalinan.";
  } 
  else if (q.includes('flek') || q.includes('darah') || q.includes('pendarahan')) {
    return "⚠️ <strong>PERHATIAN MEDIS:</strong> Adanya flek atau perdarahan pada masa kehamilan memerlukan pemeriksaan segera oleh dokter kandungan atau bidan terdekat. Segera istirahat (bedrest) dan hubungi layanan darurat RS.";
  } 
  else {
    return `Terima kasih atas pertanyaannya, Bunda! Mengenai "<strong>${escapeHtml(query)}</strong>", secara umum menjaga gizi seimbang, cairan tubuh terjamin, serta pola istirahat yang cukup sangat disarankan bagi kehamilan yang sehat 💕.<br><br><small style="color:var(--text-muted);">*Untuk kondisi klinis spesifik, selalu konsultasikan dengan dokter kandungan Bunda.*</small>`;
  }
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]; });
}

// --- Navigation & View Switcher ---
function switchTab(tabId) {
  // Update sidebar active status
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update mobile bottom nav
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    if (btn.getAttribute('onclick').includes(tabId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Hide all tabs & show active tab
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.remove('active');
  });

  const activeView = document.getElementById(`tab-${tabId}`);
  if (activeView) {
    activeView.classList.add('active');
  }

  // Update Page Title
  const titles = {
    'dashboard': 'Dashboard Ringkasan',
    'profil': 'Profil Kehamilan Bunda',
    'obat': 'Pengingat Obat & Vitamin',
    'pemeriksaan': 'Rekam Pemeriksaan ANC & USG',
    'kalender': 'Kalender & Agenda Kehamilan',
    'edukasi': 'Edukasi Mingguan Kehamilan',
    'catatan': 'Catatan Harian & Mood Tracker',
    'ai-assistant': 'Asisten AI BundaCare',
    'pengaturan': 'Pengaturan Aplikasi'
  };

  document.getElementById('pageTitle').innerText = titles[tabId] || 'BundaCare';

  // Trigger tab-specific renders
  if (tabId === 'obat') renderFullMedList();
  if (tabId === 'pemeriksaan') renderAncList();
  if (tabId === 'kalender') renderCalendar();
  if (tabId === 'profil') populateProfileModal();
  if (tabId === 'catatan') renderDiaryHistory();
}

// --- Modals & Toasts ---
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('active');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('active');
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  showToast(`Mode tampilan diubah ke ${next.toUpperCase()} mode.`);
}

function resetAppData() {
  if (confirm("Apakah Bunda yakin ingin mengembalikan data ke kondisi awal demo?")) {
    localStorage.removeItem('bundacare_state');
    appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
    updateDashboard();
    renderFullMedList();
    renderAncList();
    showToast("Data aplikasi berhasil direset.");
  }
}

// --- Initialize App on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  // Bind Sidebar Nav Clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Bind Theme Toggle
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

  // Bind Emergency Button
  document.getElementById('emergencyBtn').addEventListener('click', () => {
    alert(`🚨 DARURAT BUNDACARE 🚨\n\nMenghubungi:\n1. Suami / Kontak Utama: ${appState.profile.emergency}\n2. RS / Dokter Pendamping: ${appState.profile.doctor}\n3. Ambulans Gawat Darurat: 118 / 119`);
  });

  // Initial Builds
  updateDashboard();
  renderFullMedList();
  renderAncList();
  initEducationSelect();
  renderDiaryHistory();
});

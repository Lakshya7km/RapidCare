const params = new URLSearchParams(location.search);
const hospitalId = params.get('id');

const infoEl = document.getElementById('hospital-info');
const bedsEl = document.getElementById('beds');
const doctorsEl = document.getElementById('doctors');
const form = document.getElementById('emergency-form');
const formMsg = document.getElementById('form-msg');

async function loadHospital() {
  const res = await fetch(`/api/hospitals/${hospitalId}`);
  if (!res.ok) return;
  const h = await res.json();
  infoEl.innerHTML = `
    <h2>${h.name}</h2>
    <p>${h.location}</p>
    <p>Rating: ${h.rating?.toFixed?.(1) ?? h.rating ?? '-'} ★</p>
    <p>Specialties: ${(h.specialties||[]).join(', ') || '-'}</p>
    <p>Contact: ${h.contact || '-'}</p>
    <p>${h.yearsInService || 0} years – ${h.doctorsAvailable || 0} doctors</p>
  `;
}

async function loadBeds() {
  const res = await fetch(`/api/beds/availability?hospital_id=${hospitalId}`);
  const data = await res.json();
  bedsEl.innerHTML = data.map(b => `
    <div class="card">
      <div class="row"><span class="label">Bed:</span> ${b.bed_number} (${b.type})</div>
      <div>Status: <span class="badge ${b.status==='Vacant'?'green':'red'}">${b.status}</span></div>
    </div>
  `).join('') || '<div class="alert">No bed data</div>';
}

async function loadDoctors() {
  const res = await fetch(`/api/doctors/availability?hospital_id=${hospitalId}`);
  const data = await res.json();
  doctorsEl.innerHTML = data.map(d => `
    <div class="card">
      <div class="row"><span class="label">Dr. ${d.name}</span> – ${d.specialty}</div>
      <div>OPD: ${d.timings || '-'}</div>
      <div>Status: <span class="badge ${d.availability?'green':'red'}">${d.availability?'Available':'Not Available'}</span></div>
    </div>
  `).join('') || '<div class="alert">No doctor data</div>';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());
  payload.age = Number(payload.age);
  payload.hospital_id = hospitalId;
  const res = await fetch('/api/emergency/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    form.reset();
    formMsg.textContent = 'Emergency alert sent!';
  } else {
    formMsg.textContent = 'Failed to send alert';
  }
});

const socket = io();
socket.on('bed:updated', (bed) => {
  if (bed.hospital_id === hospitalId || bed.hospital_id?._id === hospitalId) {
    loadBeds();
  }
});
socket.on('doctor:updated', (doc) => {
  if (doc.hospital_id === hospitalId || doc.hospital_id?._id === hospitalId) {
    loadDoctors();
  }
});

loadHospital();
loadBeds();
loadDoctors();

const loginBox = document.getElementById('login-box');
const u = document.getElementById('u');
const p = document.getElementById('p');
const loginBtn = document.getElementById('login-btn');
const loginMsg = document.getElementById('login-msg');
const dash = document.getElementById('dash');
const bedsEl = document.getElementById('beds');
const doctorsEl = document.getElementById('doctors');
const requestsEl = document.getElementById('requests');

let token = localStorage.getItem('rc_staff_token') || '';

function setTab(tab) {
  document.getElementById('tab-beds').style.display = tab==='beds'?'block':'none';
  document.getElementById('tab-doctors').style.display = tab==='doctors'?'block':'none';
  document.getElementById('tab-ambulance').style.display = tab==='ambulance'?'block':'none';
}

document.querySelectorAll('.tabbar .btn').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));

async function login() {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: u.value, password: p.value })
  });
  if (res.ok) {
    const data = await res.json();
    token = data.token;
    localStorage.setItem('rc_staff_token', token);
    loginBox.style.display = 'none';
    dash.style.display = 'block';
    refreshAll();
  } else {
    loginMsg.textContent = 'Login failed';
  }
}
loginBtn.addEventListener('click', login);

async function loadBeds() {
  const res = await fetch('/api/beds/availability');
  const data = await res.json();
  bedsEl.innerHTML = data.map(b => `
    <div class="card">
      <div class="row"><span class="label">Hospital:</span> ${b.hospital_id?.name || '-'}</div>
      <div class="row"><span class="label">Bed:</span> ${b.bed_number} (${b.type})</div>
      <div>Status: <span class="badge ${b.status==='Vacant'?'green':'red'}">${b.status}</span></div>
      <div class="row">
        <button class="btn" data-id="${b._id}" data-status="Vacant">Mark Vacant</button>
        <button class="btn" data-id="${b._id}" data-status="Occupied">Mark Occupied</button>
      </div>
    </div>
  `).join('');
  bedsEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', async ()=>{
    await fetch(`/api/beds/update/${btn.dataset.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: btn.dataset.status })
    });
  }));
}

async function loadDoctors() {
  const res = await fetch('/api/doctors/availability');
  const data = await res.json();
  doctorsEl.innerHTML = data.map(d => `
    <div class="card">
      <div class="row"><span class="label">Hospital:</span> ${d.hospital_id?.name || '-'}</div>
      <div class="row"><span class="label">Doctor:</span> Dr. ${d.name} – ${d.specialty}</div>
      <div>Status: <span class="badge ${d.availability?'green':'red'}">${d.availability?'Available':'Not Available'}</span></div>
      <div class="row">
        <button class="btn" data-id="${d._id}" data-availability="true">Set Available</button>
        <button class="btn" data-id="${d._id}" data-availability="false">Set Not Available</button>
      </div>
    </div>
  `).join('');
  doctorsEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', async ()=>{
    await fetch(`/api/doctors/update/status/${btn.dataset.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ availability: btn.dataset.availability === 'true' })
    });
  }));
}

async function loadRequests() {
  const res = await fetch('/api/emergency/requests', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  requestsEl.innerHTML = data.map(r => `
    <div class="card">
      <div class="row"><span class="label">Patient:</span> ${r.patient_name} (${r.age}, ${r.gender})</div>
      <div class="row"><span class="label">Type:</span> ${r.emergency_type}</div>
      <div>Symptoms: ${r.symptoms || '-'}</div>
      <div>Status: <span class="badge">${r.status}</span></div>
      <div class="row">
        <button class="btn" data-action="accept" data-id="${r._id}">Accept</button>
        <button class="btn" data-action="transfer" data-id="${r._id}">Transfer</button>
      </div>
    </div>
  `).join('') || '<div class="alert">No requests</div>';
  requestsEl.querySelectorAll('button').forEach(btn => btn.addEventListener('click', async ()=>{
    const id = btn.dataset.id;
    if (btn.dataset.action === 'accept') {
      await fetch(`/api/emergency/request/accept/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }});
    } else {
      await fetch(`/api/emergency/request/transfer/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify({}) });
    }
  }));
}

function refreshAll(){ loadBeds(); loadDoctors(); loadRequests(); }

const socket = io();
socket.on('bed:updated', refreshAll);
socket.on('doctor:updated', refreshAll);
socket.on('emergency:new', refreshAll);
socket.on('emergency:updated', refreshAll);
socket.on('emergency:transferred', refreshAll);

if (token) { loginBox.style.display='none'; dash.style.display='block'; refreshAll(); }

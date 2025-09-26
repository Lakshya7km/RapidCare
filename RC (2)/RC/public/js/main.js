const listEl = document.getElementById('hospital-list');

async function loadHospitals() {
  const res = await fetch('/api/hospitals');
  const data = await res.json();
  listEl.innerHTML = data.map((h, index) => {
    const imageUrl = `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&w=400&h=250&fit=crop&crop=entropy&seed=${h._id}`;
    return `
      <div class="card">
        <img src="${imageUrl}" alt="${h.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
        <h3>${h.name}</h3>
        <p>${h.location}</p>
        <p><strong>Rating:</strong> ${h.rating?.toFixed?.(1) ?? h.rating ?? '-'} ★</p>
        <p><strong>Specialties:</strong> ${(h.specialties||[]).join(', ') || '-'}</p>
        <p><strong>Contact:</strong> ${h.contact || '-'}</p>
        <p>${h.yearsInService || 0} years in service – ${h.doctorsAvailable || 0} doctors available</p>
        <a class="btn" href="/hospital.html?id=${h._id}" style="margin-top: 12px;">View Details</a>
      </div>
    `;
  }).join('');
}

loadHospitals();

const socket = io();
socket.on('bed:updated', () => {/* optional visual cue */});
socket.on('doctor:updated', () => {/* optional visual cue */});

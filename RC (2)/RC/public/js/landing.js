function setupTabs(cardSelector){
  const card = document.querySelector(cardSelector);
  const tabs = card.querySelectorAll('.tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.target;
    card.querySelectorAll('#'+target+', [id$="-login"], [id$="-register"]').forEach(el=>{
      if (el.id === target) el.style.display='block'; else if (el.id.endsWith('login') || el.id.endsWith('register')) el.style.display='none';
    });
  }));
}

setupTabs('.card:nth-child(2)'); // staff
setupTabs('.card:nth-child(3)'); // ambulance

async function login(rolePrefix, redirect){
  const u = document.getElementById(rolePrefix+'-u');
  const p = document.getElementById(rolePrefix+'-p');
  const msg = document.getElementById(rolePrefix+'-login-msg');
  const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: u.value, password: p.value }) });
  if (res.ok) {
    const data = await res.json();
    const key = rolePrefix==='staff' ? 'rc_staff_token' : 'rc_amb_token';
    localStorage.setItem(key, data.token);
    location.href = redirect;
  } else {
    msg.textContent = 'Login failed';
  }
}

async function register(rolePrefix, role){
  const msg = document.getElementById(rolePrefix+'-register-msg');
  const name = document.getElementById(rolePrefix+'-name').value;
  const contact = document.getElementById(rolePrefix+'-contact').value;
  const username = document.getElementById(rolePrefix+'-ru').value;
  const password = document.getElementById(rolePrefix+'-rp').value;
  const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, contact, username, password, role }) });
  if (res.ok) {
    msg.textContent = 'Registered. You can now login.';
  } else {
    const t = await res.json().catch(()=>({error:'Failed'}));
    msg.textContent = t.error || 'Failed';
  }
}

document.getElementById('staff-login-btn').addEventListener('click', ()=>login('staff','/reception.html'));
document.getElementById('amb-login-btn').addEventListener('click', ()=>login('amb','/ambulance.html'));
document.getElementById('staff-register-btn').addEventListener('click', ()=>register('staff','staff'));
document.getElementById('amb-register-btn').addEventListener('click', ()=>register('amb','ambulance'));

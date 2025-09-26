const loginBox = document.getElementById('login-box');
const formBox = document.getElementById('form-box');
const loginBtn = document.getElementById('login-btn');
const u = document.getElementById('u');
const p = document.getElementById('p');
const loginMsg = document.getElementById('login-msg');
const form = document.getElementById('case-form');
const msg = document.getElementById('msg');

let token = localStorage.getItem('rc_amb_token') || '';

async function login() {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: u.value, password: p.value })
  });
  if (res.ok) {
    const data = await res.json();
    token = data.token;
    localStorage.setItem('rc_amb_token', token);
    loginBox.style.display = 'none';
    formBox.style.display = 'block';
  } else {
    loginMsg.textContent = 'Login failed';
  }
}
loginBtn.addEventListener('click', login);

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.age = Number(payload.age);
  const res = await fetch('/api/emergency/form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (res.ok) { form.reset(); msg.textContent = 'Submitted.'; } else { msg.textContent = 'Failed.'; }
});

if (token) { loginBox.style.display='none'; formBox.style.display='block'; }

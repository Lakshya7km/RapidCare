const http = require('http');

const BASE_URL = 'http://localhost:5000'; // Assuming it starts on 5000, if not I'll need to check output.
// Actually I'll make it configurable or just error out.

async function request(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const opts = {
            method: options.method || 'GET',
            headers: { 'Content-Type': 'application/json', ...options.headers }
        };
        const req = http.request(url, opts, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        if (options.body) req.write(JSON.stringify(options.body));
        req.end();
    });
}

async function run() {
    try {
        console.log('Testing Developer Flow...');

        // 1. Login
        console.log('1. Login as root...');
        const login = await request('/api/auth/login', {
            method: 'POST',
            body: { role: 'developer', username: 'root', password: 'root1234' }
        });
        console.log('Login Status:', login.status);
        const loginBody = JSON.parse(login.body);
        if (!loginBody.token) throw new Error('No token returned');
        const token = loginBody.token;
        console.log('Token received.');

        // 2. Get DB Info
        console.log('2. Fetching DB Info...');
        const dbInfo = await request('/api/dev/db-info', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('DB Info Status:', dbInfo.status);
        const info = JSON.parse(dbInfo.body);
        console.log('Collections:', info.collections.map(c => `${c.name}: ${c.count}`).join(', '));
        console.log('URI (Masked):', info.connection.uri);

        if (!info.connection.uri.includes('****')) throw new Error('URI not masked!');

        console.log('SUCCESS: Developer flow Verified.');
    } catch (e) {
        console.error('FAILED:', e.message);
    }
}

run();

import http from 'http';
import { spawn } from 'child_process';

console.log('====================================================');
console.log('🌐 RUNNING FULL END-TO-END LIVE ROUTE INTEGRATION SUITE');
console.log('====================================================\n');

const PORT = 3008;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ROUTES = [
    { path: '/', expectedStatus: [200, 307, 308], desc: 'Root Locale Redirect / Landing' },
    { path: '/vi', expectedStatus: [200], desc: 'Vietnamese Landing Page' },
    { path: '/en', expectedStatus: [200], desc: 'English Landing Page' },
    { path: '/vi/login', expectedStatus: [200], desc: 'Vietnamese Login Page' },
    { path: '/en/login', expectedStatus: [200], desc: 'English Login Page' },
    { path: '/vi/signup', expectedStatus: [200], desc: 'Vietnamese Signup Page' },
    { path: '/en/signup', expectedStatus: [200], desc: 'English Signup Page' },
    { path: '/vi/forgot-password', expectedStatus: [200], desc: 'Forgot Password Page' },
    { path: '/vi/reset-password', expectedStatus: [200], desc: 'Reset Password Page' },
    { path: '/vi/mh-wilds', expectedStatus: [200], desc: 'Monster Hunter Wilds Hub' },
    { path: '/en/mh-wilds', expectedStatus: [200], desc: 'Monster Hunter Wilds Hub (EN)' },
    { path: '/vi/planner/today', expectedStatus: [307], desc: 'Protected Planner Today (Guest Redirect)' },
    { path: '/vi/planner/week', expectedStatus: [307], desc: 'Protected Planner Week (Guest Redirect)' },
    { path: '/vi/planner/someday', expectedStatus: [307], desc: 'Protected Planner Someday (Guest Redirect)' },
    { path: '/vi/working', expectedStatus: [307], desc: 'Protected Working Kanban (Guest Redirect)' },
    { path: '/en/working', expectedStatus: [307], desc: 'Protected Working Kanban EN (Guest Redirect)' },
    { path: '/api/health', expectedStatus: [200], desc: 'Health Check API' }
];

async function checkServerReady(retries = 20, intervalMs = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            await new Promise((resolve, reject) => {
                const req = http.get(`${BASE_URL}/api/health`, (res) => {
                    resolve(res.statusCode);
                });
                req.on('error', reject);
                req.setTimeout(800, () => {
                    req.destroy();
                    reject(new Error('timeout'));
                });
            });
            return true;
        } catch {
            await new Promise(r => setTimeout(r, intervalMs));
        }
    }
    return false;
}

function fetchRoute(path) {
    return new Promise((resolve) => {
        const req = http.get(`${BASE_URL}${path}`, {
            headers: { 'User-Agent': 'IntegrationTestRunner/1.0' }
        }, (res) => {
            resolve({
                statusCode: res.statusCode,
                location: res.headers['location'] || null
            });
        });
        req.on('error', (err) => {
            resolve({ statusCode: 500, error: err.message });
        });
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ statusCode: 504, error: 'Timeout' });
        });
    });
}

async function run() {
    console.log(`⏳ Starting Next.js Production Server on port ${PORT}...`);
    const serverProcess = process.platform === 'win32'
        ? spawn('cmd.exe', ['/c', 'npx', 'next', 'start', '-p', String(PORT)], { stdio: 'ignore' })
        : spawn('npx', ['next', 'start', '-p', String(PORT)], { stdio: 'ignore' });

    const isReady = await checkServerReady(30, 1000);
    if (!isReady) {
        console.error('❌ Failed to start Next.js test server.');
        if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', String(serverProcess.pid), '/f', '/t']);
        } else {
            serverProcess.kill('SIGTERM');
        }
        process.exit(1);
    }
    console.log('✅ Next.js Production Server is READY!\n');

    let passed = 0;
    let failed = 0;

    for (const route of ROUTES) {
        const result = await fetchRoute(route.path);
        const isExpected = route.expectedStatus.includes(result.statusCode);

        if (isExpected) {
            console.log(`✅ [PASS] ${route.path.padEnd(24)} ➔ HTTP ${result.statusCode} | ${route.desc}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${route.path.padEnd(24)} ➔ Expected [${route.expectedStatus}], got HTTP ${result.statusCode} | ${route.desc}`);
            failed++;
        }
    }

    console.log('\n====================================================');
    console.log(`📊 LIVE INTEGRATION RESULT: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================\n');

    if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(serverProcess.pid), '/f', '/t']);
    } else {
        serverProcess.kill('SIGTERM');
    }

    if (failed > 0) {
        process.exit(1);
    }
}

run().catch((err) => {
    console.error('Test execution error:', err);
    process.exit(1);
});

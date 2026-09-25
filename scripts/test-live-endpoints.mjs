import http from 'http';
import { spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('====================================================');
console.log('🌐 RUNNING FULL END-TO-END LIVE ROUTE INTEGRATION SUITE');
console.log('====================================================\n');

const PORT = 3008;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ROUTES = [
    { path: '/', expectedStatus: [200], desc: 'English landing page' },
    { path: '/login', expectedStatus: [200], desc: 'Login page' },
    { path: '/signup', expectedStatus: [200], desc: 'Signup page' },
    { path: '/forgot-password', expectedStatus: [200], desc: 'Forgot password page' },
    { path: '/reset-password', expectedStatus: [200], desc: 'Reset password page' },
    { path: '/mh-wilds', expectedStatus: [200], desc: 'Monster Hunter Wilds hub' },
    { path: '/live-widget', expectedStatus: [200], desc: 'Live widget' },
    { path: '/planner', expectedStatus: [307], desc: 'Protected planner', location: '/login?next=%2Fplanner' },
    { path: '/planner/today', expectedStatus: [307], desc: 'Protected planner today', location: '/login?next=%2Fplanner%2Ftoday' },
    { path: '/working', expectedStatus: [307], desc: 'Protected working', location: '/login?next=%2Fworking' },
    { path: '/working/project-123', expectedStatus: [307], desc: 'Protected project', location: '/login?next=%2Fworking%2Fproject-123' },
    { path: '/media/youtube', expectedStatus: [307], desc: 'Protected YouTube', location: '/login?next=%2Fmedia%2Fyoutube' },
    { path: '/media/youtube/playlist/playlist-123', expectedStatus: [307], desc: 'Protected YouTube playlist' },
    { path: '/media/music', expectedStatus: [307], desc: 'Protected music' },
    { path: '/media/music/playlist/playlist-123', expectedStatus: [307], desc: 'Protected music playlist' },
    { path: '/media/gaming', expectedStatus: [307], desc: 'Protected gaming' },
    { path: '/media/news', expectedStatus: [307], desc: 'Protected news' },
    { path: '/media/news/technology', expectedStatus: [307], desc: 'Protected news category' },
    { path: '/vi/media/youtube', expectedStatus: [307], desc: 'Old Vietnamese route', location: '/media/youtube' },
    { path: '/en/media/youtube', expectedStatus: [307], desc: 'Old English route', location: '/media/youtube' },
    { path: '/vi', expectedStatus: [307], desc: 'Old Vietnamese home', location: '/' },
    { path: '/en', expectedStatus: [307], desc: 'Old English home', location: '/' },
    { path: '/data/mhwilds/monsters.json', expectedStatus: [200], desc: 'Monster Hunter Wilds Dataset (24h Edge Cache)', checkCache: (h) => h && h.includes('max-age=86400') },
    { path: '/api/health', expectedStatus: [200], desc: 'Health check', checkCache: (h) => h && (h.includes('no-store') || h.includes('no-cache')) },
    { path: '/api/media/now-playing', expectedStatus: [200], desc: 'Private telemetry', checkCache: (h) => h && h.includes('private') && h.includes('no-store') },
    { path: '/api/media/sync-game-mood', expectedStatus: [405], desc: 'POST-only game mood API' },
    { path: '/api/auth/steam', expectedStatus: [401], desc: 'Steam auth requires a user' },
    { path: '/missing-route', expectedStatus: [404], desc: 'Unknown route' }
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
                location: res.headers['location'] || null,
                cacheControl: res.headers['cache-control'] || null
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
    const serverProcess = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '-p', String(PORT)], { stdio: 'ignore' });

    const isReady = await checkServerReady(30, 1000);
    if (!isReady) {
        console.error('❌ Failed to start Next.js test server.');
        serverProcess.kill();
        process.exit(1);
    }
    console.log('✅ Next.js Production Server is READY!\n');

    let passed = 0;
    let failed = 0;

    for (const route of ROUTES) {
        const result = await fetchRoute(route.path);
        const cacheOk = route.checkCache ? route.checkCache(result.cacheControl) : true;
        const locationOk = !route.location || new URL(result.location, BASE_URL).pathname + new URL(result.location, BASE_URL).search === route.location;
        const isExpected = route.expectedStatus.includes(result.statusCode) && cacheOk && locationOk;

        if (isExpected) {
            const cacheSuffix = route.checkCache ? ` [Cache: ${result.cacheControl}]` : '';
            console.log(`✅ [PASS] ${route.path.padEnd(28)} ➔ HTTP ${result.statusCode} | ${route.desc}${cacheSuffix}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${route.path.padEnd(28)} ➔ Expected [${route.expectedStatus}], got HTTP ${result.statusCode} (Location: ${result.location}, Cache: ${result.cacheControl}) | ${route.desc}`);
            failed++;
        }
    }

    console.log('\n====================================================');
    console.log(`📊 LIVE INTEGRATION RESULT: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================\n');

    serverProcess.kill();

    if (failed > 0) {
        process.exit(1);
    }
}

run().catch((err) => {
    console.error('Test execution error:', err);
    process.exit(1);
});

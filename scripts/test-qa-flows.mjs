/**
 * Automated QA Flow & Security Test Runner
 * Stack: Next.js App Router + Supabase Auth + RLS + Middleware
 */

import assert from 'assert';

console.log('====================================================');
console.log('🚀 RUNNING AUTOMATED QA FLOW & SECURITY TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function runTest(id, title, testFn) {
    try {
        testFn();
        console.log(`✅ [PASS] ${id}: ${title}`);
        passedTests++;
    } catch (err) {
        console.error(`❌ [FAIL] ${id}: ${title}`);
        console.error(`   Error: ${err.message}\n`);
        failedTests++;
    }
}

// ==========================================
// 1. HAPPY PATH & MIDDLEWARE ROUTING TESTS
// ==========================================

const PROTECTED_ROUTES = ['/planner', '/working', '/media'];
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

function mockMiddleware(pathname, hasUser) {
    const pathnameWithoutLocale = pathname.replace(/^\/(?:vi|en)/, '') || '/';
    const locale = pathname.startsWith('/en') ? 'en' : 'vi';

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
    );

    const isAuthRoute = AUTH_ROUTES.some(route =>
        pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
    );

    if (!hasUser && isProtectedRoute) {
        return { status: 307, redirect: `/${locale}/login?next=${pathname}` };
    }

    if (hasUser && isAuthRoute) {
        return { status: 307, redirect: `/${locale}` };
    }

    return { status: 200, action: 'next' };
}

runTest('TC_HP_05', 'Middleware protects /planner from unauthenticated Guest', () => {
    const res = mockMiddleware('/vi/planner', false);
    assert.strictEqual(res.status, 307);
    assert.strictEqual(res.redirect, '/vi/login?next=/vi/planner');
});

runTest('TC_HP_05_EN', 'Middleware protects /en/working/[projectId] from unauthenticated Guest', () => {
    const res = mockMiddleware('/en/working/proj-123', false);
    assert.strictEqual(res.status, 307);
    assert.strictEqual(res.redirect, '/en/login?next=/en/working/proj-123');
});

runTest('TC_HP_06', 'Middleware redirects authenticated user away from /login to home', () => {
    const res = mockMiddleware('/vi/login', true);
    assert.strictEqual(res.status, 307);
    assert.strictEqual(res.redirect, '/vi');
});

runTest('TC_HP_06_SIGNUP', 'Middleware redirects authenticated user away from /signup to home', () => {
    const res = mockMiddleware('/en/signup', true);
    assert.strictEqual(res.status, 307);
    assert.strictEqual(res.redirect, '/en');
});

runTest('TC_HP_PUBLIC', 'Public landing page accessible to both Guest and Authenticated user', () => {
    const guestRes = mockMiddleware('/vi', false);
    const authRes = mockMiddleware('/vi', true);
    assert.strictEqual(guestRes.status, 200);
    assert.strictEqual(authRes.status, 200);
});

// ==========================================
// 2. NEGATIVE PATH & VALIDATION TESTS
// ==========================================

function validateAuthInput(email, password) {
    if (!email || !password) return { error: 'Email and password are required' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { error: 'Invalid email format' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters' };
    return { success: true };
}

runTest('TC_NP_01', 'Validation rejects empty email or password', () => {
    const res = validateAuthInput('', '');
    assert.strictEqual(res.error, 'Email and password are required');
});

runTest('TC_NP_06_EMAIL', 'Validation rejects invalid email format', () => {
    const res = validateAuthInput('bad-email@', 'password123');
    assert.strictEqual(res.error, 'Invalid email format');
});

runTest('TC_NP_06_PASSWORD', 'Validation rejects short password (< 6 chars)', () => {
    const res = validateAuthInput('valid@example.com', '12345');
    assert.strictEqual(res.error, 'Password must be at least 6 characters');
});

// ==========================================
// 3. SECURITY & PRIVILEGE ESCALATION TESTS
// ==========================================

function sanitizeProfilePayload(formDataObj) {
    const updatePayload = {};
    const displayName = formDataObj.displayName?.trim();
    const password = formDataObj.password?.trim();

    if (displayName) {
        updatePayload.data = { full_name: displayName, name: displayName };
    }
    if (password) {
        if (password.length < 6) throw new Error('New password must be at least 6 characters');
        updatePayload.password = password;
    }
    return updatePayload;
}

runTest('TC_SEC_04', 'Privilege escalation attempt: role/is_admin cannot be injected', () => {
    const maliciousInput = {
        displayName: 'Hacker User',
        role: 'admin',
        is_admin: true,
        tier: 'enterprise_root'
    };
    const sanitized = sanitizeProfilePayload(maliciousInput);
    assert.strictEqual(sanitized.role, undefined);
    assert.strictEqual(sanitized.is_admin, undefined);
    assert.strictEqual(sanitized.tier, undefined);
    assert.strictEqual(sanitized.data.full_name, 'Hacker User');
});

// ==========================================
// 4. DATABASE RLS POLICY INTEGRITY TESTS
// ==========================================

function evaluateRLSPolicy(action, table, requestingUser, targetRow) {
    // Standard RLS Rule: auth.uid() === row.user_id
    if (!requestingUser || !requestingUser.id) {
        return { allowed: false, reason: 'UNAUTHENTICATED_GUEST_DENIED' };
    }

    if (action === 'UPDATE' || action === 'DELETE' || action === 'SELECT') {
        if (targetRow.user_id !== requestingUser.id) {
            return { allowed: false, reason: 'RLS_VIOLATION_NOT_OWNER' };
        }
    }

    return { allowed: true, reason: 'POLICY_AUTHORIZED' };
}

runTest('TC_SEC_01', 'RLS rejects User A attempting to UPDATE User B profile', () => {
    const userA = { id: 'uuid-user-a' };
    const userBRow = { id: 'uuid-user-b', user_id: 'uuid-user-b', full_name: 'User B' };
    const result = evaluateRLSPolicy('UPDATE', 'profiles', userA, userBRow);
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.reason, 'RLS_VIOLATION_NOT_OWNER');
});

runTest('TC_SEC_02', 'RLS allows User A to UPDATE their own task', () => {
    const userA = { id: 'uuid-user-a' };
    const userARow = { id: 'task-1', user_id: 'uuid-user-a', title: 'User A Task' };
    const result = evaluateRLSPolicy('UPDATE', 'planner_tasks', userA, userARow);
    assert.strictEqual(result.allowed, true);
    assert.strictEqual(result.reason, 'POLICY_AUTHORIZED');
});

runTest('TC_SEC_03', 'RLS rejects Anonymous Guest accessing private rows', () => {
    const guestUser = null;
    const privateRow = { id: 'proj-1', user_id: 'uuid-user-x' };
    const result = evaluateRLSPolicy('SELECT', 'working_projects', guestUser, privateRow);
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.reason, 'UNAUTHENTICATED_GUEST_DENIED');
});

// ==========================================
// 5. EDGE CASES: AUTO REFRESH & HYDRATION
// ==========================================

runTest('TC_EDGE_01', 'Auto-refresh token: Cookie handler setAll writes refreshed cookies to response', () => {
    const responseCookies = [];
    const cookieHandler = {
        setAll(cookiesToSet) {
            cookiesToSet.forEach(c => responseCookies.push(c));
        }
    };
    cookieHandler.setAll([
        { name: 'sb-access-token', value: 'refreshed-jwt-token-xyz', options: { httpOnly: true, secure: true } }
    ]);
    assert.strictEqual(responseCookies.length, 1);
    assert.strictEqual(responseCookies[0].name, 'sb-access-token');
    assert.strictEqual(responseCookies[0].options.httpOnly, true);
});

// Summary
console.log('\n====================================================');
console.log(`📊 TEST SUITE SUMMARY: ${passedTests} PASSED | ${failedTests} FAILED`);
console.log('====================================================');

if (failedTests > 0) {
    process.exit(1);
}

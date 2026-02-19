/**
 * admin.js - Admin Authentication Module
 * Handles admin-only login with client-side hashing, validation, and brute-force protection
 * Only 'admin' username is allowed to access the admin panel
 */

// Helper: SHA-256 hash for passwords using Web Crypto API
async function hashString(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initialize default admin account on first load if it doesn't exist
async function ensureAdmin() {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.find(u => u.username === 'admin')) {
            const adminHash = await hashString('password');
            users.push({ username: 'admin', passwordHash: adminHash });
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Default admin account created (username: admin, password: password)');
        }
    } catch (err) {
        console.error('Error ensuring admin account:', err);
    }
}

ensureAdmin();

/**
 * Check if an admin account is locked due to too many failed login attempts
 * Lockout duration: 30 seconds after 5 failed attempts
 */
function isLockedOut(username) {
    const lock = sessionStorage.getItem('lockout_' + username);
    if (!lock) return false;
    return Date.now() < Number(lock);
}

/**
 * Record a failed admin login attempt and trigger lockout after 5 attempts
 */
function recordFailedAttempt(username) {
    const key = 'failed_' + username;
    const attempts = Number(sessionStorage.getItem(key) || 0) + 1;
    sessionStorage.setItem(key, attempts);
    if (attempts >= 5) {
        // Lock for 30 seconds
        sessionStorage.setItem('lockout_' + username, Date.now() + 30000);
        sessionStorage.removeItem(key);
    }
}

/**
 * Clear failed login attempts and lockout for an admin account
 */
function clearFailedAttempts(username) {
    sessionStorage.removeItem('failed_' + username);
    sessionStorage.removeItem('lockout_' + username);
}

// ===== ADMIN LOGIN HANDLER =====
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Input validation
    if (!username || !password) {
        errorMessage.textContent = 'Username and password are required.';
        errorMessage.setAttribute('role', 'alert');
        return;
    }

    // Admin-only access check
    if (username !== 'admin') {
        errorMessage.textContent = 'Only administrators can access this page. Contact your system administrator if you need access.';
        errorMessage.setAttribute('role', 'alert');
        console.warn(`Non-admin login attempt with username: ${username}`);
        return;
    }

    // Check lockout status
    if (isLockedOut(username)) {
        errorMessage.textContent = 'Too many failed login attempts. Please try again in 30 seconds.';
        errorMessage.setAttribute('role', 'alert');
        return;
    }

    try {
        const passwordHash = await hashString(password);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admin = users.find(u => u.username === 'admin' && u.passwordHash === passwordHash);
        
        if (admin) {
            clearFailedAttempts(username);
            alert('Admin login successful! Redirecting to admin dashboard...');
            // TODO: Redirect to admin dashboard
            // window.location.href = '/admin-dashboard.html';
        } else {
            recordFailedAttempt(username);
            const attemptsLeft = 5 - (Number(sessionStorage.getItem('failed_' + username) || 0));
            if (attemptsLeft > 0) {
                errorMessage.textContent = `Invalid admin credentials. ${attemptsLeft} attempt(s) remaining.`;
            } else {
                errorMessage.textContent = 'Admin account locked due to too many failed attempts. Try again in 30 seconds.';
            }
            errorMessage.setAttribute('role', 'alert');
            console.warn('Failed admin login attempt');
        }
    } catch (err) {
        console.error('Admin login error:', err);
        errorMessage.textContent = 'An error occurred during admin login. Please try again.';
        errorMessage.setAttribute('role', 'alert');
    }
});
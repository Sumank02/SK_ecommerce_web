// Helper: SHA-256 hash for passwords
async function hashString(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Ensure default admin exists
async function ensureAdmin() {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.find(u => u.username === 'admin')) {
            const adminHash = await hashString('password');
            users.push({ username: 'admin', passwordHash: adminHash });
            localStorage.setItem('users', JSON.stringify(users));
        }
    } catch (err) {
        console.error('Error ensuring admin:', err);
    }
}

ensureAdmin();

// Lockout helpers using sessionStorage
function isLockedOut(username) {
    const lock = sessionStorage.getItem('lockout_' + username);
    if (!lock) return false;
    return Date.now() < Number(lock);
}

function recordFailedAttempt(username) {
    const key = 'failed_' + username;
    const attempts = Number(sessionStorage.getItem(key) || 0) + 1;
    sessionStorage.setItem(key, attempts);
    if (attempts >= 5) {
        // lock for 30 seconds
        sessionStorage.setItem('lockout_' + username, Date.now() + 30000);
        sessionStorage.removeItem(key);
    }
}

function clearFailedAttempts(username) {
    sessionStorage.removeItem('failed_' + username);
    sessionStorage.removeItem('lockout_' + username);
}

// Admin Login Handler
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password.';
        return;
    }

    if (username !== 'admin') {
        errorMessage.textContent = 'Only admin can access this page.';
        return;
    }

    if (isLockedOut(username)) {
        errorMessage.textContent = 'Too many failed attempts. Try again later.';
        return;
    }

    try {
        const passwordHash = await hashString(password);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admin = users.find(u => u.username === 'admin' && u.passwordHash === passwordHash);
        if (admin) {
            clearFailedAttempts(username);
            alert('Admin login successful!');
            // TODO: redirect to admin dashboard
        } else {
            recordFailedAttempt(username);
            errorMessage.textContent = 'Invalid username or password.';
        }
    } catch (err) {
        console.error('Admin login error:', err);
        errorMessage.textContent = 'An error occurred during login. Please try again.';
    }
});
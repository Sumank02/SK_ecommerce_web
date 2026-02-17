/**
 * login.js - User Authentication Module
 * Handles login and signup with client-side hashing, validation, and brute-force protection
 */

// Helper: SHA-256 hash for passwords using Web Crypto API
async function hashString(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initialize default user account on first load if none exist
async function ensureDefaultUsers() {
    try {
        const existing = localStorage.getItem('users');
        if (!existing) {
            const adminHash = await hashString('password');
            const userHash = await hashString('password');
            const users = [
                { username: 'admin', passwordHash: adminHash },
                { username: 'user', passwordHash: userHash }
            ];
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Default users created (admin/user, password: password)');
        }
    } catch (err) {
        console.error('Error ensuring default users:', err);
    }
}

ensureDefaultUsers();

/**
 * Check if a user account is locked due to too many failed login attempts
 * Lockout duration: 30 seconds after 5 failed attempts
 */
function isLockedOut(username) {
    const lock = sessionStorage.getItem('lockout_' + username);
    if (!lock) return false;
    return Date.now() < Number(lock);
}

/**
 * Record a failed login attempt and trigger lockout after 5 attempts
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
 * Clear failed login attempts and lockout for a user
 */
function clearFailedAttempts(username) {
    sessionStorage.removeItem('failed_' + username);
    sessionStorage.removeItem('lockout_' + username);
}

// ===== LOGIN FORM HANDLER =====
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('loginErrorMessage');

    // Input validation
    if (!username || !password) {
        errorMessage.textContent = 'Username and password are required.';
        errorMessage.setAttribute('role', 'alert');
        return;
    }

    // Check lockout status
    if (isLockedOut(username)) {
        errorMessage.textContent = 'Too many failed attempts. Please try again in 30 seconds.';
        errorMessage.setAttribute('role', 'alert');
        return;
    }

    try {
        const passwordHash = await hashString(password);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.passwordHash === passwordHash);
        
        if (user) {
            clearFailedAttempts(username);
            alert('Login successful! Redirecting...');
            // TODO: Redirect to user dashboard or home
            // window.location.href = '/dashboard.html';
        } else {
            recordFailedAttempt(username);
            const attemptsLeft = 5 - (Number(sessionStorage.getItem('failed_' + username) || 0));
            if (attemptsLeft > 0) {
                errorMessage.textContent = `Invalid credentials. ${attemptsLeft} attempt(s) remaining.`;
            } else {
                errorMessage.textContent = 'Account locked due to too many failed attempts. Try again in 30 seconds.';
            }
            errorMessage.setAttribute('role', 'alert');
        }
    } catch (err) {
        console.error('Login error:', err);
        errorMessage.textContent = 'An error occurred during login. Please try again.';
        errorMessage.setAttribute('role', 'alert');
    }
});

// ===== SIGNUP FORM HANDLER =====
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errorMessage = document.getElementById('signupErrorMessage');

    // Input validation
    if (!username || !password) {
        errorMessage.textContent = 'Username and password cannot be empty.';
        errorMessage.setAttribute('role', 'alert');
        return;
    }

    if (username.length < 3) {
        errorMessage.textContent = 'Username must be at least 3 characters long.';
        errorMessage.setAttribute('role', 'alert');
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long.';
        errorMessage.setAttribute('role', 'alert');
        return;
    }

    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
            errorMessage.textContent = `Username "${username}" is already taken. Please choose a different one.`;
            errorMessage.setAttribute('role', 'alert');
            return;
        }

        const passwordHash = await hashString(password);
        users.push({ username, passwordHash });
        localStorage.setItem('users', JSON.stringify(users));

        // Success
        alert('Account created successfully! Please log in with your new credentials.');
        document.getElementById('signupUsername').value = '';
        document.getElementById('signupPassword').value = '';
        errorMessage.textContent = '';
        showLoginForm();
    } catch (err) {
        console.error('Signup error:', err);
        errorMessage.textContent = 'An error occurred during signup. Please try again.';
        errorMessage.setAttribute('role', 'alert');
    }
});

/**
 * Display the login form and hide the signup form
 */
function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('signupFormContainer').style.display = 'none';
    document.getElementById('loginErrorMessage').textContent = '';
    document.getElementById('loginUsername').focus();
}

/**
 * Display the signup form and hide the login form
 */
function showSignupForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';
    document.getElementById('signupErrorMessage').textContent = '';
    document.getElementById('signupUsername').focus();
}

// ===== FORM TOGGLE EVENT LISTENERS =====
document.getElementById('showSignup').addEventListener('click', function(event) {
    event.preventDefault();
    showSignupForm();
});

document.getElementById('showLogin').addEventListener('click', function(event) {
    event.preventDefault();
    showLoginForm();
});
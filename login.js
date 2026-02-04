// Helper: SHA-256 hash for passwords
async function hashString(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Ensure default users exist (admin and demo user)
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
        }
    } catch (err) {
        console.error('Error ensuring default users:', err);
    }
}

ensureDefaultUsers();

// Simple lockout helper using sessionStorage
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

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('loginErrorMessage');

    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password.';
        return;
    }

    if (isLockedOut(username)) {
        errorMessage.textContent = 'Too many failed attempts. Try again later.';
        return;
    }

    try {
        const passwordHash = await hashString(password);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.passwordHash === passwordHash);
        if (user) {
            clearFailedAttempts(username);
            alert('Login successful!');
            // TODO: redirect to dashboard
        } else {
            recordFailedAttempt(username);
            errorMessage.textContent = 'Invalid username or password.';
        }
    } catch (err) {
        console.error('Login error:', err);
        errorMessage.textContent = 'An error occurred during login. Please try again.';
    }
});

// Signup Form Handler
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errorMessage = document.getElementById('signupErrorMessage');

    if (!username || !password) {
        errorMessage.textContent = 'Username and password cannot be empty.';
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long.';
        return;
    }

    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
            errorMessage.textContent = 'Username already exists.';
            return;
        }

        const passwordHash = await hashString(password);
        users.push({ username, passwordHash });
        localStorage.setItem('users', JSON.stringify(users));

        // Success
        alert('Account created successfully! Please log in.');
        document.getElementById('signupUsername').value = '';
        document.getElementById('signupPassword').value = '';
        errorMessage.textContent = '';
        showLoginForm();
    } catch (err) {
        console.error('Signup error:', err);
        errorMessage.textContent = 'An error occurred during signup. Please try again.';
    }
});

// Show Login Form
function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('signupFormContainer').style.display = 'none';
    document.getElementById('loginErrorMessage').textContent = '';
}

// Show Signup Form
function showSignupForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';
    document.getElementById('signupErrorMessage').textContent = '';
}

// Toggle Form Links
document.getElementById('showSignup').addEventListener('click', function(event) {
    event.preventDefault();
    showSignupForm();
});

document.getElementById('showLogin').addEventListener('click', function(event) {
    event.preventDefault();
    showLoginForm();
});
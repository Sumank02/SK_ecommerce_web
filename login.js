// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('loginErrorMessage');

    // Simple validation (replace with actual authentication logic)
    if (username === 'user' && password === 'password') {
        alert('Login successful!');
        // Redirect to user dashboard or perform other actions
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
});

// Signup Form Handler
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const errorMessage = document.getElementById('signupErrorMessage');

    // Basic validation
    if (username.trim() === '' || password.trim() === '') {
        errorMessage.textContent = 'Username and password cannot be empty';
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long';
        return;
    }

    // Simulate signup (replace with actual backend logic)
    alert('Account created successfully! Please log in.');
    
    // Clear signup form fields
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupPassword').value = '';
    errorMessage.textContent = '';
    
    // Switch back to login form
    showLoginForm();
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
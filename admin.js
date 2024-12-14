document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Simple validation (replace with actual authentication logic)
    if (username === 'admin' && password === 'password') {
        alert('Login successful!');
        // Redirect to admin dashboard or perform other actions
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
});
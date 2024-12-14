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
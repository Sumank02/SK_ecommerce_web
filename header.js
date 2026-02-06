// Helper: Sanitize user input to prevent XSS
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Helper: Validate search query
function isValidSearchQuery(query) {
    if (typeof query !== 'string') return false;
    if (query.trim().length === 0) return false;
    if (query.length > 100) return false; // limit search length
    // Allow only alphanumeric, spaces, hyphens
    const validPattern = /^[a-zA-Z0-9\s\-]*$/;
    return validPattern.test(query);
}

// Search functionality
const searchInput = document.getElementById('input');
if (searchInput) {
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const query = this.value.trim();
            
            if (!isValidSearchQuery(query)) {
                alert('Search query contains invalid characters. Use only letters, numbers, spaces, and hyphens.');
                return;
            }

            const sanitized = sanitizeInput(query);
            console.log('Searching for:', sanitized);
            
            // TODO: Implement actual search functionality
            // Example: redirect to search results page
            // window.location.href = `/search.html?q=${encodeURIComponent(sanitized)}`;
        }
    });

    // Add placeholder validation on blur
    searchInput.addEventListener('blur', function() {
        const query = this.value.trim();
        if (query.length > 0 && !isValidSearchQuery(query)) {
            this.style.borderColor = '#ff6b6b';
            this.setAttribute('title', 'Invalid search query');
        } else {
            this.style.borderColor = '';
            this.setAttribute('title', '');
        }
    });

    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '';
    });
}

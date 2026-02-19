/**
 * Search Input Validation and XSS Prevention Module
 * 
 * This module manages the header search functionality with input validation
 * and sanitization to prevent XSS attacks. It validates user search queries
 * and provides visual feedback for invalid input.
 * 
 * Dependencies: None (vanilla JavaScript)
 * Storage: None
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * 
 * Uses textContent to safely escape HTML entities and convert the string
 * to safe innerHTML. This prevents script injection attacks.
 * 
 * @param {string} str - The input string to sanitize
 * @returns {string} The sanitized string with HTML entities escaped, or empty string if not a string
 * 
 * @example
 * sanitizeInput('<img src=x onerror=alert("xss")>') 
 * // Returns: '&lt;img src=x onerror=alert(&quot;xss&quot;)&gt;'
 */
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Validates search query format and constraints
 * 
 * Checks that the search query:
 * - Is a non-empty string
 * - Does not exceed 100 characters
 * - Contains only alphanumeric characters, spaces, and hyphens
 * 
 * @param {string} query - The search query to validate
 * @returns {boolean} True if query is valid, false otherwise
 * 
 * @example
 * isValidSearchQuery('leather belt') // Returns: true
 * isValidSearchQuery('belt<script>') // Returns: false
 */
function isValidSearchQuery(query) {
    if (typeof query !== 'string') return false;
    if (query.trim().length === 0) return false;
    if (query.length > 100) return false; // Limit search length to prevent resource exhaustion
    // Allow only alphanumeric, spaces, hyphens (prevents injection attacks)
    const validPattern = /^[a-zA-Z0-9\s\-]*$/;
    return validPattern.test(query);
}

// ===== SEARCH INPUT HANDLER =====

const searchInput = document.getElementById('input');
if (searchInput) {
    /**
     * Handles search submission when user presses Enter
     * 
     * Validates the search query, sanitizes it, and logs the request.
     * Currently logs to console; can be extended to perform actual search
     * or redirect to a search results page.
     */
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const query = this.value.trim();
            
            // Validate search query format
            if (!isValidSearchQuery(query)) {
                alert('Search query contains invalid characters. Use only letters, numbers, spaces, and hyphens.');
                return;
            }

            // Sanitize and log the query
            const sanitized = sanitizeInput(query);
            console.log('Searching for:', sanitized);
            
            // TODO: Implement actual search functionality
            // Example: redirect to search results page
            // window.location.href = `/search.html?q=${encodeURIComponent(sanitized)}`;
        }
    });

    /**
     * Provides visual feedback on blur if search input is invalid
     * 
     * Highlights the input field with a red border if it contains invalid characters,
     * and adds a title attribute for accessibility. Clears the styling for valid input.
     */
    searchInput.addEventListener('blur', function() {
        const query = this.value.trim();
        if (query.length > 0 && !isValidSearchQuery(query)) {
            // Red border indicates invalid input
            this.style.borderColor = '#ff6b6b';
            // Accessibility: provide title for screen readers and tooltips
            this.setAttribute('title', 'Invalid search query');
        } else {
            // Clear styling for valid or empty input
            this.style.borderColor = '';
            this.setAttribute('title', '');
        }
    });

    /**
     * Clears error styling when user focuses on the input field
     * 
     * Removes the red border when the user clicks into the field,
     * allowing them to correct invalid input without visual distraction.
     */
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '';
    });
}

/**
 * Diabetes Prediction Application - Frontend JavaScript
 *
 * This file handles all client-side interactions for the diabetes prediction
 * application, including form submission, API communication, and UI updates.
 *
 * Educational Overview:
 * --------------------
 * This code demonstrates several important frontend development concepts:
 * 1. Event-driven programming: Responding to user interactions
 * 2. Asynchronous JavaScript: Using async/await for API calls
 * 3. DOM manipulation: Updating the page without full reloads
 * 4. Error handling: Gracefully managing network and API errors
 * 5. User experience: Providing feedback during long operations
 *
 * Architecture:
 * ------------
 * - User fills form → JavaScript collects data
 * - JavaScript sends data to Flask backend via fetch API
 * - Backend processes and returns prediction
 * - JavaScript updates UI to show results
 *
 * Author: [Your Name / Team Name]
 * Last Updated: 2025-01-21
 */

// ============================================================================
// DOM Element References
// ============================================================================

/**
 * Cache references to frequently accessed DOM elements.
 *
 * Educational Note:
 * ----------------
 * Caching DOM element references improves performance because:
 * 1. Querying the DOM is relatively slow
 * 2. We avoid repeated lookups for the same elements
 * 3. It makes the code more maintainable with clear element names
 *
 * We wrap this in a DOMContentLoaded event to ensure elements exist
 * before we try to reference them.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application once the DOM is fully loaded
    initializeApp();
});

/**
 * Application state object
 *
 * Educational Note:
 * ----------------
 * Centralizing application state makes it easier to:
 * 1. Track what's happening in the application
 * 2. Debug issues by inspecting a single object
 * 3. Prevent conflicting operations (e.g., multiple simultaneous submissions)
 */
const appState = {
    isSubmitting: false,
    lastPrediction: null
};

// ============================================================================
// Application Initialization
// ============================================================================

/**
 * Initializes the application by setting up event listeners and initial state.
 *
 * This function is called once when the page loads and sets up all the
 * interactive functionality of the application.
 *
 * Educational Note:
 * ----------------
 * Separating initialization into its own function:
 * 1. Makes the code more organized and maintainable
 * 2. Makes it easy to re-initialize if needed
 * 3. Provides a clear entry point for understanding the application flow
 */
function initializeApp() {
    console.log('Initializing Diabetes Prediction Application...');

    // Get reference to the prediction form
    const predictionForm = document.getElementById('predictionForm');

    if (!predictionForm) {
        console.error('Prediction form not found! Check that index.html has an element with id="predictionForm"');
        return;
    }

    // Attach form submission handler
    predictionForm.addEventListener('submit', handleFormSubmit);

    // Optional: Add real-time validation
    // Uncomment the next line to enable input validation as users type
    // setupInputValidation();

    console.log('Application initialized successfully!');
}

// ============================================================================
// Form Handling
// ============================================================================

/**
 * Handles the form submission event.
 *
 * This is the main entry point for the prediction workflow. When users click
 * "Get Prediction", this function:
 * 1. Prevents the default form submission (which would reload the page)
 * 2. Collects the form data
 * 3. Sends it to the backend
 * 4. Displays the results
 *
 * @param {Event} event - The form submission event
 *
 * Educational Note:
 * ----------------
 * We use async/await syntax for handling asynchronous operations.
 * This makes the code read sequentially (top to bottom) even though
 * operations like fetch() happen asynchronously in the background.
 */
async function handleFormSubmit(event) {
    // Prevent the default form submission behavior
    // Without this, the browser would reload the page
    event.preventDefault();

    // Prevent duplicate submissions while one is in progress
    if (appState.isSubmitting) {
        console.log('Submission already in progress, ignoring duplicate request');
        return;
    }

    try {
        // Mark that we're processing a submission
        appState.isSubmitting = true;

        // Hide any previous results or errors
        hideResults();
        hideError();

        // Collect form data from all input fields
        const formData = collectFormData();

        // Optional: Validate data on the client side
        // Client-side validation provides immediate feedback to users
        const validationError = validateFormData(formData);
        if (validationError) {
            showError(validationError);
            return;
        }

        // Show loading state on the submit button
        setLoadingState(true);

        // Send prediction request to the backend
        const result = await sendPredictionRequest(formData);

        // Display the prediction result
        displayPrediction(result);

        // Store the last prediction in application state
        appState.lastPrediction = result;

    } catch (error) {
        // Handle any errors that occurred during the process
        console.error('Error during prediction:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');

    } finally {
        // Always restore the button state, even if an error occurred
        // The 'finally' block runs whether the try succeeds or fails
        setLoadingState(false);
        appState.isSubmitting = false;
    }
}

/**
 * Collects data from all form input fields.
 *
 * This function reads the values from each input field and constructs
 * an object that matches the format expected by our backend API.
 *
 * @returns {Object} Object containing all form field values
 *
 * Educational Note:
 * ----------------
 * We explicitly list each field rather than using a loop because:
 * 1. It's clear what data we're collecting
 * 2. We can easily add validation or transformation per field
 * 3. It matches the exact API contract with our backend
 */
function collectFormData() {
    return {
        age: parseFloat(document.getElementById('age').value),
        sex: parseFloat(document.getElementById('sex').value),
        bmi: parseFloat(document.getElementById('bmi').value),
        bp: parseFloat(document.getElementById('bp').value),
        s1: parseFloat(document.getElementById('s1').value),
        s2: parseFloat(document.getElementById('s2').value),
        s3: parseFloat(document.getElementById('s3').value),
        s4: parseFloat(document.getElementById('s4').value),
        s5: parseFloat(document.getElementById('s5').value),
        s6: parseFloat(document.getElementById('s6').value)
    };
}

/**
 * Validates form data before sending to the backend.
 *
 * Client-side validation provides immediate feedback and reduces unnecessary
 * API calls for invalid data. However, we still validate on the backend
 * because client-side validation can be bypassed.
 *
 * @param {Object} formData - The form data to validate
 * @returns {string|null} Error message if validation fails, null if valid
 *
 * Educational Note:
 * ----------------
 * This demonstrates the principle of "defense in depth":
 * - Client-side validation: Fast feedback for users
 * - Backend validation: Security and data integrity
 * Both layers work together to ensure data quality
 */
function validateFormData(formData) {
    // Check if all values are valid numbers
    for (const [key, value] of Object.entries(formData)) {
        if (isNaN(value) || !isFinite(value)) {
            return `Invalid value for ${key}. Please enter a valid number.`;
        }
    }

    // Optional: Add range validation if you know the expected ranges
    // For example, if normalized values should be between -1 and 1:
    // if (formData.age < -1 || formData.age > 1) {
    //     return 'Age value should be between -1 and 1 (normalized)';
    // }

    return null; // No errors found
}

// ============================================================================
// API Communication
// ============================================================================

/**
 * Sends a prediction request to the Flask backend.
 *
 * This function uses the Fetch API to make an HTTP POST request to our
 * /predict endpoint with the form data as JSON.
 *
 * @param {Object} formData - The patient data to send for prediction
 * @returns {Promise<number>} The prediction value from the model
 * @throws {Error} If the request fails or the API returns an error
 *
 * Educational Note:
 * ----------------
 * The Fetch API is the modern way to make HTTP requests in JavaScript.
 * Key concepts demonstrated here:
 * - Async/await: Handling asynchronous operations
 * - JSON serialization: Converting JavaScript objects to JSON strings
 * - Error handling: Checking response status and handling failures
 * - HTTP headers: Specifying the content type
 */
async function sendPredictionRequest(formData) {
    try {
        // Make POST request to the /predict endpoint
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Parse the JSON response
        const data = await response.json();

        // Check if the request was successful
        if (!response.ok) {
            // HTTP error (4xx, 5xx status codes)
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        // Check if the API returned a success indicator
        if (!data.success) {
            throw new Error(data.error || 'Prediction failed');
        }

        // Return the prediction value
        return data.prediction;

    } catch (error) {
        // Network errors or JSON parsing errors end up here
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to reach the server. Please check your connection.');
        }
        throw error; // Re-throw other errors
    }
}

// ============================================================================
// UI Updates
// ============================================================================

/**
 * Displays the prediction result to the user.
 *
 * This function updates the UI to show the prediction value in a visually
 * prominent way, with appropriate formatting and context.
 *
 * @param {number} prediction - The prediction value to display
 *
 * Educational Note:
 * ----------------
 * Separating UI update logic into functions:
 * 1. Makes the code reusable
 * 2. Makes it easy to change how results are displayed
 * 3. Keeps the business logic separate from presentation logic
 */
function displayPrediction(prediction) {
    // Get references to result elements
    const resultDiv = document.getElementById('result');
    const predictionValueDiv = document.getElementById('predictionValue');

    if (!resultDiv || !predictionValueDiv) {
        console.error('Result elements not found in the DOM');
        return;
    }

    // Format the prediction value
    // If it's a number, format it to 2 decimal places
    // Otherwise, convert it to a string representation
    const formattedPrediction = typeof prediction === 'number'
        ? prediction.toFixed(2)
        : JSON.stringify(prediction);

    // Update the prediction value display
    predictionValueDiv.textContent = formattedPrediction;

    // Show the result div with a smooth reveal animation
    resultDiv.classList.remove('hidden');

    // Optional: Scroll to the result for better UX
    // resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Displays an error message to the user.
 *
 * @param {string} message - The error message to display
 *
 * Educational Note:
 * ----------------
 * Good error messages should be:
 * 1. Clear and specific about what went wrong
 * 2. Actionable (tell users what they can do to fix it)
 * 3. User-friendly (avoid technical jargon when possible)
 */
function showError(message) {
    const errorDiv = document.getElementById('error');

    if (!errorDiv) {
        console.error('Error div not found in the DOM');
        alert(message); // Fallback to alert if error div is missing
        return;
    }

    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

/**
 * Hides the error message display.
 */
function hideError() {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

/**
 * Hides the prediction result display.
 */
function hideResults() {
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.classList.add('hidden');
    }
}

/**
 * Updates the submit button to show loading state.
 *
 * Providing visual feedback during long operations improves user experience
 * by letting users know that their action is being processed.
 *
 * @param {boolean} isLoading - Whether the loading state should be shown
 *
 * Educational Note:
 * ----------------
 * Loading states are important for user experience because:
 * 1. They prevent user confusion during delays
 * 2. They prevent duplicate submissions
 * 3. They make the application feel more responsive
 */
function setLoadingState(isLoading) {
    const submitBtn = document.querySelector('.btn-submit');

    if (!submitBtn) {
        console.error('Submit button not found');
        return;
    }

    if (isLoading) {
        // Store the original button text so we can restore it later
        if (!submitBtn.dataset.originalText) {
            submitBtn.dataset.originalText = submitBtn.textContent;
        }

        // Create spinning loader icon using SVG
        // Educational Note:
        // ----------------
        // We use an inline SVG for the spinner because:
        // 1. It's scalable and looks sharp on all screen sizes
        // 2. We can control its color and animation with CSS
        // 3. No external image files needed
        // 4. Better performance than animated GIFs
        const spinner = `
            <svg class="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;

        submitBtn.innerHTML = spinner + ' Predicting...';
        submitBtn.disabled = true;
    } else {
        // Restore the original button text
        submitBtn.textContent = submitBtn.dataset.originalText || 'Get Prediction';
        submitBtn.disabled = false;
    }
}

// ============================================================================
// Optional: Sample Data Functionality
// ============================================================================

/**
 * Loads sample data into the form fields.
 *
 * This function is useful for testing and demonstrations. It populates
 * all form fields with example values.
 *
 * Educational Note:
 * ----------------
 * Providing sample data is helpful for:
 * 1. Testing during development
 * 2. Demonstrating the application to others
 * 3. Helping users understand what kind of input is expected
 *
 * To use this function, add a button to your HTML:
 * <button type="button" onclick="loadSampleData()">Load Sample Data</button>
 */
function loadSampleData() {
    // Sample data from a typical diabetes dataset observation
    const sampleData = {
        age: 0.05,
        sex: 0.05,
        bmi: 0.06,
        bp: 0.02,
        s1: -0.04,
        s2: -0.03,
        s3: 0.00,
        s4: 0.00,
        s5: 0.00,
        s6: -0.03
    };

    // Populate each form field with the sample data
    for (const [key, value] of Object.entries(sampleData)) {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
        }
    }

    console.log('Sample data loaded successfully');
}

// ============================================================================
// Optional: Real-time Input Validation
// ============================================================================

/**
 * Sets up real-time validation on input fields.
 *
 * This function adds event listeners to input fields to provide immediate
 * feedback as users type, highlighting invalid inputs.
 *
 * Educational Note:
 * ----------------
 * Real-time validation improves user experience by:
 * 1. Catching errors before form submission
 * 2. Providing immediate feedback
 * 3. Reducing frustration from form rejection
 *
 * This is optional and commented out by default to keep the example simple.
 */
function setupInputValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
}

/**
 * Validates a single input field.
 *
 * @param {HTMLInputElement} input - The input element to validate
 */
function validateInput(input) {
    const value = parseFloat(input.value);

    // Check if the value is a valid number
    if (isNaN(value) || !isFinite(value)) {
        input.classList.add('border-red-500');
        input.classList.remove('border-gray-300');
    } else {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-300');
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Logs debug information to the console (only in development).
 *
 * This helper function makes it easy to add debug logging that can be
 * disabled in production.
 *
 * @param {...any} args - Arguments to log
 */
function debugLog(...args) {
    // Only log in development (you can check window.location or a config variable)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('[DEBUG]', ...args);
    }
}

// Make certain functions available globally if needed
// This allows them to be called from onclick attributes in HTML
window.loadSampleData = loadSampleData;

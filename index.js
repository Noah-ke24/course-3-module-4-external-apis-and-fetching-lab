// Weather Alerts App - index.js

// DOM Elements
const stateInput = document.querySelector("#state-input");
const fetchAlertsBtn = document.querySelector("#fetch-alerts");
const alertsDisplay = document.querySelector("#alerts-display");
const errorMessageDiv = document.querySelector("#error-message");

// Event Listener for the fetch button
fetchAlertsBtn.addEventListener("click", async () => {
    const state = stateInput.value.trim();
    
    // Input validation: Check if input is two capital letters
    if (!validateStateInput(state)) {
        displayError("Please enter a valid state abbreviation (2 capital letters).");
        return;
    }
    
    // Show loading indicator
    showLoading(true);
    
    try {
        const data = await fetchWeatherAlerts(state);
        displayAlerts(data);
        clearError();
        stateInput.value = "";
    } catch (error) {
        displayError(error.message);
    } finally {
        showLoading(false);
    }
});

/**
 * Step 1: Fetch weather alerts from the API
 * @param {string} state - State abbreviation (e.g., "MN")
 * @returns {Promise<Object>} - JSON response from the API
 */
async function fetchWeatherAlerts(state) {
    const apiUrl = `https://api.weather.gov/alerts/active?area=${state}`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch alerts. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched data:", data); // Log for testing
        return data;
    } catch (error) {
        console.log("Error:", error.message);
        throw error;
    }
}

/**
 * Step 2: Display alerts on the page
 * @param {Object} data - Data from the API response
 */
function displayAlerts(data) {
    // Clear previous alerts
    alertsDisplay.innerHTML = "";
    
    // Check if there are any features (alerts)
    if (!data.features || data.features.length === 0) {
        alertsDisplay.innerHTML = "<p>No active weather alerts for this state.</p>";
        return;
    }
    
    // Get the title from the data
    const title = data.title || "Weather Alerts";
    const alertCount = data.features.length;
    
    // Create summary message
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "alerts-summary";
    summaryDiv.innerHTML = `<h2>${title}: ${alertCount}</h2>`;
    alertsDisplay.appendChild(summaryDiv);
    
    // Create list of alert headlines
    const headlinesList = document.createElement("ul");
    headlinesList.className = "alerts-list";
    
    data.features.forEach((alert, index) => {
        const headline = alert.properties?.headline || "No headline available";
        const listItem = document.createElement("li");
        listItem.textContent = headline;
        headlinesList.appendChild(listItem);
    });
    
    alertsDisplay.appendChild(headlinesList);
}

/**
 * Step 3: Clear and reset the UI
 */
function clearError() {
    errorMessageDiv.textContent = "";
    errorMessageDiv.classList.add("hidden");
}

/**
 * Step 4: Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.remove("hidden");
    errorMessageDiv.classList.add("error-styling");
    alertsDisplay.innerHTML = ""; // Clear alerts on error
}

/**
 * Step 5: Input validation - Check if input is two capital letters
 * @param {string} input - User input
 * @returns {boolean} - True if valid, false otherwise
 */
function validateStateInput(input) {
    // Check if input is exactly 2 capital letters
    const statePattern = /^[A-Z]{2}$/;
    return statePattern.test(input);
}

/**
 * Optional: Show/hide loading indicator
 * @param {boolean} show - True to show, false to hide
 */
function showLoading(show) {
    // This is a placeholder for loading indicator functionality
    // You can add a spinner element to HTML and control it here
    if (show) {
        console.log("Loading...");
    } else {
        console.log("Loading complete.");
    }
}

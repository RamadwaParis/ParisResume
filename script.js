document.addEventListener('DOMContentLoaded', () => {
    const loadingDiv = document.getElementById('loading');
    const weatherDisplayDiv = document.getElementById('weatherDisplay');
    const errorMessageDiv = document.getElementById('errorMessage');

    // Automatically get location when page loads
    getLocationAndWeather();

    function getLocationAndWeather() {
        // Show loading, hide other elements
        loadingDiv.classList.remove('hidden');
        weatherDisplayDiv.classList.add('hidden');
        errorMessageDiv.style.display = 'none';

        // Check if geolocation is available
        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser");
            return;
        }

        // Get user's position
        navigator.geolocation.getCurrentPosition(
            position => getWeatherData(position),
            error => handleGeolocationError(error)
        );
    }

    function getWeatherData(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // OpenWeatherMap API (free tier)
        const apiKey = '8d2de98e089f1c28e1a22fc19a24ef04'; // This is a free API key for demo purposes
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data not available');
                }
                return response.json();
            })
            .then(data => {
                displayWeatherData(data);
            })
            .catch(error => {
                showError(`Error fetching weather data: ${error.message}`);
            });
    }

    function displayWeatherData(data) {
        // Get city name or set to generic location
        const locationName = data.name ? 
            `${data.name}, ${data.sys.country}` : 
            "Current Location";

        // Display location name
        document.getElementById('locationText').textContent = locationName;

        // Display temperature and weather description
        const temp = Math.round(data.main.temp);
        document.getElementById('temperature').textContent = `${temp}°C`;
        document.getElementById('weatherDescription').textContent = data.weather[0].description;

        // Display weather icon
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;

        // Show weather display, hide loading
        loadingDiv.classList.add('hidden');
        weatherDisplayDiv.classList.remove('hidden');
    }

    function handleGeolocationError(error) {
        let errorMessage;

        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "User denied the request for geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                errorMessage = "An unknown error occurred.";
                break;
        }

        showError(errorMessage);
    }

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        loadingDiv.classList.add('hidden');
    }
});

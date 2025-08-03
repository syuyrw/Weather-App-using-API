const cityName = document.getElementById("city-name");
let latitude;
let longitude;
let condition;
let icon = document.getElementById("weather-icon");
let temperature = document.getElementById("temp");
let typeCondition = document.getElementById("condition");
let submit = document.getElementById("search-bttn");

// Function to get latitude and longitude of city name entered
function getLatLon() {
    // Trim input, and ensure there is something other than spaces typed
    const input = cityName.value.trim();

    if (input === "") {
        alert("Please enter a city name.");
        return;
    }

    const options = { method: "GET", headers: { accept: "application/json" } };
    fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${input.toLowerCase()}&count=10&language=en&format=json`,
        options
    )
        // Parse data
        .then((response) => response.json())
        .then((data) => {
            if (data.results && data.results.length > 0) {
                latitude = data.results[0].latitude;
                longitude = data.results[0].longitude;
                getWeather();
            } else {
                console.error("Invalid city name or no results found");
                alert("City not found. Try another.");
            }
        })
        .catch((err) => console.error(err));
}

// Function to get weather data for latitude and longitude
function getWeather() {
    const options = { method: "GET", headers: { accept: "application/json" } };
    // Get weather API data
    fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,precipitation,rain,showers,snowfall,weather_code,cloud_cover&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`,
        options
    )
        .then((response) => response.json())
        .then((data) => {
            // Set visuals like icon, temp, and condition
            setIcon(data);
            temperature.textContent = `The current temperature is: ${data.current.temperature_2m}`;
            temperature.style.display = "block";
            document.getElementById("weather-section").style.display = "block";
            const name = cityName.value;
            document.getElementById("show-city").textContent =
                name.charAt(0).toUpperCase() + name.slice(1);
            cityName.value = "";
        })

        .catch((err) => console.error(err));
}

// Function to set weather icon
function setIcon(data) {
    if (data.current.weather_code == 0) {
        condition = "Clear";
        setCondition(condition);
        icon.style.display = "block";
        icon.src = "icons/sun.png";
    } else if (
        data.current.weather_code > 0 &&
        data.current.weather_code <= 3
    ) {
        condition = "Partly Cloudy";
        setCondition(condition);
        icon.style.display = "block";
        icon.src = "icons/cloud.png";
    } else if (
        data.current.weather_code == 45 ||
        data.current.weather_code == 48
    ) {
        condition = "Foggy";
        setCondition(condition);
        icon.style.display = "block";
        icon.src = "icons/haze.png";
    } else if (
        (data.current.weather_code >= 51 && data.current.weather_code <= 67) ||
        (data.current.weather_code >= 80 && data.current.weather_code <= 82)
    ) {
        condition = "Rain";
        setCondition(condition);
        icon.style.display = "block";
        icon.src = "icons/rainy.png";
    } else if (
        (data.current.weather_code >= 71 && data.current.weather_code <= 77) ||
        (data.current.weather_code >= 85 && data.current.weather_code <= 86)
    ) {
        condition = "Snow";
        setCondition(condition);
        icon.style.display = "block";
        icon.src = "icons/snowflake.png";
    } else if (
        data.current.weather_code >= 95 &&
        data.current.weather_code <= 99
    ) {
        condition = "Thunder";
        setCondition(condition);
        icon.style.display = "block";
        icon.src = "icons/thunderstorm.png";
    } else {
        console.log("err");
    }
}

// Display condition text
function setCondition(data) {
    typeCondition.textContent = `The current condition is: ${data}`;
    typeCondition.style.display = "block";
}

// Add ability to press Enter to run search
submit.addEventListener("click", getLatLon);
cityName.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        submit.click();
    }
});

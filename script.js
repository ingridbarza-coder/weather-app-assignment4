const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");

const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error-message");
const weatherCard = document.querySelector("#weather-card");

const cityName = document.querySelector("#city-name");
const description = document.querySelector("#description");
const weatherIcon = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");


searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});


async function getWeather(city) {

    // hide the old result while we look for the new city's weather
    weatherCard.classList.add("hidden");
    errorMessage.classList.add("hidden");
    loading.classList.remove("hidden");

    const params = new URLSearchParams({
        q: city,
        appid: API_KEY,
        units: "metric"
    });

    const url =
        `https://api.openweathermap.org/data/2.5/weather?${params}`;

    try {

        // ask the API for the weather data
        const response = await fetch(url);

        // fetch does not automatically treat a bad status like 404 as an error
        if (!response.ok) {
            throw new Error("City not found.");
        }

        const data = await response.json();

        // once we actually have the data, put it on the page
        displayWeather(data);

    } catch (error) {

        // instead of leaving an ugly console error, show something useful
        showError("Could not find that city. Please try again.");

    } finally {

        // either way we're done loading at this point
        loading.classList.add("hidden");
    }
}


function displayWeather(data) {

    cityName.textContent = `${data.name}, ${data.sys.country}`;

    description.textContent = data.weather[0].description;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherIcon.alt = data.weather[0].description;

    // everything is filled in now so we can finally show the card
    weatherCard.classList.remove("hidden");
}


function showError(message) {

    // one function for errors so i dont repeat this every time
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");

    weatherCard.classList.add("hidden");
    loading.classList.add("hidden");
}
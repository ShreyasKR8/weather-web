import './style.css';

const CELSIUS = 'C';
const FAHRENHEIT = 'F';
let allTemperatures = {};
let currentTempUnit = CELSIUS;
let isInitialSearch = true;

const searchInput = document.getElementById('location-search');
const searchWeatherBtn = document.querySelector('.search-weather-btn');
const weatherMainInfo = document.querySelector('.weather-main');
const weatherMiscInfo = document.querySelector('.weather-misc');
const tempUnitToggle = document.querySelector('input[type=checkbox]');

tempUnitToggle.checked = false;

const weatherGifMap = new Map();
weatherGifMap.set('clear-day', '../images/SunnyDay.gif');
weatherGifMap.set('clear-night', '../images/ClearNight.gif');
weatherGifMap.set('partly-cloudy-night', '../images/PartlyCloudyNight.gif');
weatherGifMap.set('partly-cloudy-day', '../images/CloudyDay.gif');
weatherGifMap.set('cloudy', '../images/CloudyDay.gif');
weatherGifMap.set('rain', '../images/RainyAnime.gif');
weatherGifMap.set('showers-day', '../images/RainyDay.gif');
weatherGifMap.set('showers-night', '../images/RainyNight.gif');
weatherGifMap.set('snow-showers-day', '../images/Snowy.gif');
weatherGifMap.set('snow-showers-night', '../images/SnowyNight.gif');
weatherGifMap.set('snow', '../images/Snowy.gif');
weatherGifMap.set('thunder', '../images/Thunder.gif');
weatherGifMap.set('thunder-rain', '../images/Thunder.gif');
weatherGifMap.set('thunder-showers-day', '../images/Thunder.gif');
weatherGifMap.set('thunder-showers-night', '../images/Thunder.gif');
weatherGifMap.set('wind', '../images/WindyCloudyDay.gif');
weatherGifMap.set('fog', '../images/foggy.gif');
weatherGifMap.set('hail', '../images/hail.gif');

function displayWeather(weatherInfo) {
    weatherMainInfo.replaceChildren();
    weatherMiscInfo.replaceChildren();

    const locationElement = document.createElement('h3');
    locationElement.classList = 'location';
    locationElement.textContent = weatherInfo.address;

    const temperatureElement = document.createElement('p');
    temperatureElement.classList = 'temperature';
    temperatureElement.innerHTML = `${weatherInfo.temperatures.currentTemp}&deg;${currentTempUnit}`;

    const feelsLikeElement = document.createElement('p');
    feelsLikeElement.classList = 'feels-like';
    feelsLikeElement.innerHTML = `Feels like ${weatherInfo.temperatures.feelsLike}&deg;${currentTempUnit}`;

    const descriptionElement = document.createElement('p');
    descriptionElement.classList = 'description';
    descriptionElement.textContent = weatherInfo.weatherCondition;

    const humidityElement = document.createElement('p');
    humidityElement.classList = 'humidity';
    humidityElement.textContent = `Humidity: ${weatherInfo.humidity}%`;

    const windSpeedElement = document.createElement('p');
    windSpeedElement.classList = 'wind-speed';
    windSpeedElement.textContent = `Wind speed: ${weatherInfo.windSpeed}km/h`;

    const uvIndexElement = document.createElement('p');
    uvIndexElement.classList = 'uv-index';
    uvIndexElement.textContent = `UV Index: ${weatherInfo.uvIndex}`;

    const maxTempElement = document.createElement('p');
    maxTempElement.classList = 'max-temp';
    maxTempElement.innerHTML =
        `${weatherInfo.temperatures.maxTemp}&deg;${currentTempUnit}` +
        ' / ' +
        `${weatherInfo.temperatures.minTemp}&deg;${currentTempUnit}`;

    const visibilityElement = document.createElement('p');
    visibilityElement.classList = 'visibility';
    visibilityElement.textContent = `Visibility: ${weatherInfo.visibility}km`;

    const gifSrc = weatherGifMap.get(weatherInfo.weatherIcon);
    document.body.style.backgroundImage = `url(${gifSrc})`;
    document.body.style.backgroundColor = 'black';
    document.body.style.backgroundSize = 'cover';

    weatherMainInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

    weatherMainInfo.appendChild(locationElement);
    weatherMainInfo.appendChild(temperatureElement);
    weatherMainInfo.appendChild(descriptionElement);
    weatherMainInfo.appendChild(maxTempElement);
    weatherMainInfo.appendChild(feelsLikeElement);
    weatherMiscInfo.appendChild(humidityElement);
    weatherMiscInfo.appendChild(windSpeedElement);
    weatherMiscInfo.appendChild(uvIndexElement);
    weatherMiscInfo.appendChild(visibilityElement);
}

//updates temp on webpage when unit is converted.
function updateTemperature(temperatures, unit) {
    const feelsLikeElement = document.querySelector('.feels-like');
    const temperatureElement = document.querySelector('.temperature');
    const maxTempElement = document.querySelector('.max-temp');

    temperatureElement.innerHTML = `${temperatures.currentTemp}&deg;${unit}`;
    feelsLikeElement.innerHTML = `Feels like ${temperatures.feelsLike}&deg;${unit}`;
    maxTempElement.innerHTML =
        `${temperatures.maxTemp}&deg;${unit}` +
        ' / ' +
        `${temperatures.minTemp}&deg;${unit}`;
}

function validateSearchInput() {
    if (searchInput.value === '') {
        searchInput.setCustomValidity('Please enter the location');
        searchInput.reportValidity();
        return false;
    }
    return true;
}

function parseJSON(responseJSON) {
    const {
        address: address,
        resolvedAddress: fullAddress,
        currentConditions: {
            uvindex: uvIndex,
            humidity: humidity,
            windspeed: windSpeed,
            icon: weatherIcon,
            conditions: weatherCondition,
            visibility: visibility,
        },
        description: description,
    } = responseJSON;

    let {
        days: [
            {
                temp: currentTemp,
                feelslike: feelsLike,
                tempmax: maxTemp,
                tempmin: minTemp,
            },
        ],
    } = responseJSON;

    if (currentTempUnit === FAHRENHEIT) {
        currentTemp = convertCelsiusToFahrenheit(currentTemp);
        feelsLike = convertCelsiusToFahrenheit(feelsLike);
        maxTemp = convertCelsiusToFahrenheit(maxTemp);
        minTemp = convertCelsiusToFahrenheit(minTemp);
    }

    const temperatures = { currentTemp, feelsLike, maxTemp, minTemp };

    return {
        address,
        fullAddress,
        temperatures,
        uvIndex,
        humidity,
        windSpeed,
        weatherIcon,
        weatherCondition,
        description,
        visibility,
    };
}

async function handleSearchWeather() {
    if (!validateSearchInput()) {
        return;
    }
    if (isInitialSearch) {
        isInitialSearch = false;
    }
    await fetchWeatherInfo();
}

async function fetchWeatherInfo() {
    const location = searchInput.value;
    const apiKey = 'E7UZ2REAT4L7RM5TCR8J248GX';
    const formattedDateTime = getFormattedDateTime();
    const requestURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formattedDateTime}?unitGroup=metric&key=${apiKey}`;

    const response = await fetch(requestURL);
    const responseJSON = await response.json();
    // console.log(responseJSON);
    const weatherInfo = parseJSON(responseJSON);
    // console.log(weatherInfo);
    allTemperatures = weatherInfo.temperatures;
    displayWeather(weatherInfo);
}

function getFormattedDateTime() {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

function convertFahrenheitToCelcius(fahrenheitTemp) {
    const celsiusTemp = (((fahrenheitTemp - 32) * 5) / 9).toFixed(1);
    return parseFloat(celsiusTemp);
}

function convertCelsiusToFahrenheit(celsiusTemp) {
    const fahrenheitTemp = ((celsiusTemp * 9) / 5 + 32).toFixed(1);
    return parseFloat(fahrenheitTemp);
}

function switchTemperatureUnit() {
    if (isInitialSearch) {
        currentTempUnit = currentTempUnit === CELSIUS ? FAHRENHEIT : CELSIUS;
        return;
    }
    if (currentTempUnit === CELSIUS) {
        allTemperatures.currentTemp = convertCelsiusToFahrenheit(
            allTemperatures.currentTemp
        );
        allTemperatures.feelsLike = convertCelsiusToFahrenheit(
            allTemperatures.feelsLike
        );
        allTemperatures.maxTemp = convertCelsiusToFahrenheit(
            allTemperatures.maxTemp
        );
        allTemperatures.minTemp = convertCelsiusToFahrenheit(
            allTemperatures.minTemp
        );
        currentTempUnit = FAHRENHEIT;
        updateTemperature(allTemperatures, currentTempUnit);
    } else {
        allTemperatures.currentTemp = convertFahrenheitToCelcius(
            allTemperatures.currentTemp
        );
        allTemperatures.feelsLike = convertFahrenheitToCelcius(
            allTemperatures.feelsLike
        );
        allTemperatures.maxTemp = convertFahrenheitToCelcius(
            allTemperatures.maxTemp
        );
        allTemperatures.minTemp = convertFahrenheitToCelcius(
            allTemperatures.minTemp
        );
        currentTempUnit = CELSIUS;
        updateTemperature(allTemperatures, currentTempUnit);
    }
}

searchWeatherBtn.addEventListener('click', handleSearchWeather);

tempUnitToggle.addEventListener('change', switchTemperatureUnit);

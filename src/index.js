const locationInput = document.getElementById('location-search');
const weatherInfo = document.querySelector('.weather-info');
const searchWeatherBtn = document.querySelector('.search-weather-btn');

function validateSearchInput() {
    if (locationInput.value === '') {
        locationInput.setCustomValidity('Please enter the location');
        locationInput.reportValidity();
        return false;
    }
    return true;
}

function parseJSON(responseJSON) {
    const {
        resolvedAddress: Address,
        currentConditions: {
            temp: currentTemp,
            uvindex: uvIndex,
            humidity: humidity,
            windspeed: windSpeed,
            icon: weatherIcon,
            conditions: weatherCondition,
        },
        description: description,
        days: [{ tempmax: maxTemp, tempmin: minTemp }],
    } = responseJSON;
    return {
        Address,
        currentTemp,
        uvIndex,
        humidity,
        windSpeed,
        weatherIcon,
        weatherCondition,
        description,
        maxTemp,
        minTemp,
    };
}

async function handleSearchWeather() {
    if (!validateSearchInput()) {
        return;
    }

    const location = locationInput.value;
    const apiKey = 'E7UZ2REAT4L7RM5TCR8J248GX';
    const requestURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;

    const response = await fetch(requestURL);
    const responseJSON = await response.json();
    // console.log(responseJSON);
    localStorage.setItem(responseJSON.address, JSON.stringify(responseJSON));
    console.log(parseJSON(responseJSON));
}

searchWeatherBtn.addEventListener('click', handleSearchWeather);

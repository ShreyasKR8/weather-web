const searchInput = document.getElementById('location-search');
const searchWeatherBtn = document.querySelector('.search-weather-btn');
const weatherMainInfo = document.querySelector('.weather-main');
const weatherMiscInfo = document.querySelector('.weather-misc');

function displayWeather(weatherInfo) {
    weatherMainInfo.replaceChildren();
    weatherMiscInfo.replaceChildren();

    const location = document.createElement('h3');
    location.classList = 'location';
    location.textContent = weatherInfo.address;

    const temperature = document.createElement('p');
    temperature.classList = 'temperature';
    temperature.innerHTML = weatherInfo.currentTemp + '&deg;F';

    const feelsLike = document.createElement('p');
    feelsLike.classList = 'feels-like';
    feelsLike.innerHTML = 'Feels like ' + weatherInfo.feelsLike + '&deg;F';

    const description = document.createElement('p');
    description.classList = 'description';
    description.textContent = weatherInfo.weatherCondition;

    const humidity = document.createElement('p');
    humidity.classList = 'humidity';
    humidity.textContent = 'Humidity: ' + weatherInfo.humidity + ' %';

    const windSpeed = document.createElement('p');
    windSpeed.classList = 'wind-speed';
    windSpeed.textContent = 'Wind speed: ' + weatherInfo.windSpeed + ' km/h';

    const uvIndex = document.createElement('p');
    uvIndex.classList = 'uv-index';
    uvIndex.textContent = 'UV Index: ' + weatherInfo.uvIndex;

    const maxTemp = document.createElement('p');
    maxTemp.classList = 'max-temp';
    maxTemp.innerHTML = weatherInfo.maxTemp + '&deg;F / ' + weatherInfo.minTemp + '&deg;F' ;

    const visibility = document.createElement('p');
    visibility.classList = 'visibility';
    visibility.textContent = 'Visibility: ' + weatherInfo.visibility + ' km';
    
    weatherMainInfo.appendChild(location);
    weatherMainInfo.appendChild(temperature);
    weatherMainInfo.appendChild(description);
    weatherMainInfo.appendChild(maxTemp);
    weatherMainInfo.appendChild(feelsLike);
    weatherMiscInfo.appendChild(humidity);
    weatherMiscInfo.appendChild(windSpeed);
    weatherMiscInfo.appendChild(uvIndex);
    weatherMiscInfo.appendChild(visibility);
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
            temp: currentTemp,
            uvindex: uvIndex,
            humidity: humidity,
            windspeed: windSpeed,
            icon: weatherIcon,
            conditions: weatherCondition,
            feelslike: feelsLike,
            visibility: visibility,
        },
        description: description,
        days: [{ tempmax: maxTemp, tempmin: minTemp }],
    } = responseJSON;

    return {
        address,
        fullAddress,
        currentTemp,
        uvIndex,
        humidity,
        windSpeed,
        weatherIcon,
        weatherCondition,
        description,
        maxTemp,
        minTemp,
        feelsLike,
        visibility,
    };
}

async function handleSearchWeather() {
    if (!validateSearchInput()) {
        return;
    }

    await getWeatherInfo();
}

async function getWeatherInfo() {
    const location = searchInput.value;
    const apiKey = 'E7UZ2REAT4L7RM5TCR8J248GX';
    const requestURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;

    const response = await fetch(requestURL);
    const responseJSON = await response.json();
    // console.log(responseJSON);
    localStorage.setItem(responseJSON.address, JSON.stringify(responseJSON));
    const weatherInfo = parseJSON(responseJSON);
    console.log(weatherInfo);
    displayWeather(weatherInfo);
}

searchWeatherBtn.addEventListener('click', handleSearchWeather);

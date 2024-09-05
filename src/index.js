const searchInput = document.getElementById('location-search');
const searchWeatherBtn = document.querySelector('.search-weather-btn');
const weatherMainInfo = document.querySelector('.weather-main');
const weatherMiscInfo = document.querySelector('.weather-misc');

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

    const location = document.createElement('h3');
    location.classList = 'location';
    location.textContent = weatherInfo.address;

    const temperature = document.createElement('p');
    temperature.classList = 'temperature';
    temperature.innerHTML = convertToC(weatherInfo.currentTemp) + '&deg;C';

    const feelsLike = document.createElement('p');
    feelsLike.classList = 'feels-like';
    feelsLike.innerHTML = 'Feels like ' + convertToC(weatherInfo.feelsLike) + '&deg;C';

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
    maxTemp.innerHTML = convertToC(weatherInfo.maxTemp) + '&deg;F / ' + convertToC(weatherInfo.minTemp) + '&deg;C' ;

    const visibility = document.createElement('p');
    visibility.classList = 'visibility';
    visibility.textContent = 'Visibility: ' + weatherInfo.visibility + ' km';
    
    const gifSrc = weatherGifMap.get(weatherInfo.weatherIcon);
    document.body.style.backgroundImage = `url(${gifSrc})`;
    document.body.style.backgroundColor = 'black';
    document.body.style.backgroundSize = 'cover';

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

function convertToC(temp) {
    return ((temp - 32) * 5/9).toFixed(1);
}

searchWeatherBtn.addEventListener('click', handleSearchWeather);

const fs = require('fs');
const path = require('path');

const folderPath = 'C:/Users/Shreyas/Downloads/WeatherIcons-main/SVG'; // Replace with your folder path

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Unable to scan folder:', err);
        return;
    } 
    files.forEach(file => {
        const fileName = file.slice(-3)
        console.log(fileName);
    });
});

clear-day
clear-night
cloudy
fog
hail
partly-cloudy-day
partly-cloudy-night
rain-snow-showers-day
rain-snow-showers-night
rain-snow
rain
showers-day
showers-night
sleet
snow-showers-day
snow-showers-night
snow
thunder-rain
thunder-showers-day
thunder-showers-night
thunder
wind
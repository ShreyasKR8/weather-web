const weatherGifMap = new Map();
weatherGifMap.set('clear-day', () => import('../images/SunnyDay.gif'));
weatherGifMap.set('clear-night', () => import('../images/ClearNight.gif'));
weatherGifMap.set(
    'partly-cloudy-night',
    () => import('../images/PartlyCloudyNight.gif')
);
weatherGifMap.set('partly-cloudy-day', () => import('../images/CloudyDay.gif'));
weatherGifMap.set('cloudy', () => import('../images/CloudyDay.gif'));
weatherGifMap.set('rain', () => import('../images/RainyAnime.gif'));
weatherGifMap.set('showers-day', () => import('../images/RainyDay.gif'));
weatherGifMap.set('showers-night', () => import('../images/RainyNight.gif'));
weatherGifMap.set('snow-showers-day', () => import('../images/Snowy.gif'));
weatherGifMap.set(
    'snow-showers-night',
    () => import('../images/SnowyNight.gif')
);
weatherGifMap.set('snow', () => import('../images/Snowy.gif'));
weatherGifMap.set('thunder', () => import('../images/Thunder.gif'));
weatherGifMap.set('thunder-rain', () => import('../images/Thunder.gif'));
weatherGifMap.set('thunder-showers-day', () => import('../images/Thunder.gif'));
weatherGifMap.set(
    'thunder-showers-night',
    () => import('../images/Thunder.gif')
);
weatherGifMap.set('wind', () => import('../images/WindyCloudyDay.gif'));
weatherGifMap.set('fog', () => import('../images/foggy.gif'));
weatherGifMap.set('hail', () => import('../images/hail.gif'));

async function getGif(weatherIcon) {
    const gifLoader = weatherGifMap.get(weatherIcon);
    if (gifLoader) {
        try {
            const module = await gifLoader();
            const gifSrc = module.default;
            return gifSrc;
        } catch (err) {
            console.error('Error loading GIF:', err);
            return null;
        }
    } else {
        console.error('No GIF found for the given weather icon.');
        return null;
    }
}

export default {
    getGif,
};

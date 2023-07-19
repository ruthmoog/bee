
export const unableToFetchWindSpeed = "Unable to fetch wind speed";
export const calm0 = "0 <dfn>Smoke rises vertically</dfn>";
export const lightAir1 = "1 <dfn>Slight smoke drift</dfn>";
export const lightBreeze2 = "2 <dfn>Wind felt on face, leaves rustle</dfn>";
export const gentleBreeze3 = "3 <dfn>Leaves and twigs in slight motion</dfn>";
export const moderateBreeze4 = "4 <dfn>Dust raised and small branches move</dfn>";
export const freshBreeze5 = "5 <dfn>Small trees in leaf begin to sway</dfn>";
export const strongBreeze6 = "6 <dfn>Large branches move and trees sway</dfn>";
export const highWind7toHurricaneForce12 = "⚠️ Avoid or abandon in bad weather";

export const sunny = "Sunny";
export const sunCloud = "Sun/Cloud";
export const cloudy = "Cloudy";
export const unableToFetchCloudCover = "Unable to fetch cloud cover";

export async function fetchWeather(currentPosition) {
    const lat = currentPosition.coords.latitude.toString()
    const lon = currentPosition.coords.latitude.toString()

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,cloudcover,windspeed_10m&forecast_days=1`
    let res = await fetch(url)
    let json = await res.json()
    return extractWeather(json, new Date());
}

export function extractWeather(weatherResponse, currentDate) {
    const index = currentDate.getHours() - 1

    const temperature = Math.round(weatherResponse.hourly.temperature_2m[index])
    const cloudCover = weatherResponse.hourly.cloudcover[index];
    const windSpeed = weatherResponse.hourly.windspeed_10m[index];

    let sunshine = determineSunshine(cloudCover);
    let beaufortScale = determineBeaufort(windSpeed);

    return {
        temperature,
        sunshine,
        windSpeed: beaufortScale,
    };
}

function determineSunshine(cloudCover) {
    let sunshine = unableToFetchCloudCover;

    if (cloudCover <= 10) {
        sunshine = sunny;
    }
    if (cloudCover > 10 && cloudCover <= 70) {
        sunshine = sunCloud;
    }
    if (cloudCover > 70) {
        sunshine = cloudy;
    }

    return sunshine;
}

function determineBeaufort(windSpeed) {
    let beaufortScale = unableToFetchWindSpeed;

    if (windSpeed < 2) {
        beaufortScale = calm0;
    }
    if (windSpeed >= 2 && windSpeed < 6) {
        beaufortScale = lightAir1;
    }
    if (windSpeed >= 6 && windSpeed < 12) {
        beaufortScale = lightBreeze2;
    }
    if (windSpeed >= 12 && windSpeed < 20) {
        beaufortScale = gentleBreeze3;
    }
    if (windSpeed >= 20 && windSpeed < 29) {
        beaufortScale = moderateBreeze4;
    }
    if (windSpeed >= 29 && windSpeed < 39) {
        beaufortScale = freshBreeze5;
    }
    if (windSpeed >= 39 && windSpeed <= 49) {
        beaufortScale = strongBreeze6;
    }
    if (windSpeed > 49) {
        beaufortScale = highWind7toHurricaneForce12;
    }

    return beaufortScale;
}
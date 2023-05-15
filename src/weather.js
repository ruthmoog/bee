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
    const temperature = weatherResponse.hourly.temperature_2m[index]
    const cloudCover = weatherResponse.hourly.cloudcover[index];
    const windSpeed = weatherResponse.hourly.windspeed_10m[index];

    let sunshine = "Cloudy"
    if (cloudCover < 20) {
        sunshine = "Sunny"
    }

    if (cloudCover >= 20 && cloudCover < 70) {
        sunshine = "Sun/Cloud"
    }

    let beaufortScale = "0"

    if (windSpeed < 2) {
        beaufortScale = "0 Smoke rises vertically"
    }
    if (windSpeed >= 2 && windSpeed < 6) {
        beaufortScale = "1 Slight smoke drift"
    }
    if (windSpeed >= 6 && windSpeed < 12) {
        beaufortScale = "2 Wind felt on face, leaves rustle"
    }
    if (windSpeed >= 12 && windSpeed < 20) {
        beaufortScale = "3 Leaves and twigs in slight motion"
    }
    if (windSpeed >= 20 && windSpeed < 29) {
        beaufortScale = "4 Dust raised and small branches move"
    }

    return {
        temperature,
        sunshine,
        windSpeed: beaufortScale,
    };
}

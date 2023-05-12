import {date, hourAndMinute} from "./timeAndDate.js";

const sightingsStorageKey = "sightings";

export function addSighting(caste, species, section) {
    let sightings = getSightings();
    sightings.push({
        section,
        species,
        caste,
    })
    localStorage.setItem(sightingsStorageKey, JSON.stringify(sightings));
}

export function getSightings() {
    let sightings = localStorage.getItem(sightingsStorageKey);
    if (!sightings) {
        return [];
    } else {
        return JSON.parse(sightings);
    }
}

function setStart(time) {
    localStorage.setItem("start", time);
}

function setDate(day) {
    localStorage.setItem("date", day);
}

function setStop(time) {
    localStorage.setItem("stop", time);
}

export function getStartTime() {
    return localStorage.getItem("start");
}

export function getDate() {
    return localStorage.getItem("date");
}

export function getEndTime() {
    return localStorage.getItem("stop");
}

export function setStartDateTime() {
    setStart(hourAndMinute());
    setDate(date());
}

export function setStopTime() {
    setStop(hourAndMinute());
}

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

    console.log("cloud cover", weatherResponse.hourly.cloudcover[index])

    let sunshine = "Cloudy"
    if (weatherResponse.hourly.cloudcover[index] < 20) {
        sunshine = "Sunny"
    }

    if(weatherResponse.hourly.cloudcover[index] >= 20 && weatherResponse.hourly.cloudcover[index] < 70) {
        sunshine = "Sun/Cloud"
    }

    return {
        temperature,
        sunshine,
    };
}

const weatherStorageKey = "weather"

export function getWeather() {
    return JSON.parse(localStorage.getItem(weatherStorageKey))
}

export function setWeather(weather) {
    localStorage.setItem(weatherStorageKey, JSON.stringify(weather))
}
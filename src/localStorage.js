import {date, hourAndMinute} from "./timeAndDate.js";

const sightingsStorageKey = "sightings";
const commentsStorageKey = "comments";

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

export function addComment(section, species, comment) {
    let comments = getComments();
    comments.push({
        section,
        species,
        comment,
    })
    localStorage.setItem(commentsStorageKey, JSON.stringify(comments));
}

export function getComments() {
    let comments = localStorage.getItem(commentsStorageKey);
    if (!comments) {
        return [];
    } else {
        return JSON.parse(comments);
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

const weatherStorageKey = "weather"

export function getWeather() {
    return JSON.parse(localStorage.getItem(weatherStorageKey))
}

export function setWeather(weather) {
    localStorage.setItem(weatherStorageKey, JSON.stringify(weather))
}

export function editWalkData() {
    const date = document.getElementById("dateDisplay").innerText;
    const startTime = document.getElementById("startTimeDisplay").innerText;
    const endTime = document.getElementById("endTimeDisplay").innerText;
    const temperature = document.getElementById("tempDisplay").innerText;
    const sunshine = document.getElementById("sunshineDisplay").innerText;
    const windSpeed = document.getElementById("windSpeedDisplay").innerText;

    setDate(date);
    setStart(startTime);
    setStop(endTime);
    setWeather({"temperature":temperature,"sunshine":sunshine,"windSpeed":windSpeed})
}
import {setDate, setStart, setStop, getStartTime, getDate, getEndTime} from "./localStorage.js";

export function hourAndMinute() {
    return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

export function setStartDateTime() {
    setStart(hourAndMinute());
    setDate(new Date().toLocaleDateString("en-GB"));
}

export function setStopTime() {
    setStop(hourAndMinute());
}

export function getStartTime() {
    return getStartTime()
}

export function getDate() {
    return getDate()
}

export function getEndTime() {
    return getEndTime()
}
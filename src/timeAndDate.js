import {setDate, setStart, setStop} from "./localStorage.js";

export function getHourAndMinute() {
    return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

export function setStartDateTime() {
    setStart(getHourAndMinute());
    setDate(new Date().toLocaleDateString("en-GB"));
}

export function setStopTime() {
    setStop(getHourAndMinute());
}
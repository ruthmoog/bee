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

export function setStart(time) {
    localStorage.setItem("start", time);
}

export function setDate(day) {
    localStorage.setItem("date", day);
}

export function getStartTime() {
    return localStorage.getItem("start");
}

export function getDate() {
    return localStorage.getItem("date");
}

export function setStop(time) {
    localStorage.setItem("stop", time);
}

export function getEndTime() {
    return localStorage.getItem("stop");
}


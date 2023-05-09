const sightingsStorageKey = "sightings";
const startTimeStorageKey = "start-time";

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
    let startTime = getStartTime();
    startTime.push({start: time,})
    localStorage.setItem(startTimeStorageKey, JSON.stringify(startTime))
}

export function getStartTime() {
    let startTime = localStorage.getItem(startTimeStorageKey);
    if (!startTime) {
        return [];
    } else {
        return JSON.parse(startTime);
    }
}



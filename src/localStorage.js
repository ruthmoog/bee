const sightingsStorageKey = "sightings";

export function addSighting(caste, species, section) {
    let sightings = getSightings();
    sightings.push({
        section,
        species,
        caste,
        // comments: comments.value
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
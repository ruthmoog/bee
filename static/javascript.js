const sightingsStorageKey = "sightings";
const button = document.getElementById("ClickBeeButton");
const displayCount = document.getElementById("beeCount");
const speciesSelection = document.getElementById("species");

function getSightings() {
    let sightings = localStorage.getItem(sightingsStorageKey);
    if (!sightings) {
        return [];
    } else {
        return JSON.parse(sightings);
    }
}

function renderCount() {
    const sightings = getSightings();

    const result = sightings.reduce((speciesCount, sighting) => {
        const currentSpeciesCount = speciesCount[sighting.species];
        if (!currentSpeciesCount) {
            speciesCount[sighting.species] = 1;
        } else {
            speciesCount[sighting.species]++;
        }
        return speciesCount
    }, {});
    console.log(result)
    displayCount.innerText = JSON.stringify(result);
}

renderCount();

button.addEventListener("click", () => {
    console.log("BUZZZZZZZ")

    let sightings = getSightings();
    sightings.push({species: speciesSelection.value})
    localStorage.setItem(sightingsStorageKey, JSON.stringify(sightings));
    renderCount();
})

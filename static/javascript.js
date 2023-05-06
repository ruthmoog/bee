const sightingsStorageKey = "sightings";
const button = document.getElementById("ClickBeeButton");
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

    const observations = document.getElementById("observations")

    for (const [species, count] of Object.entries(result)) {

        const row = observations.insertRow(0);

        const speciesCell = row.insertCell(0);
        const countCell = row.insertCell(1);

        speciesCell.innerHTML = species
        countCell.innerHTML = count
    }


}

renderCount();

button.addEventListener("click", () => {
    console.log("BUZZZZZZZ")

    let sightings = getSightings();
    sightings.push({species: speciesSelection.value})
    localStorage.setItem(sightingsStorageKey, JSON.stringify(sightings));
    renderCount();
})

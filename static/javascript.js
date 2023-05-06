const sightingsStorageKey = "sightings";
const queenSpottedButton = document.getElementById("QueenSpotted");
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
            speciesCount[sighting.species] = {queen: 1};
        } else {
            speciesCount[sighting.species].queen++;
        }
        return speciesCount
    }, {});

    console.log(result)

    const observations = document.getElementById("observations")

    observations.innerHTML = "";

    for (const [species, casteCounts] of Object.entries(result)) {

        const row = observations.insertRow(0);

        const speciesCell = row.insertCell(0);
        const queensCell = row.insertCell(1);

        console.log(casteCounts, "%%%%%%%%%%%%%%%%%%");

        speciesCell.innerHTML = species
        queensCell.innerHTML = casteCounts.queen;
    }


}

renderCount();

queenSpottedButton.addEventListener("click", () => {
    console.log("BUZZZZZZZ")

    let sightings = getSightings();
    sightings.push({species: speciesSelection.value, caste: "queen"})
    localStorage.setItem(sightingsStorageKey, JSON.stringify(sightings));
    renderCount();
})

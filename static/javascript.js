const sightingsStorageKey = "sightings";
const queenSpottedButton = document.getElementById("QueenSpotted");
const workerSpottedButton = document.getElementById("WorkerSpotted");
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
            speciesCount[sighting.species] = {[sighting.caste]: 1};
        } else {
            if (!speciesCount[sighting.species][sighting.caste]) {
                speciesCount[sighting.species][sighting.caste] = 1
            } else {
                speciesCount[sighting.species][sighting.caste]++;
            }
        }
        return speciesCount
    }, {});

    console.log(JSON.stringify(result))

    const observations = document.getElementById("observations")

    observations.innerHTML = "";

    for (const [species, casteCounts] of Object.entries(result)) {

        const row = observations.insertRow(0);

        const speciesCell = row.insertCell(0);
        const queensCell = row.insertCell(1);
        const workersCell = row.insertCell(2);

        speciesCell.innerHTML = species
        queensCell.innerHTML = casteCounts.queen ? casteCounts.queen : "";
        workersCell.innerHTML = casteCounts.worker ? casteCounts.worker : "";
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


workerSpottedButton.addEventListener("click", () => {
    console.log("WORKER OMG")

    let sightings = getSightings();
    sightings.push({species: speciesSelection.value, caste: "worker"})
    localStorage.setItem(sightingsStorageKey, JSON.stringify(sightings));
    renderCount();
})

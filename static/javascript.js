const sightingsStorageKey = "sightings";
const castesOfBees = ['queen', 'worker', 'male', 'unknown']
const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)
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

        row.insertCell(0).innerHTML = species

        castesOfBees.forEach((caste, i) => {
            row.insertCell(i+1).innerText = casteCounts[caste] ? casteCounts[caste] : "";
        })
    }
}

renderCount();

function addSighting(caste) {
    let sightings = getSightings();
    sightings.push({species: speciesSelection.value, caste})
    localStorage.setItem(sightingsStorageKey, JSON.stringify(sightings));
    renderCount();
}

beeButtons.forEach(({button, caste}) => {
    button.addEventListener("click", () => {
        addSighting(caste)
    })
})
(function () {
    'use strict';

    function createBeeSightingSummary (sightings) {
        const beeSightingsSummary = sightings.reduce((summary, sighting) => {
            // we need to update the section for the given sighting
            // look up the section from the summary (or create a new section)

            const currentSection = summary[sighting.section] || {};
            summary[sighting.section] = currentSection;

            // look up the species count in the current section
            const currentSpeciesCount = currentSection[sighting.species];

            if (!currentSpeciesCount) {
                // if the species hasnt been seen in this section, add a record of it, with its caste
                currentSection[sighting.species] = {[sighting.caste]: 1};
            } else {
                // if we haven't seen this caste (but we have seen the species)
                if (!currentSection[sighting.species][sighting.caste]) {
                    // add the caste
                    currentSection[sighting.species][sighting.caste] = 1;
                } else {
                    // increment the caste
                    currentSection[sighting.species][sighting.caste]++;
                }
            }
            return summary
        }, {});
        return beeSightingsSummary;
    }

    const sightingsStorageKey = "sightings";

    function addSighting(caste, species, section) {
        let sightings = getSightings();
        sightings.push({
            section,
            species,
            caste,
            // comments: comments.value
        });
        localStorage.setItem(sightingsStorageKey, JSON.stringify(sightings));
    }

    function getSightings() {
        let sightings = localStorage.getItem(sightingsStorageKey);
        if (!sightings) {
            return [];
        } else {
            return JSON.parse(sightings);
        }
    }

    const castesOfBees = ['queen', 'worker', 'male', 'unknown'];
    const beeButtons = castesOfBees.map((caste) => (
        {button: document.getElementById(caste + 'Spotted'), caste})
    );
    const speciesSelection = document.getElementById("species");
    const clearButton = document.getElementById("clear");

    renderSummary();

    beeButtons.forEach(({button, caste}) => {
        button.addEventListener("click", () => {
            const section = document.querySelector('input[name="section"]:checked').value;
            addSighting(caste, speciesSelection.value, section);
            renderSummary();
        });
    });

    clearButton.addEventListener("click", () => {
        localStorage.clear();
        renderSummary();
    });

    function renderSummary() {
        const sightings = getSightings();

        const beeSightingsSummary = createBeeSightingSummary(sightings);

        const observations = document.getElementById("observations");

        observations.innerHTML = "";

        for (const [section, sightings] of Object.entries(beeSightingsSummary)) {

            for (const [species, casteCounts] of Object.entries(sightings)) {

                const row = observations.insertRow(0);

                row.insertCell(0).innerHTML = species;
                row.insertCell(1).innerHTML = section;

                castesOfBees.forEach((caste, i) => {
                    row.insertCell(i + 2).innerText = casteCounts[caste] ? casteCounts[caste] : "";
                });
            }
        }
    }

})();

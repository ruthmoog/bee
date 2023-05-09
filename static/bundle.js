(function () {
    'use strict';

    function createBeeSightingSummary(sightings) {

        return sightings.reduce((summary, sighting) => {
            // look up the section from the summary (or create a new section)
            const currentSection = summary[sighting.section] || {};

            // look up the species count in the current section
            if (!currentSection[sighting.species]) {// if we haven't seen this caste (but we have seen the species)
                addSpeciesAndCaste(currentSection, sighting);
            } else {
                incrementCaste(currentSection[sighting.species], sighting.caste);
            }

            // Update the section
            summary[sighting.section] = currentSection;
            return summary
        }, {});
    }

    function incrementCaste(species, caste) {
        species[caste] = species[caste] ? species[caste] +1 : 1;
    }

    function addSpeciesAndCaste(currentSection, sighting) {
        currentSection[sighting.species] = {[sighting.caste]: 1};
    }

    const sightingsStorageKey = "sightings";
    const startTimeStorageKey = "start-time";

    function addSighting(caste, species, section) {
        let sightings = getSightings();
        sightings.push({
            section,
            species,
            caste,
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

    function setStart(time) {
        let startTime = getStartTime();
        startTime.push({start: time,});
        localStorage.setItem(startTimeStorageKey, JSON.stringify(startTime));
    }

    function getStartTime() {
        let startTime = localStorage.getItem(startTimeStorageKey);
        if (!startTime) {
            return [];
        } else {
            return JSON.parse(startTime);
        }
    }

    const startButton = document.getElementById("start");

    const castesOfBees = ['queen', 'worker', 'male', 'unknown'];
    const beeButtons = castesOfBees.map((caste) => (
        {button: document.getElementById(caste + 'Spotted'), caste})
    );
    const speciesSelection = document.getElementById("species");
    const clearButton = document.getElementById("clear");

    renderSummary();

    startButton.addEventListener("click", () => {
        setStart(new Date().getTime());
    });

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

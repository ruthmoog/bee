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
        localStorage.setItem("start", time);
    }

    function getStartTime() {
        return localStorage.getItem("start");
    }

    function setStop(time) {
        localStorage.setItem("stop", time);
    }

    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    let hide = "True";
    stopButton.hidden = hide;

    const castesOfBees = ['queen', 'worker', 'male', 'unknown'];
    const beeButtons = castesOfBees.map((caste) => (
        {button: document.getElementById(caste + 'Spotted'), caste})
    );
    const speciesSelection = document.getElementById("species");
    const clearButton = document.getElementById("clear");

    renderSummary();

    startButton.addEventListener("click", () => {
        setStart(getHourAndMinute());
        renderTime();
    });

    stopButton.addEventListener("click", () => {
        setStop(getHourAndMinute());
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

    function getHourAndMinute() {
        return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    }


    function renderTime() {
        const startTime = getStartTime();
        const stopButton = document.getElementById("stop");
        const startButton = document.getElementById("start");
        hide = !hide;
        stopButton.hidden = hide;
        startButton.outerText = startTime;
    }

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

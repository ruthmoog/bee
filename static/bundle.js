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

    function hourAndMinute() {
        return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    }

    function date() {
        return new Date().toLocaleDateString("en-GB");
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

    function setDate(day) {
        localStorage.setItem("date", day);
    }

    function setStop(time) {
        localStorage.setItem("stop", time);
    }

    function getStartTime() {
        return localStorage.getItem("start");
    }

    function getDate() {
        return localStorage.getItem("date");
    }

    function getEndTime() {
        return localStorage.getItem("stop");
    }

    function setStartDateTime() {
        setStart(hourAndMinute());
        setDate(date());
    }

    function setStopTime() {
        setStop(hourAndMinute());
    }

    async function setLocation(currentPosition) {
        localStorage.setItem("longitude", currentPosition.coords.longitude.toString());
        localStorage.setItem("latitude", currentPosition.coords.latitude.toString());

        const lat = currentPosition.coords.latitude.toString();
        const lon = currentPosition.coords.latitude.toString();
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,cloudcover,windspeed_10m&forecast_days=1`;


        let res = await fetch(url);
        let json = await res.json();
        return extractWeather(json, new Date());
    }

    function extractWeather(weatherResponse, currentDate) {
        const temperature = weatherResponse.hourly.temperature_2m[currentDate.getHours() - 1];

        return {
            temperature
        }
    }

    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    let dateTimeDisplay = document.getElementById("dateTime");
    stopButton.hidden = !getStartTime();
    const castesOfBees = ['queen', 'worker', 'male', 'unknown'];
    const beeButtons = castesOfBees.map((caste) => (
        {button: document.getElementById(caste + 'Spotted'), caste})
    );
    const speciesSelection = document.getElementById("species");
    const clearButton = document.getElementById("clear");

    renderSummary();
    renderMetaData();

    startButton.addEventListener("click", () => {
        startBeeWalk();
        renderMetaData();
    });

    stopButton.addEventListener("click", () => {
        stopBeeWalk();
        renderMetaData();
    });

    beeButtons.forEach(({button, caste}) => {
        button.addEventListener("click", () => {
            const section = document.querySelector('input[name="section"]:checked').value;
            addSighting(caste, speciesSelection.value, section);
            renderSummary();
        });
    });

    clearButton.addEventListener("click", () => {
        const warningClearStoredData = "Make sure you have saved or submitted your data before proceeding.\n\n" +
            "Delete forever?";
        if (confirm(warningClearStoredData)) {
            localStorage.clear();
            location.reload();
        }
    });

    function startBeeWalk() {
        function error() {
            //todo: what do we do if we cant get the position
            alert('this wont work');
        }

        setStartDateTime();

        navigator.geolocation.getCurrentPosition(async (location) => {
            const weather = await setLocation(location); //todo: maybe this should just return
            renderMetaData(weather);
        }, error);
    }

    function stopBeeWalk() {
        setStopTime();
        renderMetaData();
    }

    function renderMetaData(weather) {
        const startTime = getStartTime();
        const date = getDate();
        const endTime = getEndTime();

        if (startTime) {
            dateTimeDisplay.innerText = `Date: ${date}
BeeWalk started: ${startTime}
Temp (°C): ${weather?.temperature}`;
            startButton.hidden = true;
            stopButton.hidden = false;
        }

        if (endTime) {
            dateTimeDisplay.innerText = `Date: ${date}
BeeWalk started: ${startTime}
 ended: ${endTime}
 Temp (°C): ${weather?.temperature}`;
            stopButton.hidden = true;
        }
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

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
    const commentsStorageKey = "comments";
    let currentRow = new Map();

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

    function addComment(comment) {
        let storedComments = getComments();

        const species = currentRow.get("species");
        const section = currentRow.get("section");
        const comments = storedComments.filter(comment => comment.species !== species && comment.section !== section);

        comments.push({
            species,
            section,
            comment,
        });
        localStorage.setItem(commentsStorageKey, JSON.stringify(comments));
    }

    function getComments() {
        let comments = localStorage.getItem(commentsStorageKey);

        if (!comments) {
            return [];
        } else {
            return JSON.parse(comments);
        }
    }

    function getComment(species, section) {
        currentRow.set("species",species);
        currentRow.set("section",section);

        const allComments = getComments();
        const matchedComment = allComments.filter(comment => comment.species === species && comment.section === section).at(0);

        if (matchedComment) {
            return matchedComment.comment;
        } else {
            return [];
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

    const weatherStorageKey = "weather";

    function getWeather() {
        return JSON.parse(localStorage.getItem(weatherStorageKey))
    }

    function setWeather(weather) {
        localStorage.setItem(weatherStorageKey, JSON.stringify(weather));
    }

    function editWalkData() {
        const date = document.getElementById("dateDisplay").innerText;
        const startTime = document.getElementById("startTimeDisplay").innerText;
        const endTime = document.getElementById("endTimeDisplay").innerText;
        const temperature = document.getElementById("tempDisplay").innerText;
        const sunshine = document.getElementById("sunshineDisplay").innerText;
        const windSpeed = document.getElementById("windSpeedDisplay").innerText;

        setDate(date);
        setStart(startTime);
        setStop(endTime);
        setWeather({"temperature":temperature,"sunshine":sunshine,"windSpeed":windSpeed});
    }

    const unableToFetchWindSpeed = "Unable to fetch wind speed";
    const calm0 = "0 <dfn>Smoke rises vertically</dfn>";
    const lightAir1 = "1 <dfn>Slight smoke drift</dfn>";
    const lightBreeze2 = "2 <dfn>Wind felt on face, leaves rustle</dfn>";
    const gentleBreeze3 = "3 <dfn>Leaves and twigs in slight motion</dfn>";
    const moderateBreeze4 = "4 <dfn>Dust raised and small branches move</dfn>";
    const freshBreeze5 = "5 <dfn>Small trees in leaf begin to sway</dfn>";
    const strongBreeze6 = "6 <dfn>Large branches move and trees sway</dfn>";
    const highWind7toHurricaneForce12 = "⚠️ Avoid or abandon in bad weather";

    const sunny = "Sunny";
    const sunCloud = "Sun/Cloud";
    const cloudy = "Cloudy";
    const unableToFetchCloudCover = "Unable to fetch cloud cover";

    async function fetchWeather(currentPosition) {
        const lat = currentPosition.coords.latitude.toString();
        const lon = currentPosition.coords.latitude.toString();

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,cloudcover,windspeed_10m&forecast_days=1`;
        let res = await fetch(url);
        let json = await res.json();
        return extractWeather(json, new Date());

    }

    function extractWeather(weatherResponse, currentDate) {
        const index = currentDate.getHours() - 1;

        const temperature = weatherResponse.hourly.temperature_2m[index];
        const cloudCover = weatherResponse.hourly.cloudcover[index];
        const windSpeed = weatherResponse.hourly.windspeed_10m[index];

        let sunshine = determineSunshine(cloudCover);
        let beaufortScale = determineBeaufort(windSpeed);

        return {
            temperature,
            sunshine,
            windSpeed: beaufortScale,
        };
    }

    function determineSunshine(cloudCover) {
        let sunshine = unableToFetchCloudCover;

        if (cloudCover <= 10) {
            sunshine = sunny;
        }
        if (cloudCover > 10 && cloudCover <= 70) {
            sunshine = sunCloud;
        }
        if (cloudCover > 70) {
            sunshine = cloudy;
        }

        return sunshine;
    }

    function determineBeaufort(windSpeed) {
        let beaufortScale = unableToFetchWindSpeed;

        if (windSpeed < 2) {
            beaufortScale = calm0;
        }
        if (windSpeed >= 2 && windSpeed < 6) {
            beaufortScale = lightAir1;
        }
        if (windSpeed >= 6 && windSpeed < 12) {
            beaufortScale = lightBreeze2;
        }
        if (windSpeed >= 12 && windSpeed < 20) {
            beaufortScale = gentleBreeze3;
        }
        if (windSpeed >= 20 && windSpeed < 29) {
            beaufortScale = moderateBreeze4;
        }
        if (windSpeed >= 29 && windSpeed < 39) {
            beaufortScale = freshBreeze5;
        }
        if (windSpeed >= 39 && windSpeed <= 49) {
            beaufortScale = strongBreeze6;
        }
        if (windSpeed > 49) {
            beaufortScale = highWind7toHurricaneForce12;
        }

        return beaufortScale;
    }

    const castesOfBees = ['queen', 'worker', 'male', 'unknown'];

    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    const editButton = document.getElementById("edit");
    const saveButton = document.getElementById("save");

    const walkData = document.getElementById("walkData");
    const dateDisplay = document.getElementById("dateDisplay");
    const startTimeDisplay = document.getElementById("startTimeDisplay");
    const endTimeDisplay = document.getElementById("endTimeDisplay");
    const tempDisplay = document.getElementById("tempDisplay");
    const sunshineDisplay = document.getElementById("sunshineDisplay");
    const windSpeedDisplay = document.getElementById("windSpeedDisplay");
    const ended = document.getElementById("ended");

    const commentBox = document.getElementById("commentText");
    const commentSaveButton = document.getElementById("saveComment");
    const discardCommentButton = document.getElementById("discardComment");

    const speciesSelection = document.getElementById("species");
    const clearButton = document.getElementById("clear");

    const beeButtons = castesOfBees.map((caste) => (
        {button: document.getElementById(caste + 'Spotted'), caste})
    );

    stopButton.hidden = !getStartTime();
    editButton.hidden = !getStartTime();
    walkData.hidden   = !getStartTime();
    saveButton.hidden = true;
    commentBox.hidden = true;
    commentSaveButton.hidden = true;
    discardCommentButton.hidden = true;

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

    editButton.addEventListener("click", () => {
        makeMetaDataEditable(true);
    });

    saveButton.addEventListener("click", () => {
        editWalkData();
        makeMetaDataEditable(false);
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

    commentSaveButton.addEventListener("click", () => {
        addComment(document.getElementById("commentText").value);
        commentSaveButton.hidden = true;
        discardCommentButton.hidden = true;
        commentBox.hidden = true;
        renderSummary();
    });

    discardCommentButton.addEventListener("click", () => {
        commentBox.hidden = true;
        commentSaveButton.hidden = true;
        discardCommentButton.hidden = true;
    });

    function makeMetaDataEditable(isEditable) {
        dateDisplay.contentEditable = isEditable;
        startTimeDisplay.contentEditable = isEditable;
        endTimeDisplay.contentEditable = isEditable;
        tempDisplay.contentEditable = isEditable;
        windSpeedDisplay.contentEditable = isEditable;
        sunshineDisplay.contentEditable = isEditable;
        editButton.hidden = isEditable;
        saveButton.hidden = !isEditable;
    }

    function startBeeWalk() {
        walkData.hidden = false;
        function error() {
            //todo: what do we do if we cant get the position
            alert('this wont work');
        }

        setStartDateTime();

        navigator.geolocation.getCurrentPosition(async (location) => {
            const weather = await fetchWeather(location); //todo: maybe this should just return
            setWeather(weather);
            renderMetaData();
        }, error);
    }

    function stopBeeWalk() {
        setStopTime();
        renderMetaData();
    }

    function renderMetaData() {
        const startTime = getStartTime();
        const date = getDate();
        const endTime = getEndTime();
        const weather = getWeather();

        const pendingText = "<small>fetching...</small>";
        const temp = weather?.temperature ?? pendingText;
        const sunshine = weather?.sunshine ?? pendingText;
        const windSpeed = weather?.windSpeed ?? pendingText;

        dateDisplay.innerHTML = "";
        startTimeDisplay.innerHTML = "";
        endTimeDisplay.innerHTML = "";
        tempDisplay.innerHTML = "";
        sunshineDisplay.innerHTML = "";
        windSpeedDisplay.innerHTML = "";

        if (startTime) {
            ended.hidden = true;
            dateDisplay.innerHTML = `${date}`;
            startTimeDisplay.innerHTML = `${startTime}`;
            tempDisplay.innerHTML = `${temp}`;
            sunshineDisplay.innerHTML = `${sunshine}`;
            windSpeedDisplay.innerHTML = `${windSpeed}`;

            startButton.hidden = true;
            stopButton.hidden = false;
            editButton.hidden = false;
        }

        if (endTime) {
            ended.hidden = false;
            endTimeDisplay.innerHTML = `${endTime}`;
            stopButton.hidden = true;
            editButton.hidden = false;
        }
    }

    function renderSummary() {
        const sightings = getSightings();
        const comments = getComments();

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

                if (comments.filter(comments => comments.species === species && comments.section === section).at(0)) {
                    row.insertCell(6).innerHTML = '💬';
                } else {
                    row.insertCell(6).innerHTML = '';
                }

                row.onclick = () => {
                    commentBox.hidden = !commentBox.hidden;
                    commentBox.innerText = getComment(species, section);
                    commentSaveButton.hidden = !commentSaveButton.hidden;
                    discardCommentButton.hidden = !discardCommentButton.hidden;
                };
            }
        }
    }

})();

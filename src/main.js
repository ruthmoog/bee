import {createBeeSightingSummary} from "./beeSummary";
import {
    addSighting,
    getDate,
    getEndTime,
    getSightings,
    getStartTime,
    getWeather,
    setStartDateTime,
    setStopTime,
    setWeather,
    editWalkData,
} from "./localStorage";
import {fetchWeather} from "./weather.js";
import {castesOfBees} from "./bees.js";

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
const editButton = document.getElementById("edit")
const saveButton = document.getElementById("save")

const walkData = document.getElementById("walkData");
const dateDisplay = document.getElementById("dateDisplay");
const startTimeDisplay = document.getElementById("startTimeDisplay");
const endTimeDisplay = document.getElementById("endTimeDisplay");
const tempDisplay = document.getElementById("tempDisplay");
const sunshineDisplay = document.getElementById("sunshineDisplay");
const windSpeedDisplay = document.getElementById("windSpeedDisplay");
const ended = document.getElementById("ended");

const speciesSelection = document.getElementById("species");
const clearButton = document.getElementById("clear");

const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)

stopButton.hidden = !getStartTime();
editButton.hidden = !getStartTime();
saveButton.hidden = true;

renderSummary();
renderMetaData();

startButton.addEventListener("click", () => {
    startBeeWalk();
    renderMetaData();
})

stopButton.addEventListener("click", () => {
    stopBeeWalk();
    renderMetaData();
})

beeButtons.forEach(({button, caste}) => {
    button.addEventListener("click", () => {
        const section = document.querySelector('input[name="section"]:checked').value
        addSighting(caste, speciesSelection.value, section)
        renderSummary()
    })
})

editButton.addEventListener("click", () => {
    console.log("temp display editable?: " + tempDisplay.contentEditable)
    if (tempDisplay.contentEditable === "true") {
        dateDisplay.contentEditable = "false";
        startTimeDisplay.contentEditable = "false";
        endTimeDisplay.contentEditable = "false";
        tempDisplay.contentEditable = "false";
        windSpeedDisplay.contentEditable = "false";
        sunshineDisplay.contentEditable = "false";
        saveButton.hidden = true;
    } else {
        dateDisplay.contentEditable = "true";
        startTimeDisplay.contentEditable = "true";
        endTimeDisplay.contentEditable = "true";
        tempDisplay.contentEditable = "true";
        windSpeedDisplay.contentEditable = "true";
        sunshineDisplay.contentEditable = "true";
        saveButton.hidden = false;
    }
})

saveButton.addEventListener("click", () => {
    editWalkData();
})

clearButton.addEventListener("click", () => {
    const warningClearStoredData = "Make sure you have saved or submitted your data before proceeding.\n\n" +
        "Delete forever?";
    if (confirm(warningClearStoredData)) {
        localStorage.clear();
        location.reload();
    }
})

function startBeeWalk() {
    walkData.hidden = false;
    function error() {
        //todo: what do we do if we cant get the position
        alert('this wont work')
    }

    setStartDateTime();

    navigator.geolocation.getCurrentPosition(async (location) => {
        const weather = await fetchWeather(location) //todo: maybe this should just return
        setWeather(weather)
        renderMetaData()
    }, error)
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
    const temp = weather?.temperature ?? pendingText
    const sunshine = weather?.sunshine ?? pendingText
    const windSpeed = weather?.windSpeed ?? pendingText

    if (startTime){
        walkData.hidden = false;
    } else {
        walkData.hidden = true;
    }

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

    const beeSightingsSummary = createBeeSightingSummary(sightings);

    const observations = document.getElementById("observations")

    observations.innerHTML = "";

    for (const [section, sightings] of Object.entries(beeSightingsSummary)) {

        for (const [species, casteCounts] of Object.entries(sightings)) {

            const row = observations.insertRow(0);

            row.insertCell(0).innerHTML = species;
            row.insertCell(1).innerHTML = section;

            castesOfBees.forEach((caste, i) => {
                row.insertCell(i + 2).innerText = casteCounts[caste] ? casteCounts[caste] : "";
            })
        }
    }
}

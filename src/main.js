import {createBeeSightingSummary} from "./beeSummary";
import {addSighting, getSightings} from "./localStorage";
import {getDate, getEndTime, getStartTime, setStartDateTime, setStopTime} from "./timeAndDate.js";

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
let dateTimeDisplay = document.getElementById("dateTime")
let started = false;
let stopped = false;
stopButton.hidden = !started;

const castesOfBees = ['queen', 'worker', 'male', 'unknown']
const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)
const speciesSelection = document.getElementById("species");
const clearButton = document.getElementById("clear");

renderSummary();
renderTime();

startButton.addEventListener("click", () => {
    startBeeWalk();
    renderTime();
})

stopButton.addEventListener("click", () => {
    stopBeeWalk();
    renderTime();
})

beeButtons.forEach(({button, caste}) => {
    button.addEventListener("click", () => {
        const section = document.querySelector('input[name="section"]:checked').value
        addSighting(caste, speciesSelection.value, section)
        renderSummary()
    })
})

clearButton.addEventListener("click", () => {
    const warningClearStoredData = "Make sure you have saved or submitted your data before proceeding.\n\n" +
        "Delete forever?";
    if (confirm(warningClearStoredData) == true) {
        localStorage.clear();
        location.reload();
    }
})

function startBeeWalk() {
    started = true;
    setStartDateTime();
    renderTime();
}

function stopBeeWalk() {
    stopped = true;
    setStopTime();
    renderTime();
}

function renderTime() {
    const startTime = getStartTime();
    const date = getDate();

    if (started) {
        dateTimeDisplay.innerText = "Date: " + date + "\nBeeWalk started: " + startTime;
        startButton.hidden = started;
        stopButton.hidden = stopped;
    }

    if (stopped) {
        const endTime = getEndTime();
        dateTimeDisplay.innerText = "Date: " + date + "\nBeeWalk started: " + startTime + " ended: " + endTime;
        stopButton.hidden = stopped;
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

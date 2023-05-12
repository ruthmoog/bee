import {createBeeSightingSummary} from "./beeSummary";
import {
    addSighting,
    getDate,
    getEndTime,
    getSightings,
    getStartTime,
    setLocation,
    setStartDateTime,
    setStopTime
} from "./localStorage";

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
let dateTimeDisplay = document.getElementById("dateTime")
stopButton.hidden = !getStartTime();
const castesOfBees = ['queen', 'worker', 'male', 'unknown']
const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)
const speciesSelection = document.getElementById("species");
const clearButton = document.getElementById("clear");

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

clearButton.addEventListener("click", () => {
    const warningClearStoredData = "Make sure you have saved or submitted your data before proceeding.\n\n" +
        "Delete forever?";
    if (confirm(warningClearStoredData)) {
        localStorage.clear();
        location.reload();
    }
})

function startBeeWalk() {
    function error() {
        //todo: what do we do if we cant get the position
        alert('this wont work')
    }

    setStartDateTime();

    navigator.geolocation.getCurrentPosition(async (location) => {
        const weather = await setLocation(location) //todo: maybe this should just return
        renderMetaData(weather)
    }, error)
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

import {createBeeSightingSummary} from "./beeSummary";
import {addSighting, getSightings, setStart, setDate, setStop, getStartTime, getDate} from "./localStorage";

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
let hide = "True";
stopButton.hidden = hide;

const castesOfBees = ['queen', 'worker', 'male', 'unknown']
const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)
const speciesSelection = document.getElementById("species");
const clearButton = document.getElementById("clear");

renderSummary();

startButton.addEventListener("click", () => {
    setStart(getHourAndMinute());
    setDate(new Date().toLocaleDateString("en-GB"));
    renderTime();
})

stopButton.addEventListener("click", () => {
    setStop(getHourAndMinute());
})

beeButtons.forEach(({button, caste}) => {
    button.addEventListener("click", () => {
        const section = document.querySelector('input[name="section"]:checked').value
        addSighting(caste, speciesSelection.value, section)
        renderSummary()
    })
})

clearButton.addEventListener("click", () => {
    localStorage.clear();
    renderSummary();
})

function getHourAndMinute() {
    return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

function renderTime() {
    const startTime = getStartTime();
    const date = getDate();
    hide = !hide
    stopButton.hidden = hide
    startButton.outerText = "Date: " + date + "\nBeeWalk started: " + startTime
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

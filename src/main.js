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
    setWeather
} from "./localStorage";
import {fetchWeather} from "./weather.js";
import {castesOfBees} from "./bees.js";

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
const aboutWalkDisplay = document.getElementById("dateTime");
const speciesSelection = document.getElementById("species");
const clearButton = document.getElementById("clear");

const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)

stopButton.hidden = !getStartTime();
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

    const pendingText = "<marquee>fetching</marquee>";
    const temp = weather?.temperature ?? pendingText
    const sunshine = weather?.sunshine ?? pendingText
    const windSpeed = weather?.windSpeed ?? pendingText

    aboutWalkDisplay.innerHTML = "";
    let dateTimeText = `Date: ${date}<br />BeeWalk started: ${startTime}`;
    let weatherText =  `<br />Sunshine: ${sunshine}<br />Wind Speed: ${windSpeed}<br />Temp °C: ${temp}`;

    if (startTime) {
        aboutWalkDisplay.innerHTML = dateTimeText + weatherText;
        startButton.hidden = true;
        stopButton.hidden = false;
    }

    if (endTime) {
        aboutWalkDisplay.innerHTML = dateTimeText + ` ended: ${endTime} ` + weatherText;
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

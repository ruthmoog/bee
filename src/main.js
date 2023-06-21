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
    editWalkData, getComments, addComment, getComment,
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

const commentBox = document.getElementById("commentText");
const commentSaveButton = document.getElementById("saveComment");

const speciesSelection = document.getElementById("species");
const clearButton = document.getElementById("clear");

const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)

stopButton.hidden = !getStartTime();
editButton.hidden = !getStartTime();
walkData.hidden   = !getStartTime();
saveButton.hidden = true;
commentBox.hidden = true;
commentSaveButton.hidden = true;

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

editButton.addEventListener("click", () => {
    makeMetaDataEditable(true);
})

saveButton.addEventListener("click", () => {
    editWalkData();
    makeMetaDataEditable(false);
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

commentSaveButton.addEventListener("click", () => {
    addComment(); // section, species, comment
    console.log("click save");
    commentSaveButton.hidden = true;
    commentBox.hidden = true;
})

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

            if (comments.filter(comments => comments.species === species && comments.section === section).at(0)) {
                row.insertCell(6).innerHTML = '💬';
            } else {
                row.insertCell(6).innerHTML = '';
            }

            row.onclick = () => {
                //get the element id to work out the species and the section to pass to the save button
                commentBox.hidden = !commentBox.hidden;
                commentBox.innerText = getComment(species, section);
                commentSaveButton.hidden = !commentSaveButton.hidden;
            }
        }
    }
}

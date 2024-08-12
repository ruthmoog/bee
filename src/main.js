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
import {
    fetchWeather,
} from "./weather.js";
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
const windSpeedSelector = document.getElementById("windSelect");
const ended = document.getElementById("ended");

const commentBox = document.getElementById("commentText");
const commentSaveButton = document.getElementById("saveComment");
const discardCommentButton = document.getElementById("discardComment");

const transectToggleButton = document.getElementById("toggleTransect");
const coalDropsSections = document.getElementById("coalDropsYard");

const speciesSelection = document.getElementById("species");
const clearButton = document.getElementById("clear");

const beeButtons = castesOfBees.map((caste) => (
    {button: document.getElementById(caste + 'Spotted'), caste})
)

let currentRow = new Map;

stopButton.hidden = !getStartTime();
editButton.hidden = !getStartTime();
walkData.hidden   = !getStartTime();
windSpeedSelector.hidden = true;
saveButton.hidden = true;
commentBox.hidden = true;
commentSaveButton.hidden = true;
discardCommentButton.hidden = true;
coalDropsSections.hidden = true;

renderSummary();
renderMetaData();

transectToggleButton.addEventListener("click", () => {
    toggleTransect();
    renderMetaData();
})

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

commentSaveButton.addEventListener("click", () => {
    const species = currentRow.get("species");
    const section = currentRow.get("section");
    const comment = document.getElementById("commentText").value

    addComment(species, section, comment);

    commentSaveButton.hidden = true;
    discardCommentButton.hidden = true;
    commentBox.hidden = true;
    commentBox.innerText = getComment(species, section);

    renderSummary();
})

discardCommentButton.addEventListener("click", () => {
    commentBox.hidden = true;
    commentSaveButton.hidden = true;
    discardCommentButton.hidden = true;
    commentBox.innerText = getComment(currentRow.get("species"), currentRow.get("section"));
})

function makeMetaDataEditable(isEditable) {
    dateDisplay.contentEditable = isEditable;
    startTimeDisplay.contentEditable = isEditable;
    endTimeDisplay.contentEditable = isEditable;
    tempDisplay.contentEditable = isEditable;
    sunshineDisplay.contentEditable = isEditable;

    windSpeedSelector.selected = windSpeedDisplay.innerText;
    windSpeedDisplay.hidden = isEditable;
    windSpeedSelector.hidden = !isEditable;

    editButton.hidden = isEditable;
    saveButton.hidden = !isEditable;
}

function toggleTransect() {
        // show the relevant sections
        coalDropsSections.hidden = !coalDropsSections.hidden;

        // update label
        let labelText = transectToggleButton.innerText;
        labelText === "Castle Hill" ? labelText = "Coal Drops Yard" : labelText = "Castle Hill";
        transectToggleButton.innerText = labelText;
}

function startBeeWalk() {
    walkData.hidden = false;
    function error() {
        //todo: what do we do if we cant get the position
        alert('this wont work')
    }

    setStartDateTime();
    setTransect();

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

            if (comments.filter(comment => comment.species === species && comment.section === section && comment.comment !== "").at(0)) {
                row.insertCell(6).innerHTML = '💬';
            } else {
                row.insertCell(6).innerHTML = '';
            }

            row.onclick = () => {
                currentRow.set("species", species);
                currentRow.set("section", section);

                // commentBox.innerText = getComment(species, section);
                commentBox.value = getComment(species, section);
                commentBox.hidden = !commentBox.hidden;
                commentSaveButton.hidden = !commentSaveButton.hidden;
                discardCommentButton.hidden = !discardCommentButton.hidden;
            }
        }
    }
}

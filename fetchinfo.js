"use strict";

let unverifiedRuns = 0;
let unrecordedRaces = 0;

const updateHtmlHeader = async () => {
    await refreshSrc();
    await refreshRacetime();
    document.getElementById("header").innerHTML = buildSrcString() + buildRacetimeString();
};

function buildSrcString() {
    if (unverifiedRuns === 16) {
        return "";
    }

    return `<a href="https://www.speedrun.com/runsawaitingverification" target="blank"><span class="speedrundotcom headElement">${unverifiedRuns} unverified runs</span></a>`;
}

function buildRacetimeString() {

    if (unrecordedRaces === 0) {
        return "";
    }

    return `<a href="https://racetime.gg/oot" target="blank"><span class="racetime headElement">${unrecordedRaces} unrecorded races</span></a>`;
}

async function refreshSrc() {
    let response = await fetch("https://www.speedrun.com/api/v1/runs?status=new&game=76rkv4d8&max=100", { cache: "no-store" });
    let json = await response.json();
    unverifiedRuns = json.data.length;
    console.log(`${unverifiedRuns} unverified runs found`);
}

async function refreshRacetime() {

    let json = await (
        fetch("https://cors-anywhere.herokuapp.com/racetime.gg/oot/races/data", { cache: "no-store" })
            .then(r => r.json())
    );

    unrecordedRaces =
        json.races
            .filter(r => r.status.value === "finished")
            .filter(r => r.recordable)
            .filter(r => !r.recorded)
            .length;

    console.log(`${unrecordedRaces} unrecorded races found`);
}

updateHtmlHeader();
setInterval(updateHtmlHeader, 60000);
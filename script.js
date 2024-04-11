const dom = {
    startTimeLabelBtn: document.getElementById('startTimeLabelBtn'),
    endTimeLabelBtn: document.getElementById('endTimeLabelBtn'),
    resetTimeLabelBtn: document.getElementById('resetTimeLabelBtn'),
    classSelect: document.getElementById('classSelect'),
    startTimeLabelInput: document.getElementById('startTimeLabelInput'),
    endTimeLabelInput: document.getElementById('endTimeLabelInput'),
}

function formatTimeFromSecondsWithMilliseconds(secondsWithMilliseconds) {
    let milliseconds = Math.round(secondsWithMilliseconds * 1000);
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let millisecondsLeft = milliseconds % 1000;

    // 在個位數前面補0
    let formattedHours = hours < 10 ? '0' + hours : hours;
    let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    let formattedMilliseconds = ('00' + millisecondsLeft).slice(-3).slice(0, 2);

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function getVideoCurrentTime() {
    return document.getElementsByTagName('video')[0].currentTime
}

function addStartTimeLabel() {
    let currentTime = getVideoCurrentTime()
    dom.startTimeLabelInput.value = formatTimeFromSecondsWithMilliseconds(currentTime)
}

function addEndTimeLabel() {
    let currentTime = getVideoCurrentTime()
    dom.endTimeLabelInput.value = formatTimeFromSecondsWithMilliseconds(currentTime)
}

function resetTimeLabel() {
    dom.startTimeLabelInput.value = ''
    dom.endTimeLabelInput.value = ''
}

window.addEventListener('DOMContentLoaded', () => {
    dom.startTimeLabelBtn.addEventListener('click', addStartTimeLabel)
    dom.endTimeLabelBtn.addEventListener('click', addEndTimeLabel)
    dom.resetTimeLabelBtn.addEventListener('click', resetTimeLabel)
})
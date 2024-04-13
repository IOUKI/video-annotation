// 將秒(含毫秒)轉換成小時分鐘秒
export function formatTimeFromSecondsWithMilliseconds(secondsWithMilliseconds) {
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

export function formatTimeToSecond (time) {
    const array = time.split(':')
    const hour = parseInt(array[0])
    const min = parseInt(array[1])
    const sec = parseFloat(array[2])
    let totalSeconds = (hour * 60 * 60) + (min * 60) + sec
    return totalSeconds
}
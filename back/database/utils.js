const secondsToTime = (seconds) => {
    let h = Math.floor(seconds / 3600); 
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60; // секунды

    function pad(n) {
        return n.toString().padStart(2, '0');
    }

    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}


const timeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = (timeStr+'').split(':').map(Number);
    
    return hours * 3600 + minutes * 60 + seconds;
}

module.exports = {
    secondsToTime,
    timeToSeconds
};



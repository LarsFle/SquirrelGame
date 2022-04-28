

class EventLog {
    static #lastLog = null;
    constructor(message, color)
    {
        this.log(message, color);
    }

    static log(message, color)
    {
        let log = document.createElement("div");
        log.setAttribute("class", "eventLogEntry");
        log.style.background = color;
        log.innerHTML = message;
        document.getElementById("eventLog").insertBefore(log, document.getElementById("eventLog").childNodes[0]);
    }
}
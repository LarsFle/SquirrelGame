

class EventLog {
    static #eventDiv = document.getElementById("eventLog");
    static #lastLog = null;
    constructor(message, color)
    {
        EventLog.log(message, color);
    }

    static log(message, color)
    {
        let log = document.createElement("div");
        log.setAttribute("class", "eventLogEntry");
        log.style.background = color;
        log.innerHTML = message;
        EventLog.#lastLog = EventLog.#eventDiv.insertBefore(log, EventLog.#lastLog);
    }
}


class Translation {
    static #dictionary;
    static init(lang)
    {
        switch(lang)
        {
            case "en-EN":
                this.#dictionary = {
                    nut: " nut",
                    nuts: " nuts",
                    nest1: " has claimed a nest at position ",
                    nest2: " for himself",
                    title: "Battlesquirrels",
                    eat: " ate a nut",
                    timerWarning: "Warning, the round ends in one minute!",
                    starved: " starved to death. What a shame...",
                    timerEnd: "Times up!",
                    stored1: " stored ",
                    stored2: "",
                    uBlock: "The game cannot load with uBlock Origin enabled because it blocks the EventLog.js for some reason. i promise there aren't any ads on this page, so please just disable it until i found a fix for this",
                    nestFail: " tried to claim a nest, but it already had one",
                    fight1: " fought for some nuts. Everyone got ",
                    bonusNut: " Bonut",
                    bonusNuts: " Bonuts"
                }
                break;

            case "de-DE":
                this.#dictionary = {
                    nut: " Nuss",
                    nuts: " N&uuml;sse",
                    nest1: " hat das Nest an Position ",
                    nest2: " f&uuml;r sich beansprucht.",
                    title: "Kampfh&ouml;rnchen",
                    eat: " hat eine Nuss gegessen.",
                    timerWarning: "Die Eichh&ouml;rnchen haben noch eine Minute!",
                    starved: " ist verhungert. Jammerschade!",
                    timerEnd: "Die Zeit ist um!",
                    stored1: " hat ",
                    stored2: " verstaut.",
                    uBlock: "Dieses Spiel kann leider nicht korrekt laden, wenn uBlock Origin aktiv ist. Es blockiert warum auch immer die EventLog Klasse. Der Adblocker muss f&uuml;r diese Anwendung ausgeschalten werden. Es gibt keine Werbung oder Tracker auf dieser Seite",
                    nestFail: " hat versucht ein Nest zu beanspruchen, aber hatte bereits eins.",
                    fight1: " hat um N&uuml;sse gek&auml;mpft. Jeder hatte am Ende ",
                    bonusNut: " Bonuss)",
                    bonusNuts: " Bon&uuml;sse)"
                }
                break;
        }
    }

    static getTranslation(id) {return this.#dictionary[id];}
    
}
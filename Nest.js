

class Nest {
    #x;
    #y;
    #master;
    constructor(x,y,master)
    {
        if (master.nest != null)
        {
            EventLog.log(master.getName() + Translation.getTranslation('nestFail'), "#ff0000");
            this.#x = master.getNest().getX();
            this.#y = master.getNest().getY();
            this.#master = master;
        }
        else
        {
            EventLog.log(master.getName() + Translation.getTranslation('nest1') + "(" + x + "," + y + ")" + Translation.getTranslation('nest2'), "#ff00ff");
            this.#x = x;
            this.#y = y;
            this.#master = master;
        }
    }

    getX() {return this.#x;}
    getY() {return this.#y;}
    getMaster() {return this.#master;}
    
}
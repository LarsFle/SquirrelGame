

class Nest {
    #x;
    #y;
    #master;
    constructor(x,y,master)
    {
        if (master.nest != null)
        {
            EventLog.log(master.getName() + " hat versucht ein Nest zu erzeugen, obwohl es bereits eines hat!", "#ff0000");
            this.#x = master.getNest().getX();
            this.#y = master.getNest().getY();
            this.#master = master;
        }
        else
        {
            EventLog.log(master.getName() + " hat das Nest an Position (" + x + "," + y + ") für sich beansprucht", "#ff00ff");
            this.#x = x;
            this.#y = y;
            this.#master = master;
        }
    }

    getX() {return this.#x;}
    getY() {return this.#y;}
    getMaster() {return this.#master;}
    
}
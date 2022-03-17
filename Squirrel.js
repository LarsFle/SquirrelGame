

class Squirrel {
    #x;
    #y;
    #nuts;
    #view = [];
    #energy;
    #nest;
    #direction;
    #action;
    #score = 0;
    #speed = 20;
    #currentSpeedPoint = 0;
    nameplate;
    #name;
    #color;
    constructor(name = "Change me", color = "#000000")
    {
        this.#name = name;
        this.#color = color;
        this.#nuts = 0;
        let plate = document.createElement("div");
        plate.setAttribute("class", "playerNamePlate");
        plate.innerHTML = name;
        document.getElementById("buttonArea").appendChild(plate);
        this.nameplate = plate;
        
        this.#direction = "down";
        this.#action = "wait";
    }

    getX() { return this.#x;}
    getY() { return this.#y;}
    getEnergy() { return this.#energy;}
    getDirection() { return this.#direction;}
    getAction() { return this.#action;}
    
    getNuts() {return this.#nuts;}
    setNuts(nut) { this.#nuts = nut;}
    getName() {return this.#name;}
    getView() {return this.#view;}

    getColor() {return this.#color;}
    getNest() {return this.#nest;}
    getScore() {return this.#score;}
    setAction(action) { this.#action = action; }
    setDirection(direction) { this.#direction = direction; }
    setView(view) { this.#view = view;}
    claimANest(controller)
    {
        this.#nest = new Nest(controller.getNests().at(-1).x, controller.getNests().at(-1).y, this);
        controller.removeANest();
        this.#x = this.#nest.getX();
        this.#y = this.#nest.getY();
        this.#energy = controller.getMaxEnergy();
    }

    #move()
    {
        StaticControllerHelper.addToUpdateList(this.#x, this.#y);
        switch(this.#direction)
        {
            case "up":
                if (this.#y > 0)
                {
                    this.#y -= 1;
                }
                break;
            case "down":
                if (this.#y < StaticControllerHelper.getHeight()-1)
                {
                    this.#y += 1;
                }
                break;
            case "left":
                if (this.#x > 0)
                {
                    this.#x -= 1;
                }
                break;
            case "right":
                if (this.#x < StaticControllerHelper.getWidth()-1)
                {
                    this.#x += 1;
                }
                break;
        }
        return;
    }

    #challenge()
    {
        this.#nuts += StaticControllerHelper.challenge(this);
        return;
    }

    #store()
    {
        if (this.#x === this.#nest.x && this.#y === this.#nest.y && this.#nuts > 0)
        {
            this.#score += this.#nuts;
            EventLog.log(this.#name+" hat " + (this.#nuts + (this.#nuts === 1) ? " Nuss" : " Nüsse") + "eingelagert!", "#ffff00");
            this.#nuts = 0;
        }
        return;
    }

    #collect()
    {
        this.#nuts += StaticControllerHelper.collect(this);
        return;
    }

    #eat()
    {
        if (this.#nuts > 0)
        {
            this.#energy = StaticControllerHelper.getMaxEnergy();
            this.#nuts -= 1;
            EventLog.log(this.#name+" hat eine Nuss gegessen", "#f0f0f0");
        }
    }

    getCurrentSpeed()
    {
        return this.#speed*(Math.pow(1.1,this.#nuts))*StaticControllerHelper.getFieldSpeedModifier(this.#x,this.#y);
    }
    runLogicTick()
    {
        let ret = false;
        if (this.#energy <= 0)
        {
            return false;
        }
        this.#currentSpeedPoint++;
        if (this.#currentSpeedPoint >= this.getCurrentSpeed())
        {
            this.#energy--;
            switch(this.#action)
            {
                case "wait":
                    this.#energy++;
                    // Do Nothing, but refund the Energy lost;
                    break;
                
                case "move":
                    this.#move();
                    break;
                
                case "challenge":
                    this.#challenge();
                    break;

                case "store":
                    this.#store();
                    break;

                case "collect":
                    this.#collect();
                    break;

                case "eat":
                    this.#eat();
                    break;
            }
            this.#currentSpeedPoint = 0;
            this.#view = StaticControllerHelper.getViewForSquirrel(this);
            ret = true;
        }
        if (this.#energy <= 0)
        {
            EventLog.log(this.#name+" ist verhungert. Jammerschade...", "#ff0000");
            this.#color = "#666666";
        }
        return ret;
    }
}


class StaticControllerHelper {
    static #controller;
    static initiate(controller)
    {
        this.#controller = controller;
    }
    
    static getRemainingTime()
    {
        return this.#controller.getRemainingTime();
    }

    static getFieldSpeedModifier(x,y)
    {
        return this.#controller.getFieldSpeedModifier(x,y);
    }

    static getMaxEnergy()
    {
        return this.#controller.getMaxEnergy();
    }

    static collect(c)
    {
        return this.#controller.collect(c);
    }

    static challenge(c)
    {
        return this.#controller.challenge(c);
    }

    static addToUpdateList(x,y)
    {
        return this.#controller.addToUpdateList(x,y);
    }

    static startGameLoop()
    {
        return this.#controller.startGameLoop();
    }

    static stopGameLoop()
    {
        return this.#controller.stopGameLoop();
    }
    
    static step()
    {
        return this.#controller.step();
    }

    static runLogicTick(start = 0)
    {
        return this.#controller.runLogicTick(start);
    }

    static getViewForSquirrel(squirrel)
    {
        let squirrels = this.#controller.getSquirrels();
        let view = this.#controller.getViewForSquirrel(squirrel, squirrels);
        return view;
    }

    static getWidth() { return this.#controller.getWidth();}
    static getHeight() { return this.#controller.getHeight();}
}
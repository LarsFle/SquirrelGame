class SquirrelController_LAF extends Squirrel {

    #mode = "scouting";
    #view;
    #gameSize;
    #goal_x;
    #goal_y;
    #cx;
    #cy;
    constructor ()
    {
        super("LAF", "#ffffff");
    }

    run(time = 0)
    {
        console.log("LAF is thinking");
        this.#view = this.getView();
        this.#cx = this.getX();
        this.#cy = this.getY();
        switch (this.#mode)
        {
            case "scouting":
                this.#scoutingAI();
                break;
        }
        console.log("LAF was thinking for: ", Date.now()-time);
    }

    #scoutingAI()
    {
        this.#gameSize = {x: StaticControllerHelper.getWidth(), y: StaticControllerHelper.getHeight()};
        let cx = this.#cx;
        let cy = this.#cy;
        let goal_x;
        let goal_y;
        if (this.#goal_x == null || (this.#goal_x === cx && this.#goal_y === cy))
        {
            goal_x = Random.r(this.#gameSize.x);
            goal_y = Random.r(this.#gameSize.y);
            this.#goal_x = goal_x;
            this.#goal_y = goal_y;
        }
        else
        {
            goal_x = this.#goal_x;
            goal_y = this.#goal_y;
        }
        let curRelPos_x = this.#cx / this.#gameSize.x ;
        let curRelPos_y = this.#cy / this.#gameSize.y ;
        if (cx < goal_x)
        {
            this.setDirection("right");
            this.setAction("move");
        }
        else if (cx > goal_x)
        {
            this.setDirection("left");
            this.setAction("move");
        }
        else if (cy < goal_y)
        {
            this.setDirection("down");
            this.setAction("move");
        }
        else 
        {
            this.setDirection("up");
            this.setAction("move");
        }
        
    }

}
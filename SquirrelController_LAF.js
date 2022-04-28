class SquirrelController_LAF extends Squirrel {

    #mode = "scouting";
    #view;
    #gameSize;
    #goal_x;
    #goal_y;
    #fightCD = 15;
    #cx;
    #cy;
    #oldnut=0;
    #currentNut=0;
    #fightCooldown=0;
    constructor (name)
    {
        super(name, "#ffffff");
        
    }

    run(time = 0)
    {
        this.#gameSize = {x: StaticControllerHelper.getWidth(), y: StaticControllerHelper.getHeight()};
        this.#view = this.getView();
        this.#cx = this.getX();
        this.#cy = this.getY();
        let r = this.getViewDistance();
        this.#fightCooldown++;
        if (this.#cx == this.#goal_x && this.#cy == this.#goal_y)
        {
           this.#mode = "scouting";
        }
        if (this.getNuts() > 8)
        {
            this.#mode = "returnToNest";
            this.#goal_x = this.getNest().getX();
            this.#goal_y = this.getNest().getY();
        }
        if (this.getNuts() > 0 && this.#cx == this.getNest().getX() && this.#cy == this.getNest().getY())
        {
            this.#mode = "storeNuts";
        }
        if (this.getLastActionPerformed() == "challenge")
        {
            this.#fightCooldown = 0;
            this.#mode = "scouting";
        }
        if (this.getNuts() <= 1 && this.#fightCooldown >= this.#fightCD && this.#cx > 1 && this.#cx < this.#gameSize.x -1 && this.#cy > 1 && this.#cy < this.#gameSize.y -1)
        {
            if (this.#view[r-1][r-1] == "isSquirrel" ||
                this.#view[r-1][r] == "isSquirrel" ||
                this.#view[r-1][r+1] == "isSquirrel" ||
                this.#view[r][r-1] == "isSquirrel" ||
                this.#view[r][r+1] == "isSquirrel" ||
                this.#view[r+1][r-1] == "isSquirrel" ||
                this.#view[r+1][r] == "isSquirrel" ||
                this.#view[r+1][r+1] == "isSquirrel"
            )
            {
                this.#mode = "fight";
            }
        }
        if (SquirrelbotDebugging)
        {
            console.log("LAF is thinking");
        }
        switch (this.#mode)
        {
            case "scouting":
                this.#scoutingAI();
                this.#moveToGoal();
                break;
            
            case "goingToNut":
                this.#moveToGoal();
                break;
            
            case "returnToNest":
                this.#moveToGoal();
                break;

            case "storeNuts":
                this.setAction("store");
                break;

            case "fight":
                this.setAction("challenge");
                if (this.#fightCooldown <= 0)
                {
                    this.#mode = "scouting";
                }
                break;

        }
        this.#tryCollectNut();
        if (SquirrelbotDebugging)
        {
            console.log("LAF was thinking for: ", Date.now()-time);
        }
        this.#oldnut = this.getNuts();
    }

    #tryCollectNut()
    {
        if (this.getCurrentField() == "isNut")
        {
            this.setAction("collect");
        }
    }

    #scoutingAI()
    {
        this.#view.forEach((row, y) => {
            row.forEach((pos, x) => {
                if(pos === "isNut")
                {
                    console.log("LAF sees Nut");
                    this.#goal_x = this.#cx-this.getViewDistance()+x;
                    this.#goal_y = this.#cy-this.getViewDistance()+y;
                    this.#mode = "goingToNut";
                    return;
                }
            });
        });
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
        return;
    }

    #moveToGoal()
    {
        let cx = this.#cx;
        let cy = this.#cy;
        let goal_x = this.#goal_x;
        let goal_y = this.#goal_y;
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
        return;
    }
}
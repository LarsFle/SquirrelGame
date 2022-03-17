

class GameController {
    #width;
    #height;
    #toUpdate = [];
    #world;
    #squirrels = [];
    #worldOrigin;
    #viewDistance;
    #nests;
    #gameSpeed;
    #maxEnergy;
    #gameLoop;
    #gameTime;
    #timer;
    #scoreBoard = document.getElementById("scoreBoard");
    #running = false;
    constructor(squirrels, fps = 60, maxEnergy = 250, viewDistance = 10, gameTime = 60*5)
    {
        //this.#width = width;
        //this.#height = height;
        this.#gameSpeed = 1000/fps;
        this.#maxEnergy = maxEnergy;
        this.#viewDistance = viewDistance;
        this.#world = new World();
        this.#nests = this.#world.getNests();
        this.#squirrels = squirrels;
        for (var squirrel of this.#squirrels)
        {
            squirrel.claimANest(this);
        }
        this.#gameTime = gameTime;
        this.#timer = setInterval(function(that) {
            that.#timerTick();
        }, 1000, this);
        this.updateScoreBoard();
    }

    getNests(){ return this.#nests;}
    getToUpdate() {return this.#toUpdate;}
    getWidth() { return this.#world.getWidth();}
    getHeight() { return this.#world.getHeight();}
    getSquirrels() {return this.#squirrels;}
    
    getRemainingTime()
    {
        return this.#gameTime;
    }

    #timerTick()
    {
        if (this.#gameTime <= 0)
        {
            clearInterval(this.#gameLoop);
            clearInterval(this.#timer);
            EventLog.log("Die Zeit ist um.", "#ff0000");
        }
        if (this.#gameTime === 60)
        {
            EventLog.log("Die Eichhörnchen haben noch eine Minute!.", "#ff0000");
        }
        if (this.#running)
        {
            this.#gameTime--;
            this.updateScoreBoard();
        }
    }

    updateScoreBoard()
    {
        let timer = document.createElement("div");
        timer.setAttribute("class", "gameTimer");
        if (this.#gameTime > 0)
        {
            timer.innerHTML = (Math.floor(this.#gameTime/60) < 10 ? "0": "")+Math.floor(this.#gameTime/60)+":"+(this.#gameTime%60 < 10 ? "0": "")+this.#gameTime%60;
        }
        else
        {
            timer.innerHTML = "<span style='color:#ff00000'>00:00</span>";
        }
        let scoreboard = document.createElement("div");
        scoreboard.setAttribute("class", "scoreBoardList");
        for (var squirrel of this.#squirrels)
        {
            let scoreEntry = document.createElement("div");
            let scoreName = document.createElement("span");
            scoreName.setAttribute("class", "scoreName");
            scoreName.innerHTML = squirrel.getName();
            let score = document.createElement("span");
            score.setAttribute("class", "scorePoints");
            score.innerHTML = squirrel.getScore();
            scoreEntry.appendChild(scoreName);
            scoreEntry.appendChild(score);
            scoreboard.appendChild(scoreEntry);
        }
        this.#scoreBoard.innerHTML = "";
        this.#scoreBoard.appendChild(timer);
        this.#scoreBoard.appendChild(scoreboard);
    }

    getMaxEnergy()
    {
        return this.#maxEnergy;
    }

    removeANest()
    {
        this.#nests.pop();
    }
    getFieldSpeedModifier(x,y)
    {
        return this.#world.getFieldSpeedModifier(x,y);
    }

    addToUpdateList(x,y)
    {
        this.#toUpdate.push({"x":x,"y":y});
    }

    getFieldClass(x,y)
    {
        return this.#world.getFieldClass(x,y);
    }

    collect(squirrel)
    {
        if (this.getFieldClass(squirrel.getX(),squirrel.getY()) === "isNut")
        {
            this.#world.collectNut(squirrel.getX(),squirrel.getY());
            return 1; 
        }
        return 0;
    }

    challenge(squirrel1)
    {
        let nutGain = 0;
        let totalNuts = 0;
        let listOfSquirrels = [];
        let highestNutYet = 0;
        let highestNutYetSquirrel;
        let bonusNut = 0;
        this.#squirrels.forEach(squirrel2 => function (){
            if (squirrel1.getX() >= squirrel2.getX()-1 &&
                squirrel1.getX() <= squirrel2.getX()+1 &&
                squirrel1.getY() >= squirrel2.getY()-1 &&
                squirrel1.getY() <= squirrel2.getY()+1 
                )
            {
                totalNuts += squirrel2.getNuts();
                listOfSquirrels.push(squirrel2);
                if (squirrel2.getNuts() > highestNutYet)
                {
                    highestNutYet = squirrel2.getNuts();
                    highestNutYetSquirrel = squirrel2;
                }
            }
        });
        bonusNut = totalNuts % listOfSquirrels.length;
        nutGain = (totalNuts-bonusNut) / listOfSquirrels.length;
        listOfSquirrels.forEach(squirrel => function (){
            let newNuts = nutGain;
            if (bonusNut !== 0 && highestNutYetSquirrel == squirrel)
            {
                newNuts += bonusNut;
            }
            squirrel.setNuts(newNuts);
        });
        EventLog.log(squirrel1.getName()+" hat um Nüsse gekämpft. Jeder kehrt mit " + 
                                            (nutGain + (nutGain === 1) ? " Nuss" : " Nüssen") + "zurück! " + 
                                            (bonusNut > 0 ? "( + " + (bonusNut + (bonusNut === 1) ? " Bonuss" : " Bonüsse") : ""),
                     "#333333");

    }

    getViewForSquirrel(squirrel, squirrels)
    {
        return this.#world.getViewForSquirrel(squirrel, squirrels, this.#viewDistance);
    }


    startGameLoop()
    {
        console.log("Game Loop is running...");
        clearInterval(this.#gameLoop);
        let startTime = Date.now();
        this.#gameLoop = setInterval(function() {
            console.log("ms since last loop: ",Date.now()-startTime);
            startTime = Date.now();
            StaticControllerHelper.runLogicTick(startTime);
        }, this.#gameSpeed);
        this.#running = true;
    }

    stopGameLoop()
    {
        console.log("Game Loop stopped...");
        clearInterval(this.#gameLoop);
        this.#running = false;
    }
    
    step()
    {
        console.log("doing one frame");
        this.runLogicTick();
    }

    runLogicTick(start = 0)
    {
        for (var squirrel of this.#squirrels)
        {
                if (squirrel.runLogicTick())
                {
                    squirrel.run(start);
                }
        }
        this.#world.runLogicTick(this, start);
        let time2 = Date.now()-start;
        console.log("GameController.runLogicTick() took ", time2, " ms");
        console.log("gameSpeed: ", this.#gameSpeed);
    }
}


class GameController {
    #width;
    #height;
    #toUpdate = [];
    #world;
    #squirrels = [];
    #squirrelData = [];
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
            this.#squirrelData[squirrel.getName()] = {score: 0, nuts: 0, instance: squirrel, status:"alive"};
        }
        this.#gameTime = gameTime;
        this.#timer = setInterval(function(that) {
            that.#timerTick();
        }, 1000, this);
        this.updateScoreBoard();
    }

    getNests(){ return this.#nests;}
    getToUpdate() {return this.#toUpdate;}
    resetToUpdate() {this.#toUpdate = [];}
    getWidth() { return this.#world.getWidth();}
    getHeight() { return this.#world.getHeight();}
    getSquirrels() {return this.#squirrels;}
    getViewDistance() {return this.#viewDistance;}

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
            EventLog.log(Translation.getTranslation('timerEnd'), "#ff0000");
        }
        if (this.#gameTime === 60)
        {
            EventLog.log(Translation.getTranslation('timerWarning'), "#ff0000");
        }
        if (this.#running)
        {
            this.#gameTime--;
            this.updateScoreBoard();
        }
    }
    getNutsOfSquirrel(squirrel)
    {
        return this.#squirrelData[squirrel.getName()].nuts;
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
        let scoreboard = document.createElement("table");
        scoreboard.setAttribute("class", "scoreBoardList");
        let highestScore = 0;
        for (var squirrel in this.#squirrelData)
        {
            if (this.#squirrelData[squirrel].score > highestScore)
            {
                  highestScore = this.#squirrelData[squirrel].score; 
            }
        }
        let sq = [];
        let sqd = Object.entries(this.#squirrelData);
        sqd.sort((a,b) => { return b[1].score - a[1].score});
        sqd.forEach((x) => {
            sq[x[0]] = x[1];
        })
        for (var squirrel in sq)
        {
            let scoreEntry = document.createElement("tr");
            let scoreName = document.createElement("td");
            scoreName.setAttribute("class", "scoreName");
            scoreName.innerHTML = this.#squirrelData[squirrel].instance.getName();
            let score = document.createElement("td");
            if (this.#squirrelData[squirrel].score === highestScore && highestScore > 0)
            {
                score.setAttribute("class", "scorePoints highScore"); 
                scoreName.setAttribute("class", "scoreName highScore");
            }
            else
            {
                score.setAttribute("class", "scorePoints");
                scoreName.setAttribute("class", "scoreName");
            }
            if (this.#squirrelData[squirrel].status === "dead")
            {
                score.setAttribute("class", "scorePoints deadScore"); 
                scoreName.setAttribute("class", "scoreName deadScore");
            }
            score.innerHTML = this.#squirrelData[squirrel].score;
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
    getFieldSpeedModifier(x,y,c)
    {
        return this.#world.getFieldSpeedModifier(x,y)*(Math.pow(1.1,this.#squirrelData[c.getName()].nuts));
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
            this.#squirrelData[squirrel.getName()].nuts += 1;
            this.#squirrelData[squirrel.getName()].instance.resetCurrentSpeedPoint();
            return 1; 
        }
        return 0;
    }

    store(squirrel)
    {
        let nest = squirrel.getNest();
        let x = squirrel.getX();
        let y = squirrel.getY();
        let nuts = this.#squirrelData[squirrel.getName()].nuts;
        if (x === nest.getX() && y === nest.getY() && nuts > 0)
        {
            this.#squirrelData[squirrel.getName()].score += nuts;
            EventLog.log(squirrel.getName()+Translation.getTranslation('stored1') + nuts + ((nuts === 1) ? Translation.getTranslation('nut') : Translation.getTranslation('nuts')) + Translation.getTranslation('stored2'), "#ffff00");
            this.#squirrelData[squirrel.getName()].nuts = 0;
            this.#squirrelData[squirrel.getName()].instance.resetCurrentSpeedPoint();
        }
        return;
    }

    challenge(squirrel1)
    {
        let nutGain = 0;
        let totalNuts = 0;
        let listOfSquirrels = [];
        let highestNutYet = 0;
        let highestNutYetSquirrel;
        let bonusNut = 0;
        let sqd = this.#squirrelData;
        let challengerNut = 0;
        for(var squirrel2 in sqd)
        {
            if (squirrel1.getX() >= this.#squirrelData[squirrel2].instance.getX()-1 &&
            squirrel1.getX() <= this.#squirrelData[squirrel2].instance.getX()+1 &&
            squirrel1.getY() >= this.#squirrelData[squirrel2].instance.getY()-1 &&
            squirrel1.getY() <= this.#squirrelData[squirrel2].instance.getY()+1 
            )
            {
                totalNuts += this.#squirrelData[squirrel2].nuts;
                listOfSquirrels.push(squirrel2);
                if (this.#squirrelData[squirrel2].nuts > highestNutYet)
                {
                    highestNutYet = this.#squirrelData[squirrel2].nuts;
                    highestNutYetSquirrel = this.#squirrelData[squirrel2];
                }
            }
        }
        bonusNut = totalNuts % listOfSquirrels.length;
        nutGain = (totalNuts-bonusNut) / listOfSquirrels.length;
        for(var squirrel of listOfSquirrels)
        {
            let newNuts = nutGain;
            if (bonusNut !== 0 && highestNutYetSquirrel == squirrel)
            {
                newNuts += bonusNut;
            }
            this.#squirrelData[squirrel].nuts = newNuts;
            this.#squirrelData[squirrel].instance.setNuts(newNuts);
            if (squirrel === squirrel1.getName())
            {
                challengerNut = newNuts;
            }
        }
        EventLog.log(squirrel1.getName()+Translation.getTranslation('fight1') + 
                                            nutGain + ((nutGain === 1) ? Translation.getTranslation('nut') : Translation.getTranslation('nuts')) + 
                                            ((bonusNut > 0) ? (" (+" + bonusNut + ((bonusNut === 1) ? Translation.getTranslation('bonusNut') : Translation.getTranslation('bonusNuts'))) : ""),
                     "#333333");
        
        squirrel1.resetCurrentSpeedPoint();
        return challengerNut;
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
            if (timeDebugging)
            {
                console.log("ms since last loop: ",Date.now()-startTime);
            }
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
                let ret = squirrel.runLogicTick();
                if (ret)
                {
                    if(ret == "dead")
                    {
                        this.#squirrelData[squirrel.getName()].status = "dead";
                    }
                    squirrel.run(start);
                }
        }
        this.#world.runLogicTick(this, start);
        let time2 = Date.now()-start;
        if (timeDebugging)
        {
            console.log("GameController.runLogicTick() took ", time2, " ms");
            console.log("gameSpeed: ", this.#gameSpeed);
        }
    }
}
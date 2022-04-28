

class World {
    #width;
    #height;
    #cellArray;
    #cellArrayOrigin;
    #nutChance = 2500;
    #nutRange = 5;
    #nests = [];
    #trees = [];
    constructor(source)
    {
        //let img = //new Image();//document.getElementById("sourceImage");
        let img = document.getElementById("sourceImage");
        //img.src = source;
        let canvas = document.getElementById("canvas");
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        this.#width = img.width;
        this.#height = img.height;
        canvas.height = height;
        canvas.width = width;
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        let playTable = document.getElementById("playTable");
        playTable.innerHTML = "";
        playTable.width = img.width*5;
        playTable.height = img.height*5;
        
        this.#cellArray = new Array(height);
        this.#cellArrayOrigin = new Array(height);
        
        for (var i = 0; i < this.#cellArray.length; i++) 
        {
            this.#cellArray[i] = new Array();
            this.#cellArrayOrigin[i] = new Array();
            
        }
        for(var y=0; y < height ; y++)
        {
            let newTr = document.createElement("tr");
            newTr.setAttribute('class',"playTableRow");
            for (var x=0; x < width ; x++)
            {
                let newTd = document.createElement("td");
                let newClass = this.#getClassFromPixelData(canvas.getContext("2d").getImageData(x,y,1,1).data);
                newTd.setAttribute('class', newClass);
                if (newClass === "isNest")
                {
                    this.#nests.push({"x":x, "y":y});
                }
                if (newClass === "isTree")
                {
                    this.#trees.push({"x":x, "y":y});
                }
                this.#cellArray[y].push(newTd);
                this.#cellArrayOrigin[y].push(newClass);
                
                newTr.appendChild(newTd);
            }
            playTable.appendChild(newTr);
        }
        //this.#cellArrayOrigin = this.#cellArray;
    }
    getWidth() { return this.#width;}
    getHeight() { return this.#height;}

    getNests() {return this.#nests;}
    #getClassFromPixelData(data)
    {
        let string = data[0] + "-" + data[1] + "-" + data[2];
        switch (string)
        {
            case "148-189-94":
                return "isGrass";
            case "0-255-0":
            case "1-255-0":
                return "isTree";
            case "128-76-25":
                return "isBush";
            case "0-255-255":
            case "1-255-255":
                return "isWater";
            case "255-51-102":
                return "isNest";  
            default:
                return "isGrass";                                                            
        }
    }

    getFieldClass(x,y)
    {
        return this.#cellArray[y][x].className;
    }

    collectNut(x,y)
    {
        this.#cellArray[y][x].className = this.#cellArrayOrigin[y][x];
    }

    getFieldSpeedModifier(x,y)
    {
        switch(this.#cellArray[y][x].className)
        {
            case "isBush":
                return 2;
            case "isWater":
                return 3;
            default:
                return 1;
        }
        return 1;
    }
    
    getViewForSquirrel(squirrel, squirrels, range)
    {
        let sx = squirrel.getX();
        let sy = squirrel.getY();
        let view = [];
        for (var y = sy-range; y <= sy+range; y++)
        {
            let view_x = [];
            for (var x = sx-range; x <= sx+range; x++)
            {
                if (y >= 0 && y < this.#height && x >= 0 && x < this.#width)
                {
                    var check = true;
                    for (var sq of squirrels)
                    {
                        if (sq.getX() === x && sq.getY() === y)
                        {
                            check = false;
                            view_x.push("isSquirrel");
                            continue;
                        }
                    }
                    if (check)
                    {
                        view_x.push(this.#cellArray[y][x].className);
                    }
                }
                else
                {
                    view_x.push("isVoid");
                }
            }
            view.push(view_x);  
        }
        return view;
    }

    runLogicTick(controller, time)
    {
        let time1 = Date.now()-time;
        for (var cell of controller.getToUpdate())
        {
            this.#cellArray[cell.y][cell.x].removeAttribute("style");
            this.#cellArray[cell.y][cell.x].className = this.#cellArrayOrigin[cell.y][cell.x];
        }
        controller.resetToUpdate();
        let time2 = Date.now()-time;
        for (var squirrel of controller.getSquirrels())
        {
            let cx = squirrel.getX();
            let cy = squirrel.getY();
            this.#cellArray[cy][cx].setAttribute("style", "background:"+squirrel.getColor());
            let newx = this.#cellArray[cy][cx].getBoundingClientRect().left// + window.scrollX
            let newy = this.#cellArray[cy][cx].getBoundingClientRect().top// + window.scrollY
            squirrel.nameplate.style.top = newy-15+"px";
            squirrel.nameplate.style.left = newx+5+"px";
            squirrel.nameplate.style.display = "block";
            
        }
        let time3 = Date.now()-time;
        for (var tree of this.#trees)
        {
            if (Random.r(this.#nutChance) === 0)
            {
                let rx = Random.r(this.#nutRange);
                let ry = Random.r(this.#nutRange);
                let halfNutRange = Math.floor(this.#nutRange/2);
                let newx = tree.x-halfNutRange+rx;
                let newy = tree.y-halfNutRange+ry;
                if (newx >= 0 && newx < this.#width && newy >= 0 && newy < this.#height)
                {
                    this.#cellArray[newy][newx].className = "isNut";
                }
                else
                {
                    //console.log("A Tree tried to nut beyond the edge of the world, what a madlad");
                }
            }
        }
        let time4 = Date.now()-time;
        //console.log(time1, time2, time3, time4);
    }
}
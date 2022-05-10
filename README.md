# SquirrelGame
Pure Javascript Implementation of a Squirrel Survival Game

# What is this project about?

Goal of the Game is to implement a Squirrel AI that will traverse the World and collect nuts more efficently than any other Squirrel on the Map.

- Every Squirrel spawns in one of the Nests (Purple spots) around the Map and will have to drop its collected nuts into it in order to gain Points.

- A Squirrel can challenge another Squirrel to normalize the nuts between the two of them if they are right next to each other (will work with more than two Squirrels as well. any leftover nuts will go to the defender)

- One Game will last for predetermined amount of time and will immediately end once the timer reaches zero.

- A Squirrel has a certain energy value that it occassionally needs to refill by eating one of its nuts it is currently carrying.

- The more nuts a Squirrel is carrying, the slower it gets.

- (@todo) the longer the run() method of the Squirrel takes, the more it will consume per step (based on recent average time)

# How to make a Bot

- Each bot requires a constructor that calls super([Name of the player], [color of the Squirrel on the Map in Hex])
- Each bot requires a run method that will be called every frame.
- during that run method, the Squirrel should determine its next action and, if needed, direction. 
### Actions
Action and direction can be set with the following methods (this can be done multiple times per run(), but will just override the old action)
  - this.setDirection(["right", "down", "left", "up"]);
  - this.setAction(["move", "challenge", "store", "collect", "eat", "wait"]);
### Orientation
to help with orientation, the following methods allow to get infos about your surroundings:
  - this.getView() ->  returns an array with all pixels a radius around you (best to check it out by debugging, hard to explain)
  - getViewDistance() -> returns the viewDistance set in the Worldcontroller
  - this.getX() -> get your x position in the world
  - this.getY() -> get your y position in the world
### General
to help with decisionmaking, the following supportive methods exist:
  - getEnergy() -> returns your current Energy
  - getDirection() -> returns your currently planned direction
  - getAction() -> returns your currently planned action
  - getNuts() -> returns your current amount of nuts carried
  - getName() -> returns your name
  - getColor() -> returns your color
  - getNest() -> returns the coordinates of your nest
  - getScore() -> returns the amount of nuts you successfully secured
  - getCurrentSpeed() -> returns the current amount frames you will have to wait before being able to move again
  - getLastActionPerformed() -> returns the last Action that was actually performed by your squirrel
  - getCurrentField() -> returns the class of the field your squirrel is currently standing on
    
### The Forbidden Methods
the following methods exists, but are highly forbidden to use (based on honor rules, it's basically cheating). By the nature of javascript, i have not been able to hide them from the bot yet
  - runLogicTick() -> runs whatever is currently set as the next action and direction, basically skipping the waiting time based on nuts and ground

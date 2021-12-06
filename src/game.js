import Grid from "./grid.js";
import Timer from "./timer.js";

const LEVEL_UP_MESSAGES = ["Well done!", "Nice going!", "America's Next Pop Model!", "You're a pop star!", "Way to go!", "Pop-notch work!", "You're on top of the pop!", "Pop off sis!"]

class Game {
    constructor() {
        this.gridObj = new Grid ();
        this.score = 0;
        this.baseKernelsRemaining = 3; // change to 7 or 8 after development
        this.kernelsRemaining = this.baseKernelsRemaining;
        
        this.level = 1;
        this.timer = new Timer (this.outOfTime.bind(this));
    }

    start () {
        this.timer.start();
    }

    outOfTime () {
        if (this.kernelsRemaining > 0) {
            this.gameOverMessage();
            return;
        }
    }

    gameOverMessage() {
        document.getElementById("final-score").innerHTML = `Final score: ${this.score} points`;
        document.getElementById("lose-modal").classList.remove("hidden");
    }

    levelUpMessage() {
        this.timer.stop();
        document.getElementById("level-up-message").innerHTML = LEVEL_UP_MESSAGES[Math.floor(Math.random() * LEVEL_UP_MESSAGES.length)];
        document.getElementById("level-up-score").innerHTML = `Current score: ${this.score} points`;
        document.getElementById("level-passed-modal").classList.remove("hidden");
    }

    makeNewLevel() {
        // update level and level display
        this.level++;
        document.getElementById("current-level").innerHTML = `${this.level}`;
        // make new game grid
        this.gridObj = new Grid ();
        // update kernel count (+2 with each successive round)
        this.kernelsRemaining = this.baseKernelsRemaining + (this.level - 1) * 2;
    }

    getFuse (pos) {
        let col = pos[0];
        let row = pos[1];
        return this.gridObj.grid[col][row];
    }

    rotateFuse (pos) {
        this.gridObj.rotate(pos);
    }

    canDetonate() {
        return this.gridObj.hasE2EConnection();
    }

    detonate () {
        // generate list of all positions to detonate
        const burntFuses = [];
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 9; j++) {
                let fusePiece = this.getFuse([i,j]);
                if (fusePiece.connectF && fusePiece.connectK) {
                    burntFuses.push([i, j]);
                }
            }
        }
        const numKernelsPopped = this.getKernelsPopped(burntFuses);
        this.incrementScore(numKernelsPopped);
        this.decrementKernelsRemaining(numKernelsPopped);
        this.gridObj.detonate(burntFuses);
        return burntFuses;
    }

    getKernelsPopped(burntFuses) {
        let numKernelsPopped = 0;
        const that = this;
        burntFuses.filter((pos) => pos[0] === 5)
            .forEach((pos) => {
                if (that.getFuse(pos).right() === 1) numKernelsPopped++;
            });
        return numKernelsPopped;
    }

    decrementKernelsRemaining(numKernelsPopped) {
        this.kernelsRemaining -= numKernelsPopped;
        if (this.kernelsRemaining <= 0) {
            this.kernelsRemaining = 0;
            setTimeout(this.levelUpMessage.bind(this), 700); //set to 700 rather than 0 so that explosion graphic plays
        }
    }


    incrementScore (numKernelsPopped) {
        this.score += numKernelsPopped * 100 + Math.floor(numKernelsPopped/1.5) * 75;
    }

    updateAfterDetonate () {
        this.gridObj.refillFuses();
        this.gridObj.refreshFuseConnections();
    }

}

export default Game;
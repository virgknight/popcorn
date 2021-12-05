import Grid from "./grid.js";
import Timer from "./timer.js";

class Game {
    constructor() {
        this.gridObj = new Grid ();
        this.score = 0;
        this.kernelsRemaining = 10;
        
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
        document.getElementById("modal").classList.remove("hidden");
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
            this.levelUpMessage();
        }
    }

    incrementScore (numKernelsPopped) {
        this.score += numKernelsPopped * 100 + Math.floor(numKernelsPopped/1.5) * 75;
    }

    updateAfterDetonate () {
        this.gridObj.refillFuses();
        this.gridObj.refreshFuseConnections();
    }

    levelUpMessage () {
        this.timer.stop();
    }
}

export default Game;
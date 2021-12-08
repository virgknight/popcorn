import Grid from "./grid.js";
import Timer from "./timer.js";

const LEVEL_UP_MESSAGES = ["Well done!", "Nice going!", "America's Next Pop Model!", "You're a pop star!", "Way to go!", "Pop-notch work!", "You're on top of the pop!", "Pop off!"]

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
        document.getElementById("kitten").src = "./images/kittens/waiting.png";
        document.getElementById("bowl").src = "./images/empty-bowl.png";
        this.timer.start();
    }

    outOfTime () {
        this.gameOverMessage();
        return;
    }

    gameOverMessage() {
        document.getElementById("kitten").src = "./images/kittens/sad.png";
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
        document.getElementById("current-level").innerHTML = `Level ${this.level}`;
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
        const poppedKernels = this.getKernelsPopped(burntFuses);
        this.incrementScore(poppedKernels.length);
        this.decrementKernelsRemaining(poppedKernels.length);
        this.gridObj.detonate(burntFuses);
        return [burntFuses, poppedKernels];
        // passes burntFuses to view so that burnt pieces are shown with the explosion animation
        // passes poppedKernels (array of vertical indices where kernels popped) to view so it can show popcorn popping from those indices
    }

    getKernelsPopped(burntFuses) {
        const that = this;
        const poppedIndices = []
        burntFuses.filter((pos) => pos[0] === 5)
            .forEach((pos) => {
                if (that.getFuse(pos).right() === 1) poppedIndices.push(pos[1]);
            });

        if (poppedIndices.length >= 5) {
            document.getElementById("kitten").src = "./images/kittens/happy-dance.png";
        }

        return poppedIndices;
        // passes poppedIndices to this.detonate so that this.detonate can pass it to the view
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
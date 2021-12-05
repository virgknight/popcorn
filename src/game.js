import Grid from "./grid.js";

class Game {
    constructor() {
        this.gridObj = new Grid ();
        this.score = 0;
        this.kernelsRemaining = 10;
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
                if (this.gridObj.grid[i][j].connectF && this.gridObj.grid[i][j].connectK) {
                    burntFuses.push([i, j]);
                }
            }
        }
        const numKernelsPopped = this.getKernelsPopped(burntFuses);
        this.incrementScore(numKernelsPopped);
        this.decrementFusesRemaining(numKernelsPopped);
        this.gridObj.detonate(burntFuses);
        return burntFuses;
    }

    getKernelsPopped(burntFuses) {
        let numKernelsPopped = 0;
        const that = this;
        burntFuses.filter((pos) => pos[0] === 5)
            .forEach((pos) => {
                console.log(pos);
                console.log(that.gridObj);
                if (that.getFuse(pos).right() === 1) numKernelsPopped++;
            });
        return numKernelsPopped;
    }

    decrementFusesRemaining(numKernelsPopped) {
        this.kernelsRemaining -= numKernelsPopped;
    }

    incrementScore (numKernelsPopped) {
        this.score += numKernelsPopped * 100 + Math.floor(numKernelsPopped/2) * 50;
    }

    updateAfterDetonate () {
        this.gridObj.refillFuses();
        this.gridObj.refreshFuseConnections();
    }

}

export default Game;
const Fuse = require("./fuse.js");

class Grid {
    constructor () {
        this.grid = Grid.makeGrid();
    }

    static makeGrid() {
        const grid = [];
        const positionFreq = [1,2,2,2,2,3,3,4,4];

        for (let i = 0; i < 9; i++) {
            grid.push([]);
            for (let j = 0; j < 5; j++) {
                // Create random new fuse for each position
                const fuse = new Fuse({
                    index: [i, j],
                    numFuseEnds: positionFreq[Math.floor(Math.random() * positionFreq.length)],
                    grid: this ////GIVES BACK GRID CLASS, NOT GRID OBJECT
                });
                grid[i].push(fuse);
            }
        }
        return grid;
    }
}

module.exports = Grid;

const g = new Grid();
console.log(g.grid);
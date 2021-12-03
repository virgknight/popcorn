import Fuse from "./fuse.js";

class Grid {
    constructor () {
        this.grid = this.generateGrid();
        this.refreshFuseConnections();
    }

    generateGrid() {
        const grid = [];
        const positionFreq = [1,2,2,2,2,2,3,3,4,4];

        // Populate grid
        for (let i = 0; i < 9; i++) {
            grid.push([]);
            for (let j = 0; j < 6; j++) {
                // Create random new fuse for each position
                const fuse = new Fuse({
                    index: [i, j],
                    numFuseEnds: positionFreq[Math.floor(Math.random() * positionFreq.length)],
                    grid: this
                });
                grid[i].push(fuse);
            }
        }

        return grid;
    }

    refreshFuseConnections() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 6; j++) {
                let fuse1 = this.grid[i][j];
                fuse1.connectedToFlame();
                let fuse2 = this.grid[8 - i][5 - j];
                fuse2.connectedToKernel();
            }
        }
    }

    rotate (pos) {
        this.grid[pos[0]][pos[1]].rotate();
    }
}

export default Grid;
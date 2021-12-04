import Fuse from "./fuse.js";
import { connectedToKernel, connectedToFlame } from "./fuse.js";
// ^ can these be one line?

class Grid {
    constructor () {
        this.grid = this.generateGrid();
        this.refreshFuseConnections();
    }

    generateGrid() {
        const grid = [];
        const positionFreq = [2,2,2,2,2,2,3,3,4];

        // Populate grid
        for (let i = 0; i < 6; i++) {
            grid.push([]);
            for (let j = 0; j < 9; j++) {
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
        this.resetFuseConnections();
        // Flame connection
        this.checkFuseConnections(0, connectedToFlame, "flame");
        // Kernel connection
        this.checkFuseConnections(5, connectedToKernel, "kernel");
    }

    resetFuseConnections () {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 9; j++) {
                this.grid[i][j].connectF = false;
                this.grid[i][j].connectK = false;
            }
        }
    }

    checkFuseConnections (startIdx, callback, subject) {
        let queue = [];
        for (let times=0; times<2; times++){
            for (let i=0; i<9; i++) {
                queue.push([startIdx, i]);
            }
        }
        let checked = [];

        while (queue.length > 0) {
            let idx = queue.shift();
            checked.push(JSON.stringify(idx));

            let fuse = this.grid[idx[0]][idx[1]];
            let neighbors = fuse.getConnectedNeighbors();

            callback.call(fuse);
            let condition = (subject === "flame") ? fuse.connectF : fuse.connectK;

            if (condition && neighbors.length > 0) {
                neighbors.forEach((neighbor) => {
                    let neighborStr = JSON.stringify(neighbor);
                    if (!checked.includes(neighborStr)) {
                        queue.push(neighbor);
                    }
                });
            }
        }
    }

    rotate (pos) {
        // rotate fuse piece
        this.grid[pos[0]][pos[1]].rotate();
        // update fuse connections
        this.refreshFuseConnections();
        // return value indicates whether end-to-end connection was created
        return this.hasE2EConnection();
    }

    hasE2EConnection () {
        return this.grid.some((row) => {
            return row.some((col) => (col.connectF && col.connectK))
        });
    }

    detonateFuses () {
        
    }

    refillFuses () {

    }
}

export default Grid;
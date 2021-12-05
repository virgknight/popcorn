import Fuse from "./fuse.js";
import { connectedToKernel, connectedToFlame } from "./fuse.js";
// ^ can these be one line?

const POSITION_FREQ = [2, 2, 2, 2, 2, 2, 2, 3, 3, 4];

class Grid {
    constructor () {
        this.grid = this.generateGrid();
        this.refreshFuseConnections();
    }

    generateGrid() {
        const grid = [];

        // Populate grid
        for (let i = 0; i < 6; i++) {
            grid.push([]);
            for (let j = 0; j < 9; j++) {
                // Create random new fuse for each position
                const fuse = new Fuse({
                    index: [i, j],
                    numFuseEnds: POSITION_FREQ[Math.floor(Math.random() * POSITION_FREQ.length)],
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

        // Use BFS node traversal to generate flame/kernel connections
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
    }

    hasE2EConnection () {
        return this.grid.some((row) => {
            return row.some((col) => (col.connectF && col.connectK))
        });
    }

    detonate (burntFuses) {
        // iterate backward to remove cells without compromising earlier indices
        burntFuses.reverse().forEach((pos) => {
            this.grid[pos[0]].splice(pos[1], 1);
        })
    }

    addNewFusePieces () {
        for (let i = 0; i < 6; i++) {
            while (this.grid[i].length < 9) {
                this.grid[i].push(new Fuse({
                    index: [i, this.grid[i].length],
                    numFuseEnds: POSITION_FREQ[Math.floor(Math.random() * POSITION_FREQ.length)],
                    grid: this
                }));
            }
        }
    }

    updateIndices () {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 9; j++) {
                this.grid[i][j].index = [i, j];
            }
        }
    }

    refillFuses() {
        this.addNewFusePieces();
        this.updateIndices();
    }
}

export default Grid;
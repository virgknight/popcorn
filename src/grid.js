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
        // clear out prior connections
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
        // Use BFS node traversal to generate flame/kernel connections
        // To begin, populate queue with the pieces that immediately border the flames/kernels
        let queue = [];
        for (let i=0; i<9; i++) {
            queue.push([startIdx, i]);
        }
        // checked will be populated with key: indices checked, value: number of times they've been checked
        let checked = {};

        while (queue.length > 0) {
            let idx = queue.shift();
            // add to checked object if not already there
            if (!([JSON.stringify(idx)] in checked)) checked[JSON.stringify(idx)] = 0;
            checked[JSON.stringify(idx)] ++;

            let fuse = this.grid[idx[0]][idx[1]];
            let neighbors = fuse.getConnectedNeighbors();

            callback.call(fuse);
            let condition = (subject === "flame") ? fuse.connectF : fuse.connectK;

            if (condition && neighbors.length > 0) {
                neighbors.forEach((neighbor) => {
                    // must convert to string to allow JS to check for equality
                    let neighborStr = JSON.stringify(neighbor);
                    // if that neighbor hasn't been checked yet...
                    if (!(neighborStr in checked) || 
                        // or if they are an edge piece but have not been checked from all three sides...
                        (checked[neighborStr] < 3) ||
                        // or if they are not an edge piece but have not been checked from all four sides...
                        (checked[neighborStr] < 4 && ![0, 5].includes(neighbor[0]))
                    ) {
                        // then add to queue to be checked (or checked again)
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
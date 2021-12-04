import Fuse from "./fuse.js";

class Grid {
    constructor () {
        this.grid = this.generateGrid();
        this.refreshFuseConnectionsBFS();
    }

    generateGrid() {
        const grid = [];
        const positionFreq = [2,2,2,2,2,2,3,3,4];

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

    /// ADD LOGIC FOR KERNEL CONNECTION!
    refreshFuseConnectionsBFS() {
        let queue = [];
        for (let times=0; times<2; times++){
            for (let i=0; i<9; i++) {
                queue.push([i, 0]);
            }
        }
        let checked = [];

        while (queue.length > 0) {
            let idx = queue.shift();
            checked.push(JSON.stringify(idx));
            let fuse = this.grid[idx[0]][idx[1]];
            let neighbors = fuse.getConnectedNeighbors();

            fuse.connectedToFlame();
            if (fuse.connectF && neighbors.length > 0) {
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
        this.grid[pos[0]][pos[1]].rotate();
        this.refreshFuseConnectionsBFS();
    }
}

export default Grid;
class Fuse {
    // takes in {index: [], numFuseEnds: integer, grid: Grid obj}
    constructor (params) {
        // index: [row, column]
        this.index = params.index;
        // fusePos: [up, right, down, left]
        // 1 indicates that there is a connecting fuse end in that direction; 0 indicates that there is not
        this.fusePos = Fuse.getStartPos(params.numFuseEnds);
        this.grid = params.grid;

        // set booleans for whether fuse adjoins kernel or flame to false at initialization- will be updated 
        // when other functions run
        this.connectK = false;
        this.connectF = false;
    }

    static getStartPos (numFuseEnds) {
        let generator = Array(numFuseEnds).fill(1).concat(Array(4 - numFuseEnds).fill(0));
        if (numFuseEnds < 4) {
            // randomly shuffle fuse end order 
            generator = generator.map((ele) => ({value: ele, sort: Math.random()}))
                        .sort((a,b) => a.sort - b.sort)
                        .map(({value}) => value);
        }
        return generator;
    }

    // helper functions for quickly returning fuse positions in a certain direction
    up () {
        return this.fusePos[0];
    }

    right () {
        return this.fusePos[1];
    }

    down() {
        return this.fusePos[2];
    }

    left() {
        return this.fusePos[3];
    }

    connectedToKernel () {
        if (this.index[1] === 5 && this.right() === 1) {
            this.connectK = true;
            return;
        } 
        
        const connectedNeighbors = this.getConnectedNeighbors();
        if (connectedNeighbors.some((pos) => {
            const row = pos[0];
            const col = pos[1];
            return gridValues[row][col].connectK;
        })) {
            this.connectK = true;
        } else {
            this.connectK = false;
        }
    }

    connectedToFlame() {
        if (this.index[1] === 0 && this.left() === 1) {
            this.connectF = true;
            return;
        }

        const connectedNeighbors = this.getConnectedNeighbors();
        if (connectedNeighbors.some((pos) => {
            const row = pos[0];
            const col = pos[1];
            return gridValues[row][col].connectF;
        })) {
            this.connectF = true;
        } else {
            this.connectF = false;
        }
    }

    getNeighborPositions () {
        let neighbors = [];
        const rowIdx = this.index[0];
        const colIdx = this.index[1];

        [rowIdx - 1, rowIdx + 1].forEach ((row) => {
            neighbors.push([row, colIdx]);
        });
        [colIdx - 1, colIdx + 1].forEach((col) => {
            neighbors.push([rowIdx, col]);
        });

        return neighbors.filter((idx) => (idx[0] >= 0 && idx[0] <= 8 && idx[1] >= 0 && idx[1] <= 5)
);
    } 

    getConnectedNeighbors () {
        const neighbors = this.getNeighborPositions();
        const gridValues = this.grid.grid;

        
    }



    rotate () {
        this.fusePos.unshift(this.fusePos.pop());
    }
}

export default Fuse;

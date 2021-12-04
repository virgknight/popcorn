class Fuse {
    // takes in {index: [], numFuseEnds: integer, grid: Grid obj}
    constructor (params) {
        // index: [column, row]
        this.index = params.index;
        // fusePos: [up, right, down, left]
        // 1 indicates that there is a connecting fuse end in that direction; 0 indicates that there is not
        this.fusePos = Fuse.getStartPos(params.numFuseEnds);
        // grid object, used to communicate with neighboring pieces of rope
        this.grid = params.grid;

        // boolean indicating whether fuse connects to kernel
        this.connectK = false;
        // boolean indicating whether fuse connects to flame
        this.connectF = false;
    }

    static getStartPos (numFuseEnds) {
        let newPosArray = Array(numFuseEnds).fill(1).concat(Array(4 - numFuseEnds).fill(0));
        if (numFuseEnds < 4) {
            // randomly shuffle fuse end order 
            newPosArray = newPosArray.map((ele) => ({value: ele, sort: Math.random()}))
                        .sort((a,b) => a.sort - b.sort)
                        .map(({value}) => value);
        }
        return newPosArray;
    }

    // helper functions for quickly returning fuse positions in a certain direction
    up () { return this.fusePos[0]; }
    right () { return this.fusePos[1]; }
    down() { return this.fusePos[2]; }
    left() { return this.fusePos[3]; }

    connectedToKernel () {
        if (this.index[0] === 5 && this.right() === 1) {
            this.connectK = true;
            return;
        } 
        
        const gridValues = this.grid.grid;
        const connectedNeighbors = this.getConnectedNeighbors();
        if (connectedNeighbors.some((pos) => {
            const col = pos[0];
            const row = pos[1];
            return gridValues[col][row].connectK;
        })) {
            this.connectK = true;
        } else {
            this.connectK = false;
        }
    }

    connectedToFlame() {
        if (this.index[0] === 0 && this.left() === 1) {
            this.connectF = true;
            return;
        }

        const gridValues = this.grid.grid;
        const connectedNeighbors = this.getConnectedNeighbors();
        if (connectedNeighbors.some((pos) => {
            const col = pos[0];
            const row = pos[1];
            return gridValues[col][row].connectF;
        })) {
            this.connectF = true;
        } else {
            this.connectF = false;
        }
    }

    getConnectedNeighbors() {
        let neighbors = [];
        const gridValues = this.grid.grid;
        const row = this.index[1];
        const col = this.index[0];

        // up
        if (this.up() === 1 && row < 8) {
            const connected = (gridValues[col][row + 1].down() === 1);
            if (connected) neighbors.push([col, row + 1]);
        }
        // right
        if (this.right() === 1 && col < 5) {
            const connected = (gridValues[col + 1][row].left() === 1);
            if (connected) neighbors.push([col + 1, row]);
        }
        // down
        if (this.down() === 1 && row > 0) {
            const connected = (gridValues[col][row - 1].up() === 1);
            if (connected) neighbors.push([col, row - 1]);
        }
        // left
        if (this.left() === 1 && col > 0) {
            const connected = (gridValues[col - 1][row].right() === 1);
            if (connected) neighbors.push([col - 1, row]);
        }
        return neighbors;
    } 


    rotate () {
        this.fusePos.unshift(this.fusePos.pop());
    }
}

export default Fuse;
export const {connectedToKernel, connectedToFlame} = new Fuse ({index: [], numFuseEnds: 0});
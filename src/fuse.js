class Fuse {
    // takes in {index: [], numFuseEnds: [], grid: Grid obj}
    constructor (params) {
        // index: [row, column]
        this.index = params.index;
        // position of fuse ends: [top, right, bottom, left]
        // 1 indicates that there is a connecting fuse end in that direction; 0 indicates that there is not
        this.fusePos = Fuse.getStartPos(params.numFuseEnds);
        this.grid = params.grid;
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
}

module.exports = Fuse;

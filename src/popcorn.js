const PIECE = new Image();
PIECE.src = "../images/popcorn.png";

class Popcorn {
    constructor (ctx, yIdx) {
        this.ctx = ctx;
        this.img = PIECE;
        this.xIdx = 0;
        this.yIdx = yIdx;
        // vertical distance to cover = 480 (bottom of canvas) - (yIdx - 10) (starting index minus two initial upward steps of 5)
        // 22 total steps (four up, eighteen down) - divide by 18 to get vertical distance of each downward step
        this.yIncrementer = (490 - yIdx) / 9;
        // boolean to indicate when the popcorn is "in" the bowl, aka done falling
        this.inBowl = false;
    }

    draw () {
        this.xIdx += 6;
        if (this.xIdx <= 24) {
            this.yIdx -= 4;
            this.ctx.drawImage(this.img, this.xIdx, this.yIdx, 70, 70);
        } else if (this.xIdx <= 144) {
            this.yIdx += this.yIncrementer;
            this.ctx.drawImage(this.img, this.xIdx, this.yIdx, 70, 70);
        }

        if (this.xIdx >= 144|| this.yIdx >= 480) this.inBowl = true;
    }
}

export default Popcorn;
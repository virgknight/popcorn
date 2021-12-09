import Game from "./game.js";
import Popcorn from "./popcorn";

const BORDERITEMS = {
    "flame": "./images/flame.png",
    "kernel": "./images/kernel.png"
};

class View {
    constructor() {
        // add flames and kernels bordering the game grid
        this.setUpBorderItems();
        // initiate new game
        this.game = new Game();
        // variables for canvas popped popcorn graphic
        this.kernelInterval = undefined;
        this.ctx = document.getElementById("popcorn-canvas").getContext("2d");
    }

    drawBackCurtains() {
        const curtainL = document.querySelector(".curtain.left");
        curtainL.classList.add("lightSpeedOutLeft");
        const curtainR = document.querySelector(".curtain.right");
        curtainR.classList.add("lightSpeedOutRight");
        setTimeout(this.removeCurtains.bind(this), 1000);
    }

    removeCurtains() {
        const curtains = document.querySelectorAll(".curtain");
        curtains.forEach((curtain) => { curtain.classList.add("hidden") });
    }

    startGame() {
        this.refreshSidebar();
        this.setUpViewableGrid();
        this.bindEvents();
        this.hideModals();
        this.game.start();
        this.checkForDetonation();
    }

    startNewLevel() {
        // clear out old level
        document.querySelectorAll("li.fuse").forEach((li) => {
            li.remove();
        });
        // create new level
        this.game.makeNewLevel();
        // begin game
        this.startGame();
    }

    restartGame() {
        // clear out old game
        document.querySelectorAll("li.fuse").forEach((li) => {
            li.remove();
        });
        // start new game
        this.game = new Game();
        this.startGame();
    }

    stopGame () {
        this.game.timer.stop();
        this.game.outOfTime();//
    }

    hideModals() {
        const modals = document.getElementsByClassName("modal");
        for (let i = 0; i < modals.length; i++) {
            let modal = modals.item(i);
            if (!modal.classList.contains("hidden")) modal.classList.add("hidden");
        }
    }

    refreshSidebar() {
        const currentscore = document.getElementById("current-score");
        currentscore.innerHTML = `${this.game.score}`;

        const kernelsremaining = document.getElementById("kernels-remaining");
        kernelsremaining.innerHTML = `${this.game.kernelsRemaining}`;
    }

    setUpViewableGrid() {
        let ul = document.createElement("ul");
        for (let i = 8; i >= 0; i--) {
            for (let j = 0; j < 6; j++) {
                let occupant = this.game.getFuse([j, i]);
                let occupantConfig = occupant.fusePos.join('');

                let img = document.createElement("img");
                // image source depends on what color the piece should be
                let color = "default";
                if (occupant.connectF && occupant.connectK) {color = "yellow";}
                else if (occupant.connectK) {color = "green";}
                else if (occupant.connectF) {color = "red";}
                img.src = `./images/fuse_pieces/${color}/${occupantConfig}.png`;

                let li = document.createElement("li");
                li.id = `${j}${i}`;
                li.classList.add("fuse");

                li.appendChild(img);
                ul.appendChild(li);
            }
        }
        const gameGrid = document.querySelector(".fuse-grid");
        gameGrid.appendChild(ul);
    }

    setUpBorderItems() {
        let flameList = document.querySelector("ul.flames");
        let kernelList = document.querySelector("ul.kernels");

        for (let i = 0; i < 9; i++) {
            let flameLi = document.createElement("li");
            let flameImg = document.createElement("img");
            flameImg.classList.add('pulsing');
            flameImg.src = BORDERITEMS["flame"];
            flameLi.appendChild(flameImg);
            flameList.appendChild(flameLi);

            let kernelLi = document.createElement("li");
            kernelLi.classList.add("kernel-img");
            let kernelImg = document.createElement("img");
            kernelImg.src = BORDERITEMS["kernel"];
            kernelLi.appendChild(kernelImg);
            kernelList.appendChild(kernelLi);
        }
    }

    bindEvents() {
        const that = this;
        document.querySelectorAll("li.fuse").forEach((li) => {
            li.addEventListener("click", that.handleFuseClick.bind(that));
        });
    }

    checkForDetonation() {
        if (this.game.canDetonate()) {
            setTimeout(this.detonateSequence.bind(this), 1000);
        }
    }

    handleFuseClick(event) {
        const clickedFuseId = event.currentTarget.id;
        const pos = clickedFuseId.split('')
                    .map((str) => parseInt(str));
        this.game.rotateFuse(pos);
        this.refreshViewableGrid();

        this.checkForDetonation();
    }

    detonateSequence() {
        if (this.game.canDetonate()) {
            const detonationAttributes = this.game.detonate();
            // play explosion graphic for burnt pieces in grid
            const burntFuses = detonationAttributes[0];
            burntFuses.forEach((pos) => {
                let fuseId = `${pos[0]}${pos[1]}`;
                let img = document.getElementById(`${fuseId}`).children[0];
                img.src = `./images/fuse_pieces/burnt.png`;
                img.classList.add("exploding");
            });
            // initiate popped popcorn animation in canvas element
            const poppedIndices = detonationAttributes[1];
            this.kernelPopInterval(poppedIndices);
            // refresh/update game board after the explosion graphics play
            setTimeout(this.updateAfterDetonate.bind(this), 700);
        }
    }

    updateAfterDetonate() {
        this.game.updateAfterDetonate();
        this.refreshViewableGrid();
        this.refreshSidebar();
        document.getElementById("kitten").src = "./images/kittens/waiting.png";
        document.getElementById("bowl").src = "./images/filled-bowl.png";
        this.checkForDetonation();
    }

    refreshViewableGrid() {
        document.querySelectorAll("li.fuse").forEach((li) => {
            const pos = li.id.split('').map((str) => parseInt(str));
            let occupant = this.game.getFuse(pos);
            let occupantConfig = occupant.fusePos.join('');

            let img = li.children[0];
            if (img.classList.contains("exploding")) img.classList.remove("exploding");
            
            let color = "default";
            if (occupant.connectF && occupant.connectK) { color = "yellow"; }
            else if (occupant.connectK) { color = "green"; }
            else if (occupant.connectF) { color = "red"; }
            img.src = `./images/fuse_pieces/${color}/${occupantConfig}.png`;
        })
    }

    kernelPopInterval(poppedIndices) {
        // create array of new popcorn objects for each popped index
        let popcornArr = poppedIndices.map((idx) => new Popcorn(this.ctx, 55 * (8 - idx)));
        // pass to kernelPop function
        this.kernelInterval = setInterval(this.kernelPop.bind(this, popcornArr), 50);
    }

    kernelPop(popcornArr) {
        // clear canvas prior to each rerender
        this.ctx.clearRect(0, 0, 240, 530);
        // render each piece
        popcornArr.forEach((popcorn) => {
            popcorn.draw();
        });
        // stop interval and clear display once all popcorns have made it into the bowl
        if (popcornArr.every((popcorn) => (popcorn.inBowl))) {
            clearInterval(this.kernelInterval);
            this.ctx.clearRect(0, 0, 240, 530);
        }
    }

}

export default View;
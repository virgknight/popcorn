import Game from "./game.js";

const BORDERITEMS = {
    "flame": "../images/flame.png",
    "kernel": "../images/kernel.png"
};

class View {
    constructor() {
        this.setUpBorderItems();
        this.game = new Game();
        this.startGame();
    }

    startGame() {
        this.refreshSidebar();
        this.setUpViewableGrid();
        this.bindEvents();
        this.game.start();
        this.checkForDetonation();
    }

    startNewLevel() {
        // hide modal box(es)
        this.hideModals();
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
        this.hideModals();
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
        this.game.outOfTime();
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
                // determine color of piece
                let color = "default";
                if (occupant.connectF && occupant.connectK) {color = "yellow";}
                else if (occupant.connectK) {color = "green";}
                else if (occupant.connectF) {color = "red";}
                img.src = `../images/fuse_pieces/${color}/${occupantConfig}.png`;

                let li = document.createElement("li");
                li.id = `${j}${i}`;
                li.classList.add("fuse");

                if (occupant.connectK) {
                    li.classList.add("kernel-connected");
                };
                if (occupant.connectF) {
                    li.classList.add("flame-connected");
                };

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
            kernelLi.classList.add(`${i}`);
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
        const that = this;
        if (this.game.canDetonate()) {
            setTimeout(that.detonateSequence.bind(that), 1000);
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
        const that = this;
        if (this.game.canDetonate()) {
            const burntFuses = this.game.detonate();
            burntFuses.forEach((pos) => {
                let fuseId = `${pos[0]}${pos[1]}`;
                let img = document.getElementById(`${fuseId}`).children[0];
                img.src = `../images/fuse_pieces/burnt.png`;
                img.classList.add("exploding");
            });
            setTimeout(that.updateAfterDetonate.bind(that), 700);
        }
    }

    updateAfterDetonate() {
        this.game.updateAfterDetonate();
        this.refreshViewableGrid();
        this.refreshSidebar();
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
            img.src = `../images/fuse_pieces/${color}/${occupantConfig}.png`;
        })
    }

}

export default View;
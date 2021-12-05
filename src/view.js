import Game from "./game.js";
import Timer from "./timer.js";

const BORDERITEMS = {
    "flame": "../images/flame.png",
    "kernel": "../images/kernel.png"
};

class View {
    constructor() {
        this.game = new Game();
        this.refreshSidebar();
        this.setUpViewableGrid();
        this.setUpBorderItems();
        this.bindEvents();
    }

    refreshSidebar() {
        let currentscore = document.getElementById("current-score");
        currentscore.innerHTML = `${this.game.score}`;

        let kernelsremaining = document.getElementById("kernels-remaining");
        kernelsremaining.innerHTML = `${this.game.kernelsRemaining}`;
    }

    setUpViewableGrid() {
        let ul = document.createElement("ul");
        for (let i = 8; i >= 0; i--) {
            for (let j = 0; j < 6; j++) {
                let occupant = this.game.getFuse([j, i]);
                let occupantConfig = occupant.fusePos.join('');

                let img = document.createElement("img");
                img.src = `../images/fuse_pieces/${occupantConfig}.png`;

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
        const gameGrid = document.querySelector(".game-grid");
        gameGrid.appendChild(ul);
    }

    setUpBorderItems() {
        let flameList = document.querySelector("ul.flames");
        let kernelList = document.querySelector("ul.kernels");

        for (let i = 0; i < 9; i++) {
            // No DRYer way to do this?
            let flameLi = document.createElement("li");
            flameLi.classList.add(`${i}`)
            let flameImg = document.createElement("img");
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

    handleFuseClick(event) {
        const clickedFuseId = event.currentTarget.id;
        const pos = clickedFuseId.split('')
                    .map((str) => parseInt(str));
        this.game.rotateFuse(pos);
        this.refreshViewableGrid();

        const that = this;
        if (this.game.canDetonate()) {
            setTimeout(that.detonateSequence.bind(that), 1000);
        }
    }

    detonateSequence() {
        const that = this;
        if (this.game.canDetonate()) {
            const burntFuses = this.game.detonate();
            burntFuses.forEach((pos) => {
                let fuseId = `${pos[0]}${pos[1]}`;
                let img = document.getElementById(`${fuseId}`).children[0];
                img.src = `../images/fuse_pieces/burnt.png`;
            });
            setTimeout(that.updateAfterDetonate.bind(that), 700);
        }
    }

    updateAfterDetonate() {
        console.log(this.game.gridObj);
        this.game.updateAfterDetonate();
        this.refreshViewableGrid();
        this.refreshSidebar();

        const that = this;
        if (this.game.canDetonate()) {
            setTimeout(that.detonateSequence.bind(that), 1000);
        }
    }

    refreshViewableGrid() {
        document.querySelectorAll("li.fuse").forEach((li) => {
            const pos = li.id.split('').map((str) => parseInt(str));
            let occupant = this.game.getFuse(pos);
            let occupantConfig = occupant.fusePos.join('');

            let img = li.children[0];
            img.src = `../images/fuse_pieces/${occupantConfig}.png`;

            if (occupant.connectK !== li.classList.contains("kernel-connected")) {
                li.classList.toggle("kernel-connected");
            };
            if (occupant.connectF !== li.classList.contains("flame-connected")) {
                li.classList.toggle("flame-connected");
            };
        })
    }

}

export default View;
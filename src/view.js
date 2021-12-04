import Grid from "./grid.js";

const BORDERITEMS = {
    "flame": "../images/flame.png",
    "kernel": "../images/kernel.png"
};

class View {
    constructor(gridObj) {
        this.gridObj = gridObj;
        this.setUpViewableGrid();
        this.setUpBorderItems();
        this.bindEvents();
    }

    setUpViewableGrid() {
        let ul = document.createElement("ul");
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 6; j++) {
                let occupant = this.gridObj.grid[i][j];
                let occupantConfig = occupant.fusePos.join('');

                let img = document.createElement("img");
                img.src = `../images/fuse_pieces/${occupantConfig}.png`;

                let li = document.createElement("li");
                li.id = `${i}${j}`;
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
            li.addEventListener("click", that.handleClick.bind(that));
        });
    }

    handleClick(event) {
        const clickedFuseId = event.currentTarget.id;
        const pos = clickedFuseId.split('')
                    .map((str) => parseInt(str));
        this.gridObj.rotate(pos);
        this.refreshViewableGrid();
    }

    refreshViewableGrid() {
        document.querySelectorAll("li.fuse").forEach((li) => {
            const pos = li.id.split('').map((str) => parseInt(str));
            let occupant = this.gridObj.grid[pos[0]][pos[1]];
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
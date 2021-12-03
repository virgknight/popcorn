// import Grid from './grid';
// const View = require("./view.js");
import Grid from "./grid";
import View from "./view";

document.addEventListener("DOMContentLoaded", () => {
    const grid = new Grid();
    const view = new View(grid);
});
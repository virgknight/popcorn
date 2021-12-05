import Game from "./game";
import View from "./view";

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game ();
    const view = new View(game);
});
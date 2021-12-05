import View from "./view";

document.addEventListener("DOMContentLoaded", () => {
    const view = new View();

    let newGameButton = document.getElementById("new-game-button");
    newGameButton.addEventListener("click", () => {view.restartGame()})
});
import View from "./view";

document.addEventListener("DOMContentLoaded", () => {
    const view = new View();

    let newGameButton = document.getElementById("new-game-button");
    newGameButton.addEventListener("click", () => {view.restartGame()});

    let levelUpButton = document.getElementById("next-level-button");
    levelUpButton.addEventListener("click", () => { view.startNewLevel() });
});
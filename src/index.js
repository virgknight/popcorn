import View from "./view";

document.addEventListener("DOMContentLoaded", () => {
    const view = new View();

    let newGameButton = document.getElementById("new-game-button");
    newGameButton.addEventListener("click", () => {view.restartGame()});

    let levelUpButton = document.getElementById("next-level-button");
    // CHANGE THIS TO CORRECT CALLBACK WHEN LEVEL LOGIC IS ADDED
    levelUpButton.addEventListener("click", () => { view.startNewLevel() });
});
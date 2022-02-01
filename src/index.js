import View from "./view";

document.addEventListener("DOMContentLoaded", () => {
    const view = new View();

    let startGameButton = document.getElementById("start-game-button");
    startGameButton.addEventListener("click", () => { 
        view.drawBackCurtains();
        view.startGame();
    });

    let newGameButton = document.getElementById("new-game-button");
    newGameButton.addEventListener("click", () => {view.restartGame()});

    let levelUpButton = document.getElementById("next-level-button");
    levelUpButton.addEventListener("click", () => { view.startNewLevel() });

    let quitButton = document.getElementById("quit-button");
    quitButton.addEventListener("click", () => { view.stopGame() });

    const instructionsButton = document.getElementById("instructions-button");
    instructionsButton.addEventListener("click", () => { view.reopenInstructions() })

    const resumeGameButton = document.getElementById("resume-game-button");
    resumeGameButton.addEventListener("click", () => { view.unPauseGame() });
});
import type GameController from "../controller/game-controller";
import type Game from "../model/game";

/**
 * View class GameView : Handles the UI for the game view (the target)
 * passes input to the controller (button has been clicked)
 * listens for changes from the model
 * 
 */
export default class GameView {
    #game: Game;
    #controller: GameController;

    constructor(game: Game, controller: GameController) {
        this.#game = game;
        this.#controller = controller;

        this.#game.registerListener(this); // Bind model to view

        document.querySelector("#app")!.innerHTML = `
            <div class="container">
                <div class="box game-box">
                    <h2>Click Target</h2>
                    <button id="bag">
                        <img src="bag.png" alt="Punch" />
                    </button>

                    <button id="robo-btn">RoboBuy: OFF</button>
                    <ul id="game-stats"></ul>
                </div>
                <div class="box upgrades-box" id="upgrades"></div>
                <div class="box buildings-box" id="buildings"></div>
            </div>
        `;

        document.querySelector("#bag")!
            .addEventListener("click", () => this.#controller.addClick());

        document.querySelector("#robo-btn")!
            .addEventListener("click", () => this.#controller.toggleRoboBuy());

        this.notify();
    }

    notify() { //loads up game stats
        document.querySelector("#game-stats")!.innerHTML = `
            <li>Total hits: ${this.#game.totalHits}</li>
            <li>Punch power: ${this.#game.punchPower}</li>
            <li>CPS: ${this.#game.TotalCPS}</li>
        `;

         const btn = document.querySelector("#robo-btn")!;
        btn.textContent = this.#game.roboBuyEnabled
            ? "RoboBuy: ON"
            : "RoboBuy: OFF";
    
    }
}

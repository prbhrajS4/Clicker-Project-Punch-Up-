import type GameController from "../controller/game-controller";
import type Game from "../model/game";
import Upgrade from "../model/Upgrades/upgrade";

/**
 * View class UpgradeView : Handles the UI for upgrades
 * passes input to the controller (button has been clicked)
 * listens for changes from the model
 */
export default class UpgradeView {
    #game: Game;
    #controller: GameController;

    constructor(game: Game, controller: GameController) {
        this.#game = game;
        this.#controller = controller;

        document.querySelector("#upgrades")!.innerHTML = `
            <h2>Upgrades</h2>
            <div class="upgrade-buttons" id="upgrade-buttons"></div>
            <ul id="upgrades-list"></ul>
        `;

        this.notify();
    }

    async notify() {
        const upgrades = await Upgrade.getAll(); // all shop options from inventory

        const upgradeButtonsEl = document.querySelector("#upgrade-buttons")!;
        const upgradeListEl = document.querySelector("#upgrades-list")!;

        // clear old content before re-rendering
        upgradeButtonsEl.innerHTML = "";
        upgradeListEl.innerHTML = "";

        for (const up of upgrades) {
            // create a button dynamically for each upgrade
            const button = document.createElement("button");
            button.id = up.getCode();
            button.innerHTML = `${up.getName()} <img src="punch.png" alt="${up.getName()}" />`;

            button.addEventListener("click", () => {
                this.#controller.buyUpgrade(up.getCode());
            });

            upgradeButtonsEl.appendChild(button);

            // also show upgrade info in the list
            upgradeListEl.innerHTML += `
                <li>
                    ${up.getName()} — Cost: ${up.getCost()} | ${up.getDescription()}
                </li>
            `;
        }
    }
}



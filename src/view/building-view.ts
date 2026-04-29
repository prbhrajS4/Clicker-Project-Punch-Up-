import type GameController from "../controller/game-controller";
import Building from "../model/Buildings/building";
import type Game from "../model/game";


// /**
//  * View class BuildingView : Handles the UI for the view 
//  * passes input to the controller (button has been clicked)
//  * listens for changes from the model
//  * 
//  */
export default class BuildingView {

    #game : Game;
    #controller : GameController;
  


    constructor(game : Game, controller : GameController){ 
        this.#game = game;
        this.#controller = controller;

        document.querySelector("#buildings")!.innerHTML =
       
         `
            <h2>Buildings</h2>
            <div class="buildings-buttons" id="building-buttons"></div>
            <ul id="buildings-list"></ul>
        `;


        this.notify();
    }

    async notify() {
        const buildings = await Building.getAll(); // all shop options from inventory
        const buildingButtonEl = document.querySelector("#building-buttons")!;
        const buildingListEl = document.querySelector("#buildings-list")!;
         buildingButtonEl.innerHTML = ""; 
         buildingListEl.innerHTML = "";
      

        for (const up of buildings) {
             // create a button dynamically for each upgrade
            const button = document.createElement("button");
            button.id = up.getCode();
            button.innerHTML = `${up.getName()} <img src="punch.png" alt="${up.getName()}" />`;

            button.addEventListener("click", () => {
                this.#controller.buyBuilding(up.getCode());
            });

            buildingButtonEl.appendChild(button);

            // also show upgrade info in the list
            buildingListEl.innerHTML += `
                <li>
                    ${up.getName()} — Cost: ${up.getCost()} | ${up.getDescription()}
                </li>
            `;
        }
    }
}


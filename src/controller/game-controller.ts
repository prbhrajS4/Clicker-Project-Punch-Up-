
import Upgrade from "../model/Upgrades/upgrade";
import Building from "../model/Buildings/building";
import Game from "../model/game";
import GameView from "../view/game-view";
import UpgradeView from "../view/upgrade-view";
import BuildingView from "../view/building-view";

import MarkovChain from "../markov";
import { LABEL_TO_CODE, CODE_TO_LABEL } from "../model/roboMap";

type MarkovModel = {
  labels: string[];
  counts: number[][];
  totals: number[];
};

/**
 * Controller class GameController : Coordinates input from views
 * Handles buying upgrades/buildings and updates views
 */
export default class GameController {
  #game: Game;
  #view: GameView;
  #upgradeView?: UpgradeView;
  #buildingView?: BuildingView;

  #markov?:  MarkovChain;
  #upgradeInventory: Upgrade[] = [];
  #buildingInventory: Building[] = [];

  constructor(game: Game) {
    this.#game = game;

    // Views
    this.#view = new GameView(this.#game, this);
    this.#upgradeView = new UpgradeView(this.#game, this);
    this.#buildingView = new BuildingView(this.#game, this);
    

    // Start auto-click system
    this.startAutoClick();
    this.startRoboBuy();
        void this.initMarkov();
  }

  // adds click
  addClick() {
    this.#game.punch();
  }

  // this method is responsible for auto clicking
  // once per second
  startAutoClick() {
    setInterval(() => {
      const cps = this.#game.TotalCPS;
      if (cps > 0) {
        this.#game.autoHit(cps);
      }
      this.#view.notify();
      this.#upgradeView?.notify();
      this.#buildingView?.notify();
    }, 1000);
  }


  startRoboBuy() {
    setInterval(() => {
      void this.performRoboBuy();
    }, 1000);
  }

  // These are the upgrade/ Building purchase methods..........
  /**
   * Loads the respective inventory and looks for the item. If present
   * creates a new instance of that item and applies its effect
   * notifies the view
   */


  async buyUpgrade(code: string) {
    const inventory = await Upgrade.getAll();
    const upgrade = inventory.find((u) => u.getCode() === code);

    if (!upgrade) {
        throw new Error(`Upgrade ${code} not found`);
    }

    await this.#game.buyUpgrade(upgrade);
    upgrade.applyPower(this.#game);
    this.#game.setLastPurchasedCode(code);

    this.#upgradeView?.notify();
    this.#view.notify();
}

 async buyBuilding(code: string) {
    const inventory = await Building.getAll();
    const building = inventory.find((u) => u.getCode() === code);

    if (!building) {
        throw new Error(`Upgrade ${code} not found`);
    }

    await this.#game.buyBuilding(building);
    building.autoHit(this.#game);
    this.#game.setLastPurchasedCode(code);

    this.#buildingView?.notify();
    this.#view.notify();
}
/**
 *  perform roboBuy class : is responsible for auto buying items
 *  workls only when feature is enabled
 *  use the last purchased item's mapped label
 *  Sample the next label using the Markov chain
 *  Convert that label into an item code
 *  Try to buy that item if it is affordable
 * 
 */
  async performRoboBuy(): Promise<void> {
  if (!this.#game.roboBuyEnabled) return;

  let currentState = "S";

  if (this.#game.lastPurchasedCode) {
    const mapped = CODE_TO_LABEL[this.#game.lastPurchasedCode];
    if (mapped) {
      currentState = mapped;
    }
  }

  // try a few times in case chosen item is unaffordable
  for (let tries = 0; tries < 10; tries++) {
    if (!this.#markov) {
      return;
    }
    const nextLabel = this.#markov.nextState(currentState);
    if (!nextLabel || nextLabel === "S") return;

    const code = LABEL_TO_CODE[nextLabel];
    if (!code) continue;

    const upgrades = await Upgrade.getAll();
    const upgrade = upgrades.find(u => u.getCode() === code);

    if (upgrade && upgrade.getCost() <= this.#game.totalHits) {
      await this.#game.buyUpgrade(upgrade);
      upgrade.applyPower(this.#game);
      this.#game.setLastPurchasedCode(code);

      this.#upgradeView?.notify();
      this.#view.notify();
      return;
    }

    const buildings = await Building.getAll();
    const building = buildings.find(b => b.getCode() === code);

    if (building && building.getCost() <= this.#game.totalHits) {
      await this.#game.buyBuilding(building);
      this.#game.setLastPurchasedCode(code);

      this.#buildingView?.notify();
      this.#view.notify();
      return;
    }
  }
}


   /**
   * initMarkov
   *
   * Loads model.json from the public folder and creates
   * the MarkovChain instance used for RoboBuy.
   *
   */
 async initMarkov(): Promise<void> {
    try {
      const response = await fetch("/model.json");
      if (!response.ok) {
        throw new Error(`Failed to load model.json: ${response.status}`);
      }

      const model = (await response.json()) as MarkovModel;
      this.#markov = new MarkovChain(model);
    } catch (error) {
      console.error("Markov model failed to load:", error);
    }
  }

toggleRoboBuy() {
  this.#game.toggleRoboBuy();
}

  // getter for the current game instance
  get game(): Game {
    return this.#game;
  }
}

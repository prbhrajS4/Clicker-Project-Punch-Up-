import Upgrade from "./upgrade";
import Game from "../game";

export default class Multiplicative extends Upgrade {
    // constructor(id: number, cost: number, powerUp: number, description: string) {
    //     super(id, "doubletap", "Double Tap", cost, powerUp, description);
    // }

    override applyPower(game: Game): void {
        game.multiply(this.powerUp);

    }
}
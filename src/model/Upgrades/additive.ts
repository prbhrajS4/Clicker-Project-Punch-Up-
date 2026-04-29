import Upgrade from "./upgrade";
import Game from "../game";
/**
 * inherited from upgrades
 */

 export default class Additive extends Upgrade {
    // constructor(id: number, cost: number, powerUp: number, description: string) {
    //     super(id, "boom", "Boom", cost, powerUp, description);
    // }

    override applyPower(game: Game): void {
        game.increasePunchPower(this.powerUp);
    }
}
 
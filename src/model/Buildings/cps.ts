
/**
 * Gattling inherited from buildings
 * 
 */

import Game from "../game";
import Building from "./building";

export default class CPS extends Building {
    // constructor(id: number, cost: number, cps: number, description: string) {
    //     super(id, "gattling", "Gattling", cost, cps, description);
    // }

    override autoHit(game: Game): void {
        game.autoHit(this.cps);

    }
}
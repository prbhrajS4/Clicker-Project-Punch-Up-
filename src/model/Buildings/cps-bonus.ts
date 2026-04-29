import type Game from "../game";
import Building from "./building";

/**
 * helping hand inherited from building
 */
export default class CPSBonus extends Building{
    // constructor(id: number, cost: number, cps: number, description: string) {
    //     super(id, "helpinghand", "Helping Hand", cost, cps, description);
    // }

    autoHit(game: Game): void {
        game.autoHit(this.cps);
        game.increasePunchPower(this.bonus);
    }
}
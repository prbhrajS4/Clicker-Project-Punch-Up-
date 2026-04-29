import { assert } from "../../assertions";
import db from "../connection";
import type Game from "../game";



/**
 * Abstract class Upgrade : This is the parent class for upgrades
 * Increases the power of the punches by the stores value
 * 
 * abstract class so no direct instances
 */
export default abstract class Upgrade{
    protected id: number;
    protected code: string;
    protected powerUp : number; // protected method due to the need of it being used by the sub classes
    protected  name: string;
    protected cost: number;
    protected description: string;

    constructor(id: number, code: string, name: string, cost: number, powerUp: number, description: string) {

        if (!name) throw new Error("name cannot be empty");
        if (cost < 1) throw new Error("cost must be >=1");
        if (powerUp < 1) throw new Error("powerUp must be >=1");

        this.id = id;
        this.code = code;
        this.name = name;
        this.cost = cost;
        this.powerUp = powerUp;
        this.description = description;
        this.checkUpgrade();
    }


    /**
    * Inventory loading: loads all entrties from the inventory table
    * queries the db and gets every row
    * loops through every db row returned
    * @returns array
    */
     static async getAll(): Promise<Upgrade[]> {
        const result = await db().query<{
            id: number;
            code: string;
            name: string;
            cost: number;
            powerup: number;
            effect_type: string;
            description: string;
        }>("SELECT * FROM upgrade_inventory ORDER BY id");

        const upgrades: Upgrade[] = [];

        for (const row of result.rows) {
           upgrades.push(await Upgrade.createFromRow(row));
        }

        return upgrades;
    }

       static async createFromRow(row: {
        id: number;
        code: string;
        name: string;
        cost: number;
        powerup: number;
        effect_type: string;
        description: string;
    }): Promise<Upgrade> {
        switch (row.effect_type) {
            case "add": {
                const { default: Additive } = await import("./additive.ts");
                return new Additive(
                    row.id,
                    row.code,
                    row.name,
                    row.cost,
                    row.powerup,
                    row.description
                );
            }

            case "multiply": {
                const { default: Multiplicative} = await import("./multiplicative.ts");
                return new Multiplicative(
                    row.id,
                    row.code,
                    row.name,
                    row.cost,
                    row.powerup,
                    row.description
                );
            }

            default:
                throw new Error(`Unknown upgrade effect type: ${row.effect_type}`);
        }
    }
    getId(): number {
        return this.id;
    }

    getCode(): string {
        return this.code;
    }

    getName(): string {
        return this.name;
    }

    getCost(): number {
        return this.cost;
    }

    getPowerUp(): number {
        return this.powerUp;
    }

    getDescription(): string {
        return this.description;
    }

    applyPower(game: Game): void {
        game.increasePunchPower(this.powerUp);
    }
    protected checkUpgrade() {
        assert(this.powerUp >=1, "cps should be greater than equal to 1");
        assert(this.name != null, "name cannot be empty");
         assert(this.cost >0, "cost has to greater than 0");
        assert(this.description != null, "description cannot be null");
        assert(this.code != null, "description cannot be null");
        assert(this.id != null,"id cannot be null");


        }
}


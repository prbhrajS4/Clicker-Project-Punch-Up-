import { assert } from "../../assertions";
import db from "../connection";
import type Game from "../game";

export default abstract class Building {

    protected id: number;
    protected code: string;
    protected name: string;
    protected cost: number;
    protected cps: number;
    protected bonus: number;
    protected description: string;

    constructor(id: number, code: string,name: string, cost: number, cps: number, bonus: number , description: string) {

        if (!name) throw new Error("name cannot be empty");
        if (cost < 1) throw new Error("cost must be >=1");
        if (cps < 1) throw new Error("CPS must be >=1");

        this.id = id;
        this.code = code;
        this.name = name;
        this.cost = cost;
        this.cps =cps;
        this.bonus = bonus;
        this.description = description;

        this.checkBuilding();
    }

   /**
    * Inventory loading: loads all entrties from the inventory table
    * queries the db and gets every row
    * loops through every db row returned
    * @returns array
    */
    static async getAll(): Promise<Building[]> {
         const result = await db().query<{
                    id: number;
                    code: string;
                    name: string;
                    cost: number;
                    cps: number;
                    bonus: number;
                    effect_type: string;
                    description: string;
                }>("SELECT * FROM building_inventory ORDER BY id");
        
                const buildings: Building[] = [];
        
                for (const row of result.rows) {
                    buildings.push(await Building.createFromRow(row));

                }
        return buildings;
    }
    // Converts a single database row into the correct Building subclass object
      static async createFromRow(row: {
        id: number;
        code: string;
        name: string;
        cost: number;
        cps: number;
        bonus: number;
        effect_type: string;
        description: string;
    }): Promise<Building> {
        switch (row.effect_type) {
            case "cps_only": {
                const { default: CPS } = await import("./cps.ts");
                return new CPS(
                    row.id,
                    row.code,
                    row.name,
                    row.cost,
                    row.cps,
                    row.bonus,
                    row.description
                );
            }

            case "cps&power": {
                const { default: CpsAndPunchBuilding } = await import("./cps-bonus.ts");
                return new CpsAndPunchBuilding(
                    row.id,
                    row.code,
                    row.name,
                    row.cost,
                    row.cps,
                    row.bonus,
                    row.description
                );
            }

            default:
                throw new Error(`Unknown building effect_type: ${row.effect_type}`);
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

    getCPS(): number {
        return this.cps;
    }

    getDescription(): string {
        return this.description;
    }


    autoHit(game: Game): void {
        game.autoHit(this.cps);
    }

     protected checkBuilding() {
        assert(this.cps >=1, "cps should be greater than equal to 1");
        assert(this.name != null, "name cannot be empty");
         assert(this.cost >0, "cost has to greater than 0");
        assert(this.description != null, "description cannot be null");
        assert(this.code != null, "description cannot be null");
        assert(this.id != null,"id cannot be null");


        }

}
import { assert } from "../assertions";
import type Building from "./Buildings/building";
import Upgrade from "./Upgrades/upgrade";
import db from "./connection";
import type Listener from "./listener";

/**
 * Game Class : main domain model class 
 * Stores current power, hits, upgrades, buildings
 * Handles click logic, buying upgrades/buildings, and notifying listeners
 * does persistence using sql
 */
export default class Game {

    id?: number;
    #username: string;
    #punchPower: number;
    #totalHits: number;
    #upgrades: Upgrade[];
    #buildings: Building[];
    #listeners = new Array<Listener>();
    #roboBuyEnabled: boolean;
    #lastPurchasedCode: string | null ;


    constructor(username: string, punchPower: number, totalHits: number) {
        this.#username = username;
        this.#punchPower = punchPower;
        this.#totalHits = totalHits;
        this.#upgrades = [];
        this.#buildings = [];
        this.#roboBuyEnabled = false;
        this.#lastPurchasedCode =null; 
        this.#checkGame();
    }

    // adds hits based on punch power and saves game
    async punch(): Promise<number> {
        this.#totalHits += this.#punchPower;
        this.#checkGame();
        this.#notifyAll();
        if (this.id !== undefined) {
            await Game.saveGame(this);
        }
        return this.#totalHits;
    }

    // adds hits (used by buildings which add hits automatically)
    async autoHit(hits: number): Promise<number> {
        this.#totalHits += hits;
        this.#checkGame();
        this.#notifyAll();
        if (this.id !== undefined) {
            await Game.saveGame(this);
        }
        return this.#totalHits;
    }

    // used by upgrades to increase the power
    increasePunchPower(amount: number) {
        this.#punchPower += amount;
        this.#checkGame();
        this.#notifyAll();
    }

    multiply(multiplier: number) {
        this.#punchPower *= multiplier;
        this.#checkGame();
        this.#notifyAll();
    }


    /**
     *  buy methods for upgrades and buiildigns
     * if current clicks are less than cost does not buy
     * decreases hits and adds upgrade to the array and saves
     * 
     */
    async buyUpgrade(upgrade: Upgrade): Promise<void> {
        if (this.totalHits < upgrade.getCost()) throw new Error("Not enough hits");
        this.#totalHits -= upgrade.getCost();
        this.#upgrades.push(upgrade);
        // upgrade.applyPower(this);
        if (this.id !== undefined) {
            await Game.saveUpgrade(this.id, upgrade);
        }
        this.#checkGame();
        this.#notifyAll();
    }

    async buyBuilding(building: Building): Promise<void> {
        if (this.totalHits < building.getCost()) throw new Error("Not enough hits");
        this.#totalHits -= building.getCost();
        this.#buildings.push(building);
        // building.autoHit(this);
        if (this.id !== undefined) {
            await Game.saveBuilding(this.id, building);
        }
        this.#checkGame();
        this.#notifyAll();
    }



    /**
     * load or create game
     * gets game of the entered username, if doesnt exist then creates one, else creates a new game and loads the saved data into it
     * @param username 
     * @returns 
     */
    static async loadOrCreateGame(username: string): Promise<Game> {
        const results = await db().query<{
            id: number, username: string, punchpower: number, totalhits: number
        }>("SELECT id, username, punchPower, totalHits FROM game WHERE username=$1", [username]);

        let game: Game;

        if (results.rows.length === 0) {
            game = new Game(username, 1, 0);
            const insertResult = await db().query<{ id: number }>(
                "INSERT INTO game(username, punchPower, totalHits) VALUES($1,$2,$3) RETURNING id",
                [username, game.punchPower, game.totalHits]
            );
            game.id = insertResult.rows[0].id;
        } else {
            const row = results.rows[0];
            game = new Game(row.username, row.punchpower, row.totalhits);
            game.id = row.id;
        }

        // Load purchased buildings and upgrades
        await Game.loadBuildings(game);
        await Game.loadUpgrades(game);

        return game;
    }

    // saves game by saving id, pp, and total hits
    static async saveGame(game: Game) {
        if (!game.id) throw new Error("Cannot save game without ID");
        await db().query("UPDATE game SET punchPower=$1, totalHits=$2 WHERE id=$3",
            [game.punchPower, game.totalHits, game.id]);
    }

    /**
     * saving upgrades
     * gets the upgrade from the inventory
     * if doesnt already have one inserts one or else updates quantity into existeing one by +1
     * @param gameId 
     * @param upgrade 
     */
    static async saveUpgrade(gameId: number, upgrade: Upgrade) {
        const existing = await db().query<{ id: number, quantity: number }>(
            "SELECT id, quantity FROM upgrade WHERE gameid=$1 AND upgradeinventoryid=$2",
            [gameId, upgrade.getId()]
        );
        if (existing.rows.length > 0) {
            await db().query("UPDATE upgrade SET quantity=quantity+1 WHERE id=$1", [existing.rows[0].id]);
        } else {
            await db().query(
                "INSERT INTO upgrade(gameid, upgradeinventoryid, quantity) VALUES($1,$2,1)",
                [gameId, upgrade.getId()]
            );
        }
    }
    
    /**
     * loads upgrades into the game based on the quantity we have saved(pushes one by one)
     * @param game 
     */
    static async loadUpgrades(game: Game) {
            const rows = await db().query<{ upgradeinventoryid: number, quantity: number }>(
                "SELECT upgradeinventoryid, quantity FROM upgrade WHERE gameid=$1",
                [game.id]
            );

            const inventory = await (await import("./Upgrades/upgrade")).default.getAll();
            for (const row of rows.rows) {
                const upgrade = inventory.find(u => u.getId() === row.upgradeinventoryid);
                if (upgrade) {
                    for (let i = 0; i < row.quantity; i++) {
                        game.upgrades.push(upgrade);
                        upgrade.applyPower(game);
                    }
                }
            }
        }



        // same methods but for buildings................

    static async saveBuilding(gameId: number, building: Building) {
        const existing = await db().query<{ id: number, quantity: number }>(
            "SELECT id, quantity FROM building WHERE gameid=$1 AND buildinginventoryid=$2",
            [gameId, building.getId()]
        );

        if (existing.rows.length > 0) {
            await db().query("UPDATE building SET quantity=quantity+1 WHERE id=$1", [existing.rows[0].id]);
        } else {
            await db().query(
                "INSERT INTO building(gameid, buildinginventoryid, quantity) VALUES($1,$2,1)",
                [gameId, building.getId()]
            );
        }
    }

    // Loading buildings
    static async loadBuildings(game: Game) {
        const rows = await db().query<{ buildinginventoryid: number, quantity: number }>(
            "SELECT buildinginventoryid, quantity FROM building WHERE gameid=$1",
            [game.id]
        );

        const inventory = await (await import("./Buildings/building")).default.getAll();
        for (const row of rows.rows) {
            const building = inventory.find(b => b.getId() === row.buildinginventoryid);
            if (building) {
                for (let i = 0; i < row.quantity; i++) {
                    game.buildings.push(building);
                    building.autoHit(game); // trigger auto hit
                }
            }
        }
    }

    // roboBuy methods
    get roboBuyEnabled(): boolean {
    return this.#roboBuyEnabled; // returns whether the feature is on or not
    }

    get lastPurchasedCode(): string | null {
    return this.#lastPurchasedCode; // returns the last purchased items in order to get the next item in the list
    }

    setLastPurchasedCode(code: string) {
        this.#lastPurchasedCode = code;
    }

    toggleRoboBuy() {
        this.#roboBuyEnabled = !this.#roboBuyEnabled;
        this.#notifyAll();
    }

    // getters
    get username(): string{
        return this.#username;
    }
    get totalHits(): number {
        return this.#totalHits; 
    }
    get punchPower(): number { 
        return this.#punchPower; 
    }
    get upgrades(): Upgrade[] { 
        return this.#upgrades; 
    }
    get buildings(): Building[] { 
        return this.#buildings; 
    }

    get TotalCPS(): number {
        return this.#buildings.reduce((sum, b) => sum + b.getCPS(), 0);
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    #notifyAll() {
        this.#listeners.forEach(l => l.notify());
    }

    #checkGame() {
        assert(this.#punchPower >= 1, "Punch power must be >= 1");
        assert(this.#totalHits >= 0, "Total hits must be >= 0");
        assert(this.#upgrades.length >= 0, "Upgrades array cannot be negative");
    }


}
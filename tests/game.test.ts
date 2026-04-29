import { test, expect, beforeAll, afterAll, describe } from "vitest";
import Game from "../src/model/game";
import { Gattling } from "../src/model/Buildings/gattling";
import { HelpingHand } from "../src/model/Buildings/helpingHand";
import Boom from "../src/model/Upgrades/boom";
import DoubleTap from "../src/model/Upgrades/double-tap";
import Upgrade from "../src/model/Upgrades/upgrade";
import Account from "../src/model/security/account"
import Building from "../src/model/Buildings/building";
import DatabaseHash from "../src/model/security/database-hash";
//


//testing domain methods



test('punch works', () => {
    let g = new Game("test",1,0);
    g.punch();
    expect(g.totalHits).toBe(1);


});
test('can buy upgrade', () => {
    let g = new Game("test",1,100);

    let gp = new Boom(1, 50, 2, "Adds 2 punch power");
    g.buyUpgrade(gp);

    expect(g.upgrades).contains(gp);
});
test('upgrades work', ()=> {
    let g = new Game("test",1,0);;
    let hh = new DoubleTap(1, 50, 2, "Adds 2 punch power");

    hh.applyPower(g);
    expect(g.punchPower).toBeGreaterThan(1);
})

test('auto Hit works', ()=> {
    let g = new Game("test",1,500);
    let gg = new Gattling(1, 150, 3, "Adds 3 CPS");

    gg.autoHit(g);
    g.buyBuilding(gg);
    expect(g.TotalCPS).toBeGreaterThan(1);
});
test('can buy building', ()=> {
    let g = new Game("test",1,500);
    let hh = new HelpingHand(1, 150, 3, "Adds 3 CPS");

    // hh.autoHit(g);
    g.buyBuilding(hh);
    expect(g.buildings).contain(hh);
    
});


test("upgrade inventory contains boom and doubletap", async () => {
    const upgrades = await Upgrade.getAll();

    expect(upgrades).toBeDefined();
    expect(upgrades.length).toBe(2);
    expect(upgrades[0]).toBeInstanceOf(Boom);
    expect(upgrades[1]).toBeInstanceOf(DoubleTap);
});

test("building inventory contains gattling and helpinghand", async () => {
    const buildings = await Building.getAll();

    expect(buildings).toBeDefined();
    expect(buildings.length).toBe(2);
    expect(buildings[0]).toBeInstanceOf(Gattling);
    expect(buildings[1]).toBeInstanceOf(HelpingHand);
});


 test("can load or create a game", async () => {
        const hasher = new DatabaseHash();
        await Account.create("user", "password",hasher);
        const game = await Game.loadOrCreateGame("user");

        expect(game).toBeDefined();
        expect(game.username).toBe("user");
        expect(game.id).toBeDefined();
    });

 
    test("can save an upgrade", async () => {
            const hasher = new DatabaseHash();
        await Account.create("user7", "password",hasher);
        const game = await Game.loadOrCreateGame("user7");
        const boom = new Boom(1, 10, 2, "Adds punch power");

        await Game.saveUpgrade(game.id!, boom);

        const loaded = await Game.loadOrCreateGame("user7");

        expect(loaded).toBeDefined();
        expect(loaded.upgrades.length).toBeGreaterThan(0);
    });

    test("can load upgrades from saved game", async () => {
            const hasher = new DatabaseHash();
        await Account.create("user2", "password",hasher);
        const game = await Game.loadOrCreateGame("user2");
        const doubleTap = new DoubleTap(2, 20, 2, "Doubles punch power");

        await Game.saveUpgrade(game.id!, doubleTap);

        const loaded = await Game.loadOrCreateGame("user2");

        expect(loaded).toBeDefined();
        expect(loaded.upgrades.length).toBeGreaterThan(0);
        expect(loaded.punchPower).toBeGreaterThan(1);
    });

    test("can save a building", async () => {
            const hasher = new DatabaseHash();
        await Account.create("user3", "password",hasher);
        const game = await Game.loadOrCreateGame("user3");
        const gattling = new Gattling(1, 50, 1, "Adds CPS");

        await Game.saveBuilding(game.id!, gattling);

        const loaded = await Game.loadOrCreateGame("user3");

        expect(loaded).toBeDefined();
        expect(loaded.buildings.length).toBeGreaterThan(0);
    });

    test("can load buildings from saved game", async () => {
            const hasher = new DatabaseHash();
        await Account.create("user4", "password",hasher);
        const game = await Game.loadOrCreateGame("user4");
        const helpingHand = new HelpingHand(2, 100, 2, "Adds more CPS");

        await Game.saveBuilding(game.id!, helpingHand);

        const loaded = await Game.loadOrCreateGame("user4");

        expect(loaded).toBeDefined();
        expect(loaded.buildings.length).toBeGreaterThan(0);
        expect(loaded.TotalCPS).toBeGreaterThan(0);
    });


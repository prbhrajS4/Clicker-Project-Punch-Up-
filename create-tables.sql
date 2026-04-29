CREATE TABLE IF NOT EXISTS account (
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS game (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL REFERENCES account(username),
    punchpower INT NOT NULL,
    totalhits BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS upgrade_inventory (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    cost INT NOT NULL,
    powerup INT NOT NULL,
    --added-- 
    effect_type VARCHAR(50) NOT NULL,
    description TEXT
);

INSERT INTO upgrade_inventory (code, name, cost, powerup, effect_type, description)
VALUES
('jab', 'Jab', 50, 2,'add', 'Adds 2 punch power'),
('uppercut', 'Upper Cut', 100, 5,'add', 'Adds 5 punch power'),
('boom', 'Boom', 250, 20, 'add', 'Adds 20 punch power'),
('megaboom', 'Mega Boom', 500, 50, 'add', 'Adds 50 punch power'),
('doubletap', 'Double Tap', 5000, 2, 'multiply', 'Doubles current punch power')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS building_inventory (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    cost INT NOT NULL,
    cps INT NOT NULL,
    bonus INT NOT NULL DEFAULT 0, --added
    effect_type VARCHAR(50) NOT NULL,
    description TEXT
);


INSERT INTO building_inventory(code, name, cost, cps,bonus, effect_type, description)
VALUES
('autopunch', 'AutoPunch', 100, 2,0,'cps_only', 'Adds 2 CPS'),
('bot', 'Bot', 200, 5,0,'cps_only', 'Adds 5 CPS'),
('helpinghand', 'Helping Hand', 500, 5,15, 'cps&power', 'Adds 2 CPS and 10 punch power'),
('gattling', 'Gattling', 5000, 100,0,'cps_only', 'Adds 100 CPS'),
('poweroffriendship', 'Power of Friendship', 10000, 200,1000,'cps&power', 'Adds 200 CPS and 1000 PP')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS upgrade (
    id SERIAL PRIMARY KEY,
    gameid INT NOT NULL REFERENCES game(id),
    upgradeinventoryid INT NOT NULL REFERENCES upgrade_inventory(id),
    quantity INT NOT NULL DEFAULT 1,
    UNIQUE(gameid, upgradeinventoryid)
);

CREATE TABLE IF NOT EXISTS building (
    id SERIAL PRIMARY KEY,
    gameid INT NOT NULL REFERENCES game(id),
    buildinginventoryid INT NOT NULL REFERENCES building_inventory(id),
    quantity INT NOT NULL DEFAULT 1,
    UNIQUE(gameid, buildinginventoryid)
);

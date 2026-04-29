# Flows of Interaction

---
**Title** : Flows of Interactions for my clicker game 'Punch up'(name tbd) <br>
**Author**  : Prabhraj Singh Mudharh (mudharps@myumanitoba.ca) - 8012189 <br>
**date** : Winter 2026


---
### Hitting the target

This is for when you want to hit the target
```mermaid
flowchart
    subgraph **Hit Target**
    home[[Game Screen]]
    target[Click on target]
    hit{update target}
    success[[Target hit]]

    home==>target
    target == target clicked ==> hit
    hit-.update counter.->success
    end

```
### Phase 2

### Log In
This is to log into your account or create one in order to play a game.
```mermaid
    flowchart
    subgraph **Create/log Into Account**
    start[[Start screen]]
    input[Enter username &
    password]
    valid{ valid credential?}
    game[[Game screen]]
    create[create account]

    start==> input
    input== input given==> valid
    valid -.correct.-> game
    valid -.Acc doesnt exist.->create
    create== load game==> game
    valid -.Incorrect password.-> input
    end
```

### Purchasing an upgrade
This is for when you would want to view and purchase an upgrade
(Game screen is common for both exiting or completing any of the task result in ending up back there)
```mermaid
     flowchart
    subgraph **Buy Upgrade**
    home[[Game Screen]]
    upgrades[Select Upgrade]
    cart[Purchase?]
    apply{apply upgrade}
    finish[[Upgrade acquired]]

    home==> upgrades
    upgrades == selected upgrade==> cart
    cart==upgrade purchased==>apply
    cart==No upgrade purchased==>home
    cart==Not enough clicks==>home
    apply-.power increased.->finish
    end
```

### Purchase a Building
this is for when you want to purchase a building. This is the same as the upgrade one.
```mermaid
 flowchart
    subgraph **Buy Building**
    home[[Game Screen]]
    buildings[Select Building]
    cart[Purchase?]
    apply{apply effect}
    finish[[Building acquired]]

    home==> buildings
    buildings == selected building==> cart
    cart==building acquired==>apply
    cart==No building purchased==>home
    cart==Not enough clicks==>home
    apply-.auto hit enabled.->finish
    end
```

### Notes
Log in task has been shown. Upgrades and buildings now have a cost and the required changes have been reflected in the flows
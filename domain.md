# Domain model

---
**Title** : Domain model for my clicker game 'Punch up'<br>
**Author**  : Prabhraj Singh Mudharh (mudharps@myumanitoba.ca) - 8012189 <br>
**date** : Winter 2026


---


```mermaid
classDiagram

    note for Account "Class invariants:  <ul>
    <li> username is not empty
    <li> username is unique
    <li> password is not empty
    <li> 0 or 1 game per account
    </ul>"

    class Account {
        ~string username
        -string  passwordHash

        +login(string username, string password)
        +create(string username, string password)
    }



    note for Game "Invariant Properties:
    <ul>
        <li>punchPower >=1
        <li>totalHits >=0
        <li>upgrades.length >=0
        <li>buildings.length >=0
        <li>A game is linked to only 1 account
        <li>
    </ul"
    class Game{
        ~id number
        -Account account
       -number punchPower
       -number totalHits
       -Array<Upgrade> upgrades
       -Array<Building> buildings

       +buyUpgrade(Upgrade upgrade)
       +buyBuilding(Building building)
       +punch(number punchPower)
       +autoHits(hits number)
       +increasePunchPower(number amount)
       +multiply(number multiplier)
       +saveMethods()
    }

    

    note for Upgrade "Invariant Properties:
    <ul>
        <li>powerUp >=1
        <li>name is not empty
        <li>cost >=1
        <li>description is not empty
        <li>id is not null
    </ul"
    class Upgrade{
        <<abstract>>
        -id number
        -code string
        ~string name
        -number cost
        -number PowerUp
        -string description
        
        +applyPower(Game game)
        +getAll() : upgrade[]
    }

    class Additive{
        +applyPower(Game game)
    }

    class Multiplicative{
        +applyPower(Game game)
    }

    class CPS{
        +autoHit(Game game)
    }
    class CPSBonus{
        +autoHit(Game game)
    }

    note for Building "Invariant Properties:
    <ul>
        <li>CPS >=1
        <li>name is not empty
        <li>cost >=1
        <li>description is not empty
        <li>id is not null
    </ul"
    class Building{
        <<abstract>>
        -id number
        -code string
        ~string name
        -number cost
        -number CPS
        -number bonus
        -string description


        +autoHit(Game game)
        +getAll() : buildings[]

    }

    Account "1" *--o "1" Game
    Game "1" *--o "*" Upgrade
    Upgrade <|--Additive
    Upgrade<|--Multiplicative
    Building <|-- CPS
    Building <|-- CPSBonus
    Game  "1" *--o "*" Building
    
```

### Notes
 Domain model is now more granular ( contains more details). Cardinality has been added showing bidirectional relationship wherever neccessary.
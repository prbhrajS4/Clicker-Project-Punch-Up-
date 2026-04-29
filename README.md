# Clicker Project

---
**Title** : Project phase 3, design  & implementation for my clicker game 'Punch up' <br>
**Author**  : Prabhraj Singh Mudharh (mudharps@myumanitoba.ca) - 8012189 <br>
**date** : Winter 2026


---

## Running

You can start my app using `npm` and `npx`:

```bash
npm install
npx vite
```

## Training program

You can run my training program after installing `npm`. The data file `training.csv` is already present . To run you can :

```bash
npx ts.node src/train.ts
```

Running this will create a file `model.json` in the root of the prgram. I request to you that kindly move the file into the `public` folder. This will now allow the markov chain to run without problems as I have tested on multiple devices.

## Other docs

* You can find my domain model in `domain.md`.
* You can find my flows of interaction in `flows.md`.
* You can see my ddl table `create-tables.sql`.
* You can find my UI assesment in `ui-assessment.md`.


## Overview 
This is the phase 3 for the clicker game for COMP 2452. The objective of the game is to click on the target on screen which 'does something' in this case increase the counter(for now). Uprgrades can be purchased which would increase the power of the clicks wheras buildings add auto clicks. The game also includes an auto purchase system, Robo Buy. It will automatically buy items for you.
 
An account is need in order to play the game. Username must be unique and passwords are secured(web crypto and pkbdf2). A game is saved to the account and is loaded upon logging in.

## Notes

This is much more advanced implementation than phase 1. clicks are added automatically. Inheritence is used for buuildings and upgrades becuase of slightly unique behavior. 
2 different hasher are used in the program because the one used for database does not work while testing. Interface is used there to implement both.
Testing is done. All tests passed with >70% lines covered for the model

The images used in the display have been created with the help of AI (Chat GPT). Help taken from AI to learn and improve look.

### changes from phase 2

All purchasable are now created from inventory, no hard coded instances. Sub classes still used but changed name for clarity.

Robo buy feature is now fully implemented. Trains data from the file provided and creates a markov model. Uses probability to auto buy items. 

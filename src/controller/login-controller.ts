import LoginView from "../view/login-view";
import Account from "../model/security/account";
import Game from "../model/game";
import GameController from "./game-controller";
import DatabaseHash from "../model/security/database-hash";

/**
 * Login controller class: coordinates login input from login cview
 * takes input regarding logining in or registering an account from the view
 */
export default class LoginController {
    #view: LoginView;
    #hasher : DatabaseHash;  // hash method for main project (DB PKBDF2)

    constructor() {
        this.#view = new LoginView(this); // initiallizes view and hasher
        this.#hasher = new DatabaseHash();
    }

    /**
     *  login method : if clicked on login
     *  if account esists loads game else shows error
     * @param username account name entered
     * @param password entered
     */
    async login(username: string, password: string) {
        try {
            const account = await Account.login(username, password,this.#hasher);

            const game = await Game.loadOrCreateGame(account.getUsername());

            new GameController(game);
        } catch (err) {
            this.#view.showError("Invalid username or password");
        }
    }
    // if clicked on register 
    async register(username: string, password: string) {
        try {
            // Account.create handles hashing internally
            await Account.create(username, password,this.#hasher);
            this.#view.showSuccess(`Account created for ${username}. You can log in now.`);
        } catch (err) {
            this.#view.showError("Failed to create account: " + err);
        }
    }
}


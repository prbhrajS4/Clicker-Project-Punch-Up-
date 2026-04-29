import db from "../connection";
import { AccountAlreadyExistsException, AccountDoesNotExistException, IncorrectPasswordException, InvalidPasswordException, InvalidUsernameException } from "../exceptions.ts";
import type DatabaseHash from "./database-hash.ts";


/**
 * Model class Account : Handles Accounts and behaviours
 * 
 */
export default class Account {
    #username: string;  // username of account
    #passwordHash: string; //hashed password

    constructor(username: string, passwordHash: string) {
        this.#username = username;
        this.#passwordHash = passwordHash;

        //esuring correct values 
        if (this.#username.length === 0) {
            throw new InvalidUsernameException();
        }

        if (this.#passwordHash.length === 0) {
            throw new InvalidPasswordException();
        }
    }

    /**
     *  creates an accounts
     * first chacks if an account with same account doesnt already exist
     * hashes password and saves the account into the Database
     * @param username 
     * @param password 
     * @param hasher 
     * @returns new Account
     */
    static async create(username: string, password: string, hasher: DatabaseHash
    ): Promise<Account> {
        const checkResults = await db().query<{ username: string }>(
            "select username from account where username = $1",
            [username]
        );

        if (checkResults.rows.length > 0) {
            throw new AccountAlreadyExistsException();
        }

        const passwordHash = await hasher.hashPassword(password);

        await db().query(
            "insert into account(username, password) values($1, $2)",
            [username, passwordHash]
        );

        return new Account(username, passwordHash);
    }

    /**
     *  logs into an account
     * enters password into the account which username has been provided
     * 
     * @param username 
     * @param password 
     * @param hasher 
     * @returns 
     */
    static async login(username: string, password: string, hasher: DatabaseHash
    ): Promise<Account> {
        const results = await db().query<{ password: string }>(
            "select password from account where username = $1", // load username from db
            [username]
        );

        if (results.rows.length === 0) {
            throw new AccountDoesNotExistException();
        }

        const storedPasswordHash = results.rows[0].password;
        const isValid = await hasher.verifyPassword(password, storedPasswordHash);

        if (!isValid) {
            throw new IncorrectPasswordException();
        }

        return new Account(username, storedPasswordHash);
    }

    //getter
    getUsername(): string {
        return this.#username;
    }
}

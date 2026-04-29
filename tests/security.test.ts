import db from "../src/model/connection";
import { test, expect, describe } from "vitest";

import Account from "../src/model/security/account";
import { AccountAlreadyExistsException, AccountDoesNotExistException, IncorrectPasswordException, InvalidPasswordException, InvalidUsernameException } from "../src/model/exceptions.ts";
import TestHash from "../src/model/security/test-hash"

const hasher = new TestHash();

test("cannot create account with empty username", () => {
  expect(() => new Account("", "pass")).toThrow(InvalidUsernameException);
});

test("cannot create account with empty password", () => {
  expect(() => new Account("user", "")).toThrow(InvalidPasswordException);
});


test("same password produces same hash", async () => {
  const h1 = await hasher.hashPassword("test");
  const h2 = await hasher.hashPassword("test");
  expect(h1).toBe(h2);
});

test("different passwords produce different hashes", async () => {
  const h1 = await hasher.hashPassword("test1");
  const h2 = await hasher.hashPassword("test2");
  expect(h1).not.toBe(h2);
});

describe("Account integration tests", () => {

  test("create works when username does not exist", async () => {
    const username = "test_user_create_1";
    const password = "mypassword";

    const acc = await Account.create(username, password, hasher);

    expect(acc).toBeDefined();
    expect(acc.getUsername()).toBe(username);

    const result = await db().query(
      "select username from account where username = $1",
      [username]
    );

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].username).toBe(username);
  });

  test("create throws if account already exists", async () => {
    const username = "test_user_exists_1";
    const password = "mypassword";

    await Account.create(username, password, hasher);

    await expect(Account.create(username, password, hasher)).rejects.toThrow(AccountAlreadyExistsException);
  });

  test("login works with correct username and password", async () => {
    const username = "test_user_login_1";
    const password = "mypassword";

    await Account.create(username, password, hasher);

    const acc = await Account.login(username, password, hasher);

    expect(acc).toBeDefined();
    expect(acc.getUsername()).toBe(username);
  });

  test("login throws if account does not exist", async () => {
    await expect(Account.login("test_user_does_not_exist", "pass", hasher))
      .rejects
      .toThrow(AccountDoesNotExistException);
  });

  test("login throws if password is incorrect", async () => {
    const username = "test_user_wrong_pass_1";
    const password = "mypassword";

    await Account.create(username, password, hasher);

    await expect(Account.login(username, "wrongpassword", hasher))
      .rejects
      .toThrow(IncorrectPasswordException);
  });
});
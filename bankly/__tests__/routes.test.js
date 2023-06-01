// Set ENV VAR to test before we load anything, so our app's config will use
// testing settings
"use strict";
process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// tokens for our sample users
const tokens = {};

/** before each test, insert u1, u2, and u3  [u3 is admin] */

beforeEach(async function () {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1);
  }

  let sampleUsers = [
    ["u1", "fn1", "ln1", "email1", "phone1", await _pwd("pwd1"), false],
    ["u2", "fn2", "ln2", "email2", "phone2", await _pwd("pwd2"), false],
    ["u3", "fn3", "ln3", "email3", "phone3", await _pwd("pwd3"), true]
  ];

  for (let user of sampleUsers) {
    await db.query(
      `INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      user
    );
    tokens[user[0]] = createToken(user[0], user[6]);
  }
});

describe("POST /auth/register", function () {
  test("should allow a user to register in", async function () {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "new_user",
        password: "new_password",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("new_user");
    expect(admin).toBe(false);
  });

  test("should not allow a user to register with an existing username", async function () {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "u1",
        password: "pwd1",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: 400,
      message: `There already exists a user with username 'u1'`
    });
  });
});

describe("POST /auth/login", function () {
  test("should allow a correct username/password to log in", async function () {
    const response = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "pwd1"
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("u1");
    expect(admin).toBe(false);
  });
});

describe("GET /users", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(401);
  });

  //TEST BUG #1 , 1 OF 2
  test("should deny access if invalid token is provided", async function () {
    const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBob2VuaXgiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTY4NTU2OTEzNX0.w6rPUND1_i5RfUxH8vIB0mz_dy4S8cdJwuTjZU0zpz";
    const response = await request(app)
      .get("/users")
      .send({ _token: randomToken });
    expect(response.statusCode).toBe(401);
  });

  test("should list all users", async function () {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
  });

  //TEST BUG #2 
  test("should only list basic info on users", async function () {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users).toEqual([{
      username: "u1",
      first_name: "fn1",
      last_name: "ln1"
    },
    {
      username: "u2",
      first_name: "fn2",
      last_name: "ln2"
    },
    {
      username: "u3",
      first_name: "fn3",
      last_name: "ln3"
    }]
    );
  });


});

describe("GET /users/[username]", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).get("/users/u1");
    expect(response.statusCode).toBe(401);
  });


  //TEST BUG #1 , 2 OF 2
  test("should deny access if invalid token provided", async function () {
    const randomToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBob2VuaXgiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTY4NTU2OTEzNX0.w6rPUND1_i5RfUxH8vIB0mz_dy4S8cdJwuTjZU0zpz";
    const response = await request(app).get("/users/u1")
      .send({ _token: randomToken });
    expect(response.statusCode).toBe(401);
  });

  //TEST BUG #3
  test("should return 404 if user does not exit", async function () {
    const response = await request(app)
      .get("/users/NonexistantUser")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(404);
  })

  test("should return data on u1", async function () {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1"
    });
  });
});

describe("PATCH /users/[username]", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).patch("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should deny access if not admin/right user", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u2 }); // wrong user!
    expect(response.statusCode).toBe(401);
  });

  test("should patch data if admin", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u3, first_name: "new-fn1" }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });

  test("should disallow patching not-allowed-fields", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, admin: true });
    expect(response.statusCode).toBe(403);
  });

  //TEST BUG #5
  test("should disallow patching non-existing-fields", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, isCool: true });
    expect(response.statusCode).toBe(403);
  });

  test("should return 404 if cannot find", async function () {
    const response = await request(app)
      .patch("/users/not-a-user")
      .send({ _token: tokens.u3, first_name: "new-fn" }); // u3 is admin
    expect(response.statusCode).toBe(404);
  });

  //TEST BUG #4
  test("should patch data if correct user", async function () {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, first_name: "new-fn1" });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });
});

describe("DELETE /users/[username]", function () {
  test("should deny access if no token provided", async function () {
    const response = await request(app).delete("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should deny access if not admin", async function () {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(401);
  });

  test("should allow if admin", async function () {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u3 }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "deleted" });
  });

  //TEST BUG #6
  test("should give 404 error if user cannot be found", async function () {
    const resp1 = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u3 }); // u3 is admin

    const resp2 = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u3 }); // u3 is admin

    expect(resp2.statusCode).toEqual(404);
  });

});

afterEach(async function () {
  await db.query("DELETE FROM users");
});

afterAll(function () {
  db.end();
});

const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

test("should register a new user", async () => {
  const response = await request(app)
    .post("/api/users/register")
    .send({
      username: "testuser",
      password: "password123",
      email: "test@example.com",
    });

  expect(response.statusCode).toBe(201);
  expect(response.body.user).toHaveProperty("id");
  expect(response.body).toHaveProperty("token");
});

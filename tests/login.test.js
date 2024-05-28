import { jest } from "@jest/globals";
import supertest from "supertest";

const userData = {
  email: "user@example.com",
  password: "password123",
  subscription: "starter",
  _id: "1",
};

const token = "fakeToken123";

jest.unstable_mockModule("../services/authServices.js", () => ({
  default: {
    findUser: jest.fn().mockResolvedValue(userData),
    updateUser: jest.fn().mockResolvedValue({
      ...userData,
      token,
    }),
  },
}));

jest.unstable_mockModule("../helpers/compareHash.js", () => ({
  default: jest.fn().mockResolvedValue(true),
}));

jest.unstable_mockModule("../helpers/jwt.js", () => ({
  createToken: jest.fn().mockReturnValue(token),
  verifyToken: jest.fn().mockReturnValue({ id: userData._id }),
}));

const app = (await import("../app.js")).default;

describe("POST /login", () => {
  it("should respond with a 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/users/login")
      .send({ email: userData.email, password: userData.password });

    expect(response.statusCode).toBe(200);
  }, 5000);

  it("should return a token", async () => {
    const response = await supertest(app)
      .post("/api/users/login")
      .send({ email: userData.email, password: userData.password });

    expect(response.body.token).toBe(token);
  }, 5000);

  it("should return a user object with email and subscription", async () => {
    const response = await supertest(app)
      .post("/api/users/login")
      .send({ email: userData.email, password: userData.password });

    expect(response.body.user).toEqual({
      email: userData.email,
      subscription: userData.subscription,
    });
  }, 5000);
});

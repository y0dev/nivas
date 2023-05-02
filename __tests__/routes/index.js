const request = require("supertest");
const jwt = require("jsonwebtoken");
const server = require("../../server");

const prefix = "/api/v1";
let route = "user";

describe(`POST ${prefix}/${route}/signup`, () => {
  test("should create a new user", async () => {
    const res = await request(server).post(`${prefix}/${route}/signup`).send({
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "password456",
      passwordConfirmation: "password456",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("token");
  });
});

describe(`POST ${prefix}/${route}/login`, () => {
  test("should create a new user", async () => {
    const res = await request(server).post(`${prefix}/${route}/login`).send({
      email: "johndoe@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("token");
  });
});

describe("Protected User Routes", () => {
  let token;

  beforeAll(() => {
    // Generate a JWT token with a secret key
    token = jwt.sign(
      { id: "64506cb89d4a4b184ec94de0" },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );
  });

  test(`GET ${prefix}/${route}/logout`, async () => {
    // Send a GET request to the protected endpoint with the JWT token in the Authorization header
    const res = await request(server)
      .get(`${prefix}/${route}/logout`)
      .set("Authorization", `Bearer ${token}`);

    // Expect the response to have a 200 status code
    expect(res.body).toHaveProperty("status");
    expect(res.statusCode).toEqual(200);
  });
});

// route = "mls";
// describe("Protected MLS Routes", () => {
//   let token;

//   beforeAll(() => {
//     // Generate a JWT token with a secret key
//     token = jwt.sign(
//       { id: "64506cb89d4a4b184ec94de0" },
//       process.env.SECRET_KEY,
//       {
//         expiresIn: process.env.JWT_EXPIRES,
//       }
//     );
//   });

//   test(`GET ${prefix}/${route}/searchZip`, async () => {
//     // Send a GET request to the protected endpoint with the JWT token in the Authorization header
//     const res = await request(server)
//       .post(`${prefix}/${route}/searchZip`)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ zip_code: "75071" });

//     // Expect the response to have a 200 status code
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("status");
//     expect(res.body).toHaveProperty("results");
//   });

//   // test("GET /protected should return 401 if no token provided", async () => {
//   //   // Send a GET request to the protected endpoint without the JWT token in the Authorization header
//   //   const res = await request(server).get("/protected");

//   //   // Expect the response to have a 401 status code
//   //   expect(res.statusCode).toEqual(401);
//   // });
// });

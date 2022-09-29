const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv")?.config({ path: "./config.env" });

const { createClient } = require("redis");

// Development
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// const knex = require("knex")({
//   client: "pg",
//   connection: process.env.DATABASE_URI,
// });

// Production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URI,
    ssl: { rejectUnauthorized: false },
  },
});

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const imageApi = require("./controllers/imageapi");
const auth = require("./middleware/authorization");

const app = express();

// Development
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//   })
// );

// Production
app.use(
  cors({
    origin: ["https://face-detect-m-brain.herokuapp.com/"],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

// Development
{
  /* const redisClient = createClient({ url: process.env.REDIS_URI }); */
}

// Production
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

(async function redisConnection() {
  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();
})();

app.get("/", (_req, res) => res.send("App is running"));

app.post("/register", register.handleRegister(redisClient, knex, bcrypt));

app.post("/signin", signin.handleSigninAuth(redisClient, knex, bcrypt));

app.get(
  "/profile/:id",
  auth.requireAuth(redisClient),
  profile.handleProfileGet(knex)
);

app.put(
  "/profile/:id",
  auth.requireAuth(redisClient),
  profile.handleProfileUpdate(knex, bcrypt)
);

app.put("/image", auth.requireAuth(redisClient), image.handleImage(knex));

app.post("/imageurl", auth.requireAuth(redisClient), imageApi.handleApiCall());

app.listen(process.env.PORT || 3001, () => {
  console.log(`App is running on port ${process.env.PORT || 3001}`);
});

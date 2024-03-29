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

const redisClient = createClient({ url: process.env.REDIS_URI });

(async function redisConnection() {
  redisClient
    .on("connect", () => console.log("Connected to Redis"))
    .on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();
})();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const imageApi = require("./controllers/imageapi");
const auth = require("./middleware/authorization");

const app = express();

// Development
// app.use(cors());

// Production
const corsOptions = { origin: ["https://face-detect-m.herokuapp.com"] };
app.use(
  cors(corsOptions)
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));

app.get("/", cors(), (_req, res) => res.send("App is running"));

app.post(
  "/register",
  cors(),
  register.handleRegister(redisClient, knex, bcrypt)
);

app.post("/signin", cors(), signin.handleSigninAuth(redisClient, knex, bcrypt));

app.get(
  "/profile/:id",
  cors(),
  auth.requireAuth(redisClient),
  profile.handleProfileGet(knex)
);

app.put(
  "/profile/:id",
  cors(),
  auth.requireAuth(redisClient),
  profile.handleProfileUpdate(knex, bcrypt)
);

app.put(
  "/image",
  cors(),
  auth.requireAuth(redisClient),
  image.handleImage(knex)
);

app.post(
  "/imageurl",
  cors(),
  auth.requireAuth(redisClient),
  imageApi.handleApiCall()
);

app.listen(process.env.PORT || 3001, () => {
  console.log(`App is running on port ${process.env.PORT || 3001}`);
});

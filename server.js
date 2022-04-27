const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv")?.config({ path: "./config.env" });

// Production

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

// Development

// const knex = require("knex")({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     user: "mohamedh.aly",
//     password: "",
//     database: "smart-brain",
//   },
// });

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const imageApi = require("./controllers/imageapi");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) =>
  knex
    .select("*")
    .from("users")
    .then((data) => {
      res.send(data);
    })
);

app.post("/register", register.handleRegister(knex, bcrypt));

app.post("/signin", signin.handleSignin(knex, bcrypt));

app.get("/profile/:id", profile.handleProfileGet(knex));

app.put("/image", image.handleImage(knex));

app.post("/imageurl", (req, res) => {
  imageApi.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`App is running on port ${process.env.PORT || 3001}`);
});

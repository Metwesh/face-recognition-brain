const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "mohamedh.aly",
    password: "",
    database: "smart-brain",
  },
});

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const imageApi = require("./controllers/imageapi");

knex
  .select("*")
  .from("users")
  .then((data) => {});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("sucess");
});

app.post("/register", register.handleRegister(knex, bcrypt));

app.post("/signin", signin.handleSignin(knex, bcrypt));

app.get("/profile/:id", profile.handleProfileGet(knex));

app.put("/image", image.handleImage(knex));

app.post("/imageurl", (req, res) => {imageApi.handleApiCall(req, res)});

app.listen(3001, () => {
  console.log("app is running on port 3001");
});

const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv")?.config({ path: "./config.env" });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URI,
    ssl: true,
  },
});

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const imageApi = require("./controllers/imageapi");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("combined"));
app.use(cors());

app.get("/", (_req, res) => res.send("App is running"));

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

const jwt = require("jsonwebtoken");

const handleSigninAuth = (redisClient, knex, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenID(redisClient, req, res)
    : findUser(knex, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email
            ? createSession(redisClient, data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

const getAuthTokenID = async (redisClient, req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const value = await redisClient.get(token);
  if (value < 1 || isNaN(value)) return res.status(403).json("Unauthorized");
  return res.status(200).json({ id: value });
};

const createSession = (redisClient, user) => {
  const { email, id } = user;
  const token = signToken(email);
  setToken(redisClient, token, id);
  return { success: "true", id: id, token: token };
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET);
};

const setToken = async (redisClient, token, id) => {
  return await redisClient.set(token, id).catch((err) => console.log(err));
};

const findUser = (knex, bcrypt, req, _res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return knex
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return knex
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0])
          .catch((_err) => Promise.reject("Unable to get user"));
      } else {
        Promise.reject("Wrong credentials");
      }
    })
    .catch((_err) => Promise.reject("Wrong credentials"));
};

module.exports = { handleSigninAuth };

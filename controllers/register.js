const jwt = require("jsonwebtoken");

const handleRegister = (redisClient, knex, bcrypt) => (req, res) => {
  const { email, name, hash } = req.body;

  if (!email || !name || !hash) {
    return res.status(400).json("incorrect form submission");
  }
  let salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(hash, salt);

  knex
    .transaction((trx) => {
      trx
        .insert({
          hash: hashedPassword,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((loginEmail) => {
          return trx("users")
            .returning("*")
            .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              const token = signToken(email);
              setToken(redisClient, token, user[0].id);
              res.status(200).json({ ...user[0], token });
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => console.log(err));
};

const setToken = async (redisClient, token, id) => {
  return await redisClient.set(token, id).catch((err) => console.log(err));
};

function signToken(email) {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = { handleRegister };

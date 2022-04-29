const handleRegister = (knex, bcrypt) => (req, res) => {
  const { email, name, hash } = req.body;
  if (!email || !name || !hash ) {
      return res.status(400).json('incorrect form submission')
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
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => 
    console.log(err)
    // res.status(400).json("E-mail is already in use")
    );
};

module.exports = { handleRegister };

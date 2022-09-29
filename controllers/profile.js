const handleProfileGet = (knex) => (req, res) => {
  const { id } = req.params;
  knex
    .select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((_err) => res.status(400).json("Error getting user"));
};

const handleProfileUpdate = (knex, bcrypt) => (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body.formInput;
  let salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(password, salt);

  knex.transaction((trx) => {
    let queries = [];
    const query = knex("users")
      .where({ id: id })
      .update({
        email: email,
        name: name,
      })
      .transacting(trx);
    queries.push(query);

    const query2 = knex("login")
      .where({ id: id })
      .update({
        hash: hashedPassword,
        email: email,
      })
      .transacting(trx);
    queries.push(query2);

    Promise.all(queries)
      .then(trx.commit)
      .then(res.status(200).json("Success"))
      .catch((err) => {
        trx.rollback;
        res.status(400).json(`Error updaing user due to: \n   ${err}`);
      });
  });
};

module.exports = { handleProfileGet, handleProfileUpdate };

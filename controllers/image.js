const handleImage = (knex) => (req, res) => {
  const { id } = req.body;
  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((_err) => res.status(400).json("Unable to get entries"));
};

module.exports = { handleImage };

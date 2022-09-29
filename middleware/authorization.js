const requireAuth = (redisClient) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json("Unauthorized");
  const value = await redisClient.get(token);
  if (value < 1 || isNaN(value)) return res.status(401).json("Unauthorized");
  return next();
};

module.exports = { requireAuth };

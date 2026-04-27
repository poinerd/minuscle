const jwt = require('jsonwebtoken')

const auth = (req, res, next) =>{
    const header = req.headers.authorization;

    if (!header) return res.status(401).send("No token");

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 userId stored here
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
}

module.exports = auth;
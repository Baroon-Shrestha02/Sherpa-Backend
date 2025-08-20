const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token not found" });
  }

  jwt.verify(token, process.env.JWT_SCERECT_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    if (decodedToken.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    req.user = decodedToken;
    next();
  });
};

module.exports = { verifyAdmin };

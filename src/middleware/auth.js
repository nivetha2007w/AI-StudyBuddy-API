const jwt = require("jsonwebtoken");

const parseCookies = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (!name) return acc;
    acc[name] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
};

const protect = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const authHeader = req.headers.authorization;
  const tokenFromCookie = cookies.accessToken;
  const token = tokenFromCookie || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

module.exports = { protect, adminOnly };

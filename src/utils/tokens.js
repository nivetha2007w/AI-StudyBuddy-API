const jwt = require("jsonwebtoken");

const getEnvValue = (name, fallback) => {
  const value = process.env[name];
  return value && value !== "<your_" && !value.includes("your_") ? value : fallback;
};

const generateTokens = (userId, role) => {
  const accessSecret = getEnvValue("JWT_ACCESS_SECRET", "dev-access-secret");
  const refreshSecret = getEnvValue("JWT_REFRESH_SECRET", "dev-refresh-secret");

  const accessToken = jwt.sign({ userId, role }, accessSecret, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId, role }, refreshSecret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", { httpOnly: true, secure: isProd, sameSite: "strict" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: isProd, sameSite: "strict" });
};

module.exports = { generateTokens, setAuthCookies, clearAuthCookies };

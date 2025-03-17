const { verify } = require("jsonwebtoken");
require("dotenv").config();
const jwt = require('jsonwebtoken')
const { User } = require('../models/model')

// const isAdmin = (req, res, next) => {

//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const validToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);

//     req.user = validToken;

//     if (req.user.role !== "Admin") {
//       return res.status(403).json({ error: "Access denied" });
//     }
//     next();
//   } catch (err) {
//     throw err;
//   }
// };


// const isAdmin = async (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const validToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);

//     const user = await User.findByPk(validToken.id);
//     if (!user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     req.user = user;

//     if (req.user.role !== "admin") {
//       return res.status(403).json({ error: "Access denied" });
//     }
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Unauthorized" });
//   }
// };


const isAdmin = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.headers["authorization"]?.split(" ")[1];

  if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify refresh token
    const validToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    
    // Fetch user from DB
    const user = await User.findByPk(validToken.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const refreshToken = async (req, res) => {
  try {
    // Ensure req.cookies and req.body are defined
    const refreshToken =
      (req.cookies && req.cookies.refreshToken) ||
      (req.body && req.body.refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify refresh token
    const validToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    // Fetch user from DB
    const user = await User.findByPk(validToken.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "15m" } // Short-lived access token
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};


// function verifyToken (token, secret) {
//   try {
//     return jwt.verify(token, secret);
//   } catch (err) {
//     throw new Error("Invalid or expired token");
//   }
// };

module.exports = { isAdmin, refreshToken };
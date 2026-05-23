
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================
// ✅ Protect Middleware
// ========================
const protect = async (req, res, next) => {
  try {
    let token;

    // Check token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Save user in request
      req.user = user;

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

// ========================
// ✅ Admin Middleware
// ========================
const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }
  } catch (error) {
    console.error("ADMIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  protect,
  adminOnly,
};
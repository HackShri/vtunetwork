const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Check if authenticated via Passport.js (optional)a


    console.log(req.isAuthenticated())
    if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
        req.userInfo = req.user;
        console.log("✅ Authenticated via Passport.js:", req.userInfo);
        return next();
    }

    // 2. Try getting JWT from cookies
    const cookieToken = req.cookies && req.cookies['userToken'];

    // 3. If no cookie token, try Authorization header (Bearer)
    let token = cookieToken;
    console.log(token)
    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            req.authTokenSource = 'header';
        }
    } else {
        req.authTokenSource = 'cookie';
    }

    // 4. If still no token, deny access
    if (!token) {
        return res.status(401).json({
            message: "❌ Access denied. No token provided.",
            success: false,
            isAuthenticated: false
        });
    }

    // 5. Check if JWT secret key exists
    if (!process.env.JWT_SECRET_KEY) {
        console.error("❌ Missing JWT_SECRET_KEY in environment variables.");
        return res.status(500).json({
            message: "Internal server error: JWT secret not configured.",
            success: false
        });
    }

    // 6. Try verifying the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach user info to request
        req.userName = decoded.username;
        console.log("✅ JWT verified. User:", decoded);
        next();
    } catch (error) {
        console.error("❌ JWT Error:", error.message);

        let message = "Access denied. Invalid or expired token.";
        if (error.name === 'TokenExpiredError') {
            message = "Session expired. Please log in again.";
        } else if (error.name === 'JsonWebTokenError') {
            message = "Invalid token. Please log in again.";
        }

        return res.status(401).json({
            message,
            success: false,
            isAuthenticated: false
        });
    }
};

module.exports = authMiddleware;
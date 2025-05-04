const cookieParser = require('cookie-parser');

async function checkAuth(req, res, next) {
    try {
        // Read cookies from the request
        const uid1 = req.cookies?.Uid1;
        const userDetails = req.cookies?.userdetails;

        // Check if cookies exist
        if (!uid1 || !userDetails) {
            return res.status(401).json({ redirectTo: '/login' }); // Send a response to redirect
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = checkAuth;

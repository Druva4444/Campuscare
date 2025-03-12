function errorHandler(err, req, res, next) {
    console.error("Error:", err.message || err);
    
    // Handle specific errors
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }

    // Generic error response
    res.status(500).json({ error: "Internal Server Error" });
}

module.exports = errorHandler;
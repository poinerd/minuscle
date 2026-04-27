const pool = require('./db');

const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
};

const getHome = (req, res) => {
    res.send("Home route working");
    // res.redirect('http://the-grandeur.vercel.app/')
};

const createLink = async (req, res) => {
    const { url } = req.body;
    const userId = req.user.userId;

    if (!url) {
        return res.status(400).json({ message: "URL is required" });
    }

    try {
        const shortCode = generateShortCode();

      
        const result = await pool.query(
            "INSERT INTO links (original_url, short_code, user_id) VALUES ($1, $2, $3) RETURNING *",
            [url, shortCode, userId]
        );

        res.json({
            shortUrl: `http://localhost:3000/${shortCode}`,
            data: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getHome,
    createLink
};
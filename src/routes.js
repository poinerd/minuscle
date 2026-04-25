const express = require('express');
const router = express.Router();
const { getHome, createLink,} = require('./controllers');
const pool = require('./db');

router.get('/',getHome);
router.post('/shorten', createLink)


router.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const result = await pool.query(
            'SELECT original_url FROM links WHERE short_code = $1',
            [shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Link not found" });
        }

        let url = result.rows[0].original_url;

        // FIX missing protocol issue
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        return res.redirect(url);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
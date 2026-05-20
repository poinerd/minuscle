const express = require("express");
const router = express.Router();

const { getHome, createLink, getQrCodeForLink, getLinkAnalytics } = require("./controllers");
const { register, login } = require("./auth");
const pool = require("./db");
const auth = require("./middleware"); // 
// AUTH
// -------------------
router.post("/register", register);
router.post("/login", login);

// -------------------
// HOME
// -------------------
router.get("/", getHome);

// -------------------
// CREATE SHORT LINK (PROTECTED)
// -------------------
router.post("/shorten", auth, createLink);
// -------------------
// QR CODE FOR EXISTING SHORT LINK (PUBLIC)
// -------------------
router.get("/qr/:shortCode", getQrCodeForLink);

// -------------------
// LINK ANALYTICS (PROTECTED)
// -------------------
router.get("/analytics/:shortCode", auth, getLinkAnalytics)

// -------------------
// REDIRECT (PUBLIC)
// -------------------
router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, original_url FROM links WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    const { id, original_url } = result.rows[0];
    // await pool.query(
    //   "INSERT INTO link_clicks (link_id) VALUES ($1)",
    //   [id]
    // );

    let url = original_url;

    // fix missing protocol
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    return res.redirect(url);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
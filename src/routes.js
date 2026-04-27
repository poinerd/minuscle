const express = require("express");
const router = express.Router();

const { getHome, createLink } = require("./controllers");
const { register, login } = require("./auth");
const pool = require("./db");
const auth = require("./middleware"); // 👈 JWT middleware

// -------------------
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
// REDIRECT (PUBLIC)
// -------------------
router.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      "SELECT original_url FROM links WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Link not found" });
    }

    let url = result.rows[0].original_url;

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
const generateShortLink = (url) => {
    // Logic to generate a short link from the original URL
    return "short.ly/abc123"; // Placeholder short link
}

const getHome = (req, res) => {
    res.send("Home route working");
};

const createLink = (req, res) => {
    const { url } = req.body;

    res.json({
        message: "Link received",
        url
    });

    console.log(generateShortLink(url));

};



module.exports = {
    getHome,
    createLink,
    generateShortLink
};
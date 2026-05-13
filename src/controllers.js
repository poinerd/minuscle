const pool = require('./db');
const qrCode = require('qrcode');

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

const buildShortUrl = (code) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/${code}`;
};

const getHome = (req, res) => {
  res.send('Home route working');
};

const createLink = async (req, res) => {
  const { url, customCode } = req.body;
  const userId = req.user.userId;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  let shortCode = customCode ? String(customCode).trim() : generateShortCode();

  if (customCode) {
    const isValid = /^[A-Za-z0-9_-]{4,30}$/.test(shortCode);
    if (!isValid) {
      return res.status(400).json({ message: 'Custom code must be 4-30 characters and may only include letters, numbers, underscores, or hyphens' });
    }
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM links WHERE short_code = $1',
      [shortCode]
    );

    if (existing.rows.length) {
      return res.status(409).json({ message: 'This custom code is already in use. Please choose another.' });
    }

    if (!customCode) {
      let collision = true;
      while (collision) {
        const candidate = generateShortCode();
        const collisionResult = await pool.query(
          'SELECT id FROM links WHERE short_code = $1',
          [candidate]
        );
        if (!collisionResult.rows.length) {
          shortCode = candidate;
          collision = false;
        }
      }
    }

    const result = await pool.query(
      'INSERT INTO links (original_url, short_code, user_id) VALUES ($1, $2, $3) RETURNING *',
      [url, shortCode, userId]
    );

    const shortUrl = buildShortUrl(shortCode);
    const qrCodeDataUrl = await qrCode.toDataURL(shortUrl);

    res.json({
      shortUrl,
      qrCode: qrCodeDataUrl,
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLinkAnalytics = async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.user.userId;

  try {
    const linkResult = await pool.query(
      'SELECT id, original_url, short_code FROM links WHERE short_code = $1 AND user_id = $2',
      [shortCode, userId]
    );

    if (!linkResult.rows.length) {
      return res.status(404).json({ message: 'Link not found or access denied' });
    }

    const link = linkResult.rows[0];
    const statsResult = await pool.query(
      'SELECT COUNT(*) AS click_count, MAX(clicked_at) AS last_clicked_at FROM link_clicks WHERE link_id = $1',
      [link.id]
    );

    const stats = statsResult.rows[0];

    res.json({
      shortCode: link.short_code,
      originalUrl: link.original_url,
      clickCount: Number(stats.click_count),
      lastClickedAt: stats.last_clicked_at,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getQrCodeForLink = async (req, res) => {
  const { shortCode } = req.params;
  const shortUrl = buildShortUrl(shortCode);

  try {
    const result = await pool.query(
      'SELECT id FROM links WHERE short_code = $1',
      [shortCode]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.type('png');
    qrCode.toFileStream(res, shortUrl, (err) => {
      if (err) {
        console.log(err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to generate QR code' });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getHome,
  createLink,
  getLinkAnalytics,
  getQrCodeForLink,
};

const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlStats,
} = require('../controllers/urlController');

// POST - Create short URL
router.post('/shorturls', createShortUrl);

// GET - Redirect
router.get('/:shortcode', redirectToOriginalUrl);

// GET - Stats
router.get('/shorturls/:shortcode', getUrlStats);

module.exports = router;

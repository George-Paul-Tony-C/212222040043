const { customAlphabet } = require('nanoid');
const Url = require('../models/Url');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

const generateUniqueShortcode = async () => {
  let shortcode;
  let exists = true;

  while (exists) {
    shortcode = nanoid();
    const found = await Url.findOne({ shortcode });
    if (!found) exists = false;
  }

  return shortcode;
};

module.exports = generateUniqueShortcode;

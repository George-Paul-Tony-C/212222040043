const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const log = async (stack, level, pkg, message) => {
  try {
    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Logging failed:', error.message);
  }
};

module.exports = log;

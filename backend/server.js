const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const urlRoutes = require('./routes/urlRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/', urlRoutes);

// DB & Server Init
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('DB Error:', err));

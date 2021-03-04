'use strict';
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const isProd = process.env.NODE_ENV === 'production';
dotenv.config({ path: isProd ? '.env.prod' : '.env.dev' });
console.log(`Env loading ${isProd ? 'PROD' : 'DEV'} file`);

const app = express();

app.use(express.json({ extended: true }));

app.use('/api', require('./routes/API.js'));

if (isProd) {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function start() {
  try {
    await mongoose.connect(process.env.LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server has been started ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`Server error ${error.message}`);
    process.exit(1);
  }
}

start();

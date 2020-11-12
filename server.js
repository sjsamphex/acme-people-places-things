const {
  syncAndSeed,
  models: { User, Department },
} = require('./db');
const express = require('express');
const app = express();
const html = require('html-template-tag');

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
  console.log('ready');
};

init();

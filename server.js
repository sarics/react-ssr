/* eslint no-console: 'off' */

const express = require('express');

const ssr = require('./build/ssr').default;
const manifest = require('./build/manifest');

let port = 8080;
if (process.env.PORT) {
  const envPort = parseInt(process.env.PORT, 10);
  if (!Number.isNaN(envPort)) port = envPort;
}

const app = express();
app.locals.files = manifest;

app.set('view engine', 'ejs');

app.use(express.static('./build/public'));

app.get(/\./, (req, res) => {
  res.sendStatus(404);
});

app.get('/*', ssr);

app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`);
});

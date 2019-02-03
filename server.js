/* eslint no-console: 'off' */

const express = require('express');

const ssr = require('./build/ssr').default;
const stats = require('./build/stats');
const getFilesFromStats = require('./scripts/getFilesFromStats');

let port = 8080;
if (process.env.PORT) {
  const envPort = parseInt(process.env.PORT, 10);
  if (!Number.isNaN(envPort)) port = envPort;
}

const app = express();
app.locals.files = getFilesFromStats(stats);

app.set('view engine', 'ejs');

app.use(express.static('./build/public'));

app.get('/*', ssr);

app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`);
});

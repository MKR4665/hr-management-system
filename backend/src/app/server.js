const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const path = require('path');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading local images
}));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 uploads
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

module.exports = app;

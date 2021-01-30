require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');

const route = require('./src/routes/route');

const app = express();

const port = process.env.PORT || 8080;

// Middleware for Cross Origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());

// Route
app.use('/', route);

// Error handler
app.use((error, _req, res, _next) => {
    const { data } = error;
    const message = data ? data : 'Invalid JSON payload passed.';
    const status = 'error';
    res.status(400).json({
      message,
      status,
      data: null,
    });
});

app.listen(port, () => console.log(`server connected at port: ${port}`));
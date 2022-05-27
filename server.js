const express = require('express');
const cors = require('cors');
const path = require('path');

// import routers 
const apiRouter = require('./apiRouter.js');

// initialize application
const app = express();

// set up CORS for Cross-Origin-Resource-Sharing
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'locahost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// converts API responses to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up router
app.use('/api', apiRouter);

// catch-all route handler for any requests to an unknown route
app.use('/*', (req, res) => res.sendStatus(404));

// configire express global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(8000,() =>
  console.log(`Server running on 8000`)
);

module.exports = app;

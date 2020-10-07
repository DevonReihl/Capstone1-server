require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./error-handler')
const itemsRouter = require('./list/items-router')
const membersRouter = require('./members/members-router')


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/items', itemsRouter)
app.use('/api/members', membersRouter)

app.get('/', (req, res) => {
  res.send('Hello, beautiful!');
});

app.use(errorHandler);

module.exports = app;
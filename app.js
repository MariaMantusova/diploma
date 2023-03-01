const express = require('express');
const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const allowedCors = [
  'localhost:3000',
];

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use('/', (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
app.use('/', userRouter);
app.use('/', movieRouter);
router.all('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
app.listen(PORT);

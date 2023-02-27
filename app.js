const express = require('express');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

const { PORT = 3000 } = process.env;

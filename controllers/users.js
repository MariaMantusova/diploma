require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ExistingEmailError = require('../errors/ExistingEmailError');

const getMyInfo = (req, res, next) => User.findById(req.user._id)
  .then((user) => res.status(200).send({ data: user }))
  .catch(next);

const changeInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (email.unique(false)) {
        throw ExistingEmailError();
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistingEmailError());
      } else if (err.name === 'CastError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

const createUser = ((req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(200).send(user.toObject({
      transform: (doc, res) => {
        delete res.password;
        return res;
      },
    })))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistingEmailError());
      } else if (err.name === 'CastError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
});
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res
        .send({ token });
    })
    .catch(next);
};

module.exports = {
  getMyInfo, createUser, login, changeInfo,
};

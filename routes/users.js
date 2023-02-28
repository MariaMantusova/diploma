const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMyInfo, createUser, login, changeInfo,
} = require('../controllers/users');

router.get('/users/me', auth, getMyInfo);
router.patch('/users/me', auth, changeInfo);

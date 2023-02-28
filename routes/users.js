const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getMyInfo, changeInfo,
} = require('../controllers/users');

router.get('/users/me', auth, getMyInfo);
router.patch('/users/me', auth, changeInfo);

module.exports = router;

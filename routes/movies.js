const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', auth, getSavedMovies);
router.post('/movies', auth, createMovie);
router.delete('/movies/_id', auth, deleteMovie);

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middlewares/auth');
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', auth, getSavedMovies);
router.post('/movies', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(4).max(4).required(),
    description: Joi.string().min(2).max(30).required(),
    image: Joi.string().min(2).pattern(/^https?:\/\/[a-zA-Z0-9\S]+$/),
    trailerLink: Joi.string().min(2).pattern(/^https?:\/\/[a-zA-Z0-9\S]+$/),
    thumbnail: Joi.string().min(2).pattern(/^https?:\/\/[a-zA-Z0-9\S]+$/),
    movieId: Joi.string().alphanum().length(24),
    nameRU: Joi.string().min(2).max(30).required(),
    nameEN: Joi.string().min(2).max(30).required(),
  }),
}), createMovie);
router.delete('/movies/:_id', auth, celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = router;

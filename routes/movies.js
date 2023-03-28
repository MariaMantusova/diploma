const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middlewares/auth');
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', auth, getSavedMovies);
router.post('/movies', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().min(4).max(4).required(),
    description: Joi.string().required(),
    image: Joi.object().required(),
    trailerLink: Joi.string().pattern(/^https?:\/\/[a-zA-Z0-9\S]+$/).required(),
    thumbnail: Joi.object().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/:_id', auth, celebrate({
  params: Joi.object().keys({
    _id: Joi.objectId(),
  }),
}), deleteMovie);

module.exports = router;

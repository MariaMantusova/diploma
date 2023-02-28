const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const currentUser = req.user._id;

  Movie.findById(req.params._id)
    .orFail(() => new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (currentUser !== movie.owner.toString()) {
        throw new ForbiddenError();
      }
      return movie;
    })
    .then(() => Movie.findByIdAndRemove(req.params._id, { new: true }))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

module.exports = {
  getSavedMovies, createMovie, deleteMovie,
};

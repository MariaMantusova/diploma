class ForbiddenError extends Error {
  constructor() {
    super();
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.message = 'Вы не можете удалить данный фильм, так как не являетесь его владель';
  }
}

module.exports = ForbiddenError;

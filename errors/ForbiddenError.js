class ForbiddenError extends Error {
  constructor() {
    super();
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.message = 'Вы не можете удалить данную публикацию, так как не являетесь ее автором';
  }
}

module.exports = ForbiddenError;

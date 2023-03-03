class ValidationError extends Error {
  constructor() {
    super();
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.message = 'Ошибка валидации';
  }
}

module.exports = ValidationError;

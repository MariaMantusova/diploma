class ExistingEmailError extends Error {
  constructor() {
    super();
    this.name = 'ExistingEmailError';
    this.statusCode = 409;
    this.message = 'Пользователь с таким email уже существует';
  }
}

module.exports = ExistingEmailError;

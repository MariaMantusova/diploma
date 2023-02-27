const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorizationError = require("../errors/AuthorizationError");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: 'Некорректный Email',
        },
    },
    password: {
        select: false,
        type: String,
        required: true,
        minlength: 8,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
});

userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email }).select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new AuthorizationError('Неправильные логин или пароль'));
            }

            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        return Promise.reject(new AuthorizationError('Неправильные логин или пароль'));
                    }

                    return user;
                });
        });
};

module.exports = mongoose.model('user', userSchema);

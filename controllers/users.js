/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

const { VALIDATE_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь по указаному id:${req.params.userId} не найден.` });
      } else if (err.name === 'CastError') {
        res.status(VALIDATE_ERROR_CODE).send({ message: 'Передан неккоректный id' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUserMe = (req, res) => {
  User.findOne({ _id: req.user._id })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь по указаному id:${req.params.userId} не найден.` });
      } else if (err.name === 'CastError') {
        res.status(VALIDATE_ERROR_CODE).send({ message: 'Передан неккоректный id' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.postUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATE_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATE_ERROR_CODE).send({ message: 'Переданы некорктные данные при обновлении профиля' });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь по указаному id:${req.user._id} не найден.` });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATE_ERROR_CODE).send({ message: 'Переданы некорктные данные при обновлении аватара' });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь по указаному id:${req.user._id} не найден.` });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token);
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

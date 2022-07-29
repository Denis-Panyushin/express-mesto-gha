/* eslint-disable no-unused-vars */
const User = require('../models/user');

const { VALIDATE_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь по указаному id:${req.params.userId} не найден.` });
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(VALIDATE_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode !== NOT_FOUND_ERROR_CODE) {
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
      if (err.statusCode !== NOT_FOUND_ERROR_CODE) {
        res.status(VALIDATE_ERROR_CODE).send({ message: 'Переданы некорктные данные при обновлении аватара' });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь по указаному id:${req.user._id} не найден.` });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

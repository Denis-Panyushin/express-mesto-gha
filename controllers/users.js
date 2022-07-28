/* eslint-disable no-unused-vars */
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: `Пользователь по указаному id:${req.user._id} не найден.` }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: 'Переданы некорктные данные при обновлении профиля' }))
    .catch((err) => res.status(404).send({ message: `Пользователь по указаному id:${req.user._id} не найден.` }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: 'Переданы некорктные данные при обновлении профиля' }))
    .catch((err) => res.status(404).send({ message: `Пользователь по указаному id:${req.user._id} не найден.` }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

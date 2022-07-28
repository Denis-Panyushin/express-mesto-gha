/* eslint-disable no-unused-vars */
const Card = require('../models/card');

const VALLIDATE_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(VALLIDATE_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' }))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(NOT_FOUND_ERROR_CODE).send({ message: `Карточка с указаным id:${req.params._id} не найдена` }))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(VALLIDATE_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.' }))
    .catch((err) => res.status(NOT_FOUND_ERROR_CODE).send({ message: `Передан несущетвующий id:${req.params._id} карточки` }))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(VALLIDATE_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.' }))
    .catch((err) => res.status(NOT_FOUND_ERROR_CODE).send({ message: `Передан несущетвующий id:${req.params._id} карточки` }))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: err.message }));
};

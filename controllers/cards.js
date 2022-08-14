/* eslint-disable no-unused-vars */
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const Card = require('../models/card');

const { VALIDATE_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  if (req.params.owner._id === req.user._id) {
    Card.findByIdAndRemove(req.params.cardId)
      .orFail(() => {
        const error = new Error();
        error.statusCode = 404;
        throw error;
      })
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.statusCode === NOT_FOUND_ERROR_CODE) {
          res.status(NOT_FOUND_ERROR_CODE).send({ message: `Карточка с указаным id:${req.params.cardId} не найдена` });
        } else if (err.name === 'CastError') {
          res.status(VALIDATE_ERROR_CODE).send({ message: 'Передан некорректный id карточки' });
        } else {
          res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
        }
      });
  }
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки лайка.');
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        throw new NotFoundError(`Передан несущетвующий id:${req.params._id} карточки`);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки лайка.');
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        throw new NotFoundError(`Передан несущетвующий id:${req.params._id} карточки`);
      }
    })
    .catch(next);
};

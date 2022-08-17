const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(/^(https|http)?:\/\/(www.)?[^-_.\s](\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3})?(:\d+)?(.+[#a-zA-Z/:0-9]{1,})?\.(.+[#a-zA-Z/:0-9]{1,})?$/i),
    owner: { _id: Joi.string().hex().length(24) },
  }).unknown(true),
}), createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }).unknown(true),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }).unknown(true),
}), dislikeCard);

module.exports = router;

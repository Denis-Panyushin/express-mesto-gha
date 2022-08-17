const jwt = require('jsonwebtoken');
const NoAuthorization = require('../errors/NoAuthorization');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NoAuthorization('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET, { expiresIn: '7d' });
  } catch (err) {
    next(new NoAuthorization('Необходима авторизация'));
  }

  req.user = payload;
  next();
};

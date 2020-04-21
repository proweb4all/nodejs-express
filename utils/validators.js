const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
  body('name').isLength({min: 3, max: 30})
    .withMessage('Введите корректное имя длиной от 3 до 30 символов').trim(),
  body('email').isEmail().withMessage('Введите корректный email')
    .custom(async (value, {req}) => {
      try {
        const user = await User.findOne({email: value})
        if (user) {
          return Promise.reject('Пользователь с таким email уже зарегистрирован')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),
  body('password', 'Введите корректный пароль длиной от 6 до 30 символов')
    .isLength({min: 6, max: 30}).isAlphanumeric().trim(),
  body('confirm')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('Подтверждение пароля не совпадает с первоначальным')
      }
      return true
    })
    .trim()
]
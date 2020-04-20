const {body} = require('express-validator')

exports.registerValidators = [
  body('name').isLength({min: 3, max: 30}).withMessage('Введите корректное имя длиной от 3 до 30 символов'),
  body('email').isEmail().withMessage('Введите корректный email'),
  body('password', 'Введите корректный пароль длиной от 6 до 30 символов').isLength({min: 6, max: 30}).isAlphanumeric(),
  body('confirm').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Подтверждение пароля не совпадает с первоначальным')
    }
    return true
  })
]
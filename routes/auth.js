const {Router} = require('express')
const bcript = require('bcryptjs')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    const candidate = await User.findOne({email})
    if (candidate) {
      const areSame = await bcript.compare(password, candidate.password)
      if (areSame) {
        //const user = await User.findById('5e82435ba4e6901eacd1d68d')
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          } 
          res.redirect('/')
        })
      } else {
        req.flash('loginError', 'Неверный пароль.')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'Пользователь с таким email не зарегистрирован.')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/register', async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body
    const candidate = await User.findOne({email})
    if (candidate) {
      req.flash('registerError', 'Пользователь с таким email уже зарегистрирован.')
      res.redirect('/auth/login#register')
    } else {
      const hashPassword = await bcript.hash(password, 10) 
      console.log('hashPassword:', hashPassword)
      const user = new User({
        name, email, password: hashPassword, cart: {items: []}
      })
      await user.save()
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
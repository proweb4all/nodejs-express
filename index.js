const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const User = require('./models/user')

const app = express()
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e82435ba4e6901eacd1d68d')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: false}))
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = `mongodb+srv://user:User99@cluster0-hwzqn.mongodb.net/shop`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })  
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'yurytaratov@narod.ru',
        name: 'Yury',
        cart: {items: []}
      })
      await user.save()
    }
    // useNewUrlParser: true
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()

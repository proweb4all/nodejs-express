const {Schema, model} = require('mongoose')

const user = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          defailt: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Course'
        }
      }

    ]
  }
})

user.methods.addToCart = function(course) {
  const items = [...this.cart.items]
  const idx = items.findIndex(c => {
    return c.courseId.toString() === course._id.toString()
  })
  if (idx < 0) {
    items.push({
      courseId: course._id, 
      count: 1
    })
  } else {
    items[idx].count++ 
  }
  this.cart = {items}
  return this.save()
}

user.methods.removeFromCart = function(id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(c => {
    return c.courseId.toString() === id.toString()
  })
  if (items[idx].count === 1) {
    items = items.filter((c, i) => i !== idx)
  } else {
    items[idx].count-- 
  }
  this.cart = {items}
  return this.save()
}

module.exports = model('User', user)
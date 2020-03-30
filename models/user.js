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

module.exports = model('User', user)
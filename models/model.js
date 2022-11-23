const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String},
  email: {type: String},
  bio: {type: String},
  image: {type: String},
  password: {type: String},
  salt: {type: String},
})

const followSchema = new Schema({
  follower: {type: String, ref: 'User'},
  following: {type: String, ref: 'User'}
})

const articleSchema = new Schema({
  description: {type: String},
  photos: [{type: String}],
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  tagList: [{type: String}],
  user: {type: Schema.ObjectId, ref: 'User'},
  favoriteCount: {type: Number, default: 0}
})

const favoriteSchema = new Schema({
  user: {type: Schema.ObjectId},
  article: {type: Schema.ObjectId}
})

const commentSchema = new Schema({
  content: {type: String},
  article: {type: Schema.ObjectId},
  user: {type: Schema.ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now},
  favoriteCount: {type: Number, default: 0}
})

const favoriteCommentSchema = new Schema({
  user: {type: Schema.ObjectId},
  comment: {type: Schema.ObjectId}
})

exports.User = mongoose.model('User', userSchema)
exports.Follow = mongoose.model('Follow', followSchema)
exports.Article = mongoose.model('Article', articleSchema)
exports.Favorite = mongoose.model('Favorite', favoriteSchema)
exports.Comment = mongoose.model('Comment', commentSchema)
exports.FavoriteComment = mongoose.model('FavoriteComment', favoriteCommentSchema)
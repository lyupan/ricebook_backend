// this is model.js
var mongoose = require('mongoose')
require('./db.js')


//Use validation ----- required
var userSchema = new mongoose.Schema({
	username: String, salt: String, hash: String
})
var profileSchema = new mongoose.Schema({
	facebookId: String, username: String, displayName: String, headline: String, following: [ String ],
    email: String, zipCode: String, dob: Date, avatar: String, phone: String
})
var commentSchema = new mongoose.Schema({
	commentId: Number, author: String, date: Date, text: String
})
var articleSchema = new mongoose.Schema({
	id: Number, author: String, image: String, date: Date, text: String, like: Number,
	comments: [ commentSchema ]
})

exports.User = mongoose.model('users', userSchema)
exports.Article = mongoose.model('articles', articleSchema)
exports.Profile = mongoose.model('profiles', profileSchema)
exports.Comment = mongoose.model('comments', commentSchema)

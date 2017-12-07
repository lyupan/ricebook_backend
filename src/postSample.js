var Profile = require('./model.js').Profile
var Article = require('./model.js').Article
var User = require('./model.js').User
const md5 = require('md5')

Article.remove({}, function() {
	console.log("Remove all from schema Article --------")
})
Profile.remove({}, function() {
	console.log("Remove all from schema Profile --------")
	new Profile({username: "test1", displayName:"Leonard", headline: "lalala", following: ["ab21", "test2"],
		email: "test1@rice.edu", zipCode:"77005", dob: new Date(), avatar: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061571/comp531/ab12.jpg", phone:"123-123-1234"
	}).save()
	new Profile({username: "ab21", displayName:"Hard", headline: "ab21fafaf", following: ["ab21"],
		email: "ab21@rice.edu", zipCode:"11002", dob: new Date(), avatar: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061587/comp531/ab11.png", phone:"123-123-1234"
	}).save()
	new Profile({username: "bc34", displayName:"Busy", headline: "bc34fafaf", following: [],
		email: "bc34@rice.edu", zipCode:"11002", dob: new Date(), avatar: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061588/comp531/image1.jpg", phone:"123-123-1234"
	}).save()
	new Profile({username: "test2", displayName:"Denny", headline: "hahaha", following: ["ab21", "test2"],
		email: "test2@rice.edu", zipCode:"11002", dob: new Date(), avatar: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061587/comp531/ab15.png", phone:"123-123-1234"
	}).save(function() {
	 console.log('done with save in scheme Profile --------')
	})
})
User.remove({}, function() {
	console.log("Remove all from schema User --------")
})
	// commentId: Number, author: String, date: Date, text: String
new Article({ id: 1, author: 'test1', image: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061587/comp531/image4.jpg", date: new Date().getTime(), 
	text: 'This is my first article',like: 123,
	comments:[{commentId: 1, author: "test1", date: new Date().getTime(), text: "comment one on article one"},
		{commentId: 2, author: "test2", date: new Date().getTime(), text: "comment two on article one"},
		{commentId: 3, author: "test2", date: new Date().getTime(), text: "comment three on article one"}
	]}).save()
new Article({ id: 2, author: 'test1', image: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061587/comp531/image3.jpg", date: new Date().getTime(),
 text: 'This is my second article', like: 123,
	comments:[{commentId: 1, author: "test1", date: new Date().getTime(), text: "comment one on article two"},
		{commentId: 2, author: "test2", date: new Date().getTime(), text: "comment two on article two"},
		{commentId: 3, author: "test2", date: new Date().getTime(), text: "comment three on article three"}
	]}).save()
new Article({ id: 3, author: 'test1', image: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512411106/ng6deqner6xripampzqh.jpg", date: new Date().getTime(), text: "This is Max's article", like: 0}).save()
new Article({ id: 4, author: 'test2', image: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061588/comp531/image2.jpg", date: new Date().getTime(), text: "This is Max's article", like: 0}).save()
new Article({ id: 5, author: 'test2', image: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061587/comp531/images_1.jpg", date: new Date().getTime(), text: "This is Max's article", like: 0}).save()
new Article({ id: 6, author: 'test1', image: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061587/comp531/taylor.jpg", date: new Date().getTime(), text: "This is Max's article", like: 0}).save()
new Article({ id: 7, author: 'test1', date: new Date().getTime(), text: "This is Max's article", like: 0}).save()
new Article({ id: 8, author: 'test1', date: new Date().getTime(), text: "This is Max's article", like: 0}).save()
new Article({ id: 9, author: 'test1',  date: new Date().getTime(), text: "This is Max's article", like: 0}).save()
new Article({ id: 10, author: 'test1', image: "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061587/comp531/images.png", date: new Date().getTime(), text: "This is Max's article", like: 0}).save(function() {
	console.log('done with save in schema Articles --------- ')
})


salt = "randomsaltfortest1"
password = "test1"
new User({username: "test1", salt: salt, hash: md5(password + salt)}).save()
salt = "randomsaltfortest2"
password = "test2"
new User({username: "test2", salt: salt, hash: md5(password + salt)}).save(function() {
	console.log("done with save in schema User")
})
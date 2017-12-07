const Profile = require('./model.js').Profile
const User = require('./model.js').User
const md5 = require('md5')

const getHeadlines = (req, res) => {
	let users = req.user.username
	if (req.params.users) {
		users = req.params.users.split(',')
	}
	Profile.find({username: {$in: users}}, 'username headline -_id', function(err, headlines) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	res.send({headlines: headlines})
	})
}

const updateHeadline = (req, res) => {
	const headline = req.body.headline
	if (!headline) {
		res.sendStatus(400)
		return
	}
	let username = req.user.username
	Profile.update({username: username}, {
		headline: headline
	}, function(err) {
		if (err) {
			res.sendStatus(500)
			return
		}
		res.send({username: username, headline: headline})
	})
}

const getEmail = (req, res) => {
	let user = req.params.user
	if (!user) {
		user = req.user.username
	}

	Profile.findOne({username: user}, 'username email -_id', function(err, email) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	if (!email) {
    		res.sendStatus(400)
    		return
    	}
    	res.send(email)
	})
}

const updateEmail = (req, res) => {
	const email = req.body.email
	if (!email) {
		res.sendStatus(400)
		return
	}
    const user = req.user.username
	Profile.update({username: user}, {
		email: email
	}, function(err) {
		if (err) {
			res.sendStatus(500)
			return
		}
		res.send({username: user, email: email})
	})
}

const updateDisplayName = (req, res) => {
	const displayName = req.body.displayName
	if (!displayName) {
		res.sendStatus(400)
		return
	}
    const user = req.user.username
	Profile.update({username: user}, {
		displayName: displayName
	}, function(err) {
		if (err) {
			res.sendStatus(500)
			return
		}
		res.send({username: user, displayName: displayName})
	})
}

const getZipcode = (req, res) => {
	let user = req.params.user
	if (!user) {
		user = req.user.username
	}

	Profile.findOne({username: user}, 'username zipcode -_id', function(err, zipcode) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	if (!zipcode) {
    		res.sendStatus(400)
    		return
    	}
    	res.send(zipcode)
	})
}

const updateZipcode = (req, res) => {
	const zipcode = req.body.zipcode
	if (!zipcode) {
		res.sendStatus(400)
		return
	}
    const user =  req.user.username
	Profile.update({username: user}, {
		zipCode: zipcode
	}, function(err) {
		if (err) {
			res.sendStatus(500)
			return
		}
		res.send({username: user, zipcode: zipcode})
	})
}

const getDob = (req, res)=>{
	const user = req.user.username
	Profile.findOne({username: user}, 'dob -_id', function(err, date) {
		if (err) {
			res.sendStatus(500)
			return
		}
		if (!date) {
			res.sendStatus(400)
			return
		}
		res.send({username: user, dob: new Date(date.date).getTime()})
	})
}

const updatePassword = (req, res) => {
	const password = req.body.password
	if (!password) {
		res.sendStatus(400)
		return
	}
    const user =  req.user.username
	//Password will not change
	User.findOne({username: user}, function(err, user){
		user.hash = md5(password + user.salt)
		user.save(function(err, user) {
			res.send({username: user, status: "password updated"})
		})
	})
}

const getAvatars = (req, res) => {
	let users = req.user.username
	if (req.params.users) {
		users = req.params.users.split(',')
	}
	Profile.find({username: {$in: users}}, 'username avatar -_id', function(err, avatars) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	res.send({avatars: avatars})
	})
}

const updateAvatar = (req, res) => {
	let username = req.user.username
	let avatar = req.fileurl
	Profile.update({username: username}, {
		avatar: avatar
	}, function(err, numberAffected, rawResponse) {
		if (err) {
			res.sendStatus(500)
			return
		}
		res.send({username: username, avatar:  avatar})
	})
}

const getPhone = (req, res) => {
	let users = req.user.username
	if (req.params.users) {
		users = req.params.users.split(',')
	}
	Profile.find({username: {$in: users}}, 'username phone -_id', function(err, phones) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	res.send({phones: phones})
	})
}

const updatePhone = (req, res) => {
	let username = req.user.username
	const phone = req.body.phone
	if (!phone) {
		res.sendStatus(400)
		return
	}
	Profile.update({username: username}, {
		phone: phone
	}, function(err) {
		res.send({username: username, phone: phone})
	})
}

const getProfile = (req, res) => {
	let username = req.user.username
	Profile.findOne({username: username}, '-_id -__v', function(err, profile) {
		if (err) {
			res.sendStatus(500)
			return
		}
		res.send(profile)
	})
}

const getPublicProfile = (req, res) => {
	let users = req.user.username
	if (req.params.users) {
		users = req.params.users.split(',')
	}
	Profile.find({username: {$in: users}}, 'username headline avatar -_id', function(err, profiles) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	res.send({profiles: profiles})
	})
}

const unlink = (req, res) => {
	let username = req.user.username
	Profile.findOne({username: username}, function(err, data){
		if (!data) {
			res.sendStatus(401)
			return
		}
		data.facebookId = undefined
		data.save(function(err, p) {
			res.send({profile: p})
		})
	})
}

const uploadImage = require('./upload.js').uploadImage

module.exports = (app) => {
	app.get('/headlines/:users?', getHeadlines)
	app.put('/headline', updateHeadline)
	app.get('/email/:user?', getEmail)
	app.put('/email', updateEmail)
	app.get('/zipcode/:user?', getZipcode)
	app.put('/zipcode', updateZipcode)
	app.get('/phone/:user?', getPhone)
	app.put('/phone', updatePhone)
	app.get('/dob', getDob)
	app.put('/password', updatePassword)
	app.put('/displayname', updateDisplayName)
	app.get('/avatars/:users?', getAvatars)
	app.put('/avatar', uploadImage('image'), updateAvatar)
	app.get('/profile', getProfile)
	app.get('/public/:users?', getPublicProfile)
	app.put('/unlink', unlink)
}
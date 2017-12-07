var User = require('./model.js').User
var Profile = require('./model.js').Profile
var Article = require('./model.js').Article
const cookieParser = require('cookie-parser')
const md5 = require('md5')
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy

const defaultHeadline = "default headline"
const avatar = "http://res.cloudinary.com/dkyfvlgdn/image/upload/v1512061588/comp531/default.png"
const front_end_main = "https://ricebooklp.surge.sh/#/main"
// const front_end_main = "http://localhost:4200/#/main"
const back_end = "https://rice-lp.herokuapp.com"
// const back_end = "http://localhost:3000"
const fbLogin = (req, res, next) => {
	console.log("fb login")
	passport.use(new Strategy({
	    clientID: process.env.CLIENT_ID,
	    clientSecret: process.env.CLIENT_SECRET,
	    callbackURL: back_end+'/login/facebook/return',
	    profileFields: ['id', 'displayName', 'photos', 'email']
	  },
	  function(accessToken, refreshToken, profile, cb) {
	    profile.id = 'fb' + profile.id
	    console.log('fb login create account ... ')
	   	Profile.findOne({facebookId: profile.id}, function(err, user) {
	   		console.log('fb login create account ... ', user)
	    	if (!user) {
	    		console.log('fb login create account ... ', !user)
	    		new Profile({username: profile.id, displayName: profile.displayName, facebookId: profile.id, headline: defaultHeadline, following: [],
				email: profile.email, zipCode:'00000', avatar: profile.photos ? profile.photos[0].value : avatar}).save(function(err, v) {
					if (err) {
						res.sendStatus(500)
						return
					}

					return cb(null, profile);
				})
	    	} else {
	    		return cb(null, profile);
	    	}
	    })
	  })
	)
	next()
}

const fbLink = (req, res, next) => {
	passport.use(new Strategy({
	    clientID: process.env.CLIENT_ID,
	    clientSecret: process.env.CLIENT_SECRET,
	    callbackURL: back_end+'/link/facebook/return',
	    profileFields: ['id', 'displayName', 'photos', 'email']
	  },
	  function(accessToken, refreshToken, profile, cb) {
	    profile.id = 'fb' + profile.id
	    Profile.findOne({facebookId: profile.Id}, function(err, fb) {
	    	Profile.findOne({username: req.user.username}, function(err, user) {
	    		if (!fb) {
	    			user.facebookId = profile.id
	    			user.save(function(err) {
	    				return cb(null, profile)
	    			})
	    		} else {
	    			Article.update({username: profile.Id}, {username: user.username}, function(err, data){
	    				if (err) {
	    					console.error(err)
	    				}
	    			})
	    			user.following = user.following.concat(fb.following.filter(function (item) {
					    return user.following.indexOf(item) < 0;
					}));
					user.facebookId = profile.id
	    			user.save(function(err) {
	    				if (err) {
	    					console.error(err)
	    				}
	    				return cb(null, profile)
	    			})
	    		}
	    	})
	    })
	  })
	)
	next()
}

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const register = (req, res) => {
	let username = req.body.username
	let password = req.body.password
	if (!username || !password || !req.body.email ||
		!req.body.zipcode || !req.body.dob || !req.body.phone) {
		res.sendStatus(400)
		return
	}
	//Check if username exists using count
	User.count({username: username}, function(err, c) {
		if (err)  {
			res.sendStatus(500)
			return
		}
		if (c > 0) {
			res.send({result:"failure", info:"username already exists"})
			return
		}

		let dob = new Date(req.body.dob)
		generatedSalt = randomSalt()
		//insert a record into User schema
		new User({username: username, salt: generatedSalt, hash: md5(password + generatedSalt)}).save(function(err){
			if (err)  {
				res.sendStatus(500)
				return
			}
		})
		//insert a recode into Profile schema
		new Profile({username: req.body.username, displayName: req.body.displayName, headline: defaultHeadline, following: [],
		email: req.body.email, phone: req.body.phone, zipCode:req.body.zipcode, dob: dob, avatar: avatar}).save(function(err) {
			if (err) {
				res.sendStatus(500)
				return
			}
		})
		res.send({result: "success", username: username})
	})
}

const mySecretMessage = "guess,whatismysecretmessage?"
const sessionUser = {}
const cookieKey = 'sid'
const login = (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	if (!username || !password) {
		res.sendStatus(400)
		return
	}
	User.findOne({username: username}, function(err, user) {
		if (err) {
			res.sendStatus(500)
			return
		}
		if (!user) {
			// res.sendStatus(401)
			res.send({result:"failure", info:"username not exists"})
			return
		}
		let userObj = user
		if (md5(password + userObj.salt) !== userObj.hash) {
			// res.sendStatus(401)
			res.send({result:"failure", info:"wrong password"})
			return
		}
		const sessionKey = md5(mySecretMessage + new Date().getTime() + userObj.username)
    	sessionUser[sessionKey] = userObj
    	res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true})
		let msg = {username: username, result: "success"}
		res.send(msg)
	})
}

const isLoggedIn = (req, res, next) => {
	// req.user = new User( {username: "test1", salt: "randomsaltfortest1", hash: "a792671849280d9f3410e8de8a57691e"} )
	if(req.isAuthenticated() || req.cookies && req.cookies[cookieKey] && sessionUser[req.cookies[cookieKey]]) {
		req.user = sessionUser[req.cookies[cookieKey]]
		next()
	} else {
		console.log("Unauthrized --- Login First --- ")
		res.sendStatus(401)
	}
}

const logout = (req, res) => {
	res.clearCookie(cookieKey)
	delete sessionUser[req.cookies[cookieKey]]
	res.send({username: req.user.username, result: "success"})
}

function randomSalt() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

exports.routes = (app) => {
	app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
	// Initialize Passport and restore authentication state, if any, from the
	// session.
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/login/facebook', fbLogin, 
	  passport.authenticate('facebook', {scope: [ 'email', 'public_profile']}));
	app.get('/login/facebook/return', 
	  passport.authenticate('facebook', { failureRedirect: '/auth' }),
	  function(req, res) {
	  	console.log("login return ", req.user)
	  	Profile.findOne({facebookId: req.user.id}, function(err, user) {
			const sessionKey = md5(mySecretMessage + new Date().getTime() + user.username)
	    	req.user= user
		    sessionUser[sessionKey] = user
		    res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true})
		    res.redirect(front_end_main);
	  	})
	});

	app.get('/link/facebook', isLoggedIn, fbLink, 
	  passport.authenticate('facebook', fbLink, {scope: [ 'email', 'public_profile']}));
	app.get('/link/facebook/return', 
	  passport.authenticate('facebook', { failureRedirect: '/auth' }),
	  function(req, res) {
	    res.redirect(front_end_main);
	});

    app.post('/register', register)
	app.post('/login', login)
	app.put('/logout', isLoggedIn, logout)
}
exports.isLoggedIn = isLoggedIn
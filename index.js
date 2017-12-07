const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const md5 = require('md5')
require('dotenv').config();

const enableCORS = (req, res, next) => {
	console.log("origin --- ", req.get('origin'))
	res.header("Access-Control-Allow-Origin", req.get('origin'))
	// if (req.get('origin').contains('facebook'))
	res.header("Access-Control-Allow-Credentials", true)
	// res.header("Access-Control-Allow-Origin", '*')
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
	// res.header("Access-Control-Allow-Headers", "Authorization, Content-Type")
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	if (req.method === 'OPTIONS') {
		res.sendStatus(200)
		return
	}
	console.log("CROS Request URl", req.url)
	next()
}

const hello = (req, res) => res.send({ hello: 'world' })

const app = express()
app.use(enableCORS)
app.use(cookieParser())
app.use(bodyParser.json())
require('./src/auth.js').routes(app)
app.use(require('./src/auth.js').isLoggedIn)
require('./src/articles.js')(app)
require('./src/profile.js')(app)
require('./src/following.js')(app)
app.get('', hello)

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})
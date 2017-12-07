const Profile = require('./model.js').Profile
const User = require('./model.js').User

const getFollowings = (req, res) => {
	let user = req.user.username
	if (req.params.user) {
		user = req.params.user
	}
	Profile.findOne({username: user}, 'username following -_id', function(err, following) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	if (!following) {
    		res.sendStatus(400)
    		return
    	}
    	res.send(following)
	})
}

const follow = (req, res) => {
    const defaultUser = req.user.username
	const user = req.params.user
	if (!user) {
		res.sendStatus(400)
		return
	}
    Profile.findOne({username: user}, function(err, data) {
        if (err) {
            res.sendStatus(500)
            return
        }
        if (!data) {
            res.send({result:"failure", info:"user not exists"})
            return
        }
        Profile.findOne({username: defaultUser}, 'following', function(err, following) {
            if (err) {
                res.sendStatus(500)
                return
            }
            if (following.following.indexOf(user) === -1) {
                following.following.push(user)
            }
            following.save(function(err, data) {
                res.send({username: defaultUser, following: data.following})
            })
        })
    })
}

const unfollow = (req, res) => {
    const defaultUser = req.user.username
	const user = req.params.user
	if (!user) {
		res.sendStatus(400)
		return
	}
	Profile.findOne({username: defaultUser}, 'following', function(err, following) {
    	if (err) {
    		res.sendStatus(500)
    		return
    	}
    	let index = following.following.indexOf(user)
    	if ( index === -1) {
   			res.send({result:"failure", info:"user not followed"})
    	} else {
    		following.following.splice(index, 1)
    		following.save(function(err, data) {
    			res.send({username: defaultUser, following: data.following})
    		})
    	}
	})
}

module.exports = (app) => {
	app.get('/following/:user?', getFollowings)
	app.put('/following/:user', follow)
	app.delete('/following/:user', unfollow)
}
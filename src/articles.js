var Article = require('./model.js').Article
var User = require('./model.js').User

const addArticle = (req, res) => {
	let author = req.user.username
    let text = req.body.text
     if (!text) {
     	res.sendStatus(400)
     	return
     }
     Article.findOne().sort('-id').select('id -_id').exec(function(err, max) {
     	if (err) {
     		res.sendStatus(500)
     		return
     	}
     	let id = 1
     	if (max) {
     		id = max.id + 1
     	}
     	new Article({id: max.id + 1, author: author, date: new Date().getTime(), text: text, like: 0}).save(function(err, article) {
	     	if (err) {
	     		res.sendStatus(500)
	     		return
	     	}
	     	res.send({articles: article})
     	})
     })
}

const updateArticle = (req, res) => {
	let text = req.body.text
	let id = req.params.id
	let commentId = req.body.commentId
	if (!text || !id) {
     	res.sendStatus(400)
     	return
	}
	// console.log("update article --- commentId ", commentId, ' commentId === -1', commentId === '-1', ' ', commentId === -1)
	Article.findOne({id: id}, function(err, article) {
		if (err) {
			console.error(err);
			res.sendStatus(500)
			return
		}
		if (!article) {
			console.log("---------No such articles---------")
			res.sendStatus(401)
			return
		}
		if (!commentId) {
			article.text = text
			article.save(function(err, item) {
				if (err) {
					console.log(err);
					res.sendStatus(500)
					return
				}
				res.send( {articles: item} )
				return
			})
		} else if(commentId === -1) {
			let max =  Math.max.apply(Math, article.comments.map( (c) => c.commentId))
			if (max === -Infinity) {
				max = 0
			} else {
				max++
			}
			article.comments.push({commentId: max, author: req.user.username, date: new Date(), text: text})
			article.save(function(err, data) {
				res.send( {articles: data} )
			})

		} else {
			// console.log('commentdId === ', commentId, " author ", req.user.username)
			// console.log('article.comments --- ', article.comments)
			let comment = article.comments.find( (c) => c.commentId == commentId && c.author === req.user.username )
			if (comment === undefined) {
				console.log('unauthrized to update comment ')
				res.sendStatus(401)
				return
			}
			comment.text = text
			article.save(function(err, value) {
				// console.log("value ", value)
				res.send( {articles: value} )
			})
			
		}
	})
}

//A requested article, or all requested articles by a user
const getArticles = (req, res) => {
	let author = req.user.username
	if (req.params.user) {
		author = req.params.user
	}

	if (isNaN(parseInt(author, 10))) {
		let authors = author.split(',')
		Article.find({author: {$in: authors}}, '-_id -__v',  {sort: {date: -1}, limit: 10}, function(err, articles) {
			if (err) {
				res.sendStatus(500)
				return
			}
			res.send({articles: articles})
		})
	} else {
		Article.find({id: author}, '-_id -__v', function(err, articles) {
			if (err) {
				res.sendStatus(500)
				return
			}
			res.send({articles: articles})
		})
	}
}

const deleteArticle = (req, res) => {
	let id = req.params.id
	if (!id) {
     	res.sendStatus(400)
     	return
	}
	Article.findOneAndRemove({author: req.user.username, id: id}, function(err, a){
		if (err) {
			res.sendStatus(500)
			return 
		}
		res.send({articles:a})
	})
}

const uploadImage = require('./upload.js').uploadImage

const updateImage = (req, res) => {
	let id = req.params.id
	let fileUrl = req.fileurl
	if (!id || !fileUrl) {
     	res.sendStatus(400)
     	return
	}
	Article.findOneAndUpdate({id:id}, {image: fileUrl}, {new: true}, function(err, doc) {
		if(err){
        	console.log("Something wrong when updating data!");
        	res.sendStatus(500)
        	return
    	}
   	 	res.send({article: doc})
	})
} 

module.exports = (app) => {
	app.get('/articles/:user*?', getArticles)
	app.put('/articles/:id',  updateArticle)
	app.delete('/articles/:id', deleteArticle)
	app.post('/article', addArticle)
	app.post('/articles/:id', uploadImage('image'), updateImage)
}
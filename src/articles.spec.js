/*
 * Test suite for articles.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Article functionality', () => {
	let numberOfArticles = 0
	let articleId = 0
	it('should give me no less than 10 articles', (done) => {
		fetch(url("/articles")).then(res => {
			expect(res.status).to.eql(200)
			return res.text()
		}).then(data => {
			let articles = JSON.parse(data).articles
			numberOfArticles = articles.length
			expect(articles.length).to.above(9)
		})
		.then(done)
		.catch(done)
 	}, 200)

	it('POST /article should add two articles with successive article ids, and return the article each time, and add article to results for GET /articles', (done) => {
		let articleOne = "this is my testing article one"
		let articleTwo = "this is my testing article two"
		fetch(url("/article"), {
			method:'POST',
			body:JSON.stringify({
					text: articleOne
				}),
			headers:{
				'Content-Type':'application/json'
			}
		}).then( res => {
			expect(res.status).to.eql(200)
			return res.text()
			}
		).then(data => {
			let article = JSON.parse(data).articles
			articleId = article.id
			expect(article.text).to.eql(articleOne)
		}).then(
			fetch(url("/article"), {
				method:'POST',
				body:JSON.stringify({
						text: articleTwo
					}),
				headers:{
					'Content-Type':'application/json'
				}
			}).then( res => {
				expect(res.status).to.eql(200)
				return res.text()
				}
			).then(data => {
				let article = JSON.parse(data).articles
				expect(article.id).to.eql(articleId + 1)
				expect(article.text).to.eql(articleTwo)
			}).then(
				fetch(url("/articles")).then(res => {
						expect(res.status).to.eql(200)
						return res.text()
					}).then(data => {
						let articles = JSON.parse(data).articles
						expect(articles.length).to.eql(numberOfArticles + 2)
					})
				)).then(done)
 	}, 200)
});
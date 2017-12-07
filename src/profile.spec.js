/*
 * Test suite for profile.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Profile functionality', () => {

	it ('PUT /headline updates the headline message GET /headlines returns', (done) => {
		let newHeadline = "new head line"
		fetch(url('/headline'),{
			method:'PUT',
			body:JSON.stringify({
					headline: newHeadline
				}),
			headers:{
				'Content-Type':'application/json'
			}
		}).then(res => {
			expect(res.status).to.eql(200)
			return res.text()
		}).then(data => {
			expect(JSON.parse(data).headline).to.eql(newHeadline)
		}).then(
			fetch(url('/headlines')).then(res => {
				expect(res.status).to.eql(200)
				return res.text()
			}).then(data => {
				let headlines = JSON.parse(data).headlines
				expect(headlines[0].headline).to.eql(newHeadline)
			})
		).then(done)
	})
});
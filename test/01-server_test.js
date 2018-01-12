'use strict'

import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../lib/server'
const should = chai.should()
chai.use(chaiHttp)

describe('Server', () => {
  describe('/', () => {
    it('has 200 status - all OK', (done) => {
      chai.request(server).get('/').end((err, res) => {
        should.not.exist(err)
        res.should.have.status(200)
        done()
      })
    })
  })
  describe('/admin', () => {
    it('has 401 status - redirects', (done) => {
      chai.request(server).get('/admin').end((err, res) => {
        err /*?*/ // eslint-disable-line
        res.should.have.status(401)
        done()
      })
    })
  })
  describe('/api', () => {
    context('without auth', () => {
      it('has 401 status - no data', (done) => {
        chai.request(server).get('/api').end((err, res) => {
          err /*?*/ // eslint-disable-line
          res.should.have.status(401)
          res.body.should.eql({})
          done()
        })
      })
    })
    context('with bad auth', () => {
      it('has 401 status - no access', (done) => {
        chai.request(server).get('/api').auth('foo', 'bar').end((err, res) => {
          err /*?*/ // eslint-disable-line
          res.should.have.status(401)
          done()
        })
      })
    })
    context('with good auth', () => {
      it('has 200 status - returns user', (done) => {
        chai.request(server).get('/api').auth('bubba', 'pass').end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.json // eslint-disable-line
          res.body.user.should.eql({ username: 'bubba' })
          done()
        })
      })
    })
  })
})

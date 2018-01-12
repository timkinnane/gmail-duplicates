'use strict'

import co from 'co'
import chai from 'chai'
import mongoose from 'mongoose'
import mongoDB from 'mocha-mongoose'
import guid from 'guid'
import configDB from '../lib/config/database'
import appModels from '../lib/app/models'
const should = chai.should()
const clearDB = mongoDB(configDB.url, { noClear: true })
mongoose.Promise = global.Promise // supress depreciation warnings

const Dummy = mongoose.model('Dummy', new mongoose.Schema({a: Number}))

describe('Mongo DB', () => {
  before((done) => {
    if (mongoose.connection.db) return done()
    mongoose.connect(configDB.url, configDB.options, () => {
      clearDB(done)
    })
  })
  describe('Dummy Schema', () => {
    it('can be saved', (done) => {
      Dummy.create({a: 1}, done)
    })
    it('can save another', (done) => {
      Dummy.create({a: 2}, done)
    })
    it('can be listed', (done) => {
      Dummy.find({}, (err, docs) => {
        should.not.exist(err)
        docs.should.have.length(2)
        done()
      })
    })
    it('can clear the DB', (done) => {
      Dummy.count((err, count) => {
        should.not.exist(err)
        count.should.equal(2)
        clearDB((err) => {
          should.not.exist(err)
          Dummy.find({}, (err, docs) => {
            should.not.exist(err)
            docs.should.have.length(0)
            done()
          })
        })
      })
    })
  })
  describe('Users', () => {
    it('can be saved', (done) => {
      let user = new appModels.User({
        stratachat: {
          id: '111',
          email: 'test@test.com',
          name: 'Testy McTestface',
          username: 'Testy'
        }
      })
      user.save((err) => {
        if (err) console.error(err)
        should.not.exist(err)
        done()
      })
    })
    it('new user gets new guid', (done) => {
      let user = new appModels.User({
        stratachat: {
          id: '222',
          email: 'another@user.com',
          name: 'Testy the Second',
          username: 'TestyII'
        }
      })
      user.save().then((result) => {
        should.equal(true, guid.isGuid(result.guid))
        done()
      })
    })
    it('can update - returns original guid', (done) => {
      let user = new appModels.User({
        stratachat: {
          id: '111',
          email: 'test@test.com.au',
          name: 'Testy LeTest Né McTestface'
        }
      })
      user.save((err) => {
        if (err) console.error(err)
        should.not.exist(err)
        done()
      })
    })
    it('can be retrieved', (done) => {
      appModels.User.findOne({ 'stratachat.id': '111' }, (err, doc) => {
        doc.stratachat.name.should.equal('Testy LeTest Né McTestface')
        should.not.exist(err)
        done()
      })
    })
  })
  describe('Search', () => {
    it('can save with user ID', () => co(function * () {
      let user = yield appModels.User.findOne({ 'stratachat.id': '111' }).exec()
      let search = yield new appModels.Search({ 'user_id': user._id }).save()
      search.should.be.instanceof(appModels.Search)
    }))
    it('can be created by user', () => co(function * () {
      let user = yield appModels.User.findOne({ 'stratachat.id': '111' }).exec()
      let search = yield user.newSearch()
      search.should.be.instanceof(appModels.Search)
    }))
  })
})

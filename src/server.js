'use strict'

import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import flash from 'connect-flash'
import morgan from 'morgan'
import mongoose from 'mongoose'
import logger from './utils/logger'
import configServer from './config/server'
import configPassport from './config/passport'
import configSession from './config/session'
import configDB from './config/database.js'
import appRoutes from './app/routes.js'

const app = express()
app.use(morgan('combined', { stream: logger.stream })) // log server requests
app.use(express.static('public')) // serve static assets
app.set('view engine', 'pug') // render pug templates
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })) // get data from URL
app.use(bodyParser.json()) // get data from a POST
app.use(session(configSession)) // session secret etc

mongoose.Promise = global.Promise // supress depreciation warnings
mongoose.connect(configDB.url, configDB.options) // connect to DB
mongoose.connection.on('error', (err) => logger.error(err))
mongoose.connection.once('open', () => logger.debug(`DB open at ${configDB.url}`))

configPassport(passport, logger) // pass passport for configuration
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

appRoutes(app, passport) // load our routes and pass in our app and fully configured passport
app.listen(configServer.port) // open server

logger.debug(`Server started at ${configServer.host}:${configServer.port}`)

module.exports = app

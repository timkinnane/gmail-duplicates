import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import flash from 'connect-flash'

import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'

import configDB from './config/database.js'
import configPassport from './config/passport'
import appRoutes from './app/routes.js'

const app = express()
const port = process.env.PORT || 8080

mongoose.connect(configDB.url) // connect to database
configPassport(passport) // pass passport for configuration

// set up our express application
app.use(morgan('dev')) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser()) // get information from html forms

app.set('view engine', 'ejs') // set up ejs for templating

// required for passport
app.use(session({ secret: '' })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

appRoutes(app, passport) // load our routes and pass in our app and fully configured passport

app.listen(port)

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

export default function (app, passport) {
  app.get('/', (req, res) => {
    res.render('index.pug')
  })
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }))
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/mail',
    failureRedirect: '/'
  }))
  app.get('/mail', isLoggedIn, (req, res) => {
    res.render('mail.pug', { user: req.user })
  })
  app.get('/signout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}

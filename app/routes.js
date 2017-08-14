function authMiddleware (req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

export default function (app, passport) {
  app.get('/', (req, res) => {
    res.render('index.ejs')
  })
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/mail',
    failureRedirect: '/'
  }))
  app.get('/mail', authMiddleware, (req, res) => {
    res.render('mail.ejs', {
      user: req.user
    })
  })
  app.get('/signout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
}

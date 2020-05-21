var express = require('express');
var router = express.Router();
var login = require('../controllers/C_Login')
var passport = require('passport')

/* GET index page. */
//router.get('/', login.index)

/* GET login page. */
router.get('/login', login.login)

/* GET login page. */
router.get('/logout', login.logout)

/* POST login page. */
router.post('/login', (req, res, next) => {
  if (req.isAuthenticated()) {
      req.flash('success', 'You are already logged in.')
      res.redirect('/')
  } else {
      let user = req.body.email
      let pass = req.body.password
      if (user.length === 0 || pass.length === 0) {
          req.flash('error', 'You must provide a username and password.')
          res.redirect('/login')
      } else {
          next()
      }
  }
}, passport.authenticate('login', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true
}))


module.exports = router;

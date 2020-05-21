const passport = require('passport')

class C_Login{
    login(req, res){
        if(req.isAuthenticated()){
            res.redirect('/')
        }else{
            res.render('login', {
                title: 'Login',
                error: res.locals.error,
                success:  res.locals.success
            })
        }
    }

    logout(req, res){
        if(req.isAuthenticated()){
            console.log('User [' + req.user.username + '] has logged out.')
            req.logout()
            res.redirect('/');
        }else{
            res.redirect('/')
        }
    }
}

module.exports = new C_Login();
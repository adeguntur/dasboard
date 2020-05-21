const bcrypt        = require('bcryptjs');
const db            = require('./database')

var LocalStrategy   = require('passport-local').Strategy

module.exports = function(passport){
    passport.serializeUser((user, done)=>{
        done(null, user);
    });
    passport.deserializeUser((user, done)=>{
        done(null, user);
    });
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        loginUser()
        console.log(email)
        async function loginUser(){
            try{
                db.one('SELECT *  FROM users WHERE email = $1', [email])
                .then((result) => {
                    bcrypt.compare(password, result.password, (err, valid)=>{
                        if(err){
                            console.log('error', 'Error Password Validasi')
                            return done(err)
                        }
                        if(valid){
                            console.log('User [' + req.body.email + '] has logged in.')
                            return done(null, result)
                        }else{
                            return done(null, false, req.flash('error', "Password yang anda masukkan salah"))
                        }
                    })
                }).catch(() => {
                    return done(null, false, req.flash('error', "email atau Password yang anda masukkan salah"))
                });
            }catch(err){
                throw(err)
            }
        }
    }
    ))
}
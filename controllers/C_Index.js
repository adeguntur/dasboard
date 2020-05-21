const db        = require('../config/database')


var userData = [];
var userId = [];

class C_Index {
   async index(req, res){
        if(req.isAuthenticated()){
            db.any('SELECT * FROM users')
            .then((result) => {
                for(let i = 0; i < result.length; i++){
                    userData.push(result[i].name);
                    userId.push(result[i].id)
                }
                res.render('index', {
                    user: userData,
                    id: JSON.stringify(userId)
                })
            }).catch((err) => {
                
            });
        }else{
            res.redirect('/login')
        }
    }

    async chartApi(req, res){
       res.send({
           user: userData,
           id: userId
       })
    }
    
}
module.exports = new C_Index();
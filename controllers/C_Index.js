const db        = require('../config/database')


var userData = [];
var userId = [];
var pelabuhanKode = [];
var pelabuhanJmlpib = [];

class C_Index {
   async index(req, res){
  /*       if(req.isAuthenticated()){ */
            db.any('SELECT pelbkr as kode_pelabuhan, COUNT(pelbkr) AS jml_pib FROM nswdb1.tblpibhdr ORDER BY jml_pib DESC LIMIT 5;')
            .then((result) => {
                for(let i = 0; i < result.length; i++){
                    pelabuhanKode.push(result[i].kode_pelabuhan);
                    pelabuhanJmlpib.push(result[i].jml_pib)
                }
                res.render('index', {
                })
            }).catch((err) => {
                
            });
        /* }else{
            res.redirect('/login')
        } */
    }

    async chartApi(req, res){
       res.send({
           kode_pelabuhan: pelabuhanKode,
           jml_pib: pelabuhanJmlpib
       })
    }
    
}
module.exports = new C_Index();
const db        = require('../config/database')

var pelabuhanKode = [];
var pelabuhanJmlpib = [];
var negaraImp = [];
var negaraJimp = [];

class C_Index {
   async index(req, res){
  /*       if(req.isAuthenticated()){ */
            db.any('SELECT SUBSTRING(pelbkr, 3) as kode_pelabuhan, COUNT(pelbkr) AS jml_pib FROM nswdb1.tblpibhdr GROUP BY kode_pelabuhan ORDER BY jml_pib DESC LIMIT 5;')
            .then((result) => {
                for(let i = 0; i < result.length; i++){
                    pelabuhanKode.push(result[i].kode_pelabuhan);
                    pelabuhanJmlpib.push(result[i].jml_pib)
                }
                
                res.render('index', { })
            })
            .catch((err) => {});

            db.any('SELECT penjualneg as kode_negara, COUNT(penjualneg) AS jml_imp FROM nswdb1.tblpibhdr GROUP BY kode_negara ORDER BY jml_imp DESC LIMIT 5 ')
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    negaraImp.push(result[i].kode_negara);
                    negaraJimp.push(result[i].jml_imp)
                }

                res.render('index', {})
            })
            .catch((err) => {});
            
        /* }else{
            res.redirect('/login')
        } */
    }

    async chartApi(req, res){
       res.send({
           kode_pelabuhan: pelabuhanKode,
           jml_pib: pelabuhanJmlpib,
           kode_negara: negaraImp,
           jml_importnegara: negaraJimp
       })
    }
    
}
module.exports = new C_Index();
const db = require('../config/database')

var pelabuhanKode = [];
var pelabuhanJmlpib = [];
var negaraKode = [];
var negaraTotal= [];
var importirNama = [];
var importirTotal = [];

class C_Index {
   async index(req, res){
  /*       if(req.isAuthenticated()){ */
     await db.any("" +
       +"SELECT SUBSTRING(pelbkr, 3) AS kode_pelabuhan, SUM(cif_rp) as total FROM" +
       "(SELECT SUBSTRING(pelbkr, 3) AS kode_pelabuhan, (cif * ndpbm) as cif_rp, pibtg  FROM nswdb1.tblpibhdr " +
       "WHERE pibtg BETWEEN '2019-01-01 ' AND '2019-12-31 ' GROUP BY kode_pelabuhan, cif, ndpbm, pibtg ) as foo" +
       "GROUP BY kode_pelabuhan ORDER BY total DESC LIMIT 5 ;")
            .then((result) => {
              console.log(result)

                for(let i = 0; i < result.length; i++){
                    pelabuhanKode.push(result[i].kode_pelabuhan);
                    pelabuhanJmlpib.push(result[i].total)
                }
                
                res.render('index', { })
            })
            .catch((err) => {});
            await db.any("select pasokneg, SUM(cif_rp) as total from (SELECT pasokneg, (cif * ndpbm) AS cif_rp, pibtg FROM nswdb1.tblpibhdr WHERE pibtg BETWEEN '2019-01-01' AND '2019-12-31' GROUP BY pasokneg, cif_rp, pibtg) as foo group by pasokneg order by total desc limit 10;")
              .then((result) => {
                for (let i = 0; i < result.length; i++) {
                  negaraKode.push(result[i].pasokneg);
                  negaraTotal.push(result[i].total);
                }

                res.render("index", {});
              })
              .catch((err) => {});
          
            await db.any('select impnama, SUM(cif_rp) as total from (SELECT impnama, (cif * ndpbm) AS cif_rp FROM nswdb1.tblpibhdr GROUP BY impnama,cif_rp) as foo group by impnama order by total desc limit 10;')
                .then((result) => {
                    for (let i = 0; i < result.length; i++) {
                        importirNama.push(result[i].impnama);
                        importirTotal.push(result[i].total)
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
           kode_negara: negaraKode,
           totalimport_negara: negaraTotal,
           nama_importir: importirNama,
           total_importir: importirTotal
       })
    }
    
}
module.exports = new C_Index();
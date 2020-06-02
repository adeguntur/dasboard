const db = require('../config/database')

class C_Index {
   async index(req, res){
      res.render('index', {})
    }

    async chartApi(req, res){
      var pelabuhanKode = [];
      var pelabuhanJmlpib = [];
      var negaraKode = [];
      var negaraTotal = [];
      var importirNama = [];
      var importirTotal = [];

      await db.any("SELECT kode_pelabuhan AS kode_pelabuhan, SUM(cif_rp) as total from(SELECT SUBSTRING(pelbkr, 3) AS kode_pelabuhan, (cif * ndpbm) AS cif_rp, pibtg FROM " +
          "nswdb1.tblpibhdr WHERE pibtg BETWEEN '2019-01-01' AND '2019-12-31'" +
          "GROUP BY pelbkr, cif_rp, pibtg) as foo" +
          "group by kode_pelabuhan order by total desc limit 5;")
        .then((result) => {
          console.log(result)
          for (let i = 0; i < result.length; i++) {
            pelabuhanKode.push(result[i].kode_pelabuhan);
            pelabuhanJmlpib.push(result[i].total)
          }
          
        })
        .catch((err) => {});
      await db.any("select pasokneg, SUM(cif_rp) as total from" +
          " (SELECT pasokneg, (cif * ndpbm) AS cif_rp, pibtg FROM nswdb1.tblpibhdr " +
          "WHERE pibtg BETWEEN '2019-01-01' AND '2019-12-31' GROUP BY pasokneg, cif_rp, pibtg) as foo" +
          " group by pasokneg order by total desc limit 5;")
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            negaraKode.push(result[i].pasokneg);
            negaraTotal.push(result[i].total);
          }
          
        })
        .catch((err) => {});

      await db.any('select impnama, SUM(cif_rp) as total from (SELECT impnama, (cif * ndpbm) AS cif_rp FROM nswdb1.tblpibhdr GROUP BY impnama,cif_rp) as foo group by impnama order by total desc limit 10;')
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            importirNama.push(result[i].impnama);
            importirTotal.push(result[i].total)
          }
       
        })
        .catch((err) => {})

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
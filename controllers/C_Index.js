const db = require('../config/database')

class C_Index {
   async index(req, res){
      res.render('index', {})
    }

    async chartApi(req, res){
      var pelabuhanKode = [];
      var pelabuhanJmlpemasukan = [];
      var negaraKode = [];
      var negaraTotal = [];
      var importirNama = [];
      var importirTotal = [];
      var border = [];
      var realisasiBorder = [];

      //pelabuhan
      await db.any("SELECT kode_pelabuhan AS kode_pelabuhan, SUM(cif_rp) as " +
      "total from (SELECT SUBSTRING(pelbkr, 3) AS kode_pelabuhan, (cif * ndpbm) AS cif_rp, pibtg " +
      "FROM nswdb1.tblpibhdr WHERE pibtg BETWEEN '2019-01-01' AND '2019-12-31' GROUP BY pelbkr, cif_rp, pibtg) as foo " +
      "group by kode_pelabuhan order by total desc limit 5;")
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            pelabuhanKode.push(result[i].kode_pelabuhan);
            pelabuhanJmlpemasukan.push(result[i].total)
          }
        })
        .catch((err) => {});

      //negara impport
      await db.any("select pasokneg, SUM(cif_rp) as total from" +
      "(SELECT pasokneg, (cif * ndpbm) AS cif_rp, pibtg FROM nswdb1.tblpibhdr " +
      "WHERE pibtg BETWEEN '2019-01-01' AND '2019-12-31' GROUP BY pasokneg, cif_rp, pibtg) as foo" +
      " group by pasokneg order by total desc limit 5;")
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            negaraKode.push(result[i].pasokneg);
            negaraTotal.push(result[i].total);
          }
          
        })
        .catch((err) => {});

      //importir
      await db.any("select impnama, SUM(cif_rp) as total from (SELECT impnama, (cif * ndpbm) AS cif_rp FROM nswdb1.tblpibhdr GROUP BY impnama,cif_rp) as foo group by impnama order by total desc limit 10;")
        .then((result) => {
          console.log(result)
          for (let i = 0; i < result.length; i++) {
            importirNama.push(result[i].impnama);
            importirTotal.push(result[i].total)
          }
       
        })
        .catch((err) => {})

      //Border
      await db.any(" SELECT date_part('month', a.pibtg) as bulan_pib, b.dcif, a.ndpbm"+
      "FROM tblpibhdr a JOIN tblpibdtl b ON a.cusdecid = b.cusdecid JOIN tblctl_postborder c ON c.cusdecid = a.cusdecid"+
      "JOIN tblrealisasi_postborder d ON d.seq = c.seq AND d.seri_brg = b.serial AND b.nohs::text = d.hs_code::text"+
      "WHERE a.pibtg >= '2019-01-01'::date AND a.pibtg <= '2019-12-31'::date ")
        .then((result) => {
          console.log(result)
          for (let i = 0; i < result.length; i++) {
            bulan_pib_B.push(result[i].bulan_pib);
            dcif_B.push(result[i].dcif);
            ndpbm_B.push(result[i].ndpbm)
          }
        })
        .catch((err) => {})



       res.send({
           kode_pelabuhan: pelabuhanKode,
           jml_pemasukan: pelabuhanJmlpemasukan,
           kode_negara: negaraKode,
           totalimport_negara: negaraTotal,
           nama_importir: importirNama,
           total_importir: importirTotal
       })
    }

    async detailnegaraApi(req, res) {
      var finalResult = [];

      const {
        kdneg,
        tahun,
        awal,
        akhir
      } = req.body;
      
      await db.any(
        "select negara,kd_komoditi, SUM(cif_rp) as total from ( "+
        "SELECT a.pasokneg as negara, f.kd_komoditi, b.dcif * a.ndpbm AS cif_rp, a.pasokneg, a.pibtg AS tgl_pib FROM "+
        "nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid "+
        "JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text "+
        "JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid where(date_part('month', a.pibtg) >= $3 AND(date_part('month', a.pibtg) <= $4 and date_part('year', a.pibtg) = $2)) and a.pasokneg = $1) "+
        "as foo group by negara, kd_komoditi order by total desc limit 10;",[kdneg, tahun, awal, akhir])
         .then((result) => {
              for (let i = 0; i < result.length; i++) {
                finalResult.push({
                  negara: result[i].negara,
                  kode: result[i].kd_komoditi,
                  total: result[i].total
                })
              }
        })
        .catch((err) => {
          console.log(err)
        })
 
        res.send({
          finalResult: finalResult
        })

    }   

    async detailpelpenApi(req, res) {
      var finalResult = [];

      const {
        kdpel,
        tahun,
        awal,
        ahir
      } = req.body;

      await db.any(
          "select kdpel,kd_komoditi, SUM(cif_rp) as total from ( " +
          "SELECT SUBSTRING(a.pelbkr, 3) AS kdpel, f.kd_komoditi, b.dcif * a.ndpbm AS cif_rp, a.pasokneg, a.pibtg AS tgl_pib FROM " +
          "nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid " +
          "JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text " +
          "JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid where(date_part('month', a.pibtg) >= $3 AND(date_part('month', a.pibtg) <= $4 and date_part('year', a.pibtg) = $2)) and SUBSTRING(a.pelbkr, 3) = $1) " +
          "as foo group by kdpel, kd_komoditi order by total desc limit 10;", [kdpel, tahun, awal, ahir])
        .then((result) => {
          console.log(result)
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              kode: result[i].kd_komoditi,
              total: result[i].total
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })

      res.send({
        finalResult: finalResult
      })

    }

    async detailimportirApi(req, res) {
      var finalResult = [];

      const {
        kdimportir,
        tahun,
        awal,
        ahir
      } = req.body;

      await db.any(
          "SELECT a.pibno, a.pibtg  as tgl_pib, b.serial as seri_barang, b.jmlsat as jml_satuan, b.kdsat, a.impnpwp as npwp, a.impnama as importir FROM " +
          "nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid " +
          "JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text " +
          "JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid where(date_part('month', a.pibtg) >= $3 AND(date_part('month', a.pibtg) <= $4 and date_part('year', a.pibtg) = $2)) and a.impnama = $1 ;", [kdimportir, tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              nopib: result[i].pibno,
              tglpib: result[i].tgl_pib,
              seribarang: result[i].seri_barang,
              jmlsatuan: result[i].jml_satuan,
              kodesatuan: result[i].kdsat,
              npwp: result[i].npwp,
              importir: result[i].importir
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })

      res.send({
        finalResult: finalResult
      })

    }



    
}
module.exports = new C_Index();
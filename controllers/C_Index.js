const db = require('../config/database')

class C_Index {
   async index(req, res){
      res.render('index', {})
    }
    
    async postchartApi(req, res) {
      var pelabuhanKode = [];
      var pelabuhanJmlpemasukan = [];
      var negaraKode = [];
      var negaraTotal = [];
      var importirNama = [];
      var importirTotal = [];
      var bulan_pibB = [];
      var total_B = [];
      var bulan_pib_PostBdr = [];
      var total_PostBdr = [];
      var bulan_pib_Nawas = [];
      var total_Nawas = [];

      const {
        tahun,
        awal,
        ahir
      } = req.body;

      //pelabuhan
      await db.any("SELECT kode_pelabuhan AS kode_pelabuhan, SUM(cif_rp) as " +
          "total from (SELECT SUBSTRING(pelbkr, 3) AS kode_pelabuhan, (cif * ndpbm) AS cif_rp, pibtg " +
          "FROM nswdb1.tblpibhdr WHERE (date_part('month', pibtg) >= $2 AND(date_part('month', pibtg) <= $3 and date_part('year', pibtg) = $1))  GROUP BY pelbkr, cif_rp, pibtg) as foo " +
          "group by kode_pelabuhan order by total desc limit 5;", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            pelabuhanKode.push(result[i].kode_pelabuhan);
            pelabuhanJmlpemasukan.push(result[i].total)
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //negara import
      await db.any("select pasokneg, SUM(cif_rp) as total from" +
          "(SELECT pasokneg, (cif * ndpbm) AS cif_rp, pibtg FROM nswdb1.tblpibhdr " +
          "WHERE (date_part('month', pibtg) >= $2 AND(date_part('month', pibtg) <= $3 and date_part('year', pibtg) = $1)) GROUP BY pasokneg, cif_rp, pibtg) as foo" +
          " group by pasokneg order by total desc limit 5;", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            negaraKode.push(result[i].pasokneg);
            negaraTotal.push(result[i].total);
          }

        })
        .catch((err) => {
          console.log(err);
        });

      //importir
      await db.any("select impnama, SUM(cif_rp) as total from (SELECT impnama, (cif * ndpbm) AS cif_rp FROM nswdb1.tblpibhdr "+
      " WHERE (date_part('month', pibtg) >= 02 AND (date_part('month', pibtg) <= $3 and date_part('year', pibtg) = $1)) "+
      "GROUP BY impnama,cif_rp) as foo group by impnama order by total desc limit 10;", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            importirNama.push(result[i].impnama);
            importirTotal.push(result[i].total)
          }

        })
        .catch((err) => {
          console.log(err);
        })

      //Border
      await db
        .any(
          "select bulan_pib_b, sum (cif_rp) as total_b from ( " +
            " select date_part('month', a.pibtg) as bulan_pib_B, a.car, " +
            " b.nohs AS hs_code, b.serial AS seri_barang, f.kd_ijin, b.brgurai AS uraian_barang, b.jmlsat AS jml_satuan, " +
            " b.kdsat AS kd_satuan, b.brgasal AS kd_negara_asal,''::character varying AS kd_notifikasi, f.kd_komoditi, " +
            " '1'::text AS kd_border, b.dcif * a.ndpbm AS cif_rp FROM nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid " +
            " JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text " +
            " JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid LEFT JOIN nswdb1.tblrealisasi_postborder d ON d.seq = c.seq " +
            " AND d.seri_brg = b.serial AND b.nohs::text = d.hs_code::text " +
            " WHERE(date_part('month', a.pibtg) >= $2 and(date_part('month', a.pibtg) <= $3 and date_part('year', a.pibtg) = $1))) as foo group by bulan_pib_b;",[tahun, awal, ahir]
        )
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pibB.push(result[i].bulan_pib_b);
            total_B.push(result[i].total_b);

          }
        })
        .catch((err) => {
          console.log(err);
        });

      //Post Border
      await db
        .any(
          "select bulan_pib_pb, sum (cif_rp) as total_pb from ( " +
            " select date_part('month', a.pibtg) as bulan_pib_PB, a.car, b.nohs AS hs_code, b.serial AS seri_barang, d.kd_ijin, " +
            " b.brgurai AS uraian_barang, b.jmlsat AS jml_satuan, b.kdsat AS kd_satuan, b.brgasal AS kd_negara_asal, d.statusijin AS kd_notifikasi, " +
            " d.kd_komoditi, '2'::text AS kd_border, b.dcif * a.ndpbm AS cif_rp, a.pibtg AS tgl_pib FROM nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid " +
            " JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid JOIN nswdb1.tblrealisasi_postborder d ON d.seq = c.seq AND d.seri_brg = b.serial " +
            "AND b.nohs::text = d.hs_code::text WHERE(date_part('month', a.pibtg) >= $2 and(date_part('month', a.pibtg) <= $3 and date_part('year', a.pibtg) = $1))) as foo group by bulan_pib_pb;",[tahun, awal, ahir]
        )
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pib_PostBdr.push(result[i].bulan_pib_pb);
            total_PostBdr.push(result[i].total_pb);
          }
        })
        .catch((err) => {
          console.log(err);
        });

        //non pengawasan
        // await db.any("select bulan_pib_nw, sum (cif_rp) as total_nw from ( "+
        // " select date_part('month', a.pibtg) as bulan_pib_nw, a.car, b.nohs AS hs_code, b.serial AS seri_barang, "+
        // " f.kd_ijin, b.brgurai AS uraian_barang, b.jmlsat AS jml_satuan, b.kdsat AS kd_satuan, b.brgasal AS kd_negara_asal, "+
        // " ''::character varying AS kd_notifikasi, f.kd_komoditi,'3'::text AS kd_border, b.dcif * a.ndpbm AS cif_rp, a.pibtg AS tgl_pib "+
        // " FROM nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid LEFT JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid "+
        // " LEFT JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text "+
        // " LEFT JOIN  nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid LEFT JOIN  nswdb1.tblrealisasi_postborder d ON d.seq = c.seq AND d.seri_brg = b.serial AND b.nohs::text = d.hs_code::text "+
        // " WHERE(date_part('month', a.pibtg) >= $2 and (date_part('month', a.pibtg) <=$3 and date_part('year', a.pibtg) = $1))) as foo group by bulan_pib_nw;",[tahun, awal, ahir])
        //   .then((result) => {
        //     console.log(result)
        //     for (let i = 0; i < result.length; i++) {
        //       bulan_pib_Nawas.push(result[i].bulan_pib_nw);
        //       total_Nawas.push(result[i].total_nw);
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   })

      res.send({
        kode_pelabuhan: pelabuhanKode,
        jml_pemasukan: pelabuhanJmlpemasukan,
        kode_negara: negaraKode,
        totalimport_negara: negaraTotal,
        nama_importir: importirNama,
        total_importir: importirTotal,
        bulan_border: bulan_pibB,
        total_border: total_B,
        bulan_postborder: bulan_pib_PostBdr,
        total_postborder: total_PostBdr,
        bulan_nawas: bulan_pib_Nawas,
        total_nawas: total_Nawas
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
          console.log(req.body) 
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
        akhir
      } = req.body;

      await db.any(
          "select kdpel, kd_komoditi, SUM(cif_rp) as total from ( " +
          "SELECT SUBSTRING(a.pelbkr, 30) AS kdpel, f.kd_komoditi, b.dcif * a.ndpbm AS cif_rp, a.pasokneg, a.pibtg AS tgl_pib FROM " +
          "nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid " +
          "JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text " +
          "JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid where (date_part('month', a.pibtg) >= $3 AND(date_part('month', a.pibtg) <= $4 and date_part('year', a.pibtg) = $2)) and SUBSTRING(a.pelbkr, 3) = $1) " +
          "as foo group by kdpel, kd_komoditi order by total desc limit 10;", [kdpel, tahun, awal, akhir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              pel: req.body.kdpel,
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
        akhir
      } = req.body;

      await db.any(
          "SELECT a.pibno, a.pibtg  as tgl_pib, b.serial as seri_barang, b.jmlsat as jml_satuan, b.kdsat, a.impnpwp as npwp, a.impnama as importir FROM " +
          "nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid " +
          "JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text " +
          "JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid where(date_part('month', a.pibtg) >= $3 AND(date_part('month', a.pibtg) <= $4 and date_part('year', a.pibtg) = $2)) and a.impnama = $1 ;", [kdimportir, tahun, awal, akhir])
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

     async butonpostborderApi(req, res) {
       var finalResult = [];

       const {
         tahun,
         awal,
         akhir
       } = req.body;

       await db.any(
           "SELECT a.pibno, a.pibtg  as tgl_pib, b.serial as seri_barang, b.jmlsat as jml_satuan, b.kdsat, a.impnpwp as npwp, a.impnama as importir FROM " +
           "nswdb1.tblpibhdr a JOIN nswdb1.tblpibdtl b ON a.cusdecid = b.cusdecid JOIN nswdb1.tbllartas_hdr e ON e.cusdecid = a.cusdecid " +
           "JOIN nswdb1.tbllartas_ok f ON e.seq = f.seq AND f.seri_brg = b.serial AND f.kdhs::text = b.nohs::text " +
           "JOIN nswdb1.tblctl_postborder c ON c.cusdecid = a.cusdecid where(date_part('month', a.pibtg) >= $2 AND(date_part('month', a.pibtg) <= $3 and date_part('year', a.pibtg) = $1));", [tahun, awal, akhir])
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
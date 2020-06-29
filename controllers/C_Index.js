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
      var nama_importir = []; 
      var importirTotal = [];
      var bulan_pibB = [];
      var total_B = [];
      var bulan_pib_PostBdr = [];
      var total_PostBdr = [];
      var bulan_pib_Nawas = [];
      var total_Nawas = [];
      var bulan_pib_01 = [];
      var total_01 = [];
      var bulan_pib_11 = [];
      var total_11 = [];
      var bulan_pib_12 = [];
      var total_12 = [];
      var bulan_pib_13 = [];
      var total_13 = [];

      const {
        tahun,
        awal,
        ahir,
        kl,
        komoditi
      } = req.body;

      //negara import
      await db.any("SELECT kd_negara_asal, coalesce(sum(cif_rupiah),0) as total FROM "+
      "nswdbpb.dm_negasal_imp_kom a "+
      "WHERE a.bulan_pib >= $2 and a.bulan_pib <= $3 and tahun_pib = $1 group by kd_negara_asal ORDER BY total desc limit 5;", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            negaraKode.push(result[i].kd_negara_asal);
            negaraTotal.push(result[i].total);
          }

        })
        .catch((err) => {
          console.log(err);
        });

      //pelabuhan 
      await db.any("select b.kd_pel , sum(jml_dok_pib) total "+
          "from nswdbpb.dm_pelmasuk_importir a inner join nswdbdwh.dim_pelabuhan b on a.kd_pelabuhan_masuk = b.kd_pel "+
          "where a.bulan_pib >= $2 and a.bulan_pib <= $3 and a.tahun_pib = $1 "+
          "group by b.kd_pel order by total desc limit 5 ; ", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            pelabuhanKode.push(result[i].kd_pel);
            pelabuhanJmlpemasukan.push(result[i].total)
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //importir
      await db.any("SELECT npwp ,nama_importir, coalesce(sum(cif_rupiah),0) total FROM "+
      "nswdbpb.dm_pelmasuk_imp_kom WHERE bulan_pib >= $2 and bulan_pib <= $3 "+
      "and tahun_pib = $1 GROUP BY npwp, nama_importir ORDER BY total desc limit 10;", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            importirNama.push(result[i].nama_importir);
            importirTotal.push(result[i].total);
          }
        })
        .catch((err) => {
          console.log(err);
        })

      //Border
      await db
        .any(
          "SELECT bulan_pib, coalesce(sum(cif_rupiah),0) total FROM "+
          "nswdbpb.dm_real_imp_border "+
          "WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 GROUP BY bulan_pib;",[tahun, awal, ahir]
        )
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pibB.push(result[i].bulan_pib);
            total_B.push(result[i].total);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //Post Border
      await db
        .any("SELECT bulan_pib, coalesce(sum(cif_rupiah),0) total FROM " +
            "nswdbpb.dm_real_imp_postborder " +
            "WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 GROUP BY bulan_pib  ORDER BY bulan_pib asc", [tahun, awal, ahir]
        )
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pib_PostBdr.push(result[i].bulan_pib);
            total_PostBdr.push(result[i].total);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //non pengawasan
      await db.any("SELECT bulan_pib, coalesce(sum(cif_rupiah), 0) total FROM "+
          "nswdbpb.dm_real_imp_nonijin " +
          "WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 GROUP BY bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir])
        .then((result) => {
            for (let i = 0; i < result.length; i++) {
              bulan_pib_Nawas.push(result[i].bulan_pib);
              total_Nawas.push(result[i].total);
            }
        })
        .catch((err) => {
          console.log(err);
        })

      //per notif 01
      await db.any("SELECT bulan_pib, coalesce(sum(cif_rupiah),0) total FROM "+
          "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 AND kd_ga = $4 AND kd_komoditi = $5 "+
          "AND kd_notif_postborder = '01' group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir, kl, komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pib_01.push(result[i].bulan_pib);
            total_01.push(result[i].total);
          }
        })
        .catch((err) => {
          console.log(err);
        })
      
      //per notif 11
      await db.any("SELECT bulan_pib, coalesce(sum(cif_rupiah),0) total FROM "+
          "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 AND kd_ga = $4 "+
          "AND kd_komoditi = $5 "+
          "AND kd_notif_postborder = '11' "+
          "group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir, kl, komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pib_11.push(result[i].bulan_pib);
            total_11.push(result[i].total);
          }
        })
        .catch((err) => {
          console.log(err);
        })

      //per notif 12
      await db.any("SELECT bulan_pib, coalesce(sum(cif_rupiah),0) total FROM " +
        "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 AND kd_ga = $4 " +
        "AND kd_komoditi = $5 " +
        "AND kd_notif_postborder = '12' " +
        "group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir, kl, komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pib_12.push(result[i].bulan_pib);
            total_12.push(result[i].total);
          }
        })
        .catch((err) => {
          console.log(err);
        })

        //per notif 13
     await db.any("SELECT bulan_pib, coalesce(sum(cif_rupiah),0) total FROM " +
       "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 AND kd_ga = $4 " +
       "AND kd_komoditi = $5 " +
       "AND kd_notif_postborder = '13' " +
       "group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir, kl, komoditi])
       .then((result) => {
          for (let i = 0; i < result.length; i++) {
            bulan_pib_13.push(result[i].bulan_pib);
            total_13.push(result[i].total);
          }
        })
        .catch((err) => {
          console.log(err);
        })

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
        total_nawas: total_Nawas,
        bulan_01: bulan_pib_01,
        total_01: total_01,
        bulan_11: bulan_pib_11,
        total_11: total_11,
        bulan_12: bulan_pib_12,
        total_12: total_12,
        bulan_13: bulan_pib_13,
        total_13: total_13
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
        "select case when c.ur_komoditi is null then '[non]' else c.ur_komoditi end as komoditi, " +
        "sum(a.cif_rupiah) total_cif_rp, b.uredi "+
        "from nswdbpb.dm_negasal_imp_kom a "+
        "inner join nswdb1.tblnegara b on a.kd_negara_asal = b.kdedi "+
        "left join nswdbdwh.dim_komoditi c on a.kd_komoditi = c.kd_komoditi "+
        "where a.bulan_pib >= $3 and a.bulan_pib <= $4 and a.tahun_pib = $2 and b.kdedi = $1 "+
        "group by c.ur_komoditi,b.uredi order by total_cif_rp desc limit 10 ", [kdneg, tahun, awal, akhir])
         .then((result) => {
              for (let i = 0; i < result.length; i++) {
                finalResult.push({
                  negara: result[i].uredi,
                  kode: result[i].komoditi,
                  total: result[i].total_cif_rp
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
      var kode = [];

      const {
        kdpel,
        tahun,
        awal,
        akhir
      } = req.body;

      await db.any(
          "select case when c.ur_komoditi is null then '[NON]' else c.ur_komoditi end as komoditi, sum(jml_dok_pib) total_dok_pib,b.ur_pel urpel  " +
          "from nswdbpb.dm_pelmasuk_imp_kom a "+
          "inner join nswdbdwh.dim_pelabuhan b on a.kd_pelabuhan_masuk = b.kd_pel "+
          "left join nswdbdwh.dim_komoditi c on a.kd_komoditi = c.kd_komoditi "+
          "where a.bulan_pib >= $3 "+
          "and a.bulan_pib <= $4 "+
          "and a.tahun_pib = $2 "+
          "and b.kd_pel = $1 "+
          "group by komoditi,urpel order by total_dok_pib desc limit 10 ", [kdpel, tahun, awal, akhir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              kdpel: result[i].urpel,
              kode: result[i].komoditi,
              total: result[i].total_dok_pib
            })
            console.log(result);
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
          "SELECT a.nama_importir, b.ur_komoditi, coalesce(sum(a.cif_rupiah),0) total "+
          "FROM nswdbpb.dm_pelmasuk_imp_kom a, nswdbdwh.dim_komoditi b "+
          "WHERE a.bulan_pib >= $3 and a.bulan_pib <= $4 and a.tahun_pib = $2 "+
          "and a.nama_importir = $1 "+
          "GROUP BY a.nama_importir, b.ur_komoditi ORDER BY total desc limit 10; ", [kdimportir, tahun, awal, akhir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              nama_importir: result[i].nama_importir,
              komoditi: result[i].ur_komoditi,
              total_detimportir: result[i].total              
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
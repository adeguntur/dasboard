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

      await db.any("select a.kd_negara_asal, sum(a.cif_rupiah) total "+
      "from nswdbpb.dm_negasal_imp a "+ 
      "where a.bulan_pib >= $2 "+
      "and a.bulan_pib <= $3 "+
      "and a.tahun_pib = $1 "+
      "group by a.kd_negara_asal "+
      "order by total desc limit 5;", [tahun, awal, ahir])
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
      await db.any("select a.kd_pelabuhan_masuk pelabuhan_masuk, sum(jml_dok_pib) total "+
      "from nswdbpb.dm_pelmasuk_importir a "+
      "where a.bulan_pib >= $2 and "+
      "a.bulan_pib <= $3 and "+
      "a.tahun_pib = $1 "+
      "group by pelabuhan_masuk "+ 
      "order by total desc limit 5;", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            pelabuhanKode.push(result[i].pelabuhan_masuk);
            pelabuhanJmlpemasukan.push(result[i].total)
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //importir
      await db.any("select b.npwp npwpimp, max (b.nama_importir) nama_imp, a.total totalimp from "+ 
        "(select a.npwp, sum(a.cif_rupiah) total "+  
        "from nswdbpb.dm_pelmasuk_importir a "+ 
        "where a.bulan_pib >= $2 and "+
        "a.bulan_pib <= $3 "+
        "and a.tahun_pib = $1 "+ 
        "group by a.npwp "+
        "order by total desc "+
        "limit 10) as a, "+
        "nswdbpb.dm_pelmasuk_importir b "+ 
        "where a.npwp = b.npwp "+
        "group by npwpimp, totalimp "+
        "order by totalimp desc limit 10;", [tahun, awal, ahir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            importirTotal.push(result[i].totalimp);
            importirNama.push(result[i].nama_imp);
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
            "WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 GROUP BY bulan_pib  ORDER BY bulan_pib asc;", [tahun, awal, ahir]
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
          "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 "+
          "AND kd_notif_postborder = '01' group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir])
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
          "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 "+
          "AND kd_notif_postborder = '11' "+
          "group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir])
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
        "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 "+
        "AND kd_notif_postborder = '12' " +
        "group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir])
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
       "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 "+
       "AND kd_notif_postborder = '13' " +
       "group by bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir])
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

    async postchartlkpApi(req, res) {
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

      await db.any("select a.kd_negara_asal ur_negara, case when c.ur_komoditi is null then 'N/A' else trim(both '[]' " +
      "from c.ur_komoditi) end as komoditi, sum(a.cif_rupiah) tcif_rupiah from ( select kd_ga_border kd_ga, "+
      "kd_komoditi_border kd_komoditi, kd_negara_asal, cif_rupiah, bulan_pib, tahun_pib from nswdbpb.dm_negasal_imp_kom a "+
      "union select kd_ga_postborder kd_ga, kd_komoditi_postborder kd_komoditi, kd_negara_asal, cif_rupiah, bulan_pib, "+
      "tahun_pib from nswdbpb.dm_negasal_imp_kom ) a inner join nswdb1.tblnegara b on a.kd_negara_asal = b.kdedi "+
      "left join nswdbdwh.dim_komoditi c on a.kd_komoditi = c.kd_komoditi inner join nswdb1.tblga d on a.kd_ga = d.id_ga "+
      "where a.bulan_pib >= $2 and "+
      "a.bulan_pib <= $3 "+
      "and a.tahun_pib = $1 "+
      "and a.kd_ga = $4 "+
      "and a.kd_komoditi = $5 "+
      "group by ur_negara, komoditi order by tcif_rupiah desc limit 5 ", [tahun, awal, ahir, kl, komoditi])
        .then((result) => {0
          for (let i = 0; i < result.length; i++) {
            negaraKode.push(result[i].ur_negara);
            negaraTotal.push(result[i].tcif_rupiah);
          }

        })
        .catch((err) => {
          console.log(err);
        });

      //pelabuhan 
      await db.any("select b.kd_pel ur_pelabuhan, sum(a.jml_dok_pib) total from ( "+
          "select kd_ga_border kd_ga, kd_komoditi_border kd_komoditi, kd_pelabuhan_masuk, "+
          "jml_dok_pib, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom "+
          "union select kd_ga_postborder kd_ga,kd_komoditi_postborder kd_komoditi, "+
          "kd_pelabuhan_masuk, jml_dok_pib, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom) a "+
          "inner join nswdbdwh.dim_pelabuhan b on a.kd_pelabuhan_masuk = b.kd_pel "+
          "left join nswdbdwh.dim_komoditi c on a.kd_komoditi = c.kd_komoditi "+
          "inner join nswdb1.tblga d on a.kd_ga = d.id_ga "+
          "where a.bulan_pib >= $2 and "+
          "a.bulan_pib <= $3 and "+
          "a.tahun_pib = $1 and "+
          "a.kd_ga = $4 and "+
          "a.kd_komoditi = $5 "+
          "group by b.kd_pel order by total desc limit 5;", [tahun, awal, ahir, kl, komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            pelabuhanKode.push(result[i].ur_pelabuhan);
            pelabuhanJmlpemasukan.push(result[i].total)
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //importir
      await db.any("select b.npwp npwpimp, max(b.nama_importir) nama_imp, a.total totalimp from "+
        "(select npwp, sum(cif_rupiah) total "+
        "from nswdbpb.dm_pelmasuk_imp_kom "+
        "where bulan_pib >= $2 "+
        "and bulan_pib <= $3 "+
        "and tahun_pib = $1 "+ 
        "and(kd_ga_border = $4 or kd_ga_postborder = $4) "+
        "and(kd_komoditi_border = $5 or kd_ga_postborder = $5) "+
        "group by npwp, kd_ga_border, kd_ga_postborder, kd_komoditi_border, kd_komoditi_postborder "+ 
        "order by total desc "+
        "limit 10) as a, "+
        "nswdbpb.dm_pelmasuk_importir b "+
        "where a.npwp = b.npwp "+
        "group by npwpimp, totalimp "+ 
        "order by totalimp desc limit 10;", [tahun, awal, ahir, kl, komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            importirNama.push(result[i].nama_imp);
            importirTotal.push(result[i].totalimp);
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
          "WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 and kd_ga = $4 and kd_komoditi = $5 GROUP BY bulan_pib;", [tahun, awal, ahir, kl, komoditi]
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
            "WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 and kd_ga = $4 and kd_komoditi = $5 GROUP BY bulan_pib  ORDER BY bulan_pib asc", [tahun, awal, ahir, kl, komoditi]
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
          "WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 and kd_ga = $4 and kd_komoditi = $5 GROUP BY bulan_pib ORDER BY bulan_pib asc;", [tahun, awal, ahir, kl, komoditi])
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
          "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 AND kd_ga = $4 AND kd_komoditi = $5 "+
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
        "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 AND kd_ga = $4 AND kd_komoditi = $5 " +
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
       "nswdbpb.dm_real_jns_postborder WHERE bulan_pib >= $2 and bulan_pib <= $3 and tahun_pib = $1 AND kd_ga = $4 AND kd_komoditi = $5 " +
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
        "select b.uredi ur_negara, case when c.ur_komoditi is null then 'N/A' else trim(both '[]' from c.ur_komoditi) end as komoditi, sum(a.cif_rupiah) tcif_rupiah " +
        "from( " +
        " select kd_komoditi_border kd_komoditi, kd_negara_asal, cif_rupiah, bulan_pib, tahun_pib " +
        " from nswdbpb.dm_negasal_imp_kom a union select kd_komoditi_postborder kd_komoditi, kd_negara_asal, cif_rupiah, bulan_pib, tahun_pib " +
        "from nswdbpb.dm_negasal_imp_kom ) a " +
        "inner join nswdb1.tblnegara b on a.kd_negara_asal = b.kdedi " +
        "left join nswdbdwh.dim_komoditi c on a.kd_komoditi = c.kd_komoditi " +
        "where a.bulan_pib >= $3 " +
        "and a.bulan_pib <= $4 " +
        "and a.tahun_pib = $2 " +
        "and b.kdedi = $1" +
        "group by c.ur_komoditi, b.uredi " +
        "order by tcif_rupiah desc limit 10 ", [kdneg, tahun, awal, akhir])
         .then((result) => {
              for (let i = 0; i < result.length; i++) {
                finalResult.push({
                  negara: result[i].ur_negara,
                  kode: result[i].komoditi,
                  total: result[i].tcif_rupiah
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

    async detailnegaralkpApi(req, res) {
      var finalResult = [];

      const {
        kdneg,
        tahun,
        awal,
        akhir,
        kl,
        komoditi
      } = req.body;

      await db.any(
          "select b.uredi ur_negara, case when c.ur_komoditi is null then 'N/A' else trim(both '[]' from c.ur_komoditi) end as komoditi,  "+
	        "sum(a.cif_rupiah) tcif_rupiah "+ 
          "from( "+
	          "select kd_ga_border kd_ga, kd_komoditi_border kd_komoditi, kd_negara_asal, cif_rupiah, bulan_pib, tahun_pib "+
	          "from nswdbpb.dm_negasal_imp_kom a union "+
	          "select kd_ga_postborder kd_ga, kd_komoditi_postborder kd_komoditi, kd_negara_asal, cif_rupiah, bulan_pib, tahun_pib "+
	          "from nswdbpb.dm_negasal_imp_kom "+
          ") a "+ 
          "inner join nswdb1.tblnegara b on a.kd_negara_asal = b.kdedi "+
          "left join nswdbdwh.dim_komoditi c on a.kd_komoditi = c.kd_komoditi "+
          "inner join nswdb1.tblga d on a.kd_ga = d.id_ga "+
          "where a.bulan_pib >= $3 "+
          "and a.bulan_pib <= $4 "+
          "and a.tahun_pib = $2 "+
          "and a.kd_ga  = $5 "+
          "and a.kd_komoditi = $6 "+
          "and b.kdedi = $1 "+
          "group by b.uredi, komoditi "+
          "order by tcif_rupiah desc limit 10", [kdneg, tahun, awal, akhir, kl, komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            finalResult.push({
              negara: result[i].ur_negara,
              kode: result[i].komoditi,
              total: result[i].tcif_rupiah
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

    async detailpelpenlkpApi(req, res) {
      var finalResult = [];
      var kode = [];

      const {
        kdpel,
        tahun,
        awal,
        akhir,
        kl,
        komoditi
      } = req.body;

      await db.any(
          "select b.ur_pel ur_pelabuhan, "+
          "case when c.komoditi is null then 'N/A' " +
          "else trim(both '[]' " +
          "from c.komoditi) end as komoditi, " +
          "sum(a.jml_dok_pib) tjml_dok_pib " +
          "from( " +
          "select kd_ga_border kd_ga, kd_komoditi_border kd_komoditi, " +
          "kd_pelabuhan_masuk, jml_dok_pib, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom " +
          "union select kd_ga_postborder kd_ga, kd_komoditi_postborder kd_komoditi, " +
          "kd_pelabuhan_masuk, jml_dok_pib, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom " +
          ") a " +
          "inner join nswdbdwh.dim_pelabuhan b on a.kd_pelabuhan_masuk = b.kd_pel " +
          "left join nswdb1.tblrefkomoditi c on a.kd_komoditi = c.kd_komoditi " +
          "inner join nswdb1.tblga d on a.kd_ga = d.id_ga " +
          "where a.bulan_pib >= $3 " +
          "and a.bulan_pib <= $4 " +
          "and a.tahun_pib = $2 " +
          "and b.kd_pel = $1 " +
          "and a.kd_ga = $5 "+
          "and a.kd_komoditi = $6 " +
          "group by c.komoditi, b.ur_pel " +
          "order by tjml_dok_pib desc limit 10 ;", [kdpel, tahun, awal, akhir, kl, komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              kdpel: result[i].ur_pelabuhan,
              kode: result[i].komoditi,
              total: result[i].tjml_dok_pib
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
          "select b.ur_pel ur_pelabuhan, "+
          "case when c.komoditi is null then 'N/A' "+
          "else trim(both '[]' "+
              "from c.komoditi) end as komoditi, "+
              "sum(a.jml_dok_pib) tjml_dok_pib "+
          "from( "+
            "select kd_ga_border kd_ga, kd_komoditi_border kd_komoditi, "+
            "kd_pelabuhan_masuk, jml_dok_pib, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom "+
            "union select kd_ga_postborder kd_ga, kd_komoditi_postborder kd_komoditi, "+
            "kd_pelabuhan_masuk, jml_dok_pib, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom "+
          ") a "+
          "inner join nswdbdwh.dim_pelabuhan b on a.kd_pelabuhan_masuk = b.kd_pel "+
          "left join nswdb1.tblrefkomoditi c on a.kd_komoditi = c.kd_komoditi "+
          "inner join nswdb1.tblga d on a.kd_ga = d.id_ga " +
          "where a.bulan_pib >= $3 " +
          "and a.bulan_pib <= $4 " +
          "and a.tahun_pib = $2 " +
          "and b.kd_pel = $1 " +
          "group by c.komoditi, b.ur_pel " +
          "order by tjml_dok_pib desc limit 10 ;", [kdpel, tahun, awal, akhir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              kdpel: result[i].ur_pelabuhan,
              kode: result[i].komoditi,
              total: result[i].tjml_dok_pib
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
        "select a.nama_importir nama_imp, "+
        "case when c.komoditi is null then 'N/A' "+ 
        "else trim(both '[]' "+
        "from c.komoditi) end as komoditi, "+
        "sum(a.cif_rupiah) cif_rp "+
        "from( "+
          "select kd_ga_border kd_ga, kd_komoditi_border kd_komoditi, "+
          "nama_importir, cif_rupiah, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom "+
          "union select kd_ga_postborder kd_ga, kd_komoditi_postborder kd_komoditi, "+
          "nama_importir, cif_rupiah, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom "+
        ") a "+
        "left join nswdb1.tblrefkomoditi c on a.kd_komoditi = c.kd_komoditi "+ 
        "where a.bulan_pib >= $3 "+
        "and a.bulan_pib <= $4 "+
        "and a.tahun_pib = $2 "+
        "and a.nama_importir = $1 "+ 
        "group by c.komoditi, a.nama_importir "+ 
        "order by cif_rp desc limit 10 ;", [kdimportir, tahun, awal, akhir])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {

            finalResult.push({
              nama_importir: result[i].nama_imp,
              komoditi: result[i].komoditi,
              total_detimportir: result[i].cif_rp              
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

    async detailimportirlkpApi(req, res) {
      var finalResult = [];

      const {
        kdimportir,
        tahun,
        awal,
        akhir,
        kl,
        komoditi
      } = req.body;

      await db.any(
        "select a.nama_importir nama_imp, "+
        "case when c.komoditi is null then 'N/A' "+
        "else trim(both '[]' "+
            "from c.komoditi) end as komoditi, "+
            "sum(a.cif_rupiah) cif_rp "+
        "from( "+
          "select kd_ga_border kd_ga, kd_komoditi_border kd_komoditi, "+
          "nama_importir, cif_rupiah, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom "+
          "union select kd_ga_postborder kd_ga, kd_komoditi_postborder kd_komoditi, "+
          "nama_importir, cif_rupiah, bulan_pib, tahun_pib from nswdbpb.dm_pelmasuk_imp_kom "+
        ") a "+
        "left join nswdb1.tblrefkomoditi c on a.kd_komoditi = c.kd_komoditi "+
        "where a.bulan_pib >= $3 "+
        "and a.bulan_pib <= $4 "+
        "and a.tahun_pib = $2 "+
        "and a.nama_importir = $1 "+
        "and a.kd_ga = $5 "+
        "and a.kd_komoditi = $6 "+
        "group by c.komoditi, a.nama_importir "+
        "order by cif_rp desc limit 10;", [kdimportir, tahun, awal, akhir,kl,komoditi])
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            finalResult.push({
              nama_importir: result[i].nama_imp,
              komoditi: result[i].komoditi,
              total_detimportir: result[i].cif_rp              
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

       await db.any("select distinct d.no_ijin, d.tgl_ijin, d.kd_oga kd_ga, d.kd_ijin, d.kd_komoditi, a.pibno no_pib, a.pibtg::date tgl_pib, a.car, "+
           "b.serial seri_barang, b.nohs, b.jmlsat jml_satuan, b.kdsat kd_satuan, a.impnpwp npwp, a.impnama nama_importir, a.impalmt "+
           "alamat_importir, a.kdkpbc kd_kantor, d.statusijin kd_notifikasi "+
           "from nswdb1.tblpibhdr a "+
           "inner join nswdb1.tblpibdtl b on a.cusdecid = b.cusdecid "+
           "inner join nswdb1.tblctl_postborder c on c.cusdecid = a.cusdecid "+
           "inner join nswdb1.tblrealisasi_postborder d on d.seq = c.seq and d.seri_brg = b.serial and b.nohs::text = d.hs_code::text "+
           "where date_part('month', a.pibtg) >= $2 and "+
           "date_part('month', a.pibtg) <= $3 "+
           "and date_part('year', a.pibtg) = $1 ;", [tahun, awal, akhir])
         .then((result) => {
           for (let i = 0; i < result.length; i++) {

             finalResult.push({
               nopib: result[i].no_ijin,
               tglpib: result[i].tgl_ijin,
               seribarang: result[i].seri_barang,
               jmlsatuan: result[i].jml_satuan,
               kodesatuan: result[i].kd_satuan,
               npwp: result[i].npwp,
               importir: result[i].nama_importir,
               kppbc: result[i].kd_kantor,
               notofokasi: result[i].kd_notifikasi,
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
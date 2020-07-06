var express = require('express');
var router = express.Router();
var index = require('../controllers/C_Index')

router.get('/', index.index)

//api chart
router.post('/api/grafik', index.postchartApi)
router.post('/api/grafiklkp', index.postchartlkpApi)

//api detailnegara
router.post('/api/detneg', index.detailnegaraApi)
router.post('/api/detneglkp', index.detailnegaralkpApi)

//api detailpelabuhan
router.post('/api/detpel', index.detailpelpenApi)
router.post('/api/detpellkp', index.detailpelpenlkpApi)

//api detailpelabuhan
router.post('/api/detimportir', index.detailimportirApi)
router.post('/api/detimportirlkp', index.detailimportirlkpApi)

//api post pb
router.post('/api/postborder', index.butonpostborderApi)

module.exports = router

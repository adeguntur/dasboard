var express = require('express');
var router = express.Router();
var index = require('../controllers/C_Index')

router.get('/', index.index)

//api chart
router.post('/api/grafik', index.postchartApi)
router.post('/api/grafiklkp', index.postchartlkpApi)

//api detailnegara
router.post('/api/detneg', index.detailnegaraApi)

//api detailpelabuhan
router.post('/api/detpel', index.detailpelpenApi)

//api detailpelabuhan
router.post('/api/detimportir', index.detailimportirApi)

//api post pb
router.post('/api/postborder', index.butonpostborderApi)

module.exports = router

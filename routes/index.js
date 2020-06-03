var express = require('express');
var router = express.Router();
var index = require('../controllers/C_Index')

router.get('/', index.index)

//api chart
router.get('/api/grafik', index.chartApi)

//api detailnegara
router.post('/api/detneg', index.detailnegaraApi)

//api detailpelabuhan
router.post('/api/detpel', index.detailpelpenApi)

//api detailpelabuhan
router.post('/api/detimportir', index.detailimportirApi)

module.exports = router

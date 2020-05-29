var express = require('express');
var router = express.Router();
var index = require('../controllers/C_Index')

router.get('/', index.index)

//api chart
router.get('/api/grafik', index.chartApi)

module.exports = router

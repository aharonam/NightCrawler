/**
 * Created by Aharon.Amram on 5/23/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/start', function(req, res, next) {
    var crawlerService = require('../services/crawlerService');
    crawlerService.start('http://www.yad2.co.il/Nadlan/sales.php');
    res.send('started crawling');
});

module.exports = router;

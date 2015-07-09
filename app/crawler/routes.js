var express = require('express');
var router = express.Router();
var JediBot = require('./crawler');


router.get('/', function(req, res, next) {
  res.json({message:'Star Wars Scraping API'});
});

router.get('/movies', function(req, res, next) {
  JediBot.getMovieList()
    .then(function(data){
      res.json(data);
    })
    .catch(next);
});

router.get('/movies/:name', function(req, res, next) {
  JediBot.getMovieData(req.params.name)
    .then(function (data) {
      res.json(data);
    })
    .catch(next);
});

module.exports = router;
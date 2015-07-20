var express = require('express');
var Promise = require('bluebird');
var MoviesService = Promise.promisifyAll(require('./services/MoviesService'));
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({message:'Star Wars Scraping API'});
});

router.get('/movies', function(req, res, next) {
  MoviesService.getListAsync()
    .then(function(data){
      res.json(data);
    })
    .catch(next);
});

router.get('/movies/:name', function(req, res, next) {
  var movieName = req.params.name;
  MoviesService.getBySlugAsync(movieName)
    .then(function(data){
      res.json(data)
    })
    .catch(next);
});

module.exports = router;
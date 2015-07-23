var JediBot = require('../crawler/crawler');
var Promise = require('bluebird');
var MoviesCollection = Promise.promisifyAll(require('../models/Movie'));

var MoviesService = {
  getBySlug: getBySlug,
  getList: getList
}

function getList(callback) {
  JediBot.getMovieList()
    .then(function(data){
      callback(null, data);
    })
    .catch(callback);
}

function getBySlug(slug, callback){
  MoviesCollection
  .findOneAsync({ slug: slug })
  .then(function(data){
    if(data) {
      return callback(null, data)
    }

    JediBot.getMovieData(slug)
      .then(function (data) {
        callback(null, data);
        return MoviesCollection.insertAsync(data);
      })
      .then(console.log)
      .catch(callback);
  })
  .catch(callback);
}

module.exports = MoviesService;
var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var crawler = {
  getMovieList : getMovieList,
  getMovieData : getMovieData
};

var BASE_URL = 'http://www.starwars.com/films/';
var INTERNAL_URL = "http://localhost:3000/movies/";

function MovieModel (name, description, coverArt, slug, imdb, characters) {
  this.name = name;
  this.description = description;
  this.coverArt = coverArt;
  this.slug = slug;
  this.imdb = imdb;
  this.characters = characters;
}

function MovieCollection () {
  this.movies = [];
}

function makeHyperLink (uri) {
  return uri.replace( BASE_URL,  INTERNAL_URL);
}

function parseCoverArtUrl(html) {
  var regex = /"ratio_1x1":"([^\?]+)/;
  return regex.exec(html)[1];
}

function getIMDBUrl(html) {
  var regex = /(http:\/\/www.imdb.com\/title\/[^\/]+\/)/
  return regex.exec(html)[1];
}

function getMovieList () {
  return request(BASE_URL)
    .then(function(result){
      var html = result[1];
      var $ = cheerio.load(html);
      var data = new MovieCollection();

      $('.module.display.bound').each(function() {
        data.movies.push ({
          name : $(this).find('h3').text().trim(),
          short_desc: $(this).find('.desc').text().trim(),
          _links: {
            href: makeHyperLink( $(this).find('h3 a').attr('href') )
          }
        });
      });
      return data;
    })
}

function getMovieData (slug) {
  return request(BASE_URL + slug)
    .then(function (result) {
      var html = result[1];
      var $ = cheerio.load(html);
      var JsonScript = $('body #main script').toString();

      var name, description, coverArt, imdb, characters = [];

      name = $('.poster-container img').attr('alt');
      coverArt = parseCoverArtUrl(JsonScript);
      description = $('.description-container .desc').text().trim();
      imdb = getIMDBUrl(JsonScript);

      $('.ref-1-2 .image-wrapper a').each(function(){
        characters.push({
          avatar: $(this).find('img').attr('src'),
          name: $(this).find('img').attr('alt'),
          link: $(this).attr('href')
        });
      });
      return new MovieModel(name, description, coverArt, slug, imdb, characters);
    }).
    catch(function(err){
      console.log(err);
    })
}

module.exports = crawler;
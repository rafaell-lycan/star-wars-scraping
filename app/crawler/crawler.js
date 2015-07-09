var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var crawler = {
  getMovieList : getMovieList,
  getMovieData : getMovieData
};

var BASE_URL = 'http://www.starwars.com/films/';
var INTERNAL_URL = "http://localhost:3000/movies/";

function MovieModel (name, description, coverArt, imdb, characters) {
  this.name = name;
  this.description = description;
  this.coverArt = coverArt;
  this.imdb = imdb;
  this.characters = characters;
}

function MovieCollection () {
  this.movies = [];
}

function makeHyperLink (uri) {
  return uri.replace( BASE_URL,  INTERNAL_URL);
}

// function parseCoverArtUrl(url) {
//   console.log(url);
//   return url.replace(/\n/g, '').replace(/(.*)","publish_date":"May 23, 2014","default_thumb":"(.*)\?(.*)/m, '$2');
// }

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
  console.log(BASE_URL + slug);
  return request(BASE_URL + slug)
    .then(function (result) {
      var html = result[1];
      var $ = cheerio.load(html);
      var name, description, coverArt, imdb, characters = [];

      name = $('.poster-container img').attr('alt');
      // cover_art = parseCoverArtUrl($('body #main script').toString());
      description = $('.description-container .desc').text().trim();
      imdb = $('.links-container a').get(0).href;

      $('.ref-1-2 .image-wrapper a').each(function(){
        characters.push({
          avatar: $(this).find('img').attr('src'),
          name: $(this).find('img').attr('alt'),
          link: $(this).attr('href')
        });
      });
      return new MovieModel(name, description, coverArt, imdb, characters);
    }).
    catch(function(err){
      console.log(err);
    })
}

module.exports = crawler;
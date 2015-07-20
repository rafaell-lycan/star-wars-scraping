var mongo = require('mongojs');
var db = mongo('star-wars-movies');

module.exports = db.collection('movies');
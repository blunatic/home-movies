// Get all packages needed
var express = require('express');
var app = express();
var request = require('request');

// tell node where to look for site resources
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('pages/index');
});

app.get('/search', function(req, res){
	var val = encodeURIComponent(req.query.search); 
	var url = "https://archive.org/advancedsearch.php?q=" + val +
	"+AND+mediatype:movies+AND+collection:(home_movies+OR+prelingerhomemovies)" + 
	"&fl[]=identifier,title,mediatype,collection,downloads,description,date,avg_rating&rows=15&output=json";
	console.log(url);

	request(url, function(err, resp, body){
		body = JSON.parse(body);

		// logic used to compare search results with the input from user
		 if (err){
		 	console.log("error");
		 } else if(body.response.numFound == 0){
		 	console.log('"teststsetslajflkdjf');
		 	res.send('undefined');
		 } else {
		 	// pass back the results to client side
		 	res.send(body.response);
		 }
	});
});

// start server
app.listen(8080);
console.log("Server started!");


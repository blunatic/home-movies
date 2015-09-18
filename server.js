// Get all packages needed
var express = require('express');
var app = express();
var request = require('request');

// handle redis for deployment (heroku) vs. dev
if (process.env.REDISTOGO_URL) {
    // TODO: redistogo connection
} else {
    var redis = require("redis").createClient();
}

// tell node where to look for site resources
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/search', function(req, res) {
    var val = encodeURIComponent(req.query.search);
    var url = "https://archive.org/advancedsearch.php?q=" + val +
        "+AND+mediatype:movies+AND+collection:(home_movies+OR+prelingerhomemovies)" +
        "&fl[]=identifier,title,mediatype,collection,downloads,description,date,avg_rating&rows=15&output=json";

    // check if search query already exists
    redis.exists(val, function(err, reply) {
        if (reply === 1) {
            // return cached query results
            console.log('exists in redis');
            redis.get(val, function(error, result) {
                if (error !== null) {
                    // handle error
                } else {
                	// send result as JSON
                	result = JSON.parse(result);
                    res.send(result.response);
                }
            });
        } else {
            console.log('doesn\'t exist in redis');
            request(url, function(err, resp, body) {
                body = JSON.parse(body);

                // logic used to compare search results with the input from user
                if (err) {
                    console.log("error");
                } else if (body.response.numFound == 0) {
                    // no results found
                    res.send('undefined');
                } else {
                    // set value and key in redis (set JSON to string)
                    redis.set(val, JSON.stringify(body));
                    console.log('added ' + val + ' to redis!');
                    // pass back the results to client side
                    res.send(body.response);
                }
            });
        }
    });

});

// start server
app.listen(8080);
console.log("Server started!");

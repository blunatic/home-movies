// Get all packages needed
var express = require('express');
var router = express.Router();
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var fma = require('free-music-archive');
var apicache = require('apicache').options({ debug: true }).middleware;
var port = process.env.PORT || 8080;

// tell node where to look for site resources
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// set the view engine to ejs
app.set('view engine', 'ejs');

// log all requests to console
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});


router.get('/', function(req, res) {
    res.render('pages/index');
});

router.get('/search/:movie', apicache('5 minutes'), function(req, res) {
    var val = req.params.movie;
    var url = "https://archive.org/advancedsearch.php?q=" + val +
        "+AND+mediatype:movies+AND+collection:(home_movies+OR+prelingerhomemovies)" +
        "&fl[]=identifier,title,mediatype,collection,downloads,description,date,avg_rating,year&rows=15&output=json";

    // make request and return response to client side
    request(url, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            body = JSON.parse(body);
            res.send(body.response);
        } else{
            res.send("error is" + resp.statusCode);
        }
    });
});

router.get('/music', function(req, res) {
    fma.tracks({
        genre_handle: 'Ambient',
        limit: 100
    }, function(err, results) {
        if (err) {
            console.error(err);
        }
        console.log(results.total);
        res.send(results);
    });
});

router.get('/song/:track_id', function(req, res) {
    var val = req.params.track_id;
    console.log("track ID " + val);
    var url = 'http://freemusicarchive.org/services/track/single/' + val + '.json?api_key=BAB8WGEA2X7LQNJ6';
    request(url, function(err, resp, body) {
        if(!err && resp.statusCode == 200){
            body = JSON.parse(body);
            res.send(body);
        } else{
            res.send("error is" + resp.statusCode);
        }
    });
});

// 404 handling
router.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use('/', router);

// start server
app.listen(port);
console.log("Server started!");
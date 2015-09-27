// main app controller
angular.module('homeMovies').controller('MainController', function($scope, $http, $sce, mainService, songService) {
    var pendingSearch;
    var currentMovie;
    var currentSong;
    var randomSong = 0;
    $scope.currentMovies = null;
    $scope.currentSongs = null;

    if ($scope.search !== undefined) {
        fetch();
    }

    // wait for user to type something, then search after user has stopped typing
    $scope.change = function() {
        if (pendingSearch) {
            clearTimeout(pendingSearch);
        }
        pendingSearch = setTimeout(fetch, 800);
    };

    // get next movie on top knob/button click
    $scope.nextMovie = function() {
        console.log("current movie is : " + currentMovie);
        currentMovie++;
        updateMovie();
        console.log("current movie is now: " + currentMovie);
    };

    // allow user to select all text inside input
    $scope.select = function() {
        this.setSelectionRange(0, this.value.length);
    };

    // fetch movie from server (which grabs from Internet Archive)
    function fetch() {
        $scope.showTv = true;
        $scope.loading = true;
        $scope.noResults = false;
        mainService.getMovies($scope.search).then(function(response) {
            console.log(response);
            if (response.numFound !== 0) {
                $scope.currentMovies = response;
                currentMovie = 0;
                updateMovie();
            } else {
                // no results found, display this to user
                $scope.noResults = true;
                $scope.loading = false;
            }
        });
    }

    // display movie results and/or update movie and results if button is clicked
    function updateMovie() {
        // display loading spinner
        $scope.loading = false;

        // set video url source
        $scope.movie = "https://archive.org/embed/" + $scope.currentMovies.docs[currentMovie].identifier;
        $scope.movieUrl = $sce.trustAsResourceUrl($scope.movie);

        // set video title, clearing out any brackets in title
        var temp = $scope.currentMovies.docs[currentMovie].title;
        var title = temp.replace(/[\[\]']+/g, '');
        $scope.videoTitle = " " + title + " ";

        // set video date
        var date = new Date($scope.currentMovies.docs[currentMovie].date);
        var year = date.getUTCFullYear();
        if (isNaN(year)) {
            year = 'Year not available';
        }
        // set video details (note: Internet Archive uses "downloads" field for number of views)
        $scope.videoDetails = year + " | Result: " + (currentMovie + 1) + " of " +
            +$scope.currentMovies.numFound + " | Views: " + $scope.currentMovies.docs[currentMovie].downloads;
        $scope.videoCollection = $scope.currentMovies.docs[currentMovie].collection[0] + " Collection";
        $scope.videoDescription = $scope.currentMovies.docs[currentMovie].description;
    }

    // get next movie on top knob/button click
    $scope.getSong = function() {
    	// get random song from set of current songs each time
    	randomSong = Math.floor(Math.random() * 100) + 1;
    	console.log("currentSongs is currently equal to: " + $scope.currentSongs);
        if (!$scope.currentSongs) {
        	console.log("current songs is undefined");
            songService.getSongs().then(function(response) {
                if (response.total !== 0) {
                    $scope.currentSongs = response;
                    updateSong();
                }
            });
        } else{
        	updateSong();
        }
    };

    function updateSong() {
    	console.log("inside updateSong : " + $scope.currentSongs);
    	var songDetails = $scope.currentSongs.dataset[randomSong];
    	var trackID = $scope.currentSongs.dataset[randomSong].track_id;

        songService.getRandomSong(trackID).then(function(response) {
            var musicPlayer = document.getElementById('audio');
            $('#fma-song').attr('src', response.track_listen_url);
            musicPlayer.load();
            musicPlayer.play();
        });
    }



});
// main app controller
angular.module('homeMovies').controller('MainController', function($scope, $http, $sce, mainService, songService) {
    var pendingSearch;
    var currentMovie;
    var currentSong;
    var randomSong = 0;
    $scope.currentMovies = null;
    $scope.currentSongs = null;

    // wait for user to type something, then search after user has stopped typing
    $scope.change = function() {
        if (pendingSearch) {
            clearTimeout(pendingSearch);
        }
        if($scope.search){
        pendingSearch = setTimeout(fetch, 800);
        }
    };

    // get next movie on top knob/button click
    $scope.nextMovie = function() {
        if($scope.search){
        currentMovie++;
        updateMovie();
        }   
    };

    // allow user to select all text inside input
    $scope.select = function() {
        this.setSelectionRange(0, this.value.length);
    };

    // get next song on top knob/button click
    $scope.getSong = function() {
        // get random song from set of current songs each time
        randomSong = Math.floor(Math.random() * 100) + 1;
        if (!$scope.currentSongs) {
            songService.getMusic().then(function(response) {
                $scope.currentSongs = response;
                updateSong();
            });
        } else {
            updateSong();
        }
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
        // cycle back through movies once end of results is found
        if((currentMovie) == $scope.currentMovies.numFound){
            currentMovie = 0;
        }
        // display loading spinner
        $scope.loading = false;

        // set video url source
        $scope.movie = "https://archive.org/embed/" + $scope.currentMovies.docs[currentMovie].identifier;
        $scope.movieUrl = $sce.trustAsResourceUrl($scope.movie);

        // set video title, clearing out any brackets in title
        var temp = $scope.currentMovies.docs[currentMovie].title;
        var title = temp.replace(/[\[\]']+/g, '');
        $scope.videoTitle = "  " + title + "  ";

        // set video date
        var date = new Date($scope.currentMovies.docs[currentMovie].date);
        var year = date.getUTCFullYear();
        if (isNaN(year)) {
            year = 'Year not available';
        }
        // set video details (note: Internet Archive uses "downloads" field for number of views)
        $scope.videoDetails = year + " | Result: " + (currentMovie + 1) + " of " +
            $scope.currentMovies.numFound + " | Views: " + $scope.currentMovies.docs[currentMovie].downloads;
        var collection = $scope.currentMovies.docs[currentMovie].collection[0];
        collection = collection.charAt(0).toUpperCase() + collection.substring(1);
        collection = collection.replace(/_/g, ' ');
        $scope.videoCollection = collection + " Collection";
        $scope.videoDescription = $scope.currentMovies.docs[currentMovie].description;
    }

    function updateSong() {
        console.log($scope.currentSongs);
        var shortUrl = $scope.currentSongs.results[randomSong].shorturl;
        var trackUrl = $scope.currentSongs.results[randomSong].audio;
        $scope.songName = $scope.currentSongs.results[randomSong].name;
        $scope.artistName = $scope.currentSongs.results[randomSong].artist_name;
        $scope.songLink = shortUrl;
        var musicPlayer = document.getElementById('audio');
        $('#fma-song').attr('src', trackUrl);
        musicPlayer.load();
        musicPlayer.volume = 0.5;
        musicPlayer.play();
    }



});
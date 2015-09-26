var app = angular.module('homeMovies', []);

// factory for consuming web services and returnin data to controller
app.factory('mainService', function($http) {
    return {
        getMovies: function(query) {
            // return promise to data
            return $http.get('/search/' + query).then(function(response) {
                // resolve the promise as the data
                console.log("getMovies");
                return response.data;
            });
        }
    };
});

// main app controller
app.controller('MovieController', function($scope, $http, $sce, mainService) {
    var pendingSearch;
    var currentMovie;
    $scope.currentResponse = [];

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
        update();
        console.log("current movie is now: " + currentMovie);
    };

    // allow user to select all text inside input
    $scope.select = function() {
        this.setSelectionRange(0, this.value.length);
    };

    function fetch() {
        $scope.loading = true;
        $scope.noResults = false;
        mainService.getMovies($scope.search).then(function(response) {
            console.log(response);
            if (response.numFound !== 0) {
                $scope.currentResponse = response;
                currentMovie = 0;
                update();
            } else {
                // no results found, display this to user
                $scope.noResults = true;
                $scope.loading = false;
            }
        });
    }

    // display results and/or update results if button is clicked
    function update() {
        // display loading spinner
        $scope.loading = false;

        // set video url source
        $scope.movie = "https://archive.org/embed/" + $scope.currentResponse.docs[currentMovie].identifier;
        $scope.movieUrl = $sce.trustAsResourceUrl($scope.movie);

        // set video title, clearing out any brackets in title
        var temp = $scope.currentResponse.docs[currentMovie].title;
        var title = temp.replace(/[\[\]']+/g, '');
        $scope.videoTitle = " " + title + " ";

        // set video date
        var date = new Date($scope.currentResponse.docs[currentMovie].date);
        var year = date.getUTCFullYear();
        if (isNaN(year)) {
            year = 'Year not available';
        }
        // set video details (note: Internet Archive uses "downloads" field for number of views)
        $scope.videoDetails = year + " | Result: " + (currentMovie + 1) + " of " +
            +$scope.currentResponse.numFound + " | Views: " + $scope.currentResponse.docs[currentMovie].downloads;
        $scope.videoCollection = $scope.currentResponse.docs[currentMovie].collection[0] + " Collection";
        $scope.videoDescription = $scope.currentResponse.docs[currentMovie].description;
    }


});
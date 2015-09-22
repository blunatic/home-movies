$(document).ready(function() {

    // input validation
    $(document).ajaxStart(function() {
        $("#loading").removeClass('hidden');
        $('#searchIcon').hide();
        $("#noResults").addClass('hidden');
    }).ajaxStop(function() {
        $("#loading").addClass('hidden');
        $('#searchIcon').show();
    });

    $('#videoTitle').hide();

    var result = null;
    var currentVideo = 0;
    var angle1 = 0;
    var angle2 = 0;
    var audio = new Audio('../audio/knob.mp3');
    var audio2 = new Audio('../audio/knob2.mp3');

    // onclick handler
    $('#searchIcon').click(function() {
        if ($('#searchBox').val() === '') {
            alert('Search cannot be blank!');
        } else {
            currentVideo = 0;
            $('.tvOff').css('display: none');
            $('#videoTitle').show();

            var parameters = {
                search: $('#searchBox').val()
            };

            $.get('/search', parameters, function(data) {
                if (data === 'undefined') {
                    $('#noResults').removeClass('hidden');
                } else {
                    console.log(data);
                    result = data;
                    updateVideo(currentVideo);
                }
            });
        }
    });

    // on "enter" handler
    $('#searchBox').keypress(function(e) {
        if (e.which == 13) {
            $('#searchIcon').click();
        }
    });

    $('#hiddenButton1').click(function() {
        angle1 += 45;
        var $upperKnob = $('#UpperKnob');
        // GSAP library to rotate knob
        TweenMax.to($upperKnob, '.25', {
            rotation: angle1,
            transformOrigin: "50% 50%"
        });
        audio.play();

        // play channelChange animation each time click is registered
        var channelChange = $('#videoFrame').addClass('active');
        setTimeout(function() {
            channelChange.removeClass('active');
        }, 1000);

        currentVideo++;
        updateVideo(currentVideo);
    });

    $("#hiddenButton2").on('click', function(e) {
        angle2 += 45;
        var $lowerKnob = $('#LowerKnob');
        // GSAP library to rotate knob
        TweenMax.to($lowerKnob, '.25', {
            rotation: angle2,
            transformOrigin: "50% 50%"
        });
        audio2.play();
    });

    function updateVideo(currentVideo) {
        // set video url
        var videoURL = "https://archive.org/embed/" + result.docs[currentVideo].identifier;
        $('#videoFrame').attr('src', videoURL);
        var temp = result.docs[currentVideo].title;
        // set title
        var title = temp.replace(/[\[\]']+/g,'');
        $('#videoTitle').html(" " + title + " ");
        // set date and year
        var date = new Date(result.docs[currentVideo].date);
        var year = date.getUTCFullYear();
        if (isNaN(year)) {
            year = 'Not Available';
        }
        // set video details
        $('#videoDetails').html(year + ' | Number of Downloads: ' + result.docs[currentVideo].downloads);
        $('#videoDescription').html(result.docs[currentVideo].description);
        $('#videoCollection').html(result.docs[currentVideo].collection[currentVideo] + " Collection");
    }

});
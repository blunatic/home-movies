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

    var result = null;
    var currentVideo = 0;
    var angle1 = 0;
    var angle2 = 0;
    var audio = new Audio('../audio/knob.mp3');
    // onclick handler
    $('#searchIcon').click(function() {
        if ($('#searchBox').val() === '') {
            alert('Search cannot be blank!');
        } else {
            currentVideo = 0;
            $('.tvOff').css('display: none');
            var parameters = {
                search: $('#searchBox').val()
            };

            $.get('/search', parameters, function(data) {
                if (data === 'undefined') {
                    $('#noResults').removeClass('hidden');
                } else {
                    result = data;
                    var videoURL = "https://archive.org/embed/" + data.docs[currentVideo].identifier;
                    $('#videoFrame').attr('src', videoURL);
                    $('#videoTitle').html(data.docs[0].title);
                    $('#videoDetails').html(data.docs[0].date + ' | Number of Downloads: ' + data.docs[0].downloads);
                    $('#videoDescription').html(data.docs[0].description);
                    $('#videoCollection').html(data.docs[currentVideo].collection[0] + " Collection");
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
        TweenMax.to($upperKnob, .25, {
            rotation: angle1,
            transformOrigin: "50% 50%"
        });
        audio.play();

        var channelChange = $('#videoFrame').addClass('active');        
        setTimeout(function() {
        channelChange.removeClass('active');
        }, 1000);

        currentVideo = currentVideo + 1;
        var videoURL = "https://archive.org/embed/" + result.docs[currentVideo].identifier;
        $('#videoFrame').attr('src', videoURL);
        $('#videoTitle').html(result.docs[currentVideo].title);
        $('#videoDetails').html(result.docs[currentVideo].date + ' | Number of Downloads: ' + result.docs[currentVideo].downloads);
        $('#videoDescription').html(result.docs[currentVideo].description);
    });

    $("#hiddenButton2").on('click', function(e) {
        angle2 += 45;
        var $lowerKnob = $('#LowerKnob');
        TweenMax.to($lowerKnob, .25, {
            rotation: angle2,
            transformOrigin: "50% 50%"
        });

    });

});

/*
JS for Animations and Audio
*/
$(document).ready(function() {
    var songResults = null;
    var angle1 = 0;
    var angle2 = 0;
    var audio = new Audio('../audio/knob.mp3');
    var audio2 = new Audio('../audio/knob2.mp3');
    var audio3 = new Audio('../audio/audioclick.mp3');
    var musicPlayer = document.getElementById('audio');

    var randomSong = 0;

    // animation and sound for top TV knob button
    $('#hiddenButton1').click(function() {
        // wiggle animation for antenna on load
        var $leftAntenna = $('#LeftAntenna');
        var $rightAntenna = $('#RightAntenna');

        var t1 = new TimelineLite();

        // GSAP library to rotate knob
        t1.to($leftAntenna, '.25', {
            rotation: 3,
            transformOrigin: "bottom"
        });
        t1.to($leftAntenna, '.25', {
            rotation: -3,
            transformOrigin: "bottom"
        });
        t1.to($rightAntenna, '.25', {
            rotation: 3,
            transformOrigin: "bottom"
        });
        t1.to($rightAntenna, '.25', {
            rotation: -3,
            transformOrigin: "bottom"
        });

        angle1 += 45;
        var $upperKnob = $('#UpperKnob');
        // GSAP library to rotate knob
        TweenLite.to($upperKnob, '.25', {
            rotation: angle1,
            transformOrigin: "50% 50%"
        });
        audio.play();

        // play channelChange animation each time click is registered
        var channelChange = $('#videoFrame').addClass('active');
        setTimeout(function() {
            channelChange.removeClass('active');
        }, 1000);

    });

    // animation and sound for bottom TV knob button
    $("#hiddenButton2").click(function() {

        angle2 += 45;
        var $lowerKnob = $('#LowerKnob');
        // GSAP library to rotate knob
        TweenLite.to($lowerKnob, '.25', {
            rotation: angle2,
            transformOrigin: "50% 50%"
        });
        audio2.play();

        $.get('/music', function(data) {
            console.log(data);
            songResults = data;
            randomSong = Math.floor(Math.random() * 100) + 1;
            updateMusic(randomSong);
        });
    });

    // audio hidden button controls
    $("#hiddenPlay").click(function() {
        var $playButton = $('#PlayButton');
        audioButtonClick($playButton);
        musicPlayer.play();
    });

    function audioButtonClick(button){
        var t1 = new TimelineLite();

        t1.to(button, '.25', {
            scaleX: 0.6,
            scaleY: 0.6,
            transformOrigin: "50% 50%"
        });
        t1.to(button, '.25', {
            scaleX: 1,
            scaleY: 1,
            transformOrigin: "50% 50%"
        });
        audio3.play();
    }

    $("#hiddenPause").click(function() {
        var $pauseButton = $('#PauseButton');
        audioButtonClick($pauseButton);
        musicPlayer.pause();
    });
    $("#hiddenVolumeDown").click(function() {
        var $volumeDown = $('#VolumeDown');
        audioButtonClick($volumeDown);
        musicPlayer.volume -= 0.1;
    });
    $("#hiddenVolumeUp").click(function() {
        var $volumeUp= $('#VolumeUp');
        audioButtonClick($volumeUp);
        musicPlayer.volume += 0.1;
    });

    function updateMusic(randomSong) {
        var songDetails = songResults.dataset[randomSong];
        var trackID = songResults.dataset[randomSong].track_id;
        var parameters = {
            search: trackID
        };

        $.get('/song', parameters, function(data) {
            if (data === 'undefined') {
                console.log("no results");
            } else {
                console.log("ajax got data from backend" + data);
                var songLink = data.track_listen_url;
                console.log(songLink);
                var musicPlayer = document.getElementById('audio');
                $('#fma-song').attr('src', songLink);
                musicPlayer.load();
                musicPlayer.play();
            }
        });
    }
});
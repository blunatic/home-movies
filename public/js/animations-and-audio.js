/*
JS for Animations and Audio
*/
$(document).ready(function() {
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

        var $speaker = $('#Speaker');

        TweenMax.to($speaker, .1, {
            repeat: 2,
            scaleX: 1.1,
            scaleY: 1.1,
            yoyo: true,
            delay: .1,
            ease: Quad.easeInOut
        });
        TweenMax.to($speaker, .1, {
            x: 0,
            scaleX: 1,
            scaleY: 1,
            delay: .1 * 4
        });

    });

    // audio hidden button controls
    $("#hiddenPlay").click(function() {
        var $playButton = $('#PlayButton');
        audioButtonClick($playButton);
        musicPlayer.play();
        console.log("Current time is: " + Math.floor(musicPlayer.currentTime));
    });
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
        var $volumeUp = $('#VolumeUp');
        audioButtonClick($volumeUp);
        musicPlayer.volume += 0.1;
    });

    function audioButtonClick(button) {
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
});
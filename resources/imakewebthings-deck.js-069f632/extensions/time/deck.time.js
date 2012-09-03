/*
This module adds a runing time indocator that is shown on any slide change.
*/
(function($, deck) {
    var $d = $(document),
        // pad numbers smaller than 10 with a zero prefix
        pad = function(num) {
            return (num < 10) ? '0' + num : num;
        },
        // the main function, calculates running time, and shows the container.
        // Also ensures that the conatiner is hidden after the specifiued
        // amount.
        showRunningTime = function(e, from, to) {
            var opts = $[deck]('getOptions'),
                $cont = $(opts.selectors.runningTime),
                // read out stored start time
                startDate = $cont.data('deck-time-started'),
                now = new Date(),
                round = Math.round,
                diff = now - startDate,
                // calculate hours, mins & secs
                hours = pad(round(diff / (1000*60*60))),
                mins = pad(round((diff % (1000*60*60)) / (1000*60))),
                secs = pad(round(((diff % (1000*60*60)) % (1000*60)) / 1000));

            // Set the running time
            $cont.text( hours + ':' + mins + ':' + secs );

            // clear any previous hide timeouts
            if ($cont.data('deck-time-hide-timeout')) {
                window.clearTimeout($cont.data('deck-time-hide-timeout'));
                $cont.data('deck-time-hide-timeout', null);
            }

            // fade the container in
            $cont.fadeIn(opts.fadeInSpeed);

            // set up the timeout to hide the container again
            $cont.data('deck-time-hide-timeout', window.setTimeout(function(){
                $cont.fadeOut(opts.fadeOutSpeed);
            }, opts.stayTime));

        };

    /*
    Extends defaults/options.

    options.selectors.runningTime the div we have the running time in, defaults to '.deck-running-time'
    options.stayTime              the milliseconds the time is shown on each slide, defaults to 1000
    options.fadeInSpeed           millisecond for the fade in animation, defaults to 200 (fast)
    options.fadeOutSpeed          millisecond for the fade out animation, defaults to 200 (fast)
    */
    $.extend(true, $[deck].defaults, {
        selectors: {
            runningTime: '.deck-running-time'
        },
        stayTime: 1000,
        fadeInSpeed: 200,
        fadeOutSpeed: 200
    });

    $d.bind('deck.init', function() {
        var opts = $[deck]('getOptions'),
            $cont = $(opts.selectors.runningTime);

        // save the start time
        $cont.data('deck-time-started', new Date());
        // hide the div, we just started, also unset any text
        $cont.hide().text("");
    }).bind('deck.change', showRunningTime);

})(jQuery, 'deck');

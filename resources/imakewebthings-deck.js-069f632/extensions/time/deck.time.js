/**
 * This module adds a runing time indicator that is shown on slide change.
 */
(function($, deck) {
    var $d = $(document),
        firstRun = true,
        
        /**
         * Pads numbers smaller than 10 with a zero prefix.
         * 
         * @param {Number} num
         */
        pad = function(num) {
            return (num < 10) ? '0' + num : num;
        },
        
        /**
         * the main function, calculates running time, and shows the container.
         * Also ensures that the conatiner is hidden after the specified 
         * amount.
         * @param {Object} e
         * @param {Object} from
         * @param {Object} to
         */
        showRunningTime = function(e, from, to) {
            if (firstRun) {
                // this is important for when we do not start on the first slide
                // in that case 'deck.change' fires too early
                firstRun = false;
                return;
            }

            var opts = $[deck]('getOptions'),
                $cont = $(opts.selectors.runningTime),
                // read out stored start time
                startDate = $cont.data('deck-time-started'),
                targetTime = $cont.data('deck-target-time'),
                firstShowTime = $cont.data('deck-first-show-time'),
                now = new Date(),
                floor = Math.floor,
                diff = now - startDate,
                // calculate hours, mins & secs
                dspTimes = {
                    hours : floor(diff / (1000*60*60)),
                    minutes : floor((diff % (1000*60*60)) / (1000*60)),
                    seconds : floor(((diff % (1000*60*60)) % (1000*60)) / 1000)
                },
                doShow = true;
            
            // Shall we show the time info?
            if (compareTimeObj(dspTimes, firstShowTime) === -1) {
                doShow = false;
            }
            // Are the slides already shown longer than expected? 
            if (compareTimeObj(dspTimes, targetTime) === 1) {
                $cont.addClass(opts.targetTimeExceededClass);
            }

            // Set the running time
            $cont.text(
                pad(dspTimes.hours) +
                ':' +
                pad(dspTimes.minutes) +
                ':' +
                pad(dspTimes.seconds)
            );

            // Clear any previous hide timeouts
            if ($cont.data('deck-time-hide-timeout')) {
                window.clearTimeout($cont.data('deck-time-hide-timeout'));
                $cont.data('deck-time-hide-timeout', null);
            }

            if (doShow) {
                // fade the container in
                $cont.fadeIn(opts.fadeInSpeed);

                // set up the timeout to hide the container again
                $cont.data('deck-time-hide-timeout', window.setTimeout(function(){
                    $cont.fadeOut(opts.fadeOutSpeed);
                }, opts.stayTime));
            }
        },
        /**
         * Normalizes a time string to a time object.
         * 
         * @param {String} timeStr a string like '2 hours 1 minute 23.2 seconds'
         * @return {Object} an object with the keys 'hours', 'minutes' and
         *         'seconds', e.g. { hours: 2, minutes: 1, seconds: 23.2 }
         */
        normalizeTimeObj = function(timeStr){
            var normalizedTimeObj = {
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                },
                hourRegExp = (/(\d+\.*\d*) *hours?/ig),
                minuteRegExp = (/(\d+\.*\d*) *minutes?/ig),
                secondsRegExp = (/(\d+\.*\d*) *seconds?/ig),
                res;

            res = hourRegExp.exec(timeStr);
            if (res && res[1]) {
                normalizedTimeObj.hours = parseFloat(res[1]);
            }

            res = minuteRegExp.exec(timeStr);
            if (res && res[1]) {
                normalizedTimeObj.minutes = parseFloat(res[1]);
            }

            res = secondsRegExp.exec(timeStr);
            if (res && res[1]) {
                normalizedTimeObj.seconds = parseFloat(res[1]);
            }

            return normalizedTimeObj;
        },

        /**
         * Used to compare our time objects, this method will return
         * 
         *     1   when t1 is bigger than t2
         *     0   when t1 equals t2
         *    -1   when t1 is smaller than t2
         * 
         * @param {Object} t1 An object with the keys 'hours', 'minutes' and
         *         'seconds', all should have a number as value.
         * 
         * @param {Object} t2 An object with the keys 'hours', 'minutes' and
         *         'seconds', all should have a number as value.
         */
        compareTimeObj = function(t1, t2){
            var num1 = !t1 ? -1 : (t1.hours * 60 * 60) + (t1.minutes * 60) + (t1.seconds * 1),
                num2 = !t2 ? -1 : (t2.hours * 60 * 60) + (t2.minutes * 60) + (t2.seconds * 1),
                result = 0;
            if (num1 > num2) {
                result = 1;
            } else if (num1 < num2) {
                result = -1;
            }
            return result;
        };

    /**
     * Extends defaults/options.
     *
     * options.selectors.runningTime
     *         the div we have the running time in, defaults to
     *         '.deck-running-time'.
     *
     * options.stayTime
     *         the milliseconds the time is shown on each slide, defaults to
     *         1000.
     *
     * options.fadeInSpeed
     *         millisecond for the fade in animation, defaults to 200 (fast).
     *
     * options.fadeOutSpeed
     *         millisecond for the fade out animation, defaults to 200 (fast).
     *
     * options.targetTime
     *         The time you expect to speak, when this time is exceeded, the
     *         class 'options.targetTimeExceededClass' will be added to the
     *         container. A possible string would be
     *         '1 hour 30 minutes 24 seconds'; You can leave out unneeded parts:
     *         '30 minutes' is fine, for example.
     *
     * options.targetTimeExceededClass
     *         The class to be added when the target time is exceeded. Defaults
     *         to 'deck-running-time-exceeded'.
     *
     * options.firstShowTime
     *         The time after which the elapsed time info div is first shown.
     *         For the format description see options.targetTime.
     */
    $.extend(true, $[deck].defaults, {
        selectors: {
            runningTime: '.deck-running-time'
        },
        stayTime: 1000,
        fadeInSpeed: 200,
        fadeOutSpeed: 200,
        targetTime: '28 minutes 30 seconds',
        targetTimeExceededClass: 'deck-running-time-exceeded',
        firstShowTime: '15 minutes'
    });
    
    /**
     * When the deck initializes, set up our variables and prepare the 
     * container.
     */
    $d.bind('deck.init', function() {
        var opts = $[deck]('getOptions'),
            $cont = $(opts.selectors.runningTime);

        // save the start time
        $cont.data('deck-time-started', new Date());
        // normalize and save the target time
        $cont.data('deck-target-time', normalizeTimeObj(opts.targetTime));
        // normalize and save the first show time
        $cont.data('deck-first-show-time', normalizeTimeObj(opts.firstShowTime));

        // hide the div, we just started, also unset any text
        $cont.hide().text("");
    })
    /**
     * whenever the slide changes, we check whether we have to do sth.
     */
    .bind('deck.change', showRunningTime);

})(jQuery, 'deck');
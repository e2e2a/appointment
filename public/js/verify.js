
   //timer
   function startTimer(duration, display, onExpiration) {
    var timer = duration, minutes, seconds;
    var intervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            // Timer expired, stop the interval immediately
            clearInterval(intervalId);
            display.textContent = 'Expired';

            // Call the provided callback function
            if (typeof onExpiration === 'function') {
                onExpiration();
            }
        }
    }, 1000);
}

window.onload = function () {
    
    
    var timerDuration = adjustedExpirationTimestamp ;

    // If the timer has already expired
    if (timerDuration <= 0) {
        var display = document.querySelector('#time');
        display.textContent = 'Expired';
    } else {
        if(timerDuration > 0){
            var display = document.querySelector('#time');
            startTimer(timerDuration, display);
        }
        // Start the timer and provide a callback for expiration
        var display = document.querySelector('#time');
        startTimer(timerDuration, display, function () {
            // Your logic here when the timer expires
            console.log('Timer expired!');
            // Example: Display a message or take some action
        });
    }
};
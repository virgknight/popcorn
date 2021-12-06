class Timer {
    constructor (outOfTimeCallback) {
        this.totalSeconds = 60;
        this.currentSeconds = 0;

        this.interval = undefined;

        this.outOfTimeCallback = outOfTimeCallback;
        this.renderedTimer = document.getElementById("timer");
    }

    start () {
        this.currentSeconds = this.totalSeconds; //reset
        document.getElementById("timer").innerHTML = `${this.currentSeconds}`; // flash 60 before countdown
        this.interval = setInterval(this.decrement.bind(this), 1000);
    }

    stop () {
        if (this.renderedTimer.classList.contains("blinking")) {
            this.renderedTimer.classList.remove("blinking");
        }
        clearInterval(this.interval);
    }

    decrement () {
        this.currentSeconds -= 1;

        // add red-and-black blink to timer countdown at the 5-second mark
        if (this.currentSeconds === 5) {
            this.renderedTimer.classList.add("blinking");
        }

        // stop timer when it hits zero
        if (this.currentSeconds === 0) {
            this.currentSeconds = 0;
            this.stop();
            this.outOfTimeCallback();
        }

        // update rendered second count
        this.renderedTimer.innerHTML = `${this.currentSeconds}`;
    }

}

export default Timer;
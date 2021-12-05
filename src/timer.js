class Timer {
    constructor (outOfTimeCallback) {
        this.totalSeconds = 60;
        this.currentSeconds = 0;
        this.interval = undefined;
        this.outOfTimeCallback = outOfTimeCallback;
    }

    start () {
        this.currentSeconds = this.totalSeconds;
        this.interval = setInterval(this.decrement.bind(this), 1000);
    }

    stop () {
        clearInterval(this.interval);
    }

    decrement () {
        this.currentSeconds -= 1;
        console.log(this.currentSeconds);
        if (this.currentSeconds === 0) {
            this.currentSeconds = 0;
            this.stop();
            this.outOfTimeCallback();
        }

        const timer = document.getElementById("timer");
        timer.innerHTML = `${this.currentSeconds}`;
    }

}

export default Timer;
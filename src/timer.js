class Timer {
    constructor () {
        this.totalSeconds = 60;
        this.currentSeconds = 0;
        this.interval = undefined;
    }

    start () {
        this.currentSeconds = this.totalSeconds;
        this.interval = setInterval(this.decrement.bind.this, 1000);
    }

    pause () {
        clearInterval(this.interval);
    }

    decrement () {
        this.currentSeconds -= 1;
        if (this.currentSeconds === 0) {
            this.currentSeconds = 0;
            this.pause();
            // callback?
        }

        const timer = document.getElementById("timer");
        timer.innerHTML = `${this.currentSeconds}`;
    }

}

export default Timer;
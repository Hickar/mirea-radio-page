const audioContext = new (window.AudioContext || window.webkitAudioContext)();
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

class Player {
    constructor(url) {
        this.url = url;
        this.audioElement = document.getElementById("audio");
        this.source = audioContext.createMediaElementSource(this.audioElement);

        this.volumeSlider = document.querySelector(".volumeslider");
        this.volume = this.volumeSlider.value;
        this.isPlaying = false;
        this.isMute = false;
    }

    play() {
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        audioContext.resume();
        this.audioElement.src = this.url;
        this.audioElement.load();
        this.audioElement.play();
        document.getElementById("playIcon").setAttribute("fill", "transparent");
        document.getElementById("pauseIcon").setAttribute("fill", "white");
        this.isPlaying = true;
    }

    pause() {
        this.audioElement.pause();
        this.audioElement.src = null;
        this.audioElement.currentTime = 0;
        document.getElementById("pauseIcon").setAttribute("fill", "transparent");
        document.getElementById("playIcon").setAttribute("fill", "white");
        this.isPlaying = false;
    }

    toggle() {
        if (this.isPlaying === false) {
            this.play();
        } else if (this.isPlaying === true) {
            this.pause();
        }
    }

    mute() {
        if (this.isMute === false) {
            this.volume = this.audioElement.volume;
            this.audioElement.volume = 0;
            this.isMute = true;
            this.volumeSlider.value = 0;
            this.muteCheck();
        } else if (this.isMute === true) {
            this.audioElement.volume = this.volume;
            this.isMute = false;
            this.volumeSlider.value = this.volume;
            this.muteCheck();
        }
    }

    changeVolume() {
        this.audioElement.volume = this.volumeSlider.value;
        this.muteCheck();
    }

    muteCheck() {
        if (this.audioElement.volume === 0) document.querySelector(".volumecrossline").setAttribute("stroke", "#B8B8B8");
        else document.querySelector(".volumecrossline").setAttribute("stroke", "transparent");
    }

    updateTrackInfo() {
        fetch("https://s0.radioheart.ru:8000/json.xsl?mount=/RH20507")
            .then((response) => {
                response.json().then(data => {
                    let artistName, trackName;
                    [artistName, trackName] = data.mounts[0].title.split("-");
                    if (trackName === '') trackName = "Без названия";
                    document.querySelector(".player__trackartist").innerHTML = artistName;
                    document.querySelector(".player__trackname").innerHTML = trackName;
                })
            });
        setInterval(() => this.updateTrackInfo(), 20000);
    }
}

class Spectrum {
    constructor(player) {
        this.analyser = audioContext.createAnalyser();
        this.canvas = document.querySelector("canvas");
        this.player = player;
        player.source.connect(this.analyser).connect(audioContext.destination);

        if (window.innerWidth <= 480) this.analyser.fftSize = 128;
        else this.analyser.fftSize = 256;

        this.width = this.canvas.parentElement.clientWidth;
        this.canvas.setAttribute("width", this.width);

        this.height = this.canvas.parentElement.clientHeight;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.ctx = this.canvas.getContext("2d");

        this.barWidth = ((this.width / this.bufferLength) * 2.5);
        this.barHeight = 0;
        this.x = 0;
    }

    stopRender() {
        setTimeout(cancelAnimationFrame(() => this.renderFrame()), 1000);
    }

    renderFrame() {
        try {
            this.player.isPlaying === true ?
                requestAnimationFrame(() => this.renderFrame()) :
                this.stopRender();

            this.x = 0;
            this.analyser.getByteFrequencyData(this.dataArray);
            this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel-color');
            this.ctx.fillRect(0, 0, this.width, this.height);

            for (let i = 0; i < this.bufferLength; i++) {
                this.barHeight = this.dataArray[i];

                const r = 50;
                const g = 50;
                const b = this.barHeight + (25 * (i/this.bufferLength));

                this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                this.ctx.fillRect(this.x, this.height - this.barHeight, this.barWidth, this.barHeight);

                this.x += this.barWidth + 1;
            }
        } catch(e) {
            console.error(e.toString());
        }
    }
}

const player = new Player("https://s0.radioheart.ru:8000/RH20507");
const spectrum = new Spectrum(player);

document.addEventListener("DOMContentLoaded", () => {
    player.updateTrackInfo();
});

document.querySelector(".player__spectrum").addEventListener("resize", (e) => {
    console.log(`e.target: ${e.target}`);
   [canvas.width, canvas.height] = [canvas.parentElement.clientWidth, canvas.parentElement.clientHeight];
    canvas.setAttribute("width", canvas.width);
});

document.querySelector(".playButtonOverlay").addEventListener("click", () => {
    player.toggle();
    spectrum.renderFrame();
});
document.querySelector(".volumeButtonOverlay").addEventListener("click", () => player.mute());
document.querySelector(".volumeslider").addEventListener("input", () => player.changeVolume());
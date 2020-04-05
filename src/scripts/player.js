import { drawInlineSVG, loadSVGs, isEmpty } from "./utils";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

class Player {
    constructor(url) {
        this.audioElement = document.getElementById("audio") || new Audio(url);
        this.audioElement.src = url;
        this.source = audioContext.createMediaElementSource(this.audioElement);
        this.volumeSlider = document.querySelector(".volumeslider");
        this.volume = this.volumeSlider.value;
        this.isPlaying = false;
        this.isMute = false;
    }

    init() {
        this.updateTrackInfo();
        setInterval(this.updateTrackInfo(), 20000);
        this.volumeSlider.value = 0.8;
        this.audioElement.volume = this.volume;
        this.muteCheck();
    }

    play() {
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        this.audioElement.load();
        this.audioElement.currentTime = 0;
        this.audioElement.play();
        document.getElementById("playIcon").setAttribute("fill", "transparent");
        document.getElementById("pauseIcon").setAttribute("fill", "white");
    }

    pause() {
        this.audioElement.pause();
        document.getElementById("pauseIcon").setAttribute("fill", "transparent");
        document.getElementById("playIcon").setAttribute("fill", "white");
    }

    toggle() {
        if (this.isPlaying === false) {
            this.play();
        } else if (this.isPlaying === true) {
            this.pause();
        }
        document.querySelector(".player__playbutton").classList.toggle(".player__playbutton_active");
        this.isPlaying = !this.isPlaying;
    }

    mute() {
        if (this.isMute === false) {
            this.volume = this.audioElement.volume;
            this.audioElement.volume = 0;
            this.volumeSlider.value = 0;
        } else if (this.isMute === true) {
            this.audioElement.volume = this.volume;
            this.volumeSlider.value = this.volume;
        }
        this.isMute = !this.isMute;
        this.muteCheck();
    }

    changeVolume() {
        this.audioElement.volume = this.volumeSlider.value;
        this.muteCheck();
    }

    muteCheck() {
        if (this.audioElement.volume === 0) {
            document.getElementById("crossline").setAttribute("stroke", "#B8B8B8");
            document.getElementById("v_level1").setAttribute("fill", "transparent");
            document.getElementById("v_level2").setAttribute("fill", "transparent");
            document.getElementById("v_level3").setAttribute("fill", "transparent");
        } else if (0 < this.audioElement.volume * 100 && this.audioElement.volume * 100 < 33) {
            document.getElementById("crossline").setAttribute("stroke", "transparent");
            document.getElementById("v_level1").setAttribute("fill", "#B8B8B8");
            document.getElementById("v_level2").setAttribute("fill", "transparent");
            document.getElementById("v_level3").setAttribute("fill", "transparent");
        } else if (33 < this.audioElement.volume * 100 && this.audioElement.volume * 100 < 66) {
            document.getElementById("crossline").setAttribute("stroke", "transparent");
            document.getElementById("v_level1").setAttribute("fill", "#B8B8B8");
            document.getElementById("v_level2").setAttribute("fill", "#B8B8B8");
            document.getElementById("v_level3").setAttribute("fill", "transparent");
        } else if (66 < this.audioElement.volume * 100) {
            document.getElementById("crossline").setAttribute("stroke", "transparent");
            document.getElementById("v_level1").setAttribute("fill", "#B8B8B8");
            document.getElementById("v_level2").setAttribute("fill", "#B8B8B8");
            document.getElementById("v_level3").setAttribute("fill", "#B8B8B8");
        }
    }

    updateTrackInfo() {
        fetch("https://s0.radioheart.ru:8000/json.xsl?mount=/RH20507")
            .then((response) => {
                response.json().then(data => {
                    let artistName, trackName;
                    [artistName, trackName] = data.mounts[0].title.split("-");
                    isEmpty(artistName) ?
                        document.querySelector(".player__trackartist").innerHTML = "Неизвестный исполнитель":
                        document.querySelector(".player__trackartist").innerHTML = artistName;
                    isEmpty(trackName) ?
                        document.querySelector(".player__trackname").innerHTML = "Без названия":
                        document.querySelector(".player__trackname").innerHTML = trackName;
                })
            });
    }
}

class Spectrum {
    constructor(player) {
        this.analyser = audioContext.createAnalyser();
        this.canvas = document.querySelector("canvas");
        this.player = player;
        player.source.connect(this.analyser);
        this.analyser.connect(audioContext.destination);

        if (window.innerWidth <= 480) this.analyser.fftSize = 128;
        else this.analyser.fftSize = 512;

        this.width = this.canvas.parentElement.clientWidth;
        this.height = this.canvas.parentElement.clientHeight;
        this.dpi = window.devicePixelRatio || 1;

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.ctx = this.canvas.getContext("2d");
        this.images = {};
    }

    async init() {
        const inlineSVGs = document.querySelectorAll(".player__canvassvg");
        this.images = await loadSVGs(inlineSVGs);
        await this.resize();
        await this.draw();
        this.canvas.classList.remove("player__canvas_hidden");
    }

    draw() {
        let cx = this.canvas.width / (2 * this.dpi),
            cy = this.canvas.height / (2 * this.dpi);

        const gradient = this.ctx.createLinearGradient(-138 / 2, -138 / 2, 138 / 2, 138 / 2);
        gradient.addColorStop(.9, "hsl(40, 60%, 50%)");
        gradient.addColorStop(.5, "hsl(330, 100%, 50%)");
        gradient.addColorStop(.1, "hsl(286, 87%, 34%)");

        drawInlineSVG(this.images.circuits, this.ctx, cx, cy);
        drawInlineSVG(this.images.outlines, this.ctx, cx, cy + 26);
        drawInlineSVG(this.images.bottom, this.ctx, cx, cy + 74);
        drawInlineSVG(this.images.top, this.ctx, cx, cy - 46);

        for (let i = 40; i > 0; i -= 10) {
            drawInlineSVG(this.images.wing, this.ctx, cx - (Math.cos(Math.PI * i / 180) * (this.dataArray[i * 4] + 50) / 2), cy - (Math.sin(Math.PI * i / 180) * this.dataArray[i * 4] / 2), i);
            drawInlineSVG(this.images.wing, this.ctx, cx + (Math.cos(Math.PI * -i / 180) * (this.dataArray[i * 4] + 50) / 2), cy + (Math.sin(Math.PI * -i / 180) * this.dataArray[i * 4] / 2), -i);
        }

        drawInlineSVG(this.images.center, this.ctx, cx, cy);
        drawInlineSVG(this.images.logo, this.ctx, cx, cy);
    }

    resize() {
        [this.canvas.width, this.canvas.height] = [this.canvas.parentElement.clientWidth * this.dpi, this.canvas.parentElement.clientHeight * this.dpi];
        this.ctx.scale(this.dpi, this.dpi);
        this.draw();
    }

    stopRender() {
        setTimeout(cancelAnimationFrame(() => this.renderFrame()), 1000);
    }

    renderFrame() {
        this.player.isPlaying === true ?
            requestAnimationFrame(() => this.renderFrame()) :
            this.stopRender();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        this.draw();
    }
}

export { Player, Spectrum };
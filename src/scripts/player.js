import { drawSVG, isEmpty } from "./utils";

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
        this.audioElement.volume = this.volume;
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
        // switch (true) {
        //     case (this.audioElement.volume === 0): {
        //         document.getElementById("crossline").setAttribute("stroke", "#B8B8B8");
        //         break;
        //     }
        //     case (this.audioElement.volume > 0 && this.audioElement.volume <= 33): {
        //         document.getElementById("v_level1").setAttribute("fill", "#B8B8B8");
        //         document.getElementById("v_level2").setAttribute("fill", "transparent");
        //         document.getElementById("v_level3").setAttribute("fill", "transparent");
        //         break;
        //     }
        //     case (this.audioElement.volume > 33 && this.audioElement.volume <= 66): {
        //         document.getElementById("v_level1").setAttribute("fill", "#B8B8B8");
        //         document.getElementById("v_level2").setAttribute("fill", "#B8B8B8");
        //         document.getElementById("v_level3").setAttribute("fill", "transparent");
        //         break;
        //     }
        //     case (this.audioElement.volume > 66 && this.audioElement.volume <= 100): {
        //         document.getElementById("v_level1").setAttribute("fill", "#B8B8B8");
        //         document.getElementById("v_level2").setAttribute("fill", "#B8B8B8");
        //         document.getElementById("v_level3").setAttribute("fill", "#B8B8B8");
        //         break;
        //     }
        // }
        if (this.audioElement.volume === 0) document.getElementById("crossline").setAttribute("stroke", "#B8B8B8");
        else document.getElementById("crossline").setAttribute("stroke", "transparent");
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
    }

    init() {
        this.resize();
        this.draw();
    }

    draw() {
        const center = {
            x: this.canvas.width / (2 * this.dpi),
            y: this.canvas.height / (2 * this.dpi)
        };

        const gradient = this.ctx.createLinearGradient(-138 / 2, -138 / 2, 138 / 2, 138 / 2);
        gradient.addColorStop(.9, "hsl(40, 60%, 50%)");
        gradient.addColorStop(.5, "hsl(330, 100%, 50%)");
        gradient.addColorStop(.1, "hsl(286, 87%, 34%)");

        const circuits = document.getElementById("circuits"),
            outlines = document.getElementById("outlines"),
            bottom = document.getElementById("bottom"),
            top = document.getElementById("top"),
            central = document.getElementById("center"),
            logo = document.getElementById("logo"),
            wing = document.getElementById("wing");

        drawSVG(circuits, this.ctx, center.x, center.y);
        drawSVG(outlines, this.ctx, center.x, center.y + 26);
        drawSVG(bottom, this.ctx, center.x, center.y + (bottom.height / 2));
        drawSVG(top, this.ctx, center.x, center.y - (top.height / 2) + 25);

        for (let i = 40; i > 0; i -= 10) {
            drawSVG(wing, this.ctx, center.x - (Math.cos(Math.PI * i / 180) * (this.dataArray[i * 4] + 50) / 2), center.y - (Math.sin(Math.PI * i / 180) * this.dataArray[i * 4] / 2), i);
            drawSVG(wing, this.ctx, center.x + (Math.cos(Math.PI * -i / 180) * (this.dataArray[i * 4] + 50) / 2), center.y + (Math.sin(Math.PI * -i / 180) * this.dataArray[i * 4] / 2), -i);
        }

        drawSVG(central, this.ctx, center.x, center.y);
        drawSVG(logo, this.ctx, center.x, center.y);
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
        try {
            this.player.isPlaying === true ?
                requestAnimationFrame(() => this.renderFrame()) :
                this.stopRender();

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.analyser.getByteFrequencyData(this.dataArray);
            this.draw();
        } catch(e) {
            console.error(e.toString());
        }
    }
}

const player = new Player("https://s0.radioheart.ru:8000/RH20507");
const spectrum = new Spectrum(player);

document.addEventListener("DOMContentLoaded", () => {
    player.init();
    spectrum.init();
});

window.addEventListener("resize", () => {
    spectrum.resize();
});

document.querySelector(".player__playbutton").addEventListener("click", () => {
    player.toggle();
    spectrum.renderFrame();
});

document.querySelector(".volumebutton").addEventListener("click", () => player.mute());

document.querySelector(".volumeslider").addEventListener("input", () => player.changeVolume());
import { drawInlineSVG, loadSVGs } from "./utils";

export class Spectrum {
    canvas = document.querySelector("canvas");
    width = this.canvas.parentElement.clientWidth;
    height = this.canvas.parentElement.clientHeight;
    dpi = window.devicePixelRatio || 1;
    ctx = this.canvas.getContext("2d");
    images = {};

    constructor(player) {
        this.analyser = player.audioContext.createAnalyser();
        this.player = player;
        player.source.connect(this.analyser);
        this.analyser.connect(player.audioContext.destination);

        this.analyser.fftSize = 512;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.ctx = this.canvas.getContext("2d");
    }

    async init() {
        await this.load();
        this.resize();
        this.draw();
        this.canvas.classList.remove("player__canvas_hidden");
    }

    async load() {
        const inlineSVGs = document.querySelectorAll(".player__canvassvg");
        this.images = await loadSVGs(inlineSVGs);
    }

    draw = () => {
        const cx = this.canvas.width / (2 * this.dpi),
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
        this.player.playingState === 'playing' ?
            requestAnimationFrame(() => this.renderFrame()) :
            this.stopRender();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        this.draw();
    }
}
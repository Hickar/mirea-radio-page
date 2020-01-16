window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();
const audioElement = document.getElementById("audio");
const source = audioContext.createMediaElementSource(audioElement);
source.connect(audioContext.destination);

class Player {
    audioElement = document.getElementById("audio");
    volumeSlider = document.querySelector(".volumeslider");
    volume;
    isPlaying = false;
    isMute = false;

    play() {
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        if (this.isPlaying === false) {
            this.audioElement.load();
            this.audioElement.play();
            document.getElementById("playIcon").setAttribute("fill", "transparent");
            document.getElementById("pauseIcon").setAttribute("fill", "white");
            this.isPlaying = true;
        } else if (this.isPlaying === true) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            document.getElementById("pauseIcon").setAttribute("fill", "transparent");
            document.getElementById("playIcon").setAttribute("fill", "white");
            this.isPlaying = false;
        }
    }

    mute() {
        if (this.isMute === false) {
            this.volume = this.audioElement.volume;
            this.audioElement.volume = 0;
            this.isMute = true;
            this.volumeSlider.value = 0;
        } else if (this.isMute === true) {
            this.audioElement.volume = this.volume;
            this.isMute = false;
            this.volumeSlider.value = this.volume;
        }
    }

    updateTrackInfo() {
        fetch("http://s0.radioheart.ru:8000/json.xsl?mount=/RH20507")
            .then((response) => {
                response.json().then(data => {
                    let artistName, sourceName;
                    [artistName, sourceName] = data.mounts[0].title.split("-");
                    document.querySelector(".player__trackartist").innerHTML = artistName;
                    document.querySelector(".player__trackname").innerHTML = sourceName;
                })
            });
    }

    changeVolume() {
        audioElement.volume = this.volumeSlider.value
    }
}

// class Spectrum {
//     width = canvas.parentElement.clientWidth - 32;
//     height = canvas.parentElement.clientHeight;
//     dataArray = new Uint8Array(bufferLength);
//
//     barWidth = ((this.width / this.bufferLength) * 2.5);
//     barHeight;
//     x = 0;
//
//     renderFrame() {
//         requestAnimationFrame(this.renderFrame);
//
//         this.x = 0;
//         analyser.getByteFrequencyData(this.dataArray);
//         ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel-color');
//         ctx.fillRect(0, 0, this.width, this.height);
//
//         for (let i = 0; i < bufferLength; i++) {
//             this.barHeight = this.dataArray[i];
//
//             const r = 50;
//             const g = 50;
//             const b = this.barHeight + (25 * (i/bufferLength));
//
//             ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
//             ctx.fillRect(this.x, this.height - this.barHeight, this.barWidth, this.barHeight);
//
//             this.x += this.barWidth + 1;
//         }
//     }
// }

const analyser = audioContext.createAnalyser();
const canvas = document.querySelector('canvas');
[canvas.width, canvas.height] = [canvas.parentElement.clientWidth - 32, canvas.parentElement.clientHeight];
const ctx = canvas.getContext("2d");
source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 256;
if (window.innerWidth <= 480) analyser.fftSize = 128;
console.log(window.clientWidth);

const bufferLength = analyser.frequencyBinCount;

const dataArray = new Uint8Array(bufferLength);

let WIDTH = canvas.width;
let HEIGHT = canvas.height;

let barWidth = (WIDTH / bufferLength) * 2.5;
let barHeight;
let x = 0;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const stopRender = () => setTimeout(cancelAnimationFrame(renderFrame), 1000);

const renderFrame = () => {
    player.isPlaying === true ?
        requestAnimationFrame(renderFrame) :
        stopRender();

    x = 0;
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel-color');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const r = 50;
        const g = 45;
        const b = barHeight + (30 * (i/bufferLength));

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
};

const player = new Player();
// const spectrum = new Spectrum();

document.addEventListener("DOMContentLoaded", () => {
    player.updateTrackInfo();
});

document.querySelector(".player__spectrum").addEventListener("resize", () => {
   [canvas.width, canvas.height] = [canvas.parentElement.clientWidth - 32, canvas.parentElement.clientHeight];
    renderFrame().catch(err => console.error(err.toString()));
});

// let audioStack = [];
// let nextTime = 0;
//
// let source = audioContext.createBufferSource();
// let buffer = audioStack.shift();
//
// const appendBuffer = (buffer1, buffer2) => {
//     let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
//     tmp.set(new Uint8Array(buffer1), 0);
//     tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
//     return tmp.buffer;
// };
//
// fetch("http://s0.radioheart.ru:8000/RH20507").then(response => {
//     const reader = response.body.getReader();
//     let header = null;
//
//     const read = () => {
//         return reader.read().then(({value, done}) => {
//             let audioBuffer = null;
//             if (header == null) {
//                 header = value.buffer.slice(0, 44);
//                 audioBuffer = value.buffer;
//             } else {
//                 audioBuffer = appendBuffer(header, value.buffer);
//             }
//             console.log(`audioBuffer: ${audioBuffer}`);
//             audioContext.decodeAudioData(audioBuffer, buffer => {
//
//                 audioStack.push(buffer);
//                 if (audioStack.length) {
//                     scheduleBuffers();
//                 }
//             }, err => {
//                 console.log("err(decodeAudioData): " + err);
//             });
//             if (done) {
//                 console.log("done");
//                 return;
//             }
//             read();
//         });
//     };
//     read();
// });
//
// const scheduleBuffers = () => {
//     while (audioStack.length) {
//         let buffer = audioStack.shift();
//         let source = audioContext.createBufferSource();
//         source.buffer = buffer;
//         source.connect(gainNode).connect(audioContext.destination);
//         if (nextTime === 0) nextTime = audioContext.currentTime + 0.02;
//         source.start(nextTime);
//         nextTime += source.buffer.duration;
//     }
// };

document.querySelector(".playButtonOverlay").addEventListener("click", () => {
    player.play();
    renderFrame();
});
document.querySelector(".volumeButtonOverlay").addEventListener("click", () => player.mute());
document.querySelector(".volumeslider").addEventListener("input", () => player.changeVolume());
setInterval(player.updateTrackInfo, 20000);
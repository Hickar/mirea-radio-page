const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = document.getElementById("audio");
const source = audioContext.createMediaElementSource(audioElement);
source.connect(audioContext.destination);
const gainNode = audioContext.createGain();

source.connect(gainNode).connect(audioContext.destination);

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
            this.audioElement.play();
            document.getElementById("playIcon").setAttribute("fill", "transparent");
            document.getElementById("pauseIcon").setAttribute("fill", "white");
            this.isPlaying = true;
        } else if (this.isPlaying === true) {
            this.audioElement.pause();
            document.getElementById("pauseIcon").setAttribute("fill", "transparent");
            document.getElementById("playIcon").setAttribute("fill", "white");
            this.isPlaying = false;
        }
    }

    mute() {
        if (this.isMute === false) {
            this.volume = parseFloat(gainNode.gain.value).toFixed(2);
            gainNode.gain.value = 0;
            this.isMute = true;
            this.volumeSlider.value = 0;
        } else if (this.isMute === true) {
            gainNode.gain.value = this.volume;
            this.isMute = false;
            this.volumeSlider.value = this.volume;
        }
    }

    updatesourceInfo() {
        fetch("http://s0.radioheart.ru:8000/json.xsl?mount=/RH20507")
            .then((response) => {
                response.json().then(data => {
                    let artistName, sourceName;
                    [artistName, sourceName] = data.mounts[0].title.split("-");
                    document.querySelector(".player__trackartist").innerHTML = artistName;
                    document.querySelector(".player__trackname").innerHTML = sourceName;
                })
            });
        fetch("http://s0.radioheart.ru:8000/RH20507").then(response => {
            console.log(response);
        });
    }

    changeVolume() {
        const fraction = parseInt(this.volumeSlider.value) / parseInt(this.volumeSlider.max);
        gainNode.gain.value = fraction * fraction;
    }
}

const player = new Player();

document.querySelector(".playButtonOverlay").addEventListener("click", () => player.play());
document.querySelector(".volumeButtonOverlay").addEventListener("click", () => player.mute());
document.querySelector(".volumeslider").addEventListener("input", () => player.changeVolume());
setInterval(player.updatesourceInfo(), 30000);
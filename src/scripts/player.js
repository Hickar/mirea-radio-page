const player = () => {

    const updateMusic = () => {
        fetch("http://s0.radioheart.ru:8000/json.xsl?mount=/RH20507")
            .then((response) => {
                response.json().then(data => {
                    let artistName, trackName;
                    [artistName, trackName] = data.mounts[0].title.split("-");
                    document.querySelector(".player__trackartist").innerHTML = artistName;
                    document.querySelector(".player__trackname").innerHTML = trackName;
                })
            });
        return;
    };
    setInterval(updateMusic(), 30000);

    document.querySelector(".playButtonOverlay").addEventListener("click", () => {
        const button = document.querySelector(".player__playbutton");
        if (button.dataset.playing === "true") {
            document.getElementById("pauseIcon").setAttribute("fill", "transparent");
            document.getElementById("playIcon").setAttribute("fill", "white");
        } else if (button.dataset.playing === "false") {
            document.getElementById("playIcon").setAttribute("fill", "transparent");
            document.getElementById("pauseIcon").setAttribute("fill", "white");
        }
    });

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioElement = document.getElementById("audio");
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);

    document.querySelector(".playButtonOverlay").addEventListener("click", () => {
        const button = document.querySelector(".player__playbutton");
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        if (button.dataset.playing === "false") {
            audioElement.play();
            button.dataset.playing = "true";
        } else if (button.dataset.playing === "true") {
            audioElement.pause();
            button.dataset.playing = "false";
        }
    }, false);

    const gainNode = audioContext.createGain();

    document.querySelector(".volumeslider").addEventListener("input", (e) => {
        gainNode.gain.value = e.target.value;
    }, false);

    document.querySelector(".volumeButtonOverlay").addEventListener("click", () => {
        const button = document.querySelector(".volumeicon");
        if (button.dataset.state === "unmute") {
            button.dataset.volume = parseFloat(gainNode.gain.value).toFixed(2);
            gainNode.gain.value = -1;
            button.dataset.state = "mute";
            document.querySelector(".volumeslider").value = -1;
        } else if (button.dataset.state === "mute") {
            gainNode.gain.value = button.dataset.volume;
            button.dataset.state = "unmute";
            document.querySelector(".volumeslider").value = button.dataset.volume;
        }
    }, false);

    track.connect(gainNode).connect(audioContext.destination);
};


export default player;
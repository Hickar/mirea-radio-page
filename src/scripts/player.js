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
    };
    setInterval(updateMusic(), 30000);

    document.querySelector(".player__playbutton").addEventListener("click", (e) => {
        if (e.target.dataset.playing === "true") {
            document.getElementById("pauseIcon").setAttribute("fill", "transparent");
            document.getElementById("playIcon").setAttribute("fill", "white");
        } else if (e.target.dataset.playing === "false") {
            document.getElementById("playIcon").setAttribute("fill", "transparent");
            document.getElementById("pauseIcon").setAttribute("fill", "white");
        }
    });


    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioElement = document.getElementById("audio");
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);

    const playButton = document.querySelector(".player__playbutton");

    playButton.addEventListener("click", (e) => {
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        if (e.target.dataset.playing === "false") {
            audioElement.play();
            e.target.dataset.playing = "true";
        } else if (e.target.dataset.playing === "true") {
            audioElement.pause();
            e.target.dataset.playing = "false";
        }
    }, false);

    const gainNode = audioContext.createGain();

    const volumeControl = document.querySelector(".volumeslider");
    volumeControl.addEventListener("input", (e) => {
        gainNode.gain.value = e.target.value;
    }, false);
    track.connect(gainNode).connect(audioContext.destination);
};


export default player;
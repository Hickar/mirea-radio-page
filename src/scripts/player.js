const player = () => {

    fetch("http://s0.radioheart.ru:8000/json_new.xsl?mount=/RH20507&callback=",
        {
            // method: "GET",
            // headers: {
            //     'Content-Type': 'text/plain'
            // }
        })
        .then((response) => {
            let result = response.body;
            console.log(response.text());
        });


    function parseMusic(results)
    {
        for  (var n in results){
            var nm = results[n];
            if(nm["title"]){
                document.querySelector('.player__trackname').innerHTML = nm["title"];
            }
        }
    }



    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioElement = document.getElementById('audio');
    const track = audioContext.createMediaElementSource(audioElement);
    track.connect(audioContext.destination);

    const playButton = document.querySelector('.player__playbutton');

    playButton.addEventListener('click', function() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (this.dataset.playing === 'false') {
            audioElement.play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            this.dataset.playing = 'false';
        }
    }, false);

    const gainNode = audioContext.createGain();

    const volumeControl = document.querySelector('.volumeslider');
    volumeControl.addEventListener('input', (e) => {
        gainNode.gain.value = e.target.value;
    }, false);
    track.connect(gainNode).connect(audioContext.destination);
};


export default player;
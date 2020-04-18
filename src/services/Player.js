import { LongtermKeyValue } from "./LongtermKeyValue";
const AudioContext = window.AudioContext || window.webkitAudioContext;

export class Player {
  static TRACK_INFO_URL =
    "https://s0.radioheart.ru:8000/json.xsl?mount=/RH20507";

  audioContext = new AudioContext();

  #longtermVolume = new LongtermKeyValue("__VOLUME__", 0.5);
  #longtermIsMuted = new LongtermKeyValue("__IS_MUTED__", false);
  #playingState = "idle";
  audioElement;
  source;

  constructor() {
    this.audioElement = this.getAudioElement();

    this.source = this.audioContext.createMediaElementSource(
      this.audioElement
    );
  }

  get volume() {
    return this.#longtermVolume.get();
  }

  set volume(value) {
    this.#longtermVolume.set(value);
    this.audioElement.volume = value;
    this.isMuted = false;
  }

  get isMuted() {
    return this.#longtermIsMuted.get();
  }

  set isMuted(value) {
    if (value) {
      this.audioElement.volume = 0;
    } else {
      this.audioElement.volume = this.volume;
    }

    this.#longtermIsMuted.set(value);
  }

  get playingState() {
    return this.#playingState;
  }

  init = (src) => {
    this.audioElement.src = src;
    this.audioElement.volume = this.volume;
  };

  play = () => {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.audioElement.load();
    this.audioElement.currentTime = 0;
    this.audioElement.play();

    this.#playingState = "playing";
  };

  pause = () => {
    this.audioElement.pause();
    this.#playingState = "pause";
  };

  mute = () => {
    this.isMuted = true;
  };

  unmute = () => {
    this.isMuted = false;
  };

  static fetchTrackInfo = () =>
    fetch(this.TRACK_INFO_URL)
      .then(response => response.json())
      .then(data => {
        const [artistName, trackName] = data.mounts[0].title.split("-");

        return {
          artist: artistName ? artistName : null,
          track: trackName ? trackName : null,
        };
      });

  getAudioElement = () => {
    const audio = document.createElement("audio");
    audio.crossOrigin = "anonymous";
    return audio;
  };
}

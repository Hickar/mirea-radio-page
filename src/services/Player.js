// @ts-check

import { Longterm } from "./LongtermManager/LongtermManager";

//@ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;

export class Player {
  static TRACK_INFO_URL =
    "https://s0.radioheart.ru:8000/json.xsl?mount=/RH20507";

  static audioContext = new AudioContext();

  #longtermVolume = Longterm.extract("volume");
  #longtermIsMuted = Longterm.extract("isMuted");

  /**
   * @type {'idle' | 'playing' | 'pause'}
   */
  #playingState = "idle";

  /**
   * @type {HTMLAudioElement}
   */
  audioElement;

  /**
   * @type {MediaElementAudioSourceNode}
   */
  source;

  constructor() {
    this.audioElement = Player.getAudioElement();

    this.source = Player.audioContext.createMediaElementSource(
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

  /**
   * @param {string} src
   */
  init = src => {
    this.audioElement.src = src;

    this.audioElement.volume = this.volume;
  };

  play = () => {
    if (Player.audioContext.state === "suspended") {
      Player.audioContext.resume();
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

  /**
   * @returns {Promise<{ artist: string | null, track: string | null }>}
   */
  static fetchTrackInfo = () =>
    fetch(Player.TRACK_INFO_URL)
      .then(response => response.json())
      .then(data => {
        const [artistName, trackName] = data.mounts[0].title.split("-");

        return {
          artist: artistName ? artistName : null,
          track: trackName ? trackName : null,
        };
      });

  /**
   * @returns {HTMLAudioElement}
   */
  static getAudioElement = () => {
    const audio = document.createElement("audio");

    audio.crossOrigin = "anonymous";

    return audio;
  };
}

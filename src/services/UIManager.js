// @ts-check

import { Player } from "../services/Player";

const getLevels = () => [
  document.getElementById("v_level1"),
  document.getElementById("v_level2"),
  document.getElementById("v_level3"),
];

class UIManager {
  get trackArtist() {
    return document.querySelector(".player__trackartist")?.innerHTML ?? null;
  }

  /**
   * @param {string | null} value
   */
  set trackArtist(value) {
    const element = document.querySelector(".player__trackartist");

    if (element && value !== null) {
      element.innerHTML = value;
    }
  }

  get trackName() {
    return document.querySelector(".player__trackname")?.innerHTML ?? null;
  }

  /**
   * @param {string | null} value
   */
  set trackName(value) {
    const element = document.querySelector(".player__trackname");

    if (element && value !== null) {
      element.innerHTML = value;
    }
  }

  /**
   * @param {string} theme
   */
  setTheme = theme => {
    document.documentElement.dataset.theme = theme;

    /**
     * @type {Array<HTMLElement>}
     */
    // @ts-ignore
    const parts = [...document.querySelectorAll(".player__canvassvg .body")];

    parts.forEach(element => {
      element.dataset.theme = theme;
    });
  };

  /**
   * @returns {HTMLInputElement | null}
   */
  getVolumeSlider = () => document.querySelector(".volumeslider");

  /**
   * @param {(value: number) =>  void} callback
   */
  onVolumeChange = callback => {
    this.getVolumeSlider()?.addEventListener("input", event => {
      /**
       * @type {HTMLInputElement | null}
       */
      // @ts-ignore
      const target = event.target;

      if (target) {
        callback(parseFloat(target.value));
      }
    });
  };

  /**
   * @param {() =>  void} callback
   */
  onThemeChangeButtonClick = callback => {
    document
      .querySelector(".navbar__darkmodebutton")
      ?.addEventListener("click", () => {
        callback();
      });
  };

  /**
   * @param {() =>  void} callback
   */
  onReady = callback => {
    window.addEventListener("load", () => {
      callback();
    });
  };

  /**
   * @param {() =>  void} callback
   */
  onResize = callback => {
    window.addEventListener("resize", () => {
      callback();
    });
  };

  /**
   * @param {() =>  void} callback
   */
  onMuteButtonClick = callback => {
    document.querySelector(".volumebutton")?.addEventListener("click", () => {
      callback();
    });
  };

  /**
   * @param {() =>  void} callback
   */
  onPlayButtonClick = callback => {
    document
      .querySelector(".player__playbutton")
      ?.addEventListener("click", () => {
        callback();
      });
  };

  /**
   * @param {Player} player
   */
  updatePlayButton = player => {
    const button = document.querySelector(".player__playbutton");

    if (player.playingState === "playing") {
      button?.classList.add("player__playbutton_active");
    } else {
      button?.classList.remove("player__playbutton_active");
    }
  };

  /**
   * @param {(trackArtist: string | null, trackName: string | null) =>  void} callback
   */
  onMetaClick = callback => {
    document
      .querySelector(".player__trackinfo")
      ?.addEventListener("click", () => {
        callback(this.trackArtist, this.trackName);
      });
  };

  updateTrackMeta = () => {
    Player.fetchTrackInfo().then(({ artist, track }) => {
      this.trackArtist = artist ? artist : "Неизвестный исполнитель";
      this.trackName = track ? track : "Без названия";
    });
  };

  /**
   * @param {number} level
   */
  setVolumeLevelOnMuteButton = level => {
    const levels = getLevels();

    for (const element of levels.slice(0, level)) {
      element?.setAttribute("fill", "#B8B8B8");
    }

    for (const element of levels.slice(level, levels.length)) {
      element?.setAttribute("fill", "transparent");
    }
  };

  /**
   * @param {boolean} isVisible
   */
  setCrossVisibilitylOnMuteButton = isVisible => {
    const element = document.getElementById("crossline");

    if (element) {
      element.setAttribute("stroke", isVisible ? "#B8B8B8" : "transparent");
    }
  };

  /**
   * @param {Player} player
   */
  updateMuteButton = player => {
    const volumeInPercents = player.audioElement.volume * 100;

    if (volumeInPercents) {
      this.setCrossVisibilitylOnMuteButton(false);
    } else {
      this.setCrossVisibilitylOnMuteButton(true);
    }

    if (volumeInPercents > 66) {
      this.setVolumeLevelOnMuteButton(3);
    } else if (volumeInPercents > 33) {
      this.setVolumeLevelOnMuteButton(2);
    } else if (volumeInPercents > 0) {
      this.setVolumeLevelOnMuteButton(1);
    } else {
      this.setVolumeLevelOnMuteButton(0);
    }
  };
}

export const UI = new UIManager();

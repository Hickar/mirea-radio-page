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

  set trackArtist(value) {
    const element = document.querySelector(".player__trackartist");

    if (element && value !== null) {
      element.innerHTML = value;
    }
  }

  get trackName() {
    return document.querySelector(".player__trackname")?.innerHTML ?? null;
  }

  set trackName(value) {
    const element = document.querySelector(".player__trackname");

    if (element && value !== null) {
      element.innerHTML = value;
    }
  }

  setTheme = theme => {
    document.documentElement.dataset.theme = theme;
    const parts = [...document.querySelectorAll(".player__canvassvg .body")];
    parts.forEach(element => {
      element.dataset.theme = theme;
    });
  };

  getVolumeSlider = () => document.querySelector(".volumeslider");

  onVolumeChange = callback => {
    this.getVolumeSlider()?.addEventListener("input", event => {
      const target = event.target;

      if (target) {
        callback(parseFloat(target.value));
      }
    });
  };

  onThemeChangeButtonClick = callback => {
    document
      .querySelector(".navbar__darkmodebutton")
      ?.addEventListener("click", () => {
        callback();
      });
  };

  onReady = callback => {
    window.addEventListener("load", () => {
      callback();
    });
  };

  onResize = callback => {
    window.addEventListener("resize", () => {
      callback();
    });
  };

  onMuteButtonClick = callback => {
    document.querySelector(".volumebutton")?.addEventListener("click", () => {
      callback();
    });
  };

  onPlayButtonClick = callback => {
    document
      .querySelector(".player__playbutton")
      ?.addEventListener("click", () => {
        callback();
      });
  };

  updatePlayButton = player => {
    const button = document.querySelector(".player__playbutton");

    if (player.playingState === "playing") {
      button?.classList.add("player__playbutton_active");
    } else {
      button?.classList.remove("player__playbutton_active");
    }
  };

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

  setVolumeLevelOnMuteButton = level => {
    const levels = getLevels();

    for (const element of levels.slice(0, level)) {
      element?.setAttribute("fill", "#B8B8B8");
    }

    for (const element of levels.slice(level, levels.length)) {
      element?.setAttribute("fill", "transparent");
    }
  };

  setCrossVisibilityOnMuteButton = isVisible => {
    const element = document.getElementById("crossline");

    if (element) {
      element.setAttribute("stroke", isVisible ? "#B8B8B8" : "transparent");
    }
  };

  updateMuteButton = player => {
    const volumeInPercents = player.audioElement.volume * 100;

    if (volumeInPercents) {
      this.setCrossVisibilityOnMuteButton(false);
    } else {
      this.setCrossVisibilityOnMuteButton(true);
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

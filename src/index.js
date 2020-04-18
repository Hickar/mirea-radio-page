// @ts-check

import "./style.css";

import { Player } from "./services/Player";
import { PLAYER_URL } from "./consts";
import { Spectrum } from "./scripts/player";
import { Theme } from "./services/ThemeManager";
import { UI } from "./services/UIManager";
import { copyToClipboard, showPopup } from "./scripts/utils";

const player = new Player();

const spectrum = new Spectrum(player);

UI.onReady(() => {
  player.init(PLAYER_URL);

  spectrum.init();

  Theme.set(Theme.theme);

  setInterval(UI.updateTrackMeta, 10000);
  UI.updateTrackMeta();

  const slider = UI.getVolumeSlider();

  if (slider) {
    slider.value = String(player.volume);
  }

  UI.updateMuteButton(player);

  player.isMuted
    ? UI.setCrossVisibilitylOnMuteButton(true)
    : UI.setCrossVisibilitylOnMuteButton(false);
});

UI.onResize(() => spectrum.resize());

UI.onVolumeChange(value => {
  player.volume = value;

  UI.updateMuteButton(player);
});

UI.onThemeChange(() => {
  Theme.setNext();
});

UI.onMuteButtonClick(() => {
  if (player.isMuted) {
    player.unmute();
  } else {
    player.mute();
  }

  UI.updateMuteButton(player);
});

UI.onPlayButtonClick(() => {
  if (player.playingState === "playing") {
    player.pause();
  } else {
    player.play();
  }
  spectrum.renderFrame();

  UI.updatePlayButton(player);
});

UI.onMetaClick((trackArtist, trackName) => {
  copyToClipboard(trackArtist + " - " + trackName);
  showPopup("Скопировано в буффер");
});

Theme.onChange(theme => {
  UI.setTheme(theme);

  setTimeout(() => spectrum.init(), 200);
});

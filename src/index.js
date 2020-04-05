import "./style.css";
import { Player, Spectrum } from "Scripts/player.js";
import darkmodeButtonHandler from "Scripts/darkmodeButton.js";
import { copyToClipboard, showPopup } from "Scripts/utils.js";

const player = new Player("https://s0.radioheart.ru:8000/RH20507");
const spectrum = new Spectrum(player);

window.addEventListener("load", () => {
    player.init();
    spectrum.init();
});

document.querySelector(".player__trackinfo").addEventListener("click", () => {
    const artistName = document.querySelector(".player__trackartist").innerHTML,
        trackName = document.querySelector(".player__trackname").innerHTML;

    copyToClipboard(artistName + " - " + trackName);
    showPopup("Скопировано в буффер");
});

document.querySelector(".player__playbutton").addEventListener("click", () => {
    player.toggle();
    spectrum.renderFrame();
});

window.addEventListener("resize", () => {
    spectrum.resize();
});

document.querySelector(".volumebutton").addEventListener("click", () => player.mute());

document.querySelector(".volumeslider").addEventListener("input", () => player.changeVolume());

document.querySelector(".navbar__darkmodebutton").addEventListener("click", () => {
    darkmodeButtonHandler();
    setTimeout(spectrum.init(), 200);
});
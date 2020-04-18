import "./style.css";
import { Player, Spectrum } from "Scripts/player.js";
import { copyToClipboard, showPopup } from "Scripts/utils.js";
import { Theme } from "./services/ThemeManager";

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

document.querySelector(".navbar__darkmodebutton").addEventListener("click", Theme.setNext);

Theme.onChange(theme => {
    document.documentElement.dataset.theme = theme;

    document.querySelectorAll(".player__canvassvg .body").forEach(element => {
        element.dataset.theme = theme;
    });

    setTimeout(spectrum.init(), 200);
})

// костыль чтоб заинициализировать тему при старте
Theme.set(Theme.theme);

import "./style.css";
import player from "Scripts/player.js";
import darkmodeButtonHandler from "Scripts/darkmodeButton.js";

window.onload = () => {
    player();
    darkmodeButtonHandler();
};
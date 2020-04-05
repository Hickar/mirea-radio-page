const darkmodeButtonHandler = () => {
    const theme = document.documentElement.dataset.theme === "" ? "dark" : "";

    document.documentElement.dataset.theme = theme;
    document.querySelectorAll(".player__canvassvg .body").forEach(element => {
        element.dataset.theme = theme;
    });
};

export default darkmodeButtonHandler;
const darkmodeButtonHandler = () => {
    document.querySelector(".navbar__darkmodebutton").addEventListener("click", () => {
        const theme = document.documentElement.dataset.theme === "" ? "dark" : "";

        document.documentElement.dataset.theme = theme;
        document.querySelectorAll(".player__hiddensvg .body").forEach(element => {
            element.dataset.theme = theme;
        });
    });
};

export default darkmodeButtonHandler;
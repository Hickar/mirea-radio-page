const darkmodeButtonHandler = () => {
    document.querySelector(".navbar__darkmodebutton").addEventListener("click", () => {
        if (document.documentElement.dataset.theme === "") {
            document.documentElement.dataset.theme = "dark";
        } else {
            document.documentElement.dataset.theme = "";
        }
    });
};

export default darkmodeButtonHandler;
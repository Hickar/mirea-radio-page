const darkmodeButtonHandler = () => {
    document.querySelector(".navbar__darkmodebutton").addEventListener("click", () => {
        if (document.documentElement.dataset.theme === "") {
            document.documentElement.dataset.theme = "dark";
        } else {
            document.documentElement.dataset.theme = "";
        }

        const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background-color");
        console.log(backgroundColor);
        document.querySelectorAll(".section__delimiter").forEach(delimiter => {
            delimiter.getSVGDocument().getElementById("fill").setAttribute("fill", backgroundColor);
        });
    });
};

export default darkmodeButtonHandler;
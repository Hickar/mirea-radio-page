const drawInlineSVG = (svg, ctx, x, y, degrees) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(degrees * Math.PI / 180 || 0);
    ctx.drawImage(svg, -svg.width / 2, -svg.height / 2);
    ctx.restore();
};

const loadSVG = (svg) => {
    const url = new XMLSerializer().serializeToString(svg);
    let img  = new Image();
    img.src = "data:image/svg+xml; charset=utf8, "+encodeURIComponent(url);
    return img;
};

const loadSVGs = (elements) => {
    return new Promise(resolve => {
        let images = {},
            imagesLoaded = 0;
        for (const element of elements) {
            Object.defineProperty(images, element.id, {
                value: loadSVG(element)
            });
            images[element.id].onload = () => {
                imagesLoaded++;
                if (imagesLoaded === elements.length) {
                    resolve(images);
                }
            }
        }
    })
};

const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
};

const showPopup = (text) => {
    const popup = document.createElement("div"),
        popupText = document.createElement("p");
    popup.className = "popup no-opacity";
    popupText.className = "popup__text";
    popupText.innerHTML = text;
    document.body.appendChild(popup).appendChild(popupText);
    setTimeout(() => popup.classList.toggle("no-opacity"), 50);
    setTimeout(() => {
        popup.classList.toggle("no-opacity");
        setTimeout(() => document.body.removeChild(popup), 100);
    }, 2500);
};

// const drawRect = (x, y, width, height, degrees, style, strokeStyle) => {
//     this.ctx.save();
//     this.ctx.translate(x, y);
//     this.ctx.rotate(degrees * Math.PI / 180);
//     this.ctx.fillStyle = style;
//     if (strokeStyle) {
//         this.ctx.lineWidth = 10;
//         this.ctx.strokeStyle = strokeStyle;
//         this.ctx.stroke();
//     }
//     this.ctx.fillRect(-width / 2, -height / 2, width, height);
//     this.ctx.restore();
// };

const isEmpty = (str) => {
    return (!str || str !== undefined);
};

export { drawInlineSVG, loadSVGs, isEmpty, copyToClipboard, showPopup };
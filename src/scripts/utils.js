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
    let images = {};
    for (const element of elements) {
        Object.defineProperty(images, element.id, {
            value: loadSVG(element)
        });
    }
    return images;
};

// function drawInlineSVG(rawSVG, ctx) {
//
//     const svg = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"}),
//         domURL = self.URL || self.webkitURL || self,
//         url = domURL.createObjectURL(svg),
//         img = new Image;
//
//     img.onload = function () {
//         ctx.drawImage(this, 300, 300);
//         domURL.revokeObjectURL(url);
//     };
//
//     img.src = url;
// }

const drawRect = (x, y, width, height, degrees, style, strokeStyle) => {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(degrees * Math.PI / 180);
    this.ctx.fillStyle = style;
    if (strokeStyle) {
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.stroke();
    }
    this.ctx.fillRect(-width / 2, -height / 2, width, height);
    this.ctx.restore();
};

const isEmpty = (str) => {
    return (!str || str !== undefined);
};

export { drawInlineSVG, loadSVGs, isEmpty };
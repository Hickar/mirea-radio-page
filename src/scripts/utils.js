const drawSVG = (svg, ctx, x, y, degrees) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(degrees * Math.PI / 180 || 0);
    ctx.drawImage(svg, -svg.width / 2, -svg.height / 2);
    console.log("I've been called2!");
    ctx.restore();
};

const drawInlineSVG = (svg, ctx, x, y, degrees) => {
    const svgURL = new XMLSerializer().serializeToString(svg);
    let img  = new Image();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(degrees * Math.PI / 180 || 0);
    img.src = "data:image/svg+xml; charset=utf8, "+encodeURIComponent(svgURL);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    console.log("I've been called!");
    ctx.restore();
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

export { drawSVG, drawInlineSVG, isEmpty };
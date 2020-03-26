const drawSVG = (svg, ctx, x, y, degrees) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(degrees * Math.PI / 180 || 0);
    ctx.drawImage(svg, -svg.width / 2, -svg.height / 2);
    ctx.restore();
};

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

export { drawSVG, isEmpty };
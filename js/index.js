class Pen {
    constructor(graphSel) {
         this.graph = document.querySelector(graphSel)
         this.ctx = this.graph.getContext('2d')
    }

    drawRect(x, y, width, height, type, rectColor) {
        if (type === 'fill') {
            rectColor && (this.ctx.fillStyle = rectColor)
            this.ctx.fillRect(x, y, width, height)
            this.ctx.fill()
        } else if (type === 'stroke') {
            rectColor && (this.ctx.strokeStyle = rectColor)
            this.ctx.strokeRect(x, y, width, height)
            this.ctx.stroke()
        } else if (type === 'clear') {
            this.ctx.clearRect(x, y, width, height)
        }

        return this
    }

    fillRect(x, y, width, height, color) {
        color && (this.ctx.fillStyle = color)
        this.ctx.fillRect(x, y, width, height)
    }

    drawLine(sx, sy, ex, ey, color, lineDash) {
        this.ctx.beginPath()
        lineDash && (this.ctx.setLineDash(lineDash))
        color && (this.ctx.strokeStyle = color)

        this.ctx.moveTo(sx, sy)
        this.ctx.lineTo(ex, ey)
        this.ctx.stroke()
        return this
    }

    drawCandle(sx, sy, width, height, type, color, direction , candleSY, candleEY) {
        // 先保存 竖线的x坐标
        let lineX = sx + Math.floor(width / 2)

        // 蜡烛图 竖线的 y 坐标应该是由数据确定的, 这里先留个位置
        this.drawRect(sx, sy, width, height, type, color)

        if (type === 'stroke') {
            if (direction === 'up') {
                this.drawLine(lineX, sy - 20, lineX, sy, color)
            } else {
                this.drawLine(lineX, sy + height, lineX, sy + height + 20, color)
            }
            return this
        }

        this.drawLine(lineX, sy - 20, lineX, sy + height + 20, color)
        return this
    }
}
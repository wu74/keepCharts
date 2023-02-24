class Kline {
  constructor(canvas, kLineData, mask) {
    this.c = document.querySelector(canvas)
    this.container = this.c.parentNode

    this.mask = document.querySelector(mask)
    this.cWidth = this.c.clientWidth
    this.cHeight = this.c.clientHeight
    this.ctx = this.c.getContext('2d')
    this.kLineData = kLineData
    this.defaultRenderNo = 30
    this.yAxisInterval = 2

    this.timer = null

    this.moveDay = 0

    this.mousemoveListener = null
    this.containerMousemoveFn = null
    this.canvaswheelFn = null

    this.zoom = 1
    this.enlarge = 1

    this.startIndex = 0
    this.endIndex = this.defaultRenderNo


    this.initGraph()
    this.renderData = this.kLineData.slice(this.startIndex, this.endIndex)
    this.render(this.renderData)

    this.bindEvent()
  }

  initGraph() {
    this.ctx.strokeStyle = '#bfbfbf'
    this.ctx.setLineDash([])

    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(0, this.cHeight)
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.beginPath()
    this.ctx.moveTo(0, this.cHeight)
    this.ctx.lineTo(this.cWidth, this.cHeight)
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.beginPath()
    this.ctx.moveTo(this.cWidth, this.cHeight)
    this.ctx.lineTo(this.cWidth, 0)
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.beginPath()
    this.ctx.moveTo(this.cWidth, 0)
    this.ctx.lineTo(0, 0)
    this.ctx.stroke()
    this.ctx.closePath()

    // 画背景上的网格线  y轴 3份 2条  x轴 6份 5条
    let yAxisLineWidth = this.cHeight / 3
    let xAxisLineWidth = this.cWidth / 6

    let yi = 0
    let yWidth = 0
    let xi = 0
    let xWidth = 0

    while (yi < 2) {
      this.ctx.strokeStyle = '#f6f6f6'
      this.ctx.beginPath()
      this.ctx.moveTo(0, yWidth + yAxisLineWidth)
      this.ctx.lineTo(this.cWidth, yWidth + yAxisLineWidth)
      this.ctx.stroke()
      this.ctx.closePath()

      yi++
      yWidth += yAxisLineWidth
    }


    while (xi < 5) {
      this.ctx.strokeStyle = '#f6f6f6'
      this.ctx.beginPath()
      this.ctx.moveTo(xWidth + xAxisLineWidth, 0)
      this.ctx.lineTo(xWidth + xAxisLineWidth, this.cHeight)
      this.ctx.stroke()
      this.ctx.closePath()

      xi++
      xWidth += xAxisLineWidth
    }
  }

  render(list) {
    this.dayNo = list.length
    this.dayWidth = this.cWidth / this.dayNo

    this.yAxisMax = list.map(item => +item.kline.high)
      .sort((a, b) => a - b)
      .pop() + this.yAxisInterval

    this.yAxisMin = list.map(item => +item.kline.low)
      .sort((a, b) => b - a)
      .pop() - this.yAxisInterval

    this.yUnit = (this.cHeight / (this.yAxisMax - this.yAxisMin)).toFixed(1)

    this.drawYlabel()

    list.forEach((day, idx) => {
      let renderParams = this.dataToCoordinate(day, idx)
      this.drawCancle(renderParams)

      if ((idx + 1) % 5 === 0) {
        this.drawXlabel(day, idx)
      }
    })
  }

  drawYlabel() {
    let val = (this.yAxisMax - this.yAxisMin) / 3

    let height = +this.cHeight / 3

    let curVal = this.yAxisMax
    this.ctx.fillStyle = '#202020'
    this.ctx.font = "normal 12px serif"
    this.ctx.textBaseline = 'middle'
    this.ctx.textAlign = 'left'

    this.ctx.beginPath()
    this.ctx.textBaseline = 'top'
    this.ctx.fillText(this.yAxisMax, 0, 20)
    this.ctx.closePath()

    curVal -= val

    this.ctx.beginPath()
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(curVal.toFixed(1), 0, height)
    this.ctx.closePath()

    curVal -= val
    this.ctx.beginPath()
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(curVal.toFixed(1), 0, height * 2)
    this.ctx.closePath()

    this.ctx.beginPath()
    this.ctx.textBaseline = 'bottom'
    this.ctx.fillText(this.yAxisMin, 0, this.cHeight - 20)
    this.ctx.closePath()
  }

  drawXlabel(data, idx) {
    this.ctx.beginPath()
    this.ctx.fillStyle = '#202020'
    this.ctx.fillText(data.date, idx * this.dayWidth, this.cHeight)
    this.ctx.closePath()
  }

  dataToCoordinate(data, idx) {
    const { open, close, high, low } = data.kline
    let isRise = +close - +open > 0

    let x
    let y
    let height
    let lineStartX
    let lineStartY
    let lineEndY

    let color = isRise ? '#ff5959' : '#0aab62'

    let baseY = isRise ? +close : +open

    y = (((this.yAxisMax - baseY) * this.yUnit)).toFixed(1)

    let p1 = isRise ? +close : +open
    let p2 = isRise ? +open : +close

    height = (p1 - p2) * this.yUnit

    lineStartY = (this.yAxisMax - +high) * this.yUnit
    lineEndY = (this.yAxisMax - +low) * this.yUnit

    x = idx * this.dayWidth + 1

    lineStartX = (idx + 1) * this.dayWidth - this.dayWidth * 0.5

    return {
      x,
      y,
      height,
      lineStartX,
      lineStartY,
      lineEndY,
      color,
      isRise
    }
  }

  drawCancle(renderParams) {
    const { x, y, height, lineStartX, lineStartY, lineEndY, color, isRise } = renderParams

    this.ctx.beginPath()
    this.ctx.strokeStyle = renderParams.color
    this.ctx.moveTo(lineStartX, lineStartY)
    this.ctx.lineTo(lineStartX, lineEndY)
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.beginPath()

    if (isRise) {
      this.ctx.strokeStyle = color
      this.ctx.rect(x, y, this.dayWidth - 2, height)
      this.ctx.stroke()
      this.ctx.fillStyle = '#fff'
      this.ctx.fill()
    } else {
      this.ctx.fillStyle = color
      this.ctx.fillRect(x, y, this.dayWidth - 2, height)
      this.ctx.strokeStyle = color
    }

    this.ctx.stroke()
    this.ctx.closePath()
  }

  drawDottedLineAndMask(e) {
    let maskWidth = this.mask.clientWidth

    let x = e.pageX - this.container.offsetLeft
    let y = e.pageY - this.container.offsetTop

    let middleX = this.c.clientWidth * 0.5

    let maskY = x

    if (x > middleX) {
      maskY = x - maskWidth
    }

    this.mask.style.left = maskY + 'px'

    let lineIndex = this.rangeArr.findIndex(item => item[0] <= x && item[1] >= x)

    let dayData = this.renderData[lineIndex]

    this.renderMask(dayData)

    let pos = this.rangeArr[lineIndex]
    let lineX = (pos[0] + pos[1]) / 2

    this.ctx.clearRect(0, 0, this.cWidth, this.cHeight)
    // 先画 y 轴 上的横虚线
    this.ctx.strokeStyle = '#bfbfbf'
    this.ctx.setLineDash([3])

    this.ctx.beginPath()
    this.ctx.moveTo(0, y - 10)
    this.ctx.lineTo(this.cWidth, y - 10)
    this.ctx.stroke()
    this.ctx.closePath()
    // 画 x 轴上的竖虚线
    this.ctx.beginPath()
    this.ctx.moveTo(lineX, 0)
    this.ctx.lineTo(lineX, this.cHeight)
    this.ctx.stroke()
    this.ctx.closePath()
  }

  renderMask(data) {
    this.mask.innerHTML = `
          <p>
            <span>时间</span>
            <span>${data.date}</span>
          </p>
          <p>
            <span>开盘价</span>
            <span">${data.kline.open}</span>
          </p>
          <p>
            <span>收盘价</span>
            <span">${data.kline.close}</span>
          </p>
          <p>
            <span>最高价</span>
            <span">${data.kline.high}</span>
          </p>
          <p>
            <span>最低价</span>
            <span">${data.kline.low}</span>
          </p>
        `
  }

  calculateXAxisSection() {
    let count = 0
    let len = this.renderData.length
    let res = []

    while (count < len) {
      res.push([count * this.dayWidth, (count + 1) * this.dayWidth])
      count++
    }

    this.rangeArr = res
  }

  bindEvent() {
    this.container.addEventListener('mouseenter', this.mouseenterFn.bind(this))
    this.container.addEventListener('mouseleave', this.mouseleaveFn.bind(this))
    this.c.addEventListener('mousedown', this.mousedownFn.bind(this))
    this.c.addEventListener('mouseup', this.mouseupFn.bind(this))
  }

  mouseupFn() {
    this.moveDay = 0
    this.c.removeEventListener('mousemove', this.mousemoveListener)
  }

  mousemoveFn(e) {
    this.drawDottedLineAndMask(e)

    this.initGraph()
    this.render(this.renderData)
  }

  mouseenterFn(e) {
    this.mask.style.display = 'block'
    this.calculateXAxisSection(e)
    this.containerMousemoveFn = this.mousemoveFn.bind(this)
    this.container.addEventListener('mousemove', this.containerMousemoveFn)
    this.canvaswheelFn = this.mousewheelFn.bind(this)
    this.container.addEventListener('wheel', this.canvaswheelFn)
  }

  mousewheelFn(e) {
    let x = e.pageX - this.c.offsetLeft

    let idx = this.rangeArr.findIndex(pos => pos[0] <= x && pos[1] >= x)

    let isEnlarge = e.deltaY < 0

    if (isEnlarge) {
      this.enlarge -= 0.1
      this.defaultRenderNo *= this.enlarge

      this.ctx.clearRect(0, 0, this.cWidth, this.cHeight)

      this.initGraph()

      this.render(this.renderData)
    } else {
      this.zoom += 0.1
      this.defaultRenderNo *= this.zoom
    }
  }

  mouseleaveFn() {
    this.mask.style.display = 'none'
    this.ctx.clearRect(0, 0, this.cWidth, this.cHeight)
    this.container.removeEventListener('mousemove', this.containerMousemoveFn)
    this.container.removeEventListener('wheel', this.canvaswheelFn)
    this.initGraph()
    this.render(this.renderData)
  }

  canvasMousemoveFn(e) {
    let moveX = e.pageX - this.c.offsetLeft

    let direction = moveX - this.startX > 0

    let movedDistance = Math.abs(moveX - this.startX)

    let day = Math.ceil(movedDistance / this.dayWidth)

    if (movedDistance >= this.dayWidth && movedDistance < this.dayWidth * 2) {
      if (direction) {
        if (this.startIndex <= 1) {
          console.log('到头了 不能再左拉了');
          this.startIndex = 0
          return
        }

        if (movedDistance >= this.dayWidth) {
          this.startIndex -= day
          this.endIndex -= day
        }

      } else {
        if (this.endIndex >= this.kLineData.length - 1) {
          console.log('到头了 不能再右拉了');
          return
        }

        if (movedDistance >= this.dayWidth) {
          this.startIndex += day
          this.endIndex += day
        }
      }
      this.renderData = this.kLineData.slice(this.startIndex, this.endIndex)

      this.initGraph()

      this.render(this.renderData)

      this.startX = moveX
    }
  }

  mousedownFn(e) {
    this.mousemoveListener = this.canvasMousemoveFn.bind(this)
    this.startX = e.pageX - this.c.offsetLeft
    this.c.addEventListener('mousemove', this.mousemoveListener)
  }
}
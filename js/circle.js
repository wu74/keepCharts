class Circle {
  constructor(pos, ctx, canvas) {
    this.x = pos.x
    this.y = pos.y
    this.r = pos.r
    this.ctx = ctx
    this.canvas = canvas
    this.style = {}
    this.canvasLeft = this.canvas.getBoundingClientRect().left
    this.canvasTop = this.canvas.getBoundingClientRect().top

    this.initEvent()
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = '#333'
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    this.ctx.stroke()
    this.ctx.fillStyle = this.style.fillStyle || '#fff'
    this.ctx.fill()
    this.ctx.closePath()
  }

  initEvent() {
    const mousedownFn = e => {
      let isInCircle = this.clickInCircle(e)

      if (isInCircle) {
        this.canvas.addEventListener('mousemove', mousemoveFn)
      }
    }

    const mousemoveFn = e => {
      this.onDrag(e)
    }

    const mouseupFn = () => {
      this.canvas.removeEventListener('mousemove', mousemoveFn)
    }

    this.canvas.addEventListener('mousedown', mousedownFn)
    this.canvas.addEventListener('mouseup', mouseupFn)


    this.canvas.addEventListener('click', (e) => {
      let isInCircle = this.clickInCircle(e)

      if (isInCircle) {
        this.onClick()
      }
    })
  }

  setAttr(opts) {
    if (opts.type === 'position') {
      const { x, y } = opts
      this.x = x
      this.y = y
    } else if (opts.type === 'color') {
      this.style.fillStyle = opts.color
    }
  }

  clickInCircle(e) {
    let p = {
      x: e.clientX - this.canvasLeft,
      y: e.clientY - this.canvasTop
    }

    let dis = Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y))

    if (dis <= this.r) {
      return true
    }

    return false
  }

  onClick() { }

  onDrag() { }
}
class commonDrag {
    constructor(sel, options) {
        this.dragDom = document.querySelector(sel)

        this.dragDom.style.userSelect = 'none'
        this.dragDom.style.position = 'relative'

        this.options = options

        this.startPos = {}

        if (this.options.bindEventImmediately) {
            this.bindEvent()
        }
    }

    bindEvent() {
        // 执行 开始拖拽前 钩子函数
        this.beforeDrag()
        // 判断是否是移动端 或者 PC端
        let isMobile = this.isMobile()

        // 初始化事件名称
        let startEventName = isMobile ? 'touchstart' : 'mousedown'
        let moveEventName = isMobile ? 'touchmove' : 'mousemove'
        let endEventName = isMobile ? 'touchend' : 'mouseup'

        const dragStart = e => {
            // 执行 拖拽开始 钩子函数
            this.onDragStart()

            // 如果限制了拖拽范围, 计算边界值
            if (this.options.containerClass) this.calculateDragRange()

            // 记录下第一次点击时候的坐标
            if (isMobile) {
                const { clientX, clientY } = e.touches[0]

                let x = clientX
                let y = clientY

                if (this.options.containerClass) {
                    x = x - this.graph.offsetLeft - this.dragDom.offsetLeft
                    y = y - this.graph.offsetTop - this.dragDom.offsetTop
                }

                this.startPos = {
                    x,
                    y
                }
            } else {
                const { pageX, pageY } = e

                let x = pageX
                let y = pageY

                if (this.options.containerClass) {
                    x = x - this.graph.offsetLeft - this.dragDom.offsetLeft
                    y = y - this.graph.offsetTop - this.dragDom.offsetTop
                }

                this.startPos = {
                    x,
                    y
                }
            }

            // 添加 move 事件
            document.addEventListener(moveEventName, dragMove)
        }

        const dragMove = e => {
            let nowPos

            if (isMobile) {
                const { clientX, clientY } = e.touches[0]

                nowPos = {
                    x: clientX,
                    y: clientY
                }
            } else {
                const { pageX, pageY } = e

                nowPos = {
                    x: pageX,
                    y: pageY
                }

            }

            let direction = this.calculateDirection(nowPos)

            if (this.options.dragDirection == 'none' || direction === this.options.dragDirection) {
                this.calculateMove(nowPos)
            }
        }

        const dragEnd = e => {
            // 执行 拖拽结束 钩子函数
            this.onDragEnd()

            // 解绑事件
            document.removeEventListener(moveEventName, dragMove)
        }

        this.dragDom.addEventListener(startEventName, dragStart)
        document.addEventListener(endEventName, dragEnd)
    }

    calculateDragRange() {
        if (!this.options.containerClass) return

        let graph = document.querySelector(this.options.containerClass)
        graph.style.position = 'relative'
        this.graph = graph

        let graphWidth = graph.clientWidth
        let graphHeight = graph.clientHeight

        const dragWidth = this.dragDom.clientWidth
        const dragHeight = this.dragDom.clientHeight

        this.maxX = graphWidth - dragWidth
        this.maxY = graphHeight - dragHeight
    }

    calculateDirection(endPos) {
        if (this.options.containerClass) {
            const w = this.dragDom.offsetWidth
            const h = this.dragDom.offsetHeight
            var x = (endPos.x - this.dragDom.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1),
                y = (endPos.y - this.dragDom.offsetTop - (h / 2)) * (h > w ? (w / h) : 1),
                // 上(0) 右(1) 下(2) 左(3)
                direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4

            return ['up', 'right', 'down', 'left'][direction]
        } else {
            const { x, y } = this.startPos

            // if (endPos.x - x > 0) {
            //     return 'right'
            // } else if (endPos.x - x < 0) {
            //     return 'left'
            // } else 
            if (endPos.y - y > 0) {
                return 'down'
            } else if (endPos.y - y < 0) {
                return 'up'
            }
        }

    }

    calculateMove(nowPos) {
        let x = nowPos.x - this.startPos.x
        let y = nowPos.y - this.startPos.y

        // 拖拽是否限制范围
        if (this.options.containerClass) {
            x = x - this.graph.offsetLeft
            y = y - this.graph.offsetTop

            // 边界值处理
            if (x < 0) x = 0
            if (y < 0) y = 0

            if (x > this.maxX) x = this.maxX
            if (y > this.maxY) y = this.maxY
        }
        // 执行 拖拽中 钩子函数
        if (this.options.customMoveFn) {
            this.onDragMove(x, y)
            return
        }

        this.dragDom.style.top = y + 'px'
        this.dragDom.style.left = x + 'px'
    }

    isMobile() {
        return navigator.userAgent.includes('Mobile') ||
            navigator.userAgent.includes('Android') ||
            navigator.userAgent.includes('iPhone')
    }

    beforeDrag() { }

    onDragStart() { }

    onDragMove() { }

    onDragEnd() { }
}
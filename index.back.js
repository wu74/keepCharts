class DragElement {
    constructor(dragSelector, containerSelector) {
        // 获取 DOM 节点
        const graph = document.querySelector(containerSelector)
        this.dragDom = document.querySelector(dragSelector)

        this.graphLeft = graph.offsetLeft
        this.graphTop = graph.offsetTop

        this.nodeList = Array.from(graph.children)

        this.count = 0

        // x, y轴最大距离  画布的宽高 减去 拖拽元素自身的宽高即为能拖动的最大距离
        this.maxX = graph.clientWidth - this.dragDom.clientWidth
        this.maxY = graph.clientHeight - this.dragDom.clientHeight

        this.init()
    }

    init() {
        // 存储 move 事件, 方便解绑
        let fn = null

        this.dragDom.addEventListener('mousedown', e => {
            // 存储点击时  左上角的坐标
            this.startX = e.pageX - this.graphLeft - this.dragDom.offsetLeft
            this.startY = e.pageY - this.graphTop - this.dragDom.offsetTop

            // 提高当前点击元素 优先级
            this.nodeList.forEach(div => {
                div.style.zIndex = '0'
            })
            
            this.count++

            this.dragDom.style.zIndex += this.count

            fn = this.calculate.bind(this, ...arguments)

            document.addEventListener('mousemove', fn)
        })

        document.addEventListener('mouseup', e => {
            document.removeEventListener('mousemove', fn)
        })
    }

    calculate(e) {
        let x = e.pageX - this.graphLeft - this.startX
        let y = e.pageY - this.graphTop - this.startY

        // 边界值处理
        if (x <= 0) x = 0
        if (y <= 0) y = 0
        if (x >= this.maxX) x = this.maxX
        if (y >= this.maxY) y = this.maxY

        this.dragDom.style.top = y + 'px'
        this.dragDom.style.left = x + 'px'
    }
}
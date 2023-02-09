class DragElement {
    constructor(dragSelector, containerSelector) {
        // 获取 DOM 节点
        const graph = document.querySelector(containerSelector)
        this.dragDom = document.querySelector(dragSelector)
        
        // x, y轴最大距离  画布的宽高 减去 拖拽元素自身的宽高即为能拖动的最大距离
        this.maxX = graph.clientWidth - this.dragDom.clientWidth
        this.maxY = graph.clientHeight - this.dragDom.clientHeight
        
        // 拖拽元素离body的距离
        this.dragOffsetX = this.dragDom.offsetLeft
        this.dragOffsetY = this.dragDom.offsetTop

        this.init()
    }

    init() {
        // 存储 move 事件, 方便解绑
        let fn = null

        this.dragDom.addEventListener('mousedown', e => {
            // 存储 第一次鼠标点击 在DOM内的坐标
            this.offsetX = e.offsetX
            this.offsetY = e.offsetY

            fn = this.calculate.bind(this, ...arguments)

            document.addEventListener('mousemove', fn)
        })

        document.addEventListener('mouseup', e => {
            document.removeEventListener('mousemove', fn)
        })
    }

    calculate(e) {
        // 计算拖拽的 DOM 左上角的坐标
        const moveX = e.pageX - this.offsetX
        const moveY = e.pageY - this.offsetY
        // 减去一开始的坐标, 为移动的距离
        let x = moveX - this.dragOffsetX
        let y = moveY - this.dragOffsetY

        // 边界值处理
        if (x <= 0) x = 0
        if (y <= 0) y = 0
        if (x >= this.maxX) x = this.maxX
        if (y >= this.maxY) y = this.maxY

        this.dragDom.style.top = y + 'px'
        this.dragDom.style.left = x + 'px'
    }
}

console.log(1111);
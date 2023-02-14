let count = 0         // 层级计数
let maxMapping = {}   // 边界值
let colors = [        // 颜色
    '#409EFF',
    '#67C23A',
    '#E6A23C',
    '#F56C6C',
    '#909399'
]
// 存储事件
let mousemoveListener = null
// 之前不用数组, 会造成该变量存储的永远是最后一个节点的事件, 需要分开存储每一个节点单独的事件
let mousedownListener = []
let mouseupListener = null

class DragElement {
    constructor(containerSelector, childrenNum) {
        // 获取 容器 节点
        this.graph = document.querySelector(containerSelector)

        this.graphLeft = this.graph.offsetLeft
        this.graphTop = this.graph.offsetTop

        // 根据传入的数量创建子节点
        this.creatElement(childrenNum)

        // 存储子元素
        this.nodeList = Array.from(this.graph.children)

        // 绑定事件
        this.bindEvent()
    }

    unBindEvent() {
        // 防止重复绑定
        document.removeEventListener('mouseup', mouseupListener)

        const children = this.nodeList

        for (let i = 0; i < children.length; i++) {
            // 解绑每个元素的按下事件
            children[i].removeEventListener('mousedown', mousedownListener[i])
        }

        // 清空存储数组, 防止单个节点存储多个重复事件
        mousedownListener = []
    }

    bindEvent() {
        const children = this.nodeList

        for (let i = 0; i < children.length; i++) {
            // 存储边界值
            let className = children[i].className
            if (!maxMapping[className]) maxMapping[className] = [0, 0]
            let x = this.graph.clientWidth - children[i].clientWidth
            let y = this.graph.clientHeight - children[i].clientHeight
            maxMapping[className] = [x, y]

            let tempFn = mousedownFn.bind(this, [...arguments].concat(children[i]))
            mousedownListener.push(tempFn) 

            // 绑定按下事件
            children[i].addEventListener('mousedown', tempFn)
        }

        mouseupListener = () => {
            // 抬起时解绑事件
            document.removeEventListener('mousemove', mousemoveListener)
        }
        document.addEventListener('mouseup', mouseupListener)

        function mousedownFn(elem, e) {
            let curNode = elem[0]

            // 存储点击时  左上角的坐标
            this.startX = e.pageX - this.graphLeft - curNode.offsetLeft
            this.startY = e.pageY - this.graphTop - curNode.offsetTop

            // 设置层级
            count++
            curNode.style.zIndex = count

            // 绑定移动事件
            mousemoveListener = mousemoveFn.bind(this, ...arguments)
            document.addEventListener('mousemove', mousemoveListener)
        }

        function mousemoveFn() {
            this.calculate.call(this, ...arguments)
        }
    }

    creatElement(length, type) {
        let frag = document.createDocumentFragment()

        let startIdx = type === 'add' ? this.nodeList?.length : 0
        let endIdx = type === 'add' ? startIdx + length : length

        for (let i = startIdx; i < endIdx; i++) {
            const tempDiv = document.createElement('div')
            tempDiv.className = `rect drag${i + 1}`
            tempDiv.innerText = `div${i + 1}`
            tempDiv.style.backgroundColor = colors[endIdx - i]
            tempDiv.style.top = i * 50 + 'px'
            tempDiv.style.cursor = 'pointer'
            tempDiv.style.userSelect = 'none'
            frag.appendChild(tempDiv)
        }

        this.graph.appendChild(frag)

        // 如果是新增节点, 更新子节点列表
        type === 'add' && (this.nodeList = Array.from(this.graph.children))
    }

    calculate() {
        let curNode = arguments[0][0]
        let e = arguments[2]
        let x = e.pageX - this.graphLeft - this.startX
        let y = e.pageY - this.graphTop - this.startY

        const [maxX, maxY] = maxMapping[curNode.className]
        // 边界值处理
        if (x <= 0) x = 0
        if (y <= 0) y = 0
        if (x >= maxX) x = maxX
        if (y >= maxY) y = maxY

        curNode.style.top = y + 'px'
        curNode.style.left = x + 'px'
    }

    addNode(length = 1) {
        this.creatElement(length, 'add')
        this.unBindEvent()
        this.bindEvent()
    }

    getNodes() {
        return this.nodeList
    }

    deleteNode(sel) {
        const children = this.nodeList

        children.forEach(child => {
            if (child.className.includes(sel)) {
                child.remove()
            }
        })
    }

    queryNode(sel) {
        return this.graph.querySelector(sel)
    }
}
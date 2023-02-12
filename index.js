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
let mousedownListener = null

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

    bindEvent() {
        const children = this.nodeList

        for( let i = 0; i < children.length; i++) {
            // 存储边界值
            let className = children[i].className
            if (!maxMapping[className]) maxMapping[className] = [0, 0]
            let x = this.graph.clientWidth - children[i].clientWidth
            let y = this.graph.clientHeight - children[i].clientHeight
            maxMapping[className] = [x, y]

            mousedownListener = mousedownFn.bind(this, [...arguments].concat(children[i]))
            
            // 绑定按下事件
            children[i].addEventListener('mousedown', mousedownListener)
        }
        
        document.addEventListener('mouseup', () => {
            // 抬起时解绑事件
            document.removeEventListener('mousemove', mousemoveListener)
            document.removeEventListener('mousedown', mousedownListener)
        })

        function mousedownFn(elem, e) {
            console.log('执行了一次');
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

    creatElement(length) {
        let frag = document.createDocumentFragment()

        for (let i = 0; i < length; i++) {4
            const tempDiv = document.createElement('div')
            tempDiv.className = `rect drag${i + 1}`
            tempDiv.innerText = `div${i + 1}`
            tempDiv.style.backgroundColor = colors[length - i]
            tempDiv.style.top = i * 50 + 'px'
            tempDiv.style.cursor = 'pointer'
            tempDiv.style.userSelect = 'none'
            frag.appendChild(tempDiv)
        }

        this.graph.appendChild(frag)
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
}
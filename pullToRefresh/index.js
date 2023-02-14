class pullToRefresh {
    constructor(containerSel, options) {
        // 初始化容器
        this.contentDom = document.querySelector(containerSel)

        // 保存配置和回调
        this.options = options

        // 初始化 DOM 结构
        this.initDom()

        this.totalPullNum = 0
        this.state = null

        // 初始化loading DOM 的高度, 已下拉值
        this.headHeight = this.options.headHeight || 40

        // 绑定事件
        this.bindEvent()
    }

    initDom() {
        // 创建loading DOM 的容器
        let headDom = document.createElement('div')
        headDom.className = 'head_dom'
        headDom.style.cssText = `
            position: relative;
            overflow: hidden;
            background-color: #fafbfc;
        `
        this.headDom = headDom

        // 创建用户自己的 DOM 的容器
        let contentDom = document.createElement('div')
        contentDom.className = 'content_dom'

        // 把用户的dom 移入到容器里面
        let children = this.contentDom.children
        let len = children.length
        while (len) {
            contentDom.appendChild(children[0])
            len--
        }

        // 创建 loading DOM
        let loadingDom = document.createElement('div')
        loadingDom.innerText = this.options.pullingText
        loadingDom.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${this.options.headHeight}px;
            font-size: 12px;
            text-align: center;
            line-height: ${this.options.headHeight}px;
        `
        this.loadingDom = loadingDom
        headDom.appendChild(loadingDom)

        // 添加到 根容器
        this.contentDom.appendChild(headDom)
        this.contentDom.appendChild(contentDom)
    }


    setState(state) {
        if (state === 'finish') {
            this.loadingDom.innerHTML = this.options.completeText

            setTimeout(() => {
                this.headDom.style.transition = 'height 0.5s'
                this.headDom.style.height = '0px'
            }, 1000);
        }

        if (state === 'failed') {
            alert('刷新失败, 请重试')
            this.headDom.style.transition = 'height 0.2s'
            this.headDom.style.height = '0px'
        }

        // 重置部分初始值
        this.totalPullNum = 0
    }

    bindEvent() {
        // 判断是否是移动端 或者 PC端
        let isMobile = this.getUserAgant()

        // 初始化事件名称
        let startEventName = isMobile ? 'touchstart' : 'mousedown'
        let endEventName = isMobile ? 'touchend' : 'mouseup'
        let moveEventName = isMobile ? 'touchmove' : 'mousemove'


        if (!isMobile) this.contentDom.style.userSelect = 'none'

        const touchMove = e => {
            let isVerticalScroll

            if (isMobile) {
                const { clientX, clientY } = e.touches[0]

                let x = clientX - this.startX
                let y = clientY - this.startY

                isVerticalScroll = Math.abs(x) < Math.abs(y)
            } else {
                const { pageY } = e

                let y = pageY - this.startY

                isVerticalScroll = y > 0
            }


            if (isVerticalScroll) {

                // 简陋的阻力值版本
                let scrollHeight = 1
                if (this.totalPullNum > this.headHeight * 0.5 &&
                    this.totalPullNum < this.headHeight * 2) {
                    scrollHeight = 0.5
                } else if (this.totalPullNum > this.headHeight * 2) {
                    scrollHeight = 0.25
                }

                if (this.totalPullNum > this.headHeight * 0.8) {
                    this.loadingDom.innerHTML = this.options.canReleaseText
                }

                // 计算滚动距离
                this.totalPullNum += scrollHeight

                this.headDom.style.height = this.totalPullNum + 'px'
            }
        }

        const touchEnd = () => {
            // PC端松开后要解绑move事件 要不然会触发滚动
            if (!isMobile) document.removeEventListener('mousemove', touchMove)

            // 当前下拉距离超过 headHeight 需要复原高度
            if (this.totalPullNum > this.headHeight) {
                this.headDom.style.transition = 'height 0.2s'
                this.headDom.style.height = this.headHeight + 'px'
            }

            // 有效滚动的情况下才去执行回调
            if (this.totalPullNum) {
                this.loadingDom.innerHTML = this.options.refreshingText
                this.onRefresh()
            }
        }

        const touchStart = e => {
            if (isMobile) {
                const { clientX, clientY } = e.touches[0]
                this.startX = clientX
                this.startY = clientY
            } else {
                const { pageY } = e
                this.startY = pageY
            }


            // 清空 headDom transiton  初始化 loadingDom 文本
            this.loadingDom.innerHTML = this.options.pullingText
            this.headDom.style.transition = ''

            document.addEventListener(moveEventName, touchMove)
        }

        document.addEventListener(startEventName, touchStart)
        document.addEventListener(endEventName, touchEnd)
    }

    onRefresh() { }

    getUserAgant() {
        return navigator.userAgent.includes('Mobile') ||
            navigator.userAgent.includes('Android') ||
            navigator.userAgent.includes('iPhone')
    }
}
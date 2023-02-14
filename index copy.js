class pullToRefresh {
    constructor(containerSel, options) {
        // 初始化容器
        this.contentDom = document.querySelector(containerSel)

        // 保存配置和回调
        this.options = options

        this.initDom()

        this.totalPullNum = 0
        this.state = null


        // 初始化loading DOM 的高度, 已下拉值
        this.headHeight = this.options.headHeight || 40

        // 绑定事件
        this.bindEvent()
    }

    initDom() {
        // loading DOM 的容器
        let headDom = document.createElement('div')
        headDom.className = 'head_dom'
        headDom.style.backgroundColor = '#fafbfc'
        headDom.style.overflow = 'hidden'
        headDom.style.position = 'relative'
        this.headDom = headDom

        // 用户自己的 DOM 的容器
        let contentDom = document.createElement('div')
        contentDom.className = 'content_dom'

        // 把用户的dom 结构 移入到容器里面
        let children = this.contentDom.children
        let len = children.length
        while(len) {
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

        if(state === 'failed') {
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

        if (isMobile) {
            this.bindEventMobile()
        } else {
            this.bindEventPc()
        }
    }

    bindEventMobile() {
        const touchMove = e => {
            const { clientX, clientY } = e.touches[0]

            let x = clientX - this.startX
            let y = clientY - this.startY

            // 是否是纵向滚动
            let isVerticalScroll = Math.abs(x) < Math.abs(y)

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
            // 当前下拉距离超过 headHeight 需要复原高度
            if (this.totalPullNum > this.headHeight) {
                this.headDom.style.transition = 'height 0.2s'
                this.headDom.style.height = this.headHeight + 'px'
            }
            this.loadingDom.innerHTML = this.options.refreshingText
            this.onRefresh()
        }

        const touchStart = e => {
            const { clientX, clientY } = e.touches[0]
            // 保存触摸点
            this.startX = clientX
            this.startY = clientY

            // 清空 headDom transiton  初始化 loadingDom 文本
            this.loadingDom.innerHTML = this.options.pullingText
            this.headDom.style.transition = ''

            document.addEventListener('touchmove', touchMove)
        }

        document.addEventListener('touchstart', touchStart)
        document.addEventListener('touchend', touchEnd)
    }
    
    bindEventPc() {
        this.contentDom.style.userSelect = 'none'
        const dragStart = e => {
            const { pageY } = e
            // 保存触摸点
            this.startY = pageY

            // 清空 headDom transiton  初始化 loadingDom 文本
            this.loadingDom.innerHTML = this.options.pullingText
            this.headDom.style.transition = ''

            document.addEventListener('mousemove', dragMove)
        }

        const dragMove = e => {
            const { pageY } = e

            let y = pageY - this.startY

            // 是否是纵向滚动
            let isVerticalScroll = y > 0

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

        const dragEnd = e => {
            document.removeEventListener('mousemove', dragMove)
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



        document.addEventListener('mousedown', dragStart)
        document.addEventListener('mouseup', dragEnd)
    }

    onRefresh() {}

    getUserAgant() {
        return navigator.userAgent.includes('Mobile') ||
               navigator.userAgent.includes('Android') ||
               navigator.userAgent.includes('iPhone')
    }
}
class pullToRefresh {
    constructor(containerSel, cb, options) {
        // 获取容器 DOM
        this.contentDom = document.querySelector(containerSel)
        // 保存配置和回调
        this.options = options
        this.fn = cb
        this.totalScrollTop = 0

        // 创建loading DOM
        this.creatLoadingDom()

        // 初始化最大下拉值, 已下拉值
        this.maxScrollNum = this.loadingDom.clientHeight
        this.scrolledNum = -this.maxScrollNum

        // 绑定事件
        this.bindEvent()
    }

    creatLoadingDom() {
        let div = document.createElement('div')
        div.style.cssText = `
            position: relative;
            width: 100%;
            height: 70px;
            font-size: 12px;
            text-align: center;
            line-height: 70px;
            background-color: #fafbfc;  
        `
        div.innerText = this.options.pullingText
        this.contentDom.insertBefore(div, this.contentDom.children[0])
        this.loadingDom = this.contentDom.children[0]
    }

    bindEvent() {
        const touchMove = e => {
            const { clientX, clientY } = e.touches[0]

            let x = clientX - this.startX
            let y = clientY - this.startY

            // 是否是纵向滚动
            let isVerticalScroll = Math.abs(x) < Math.abs(y)

            if (isVerticalScroll) {
                // 总下拉值 是否 小于 边界值
                if (this.totalScrollTop < this.maxScrollNum) {

                    // 简陋的阻力值版本
                    let scrollHeight = 2
                    if (this.totalScrollTop > this.maxScrollNum * 0.5) {
                        scrollHeight = 0.3
                    }

                    if (this.totalScrollTop > this.maxScrollNum * 0.8) {
                        this.loadingDom.innerHTML = this.options.canReleaseText
                    }

                    // 计算滚动距离
                    this.scrolledNum += scrollHeight
                    this.totalScrollTop += scrollHeight

                    this.contentDom.style.top = this.scrolledNum + 'px'
                }
            }

        }

        const touchEnd = () => {
            this.loadingDom.innerHTML = this.options.refreshingText

            setTimeout(() => {
                this.loadingDom.innerHTML = this.options.completeText
        
                setTimeout(() => {
                    this.contentDom.style.transition = 'top 0.5s'
                    this.contentDom.style.top = '-70px'
        
                    this.contentDom.removeEventListener('touchmove', touchMove)

                    // 重置部分初始值
                    this.totalScrollTop = 0
                    this.scrolledNum = -this.maxScrollNum
                }, 500)
            }, 1000)
        }

        const touchStart = e => {
            const { clientX, clientY } = e.touches[0]
            // 保存触摸点
            this.startX = clientX
            this.startY = clientY
            // 清空上次设置的过渡, 避免第二次下拉的时候 过渡生效
            this.contentDom.style.transition = ''
            this.loadingDom.innerHTML = this.options.pullingText

            document.addEventListener('touchmove', touchMove)
        }

        document.addEventListener('touchstart', touchStart)
        document.addEventListener('touchend', touchEnd)
    }
}
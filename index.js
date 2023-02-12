// 获取 DOM
const contentDom = document.querySelector('.content-wrap')
const loadingDom = document.querySelector('.loading-wrap')
const listDom = document.querySelector('ul')

let startX = null
let startY = null
let totalScrollTop = 0
let endHeight = -70
const maxScrollTop = loadingDom.clientHeight

const touchStart = e => {
    const { clientX, clientY } = e.touches[0]
    startX = clientX
    startY = clientY

    contentDom.addEventListener('touchmove', touchMove)
}

const touchMove = e => {
    
    const { clientX, clientY } = e.touches[0]

    let x = clientX - startX
    let y = clientY - startY

    let isVerticalScroll = Math.abs(x) < Math.abs(y)

    if (isVerticalScroll) {
        // console.log(totalScrollTop, 'totalScrollTop', maxScrollTop, 'maxScrollTop');
        console.log('是否纵向滑动');

        if (totalScrollTop < maxScrollTop) {
            let scrollHeight = 2
            if (totalScrollTop > maxScrollTop * 0.5) {
                scrollHeight = 0.3
            }

            if (totalScrollTop > maxScrollTop * 0.9) {
                loadingDom.innerHTML = '释放立即刷新'
            }

            endHeight += scrollHeight
            totalScrollTop += scrollHeight

            contentDom.style.top = endHeight + 'px'
        }
    }

    contentDom.addEventListener('touchend', e => {
        console.log('注册一次');
        touchEnd()
    })
}

const touchEnd = () => {
    loadingDom.innerHTML = '加载中'
    setTimeout(() => {
        loadingDom.innerHTML = '刷新成功'

        setTimeout(() => {
            contentDom.style.transition = 'top 0.5s'
            contentDom.style.top = '-70px'

            // contentDom.removeEventListener('touchstart', touchStart)
            contentDom.removeEventListener('touchmove', touchMove)
            contentDom.removeEventListener('touchend', touchEnd)
            totalScrollTop = 0
            endHeight = -70
        }, 500)
    }, 1000)
}

function init() {
    contentDom.addEventListener('touchstart', touchStart.bind(this, ...arguments))
}

init()
// 监听事件
// contentDom.addEventListener('touchstart', e => {
//     const { clientX, clientY } = e.touches[0]
//     let startX = clientX
//     let startY = clientY

//     contentDom.addEventListener('touchmove', e => {
//         const { clientX, clientY } = e.touches[0]

//         let x = clientX - startX
//         let y = clientY - startY

//         let isVerticalScroll = Math.abs(x) < Math.abs(y)

//         if (isVerticalScroll) {
//             if (totalScrollTop < maxScrollTop) {
//                 let scrollHeight = 2
//                 if (totalScrollTop > maxScrollTop * 0.5) {
//                     scrollHeight = 0.3
//                 }

//                 if (totalScrollTop > maxScrollTop * 0.9) {
//                     loadingDom.innerHTML = '释放立即刷新'
//                 }
//                 endHeight += scrollHeight
//                 totalScrollTop += scrollHeight

//                 contentDom.style.top = endHeight + 'px'
//             }
//         }

//         contentDom.addEventListener('touchend', e => {
//             loadingDom.innerHTML = '加载中'
//             endHeight -= 1
//             setTimeout(() => {
//                 loadingDom.innerHTML = '刷新成功'
//                 console.log(totalScrollTop, 'totalScrollTop');

//                 setTimeout(() => {
//                     contentDom.style.transition = 'margin-top 0.5s'

//                     contentDom.style.marginTop = '-70px'
//                 }, 500)
//             }, 1000)
//         })
//     })
// })
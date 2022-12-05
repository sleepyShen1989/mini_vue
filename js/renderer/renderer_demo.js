// h函数创建vnode
const vnode = h('div', { class: "title" }, [
    h("h2", null, "some title"),
    h("p", null, "some font")
])

// 通过mount，讲vnode挂在到#app上
mount(vnode, document.getElementById('app'))

// 创建新的vnode
// const vnode1 = h('div', { class: "new_title" }, "new title font")
const vnode1 = h('div', { class: "new_title" }, [
    h("h2", null, "some new title"),
    h("p", null, "some new font")
])

// patch
patch(vnode, vnode1)
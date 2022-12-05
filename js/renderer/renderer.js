const h = (tag, props, children) => {
    return {
        tag,
        props,
        children
    }
}

const mount = (vnode, container) => {
    // vnode.el: 在patch过程中获取元素
    const el = vnode.el = document.createElement(vnode.tag)

    // 处理props
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]

            if (key.startsWith("on")) {
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }

    // 处理children
    if (vnode.children) {
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else {
            vnode.children.forEach(item => {
                mount(item, el)
            })
        }
    }

    // 将el挂载到container上
    container.appendChild(el)
}

const patch = (n1, n2) => {
    if (n1.tag !== n2.tag) {
        const n1ElParent = n1.el.parentElement
        n1ElParent.removeChild(n1.el)
        mount(n2, n1ElParent)
    } else {
        const el = n2.el = n1.el

        // 1. 处理props
        const oldProps = n1.props || {}
        const newProps = n2.props || {}
        // 1.1 添加新props
        for (const key in newProps) {
            const oldValue = oldProps[key]
            const newValue = newProps[key]

            if (newValue !== oldValue) {
                if (key.startsWith("on")) {
                    el.addEventListener(key.slice(2).toLowerCase(), newValue)
                } else {
                    el.setAttribute(key, newValue)
                }
            }
        }
        // 1.2 删除旧props
        for (const key in oldProps) {
            if (key.startsWith("on")) {
                const value = oldProps[key]
                el.removeEventListener(key.slice(2).toLowerCase(), value)
            }

            if (!(key in newProps)) {
                el.removeAttribute(key)
            }
        }

        // 2. 处理children
        const oldChildren = n1.children || []
        const newChildren = n2.children || []

        if (typeof newChildren === 'string') {
            if (typeof oldChildren === 'string') {
                if (newChildren !== oldChildren) {
                    el.textContent = newChildren
                }
            } else {
                el.innerHTML = newChildren
            }
        } else {
            // children为数组
            
            // oldChildren为字符串
            if (typeof oldChildren === 'string') {
                el.innerHTML = ""
                newChildren.forEach((item) => {
                    mount(item, el)
                })
            } else {
                // oldChild [v1,v2,v3]
                // newChild [v1,v4,v5]
                // 没有key的情况
                const commonLength = Math.min(oldChildren.length, newChildren.length)
                for (let i=0;i<commonLength;i++) {
                    patch(oldChildren[i], newChildren[i])
                }

                // length: newChildren > oldChildren (挂载新节点)
                if (newChildren.length > oldChildren.length) {
                    newChildren.slice(oldChildren.length).forEach((item) => {
                        mount(item, el)
                    })
                }

                // length: newChildren < oldChildren (卸载旧节点)
                if (newChildren.length < oldChildren.length) {
                    oldChildren.slice(newChildren.length).forEach((item) => {
                        // unmount
                        el.removeChild(item.el)
                    })
                }
            }
        }
    }
}
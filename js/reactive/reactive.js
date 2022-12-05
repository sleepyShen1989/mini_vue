class Dep {
    constructor() {
        // 不重复
        this.subs = new Set()
    }

    depend() {
        if (activeEffect) {
            this.subs.add(activeEffect)
        }
    }

    notify() {
        this.subs.forEach((effect) => {
            effect()
        })
    }
}

let activeEffect = null
function watchEffect(effect) {
    activeEffect = effect
    // 先立即执行一次
    effect()
    activeEffect = null
}

// weakmap key必须是对象，弱引用 
const targetMap = new WeakMap()
function getDep(target, key) {
    // {
    //     target: {counter: 100,name: 'xyz'}
    //     key: name
    // }
    // targetMap:  { {counter: 100,name: 'xyz'}: new Map() }

    // 根据target 取出对应的map对象
    let depsMap= targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    // targetMap:  { {counter: 100,name: 'xyz'}: { name: class Dep }}
    // targetMap:  { {counter: 100,name: 'xyz'}: { name: subs[] }} 
    // 取出具体的dep对象
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }

    return dep
}

function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const dep = getDep(target, key)
            dep.depend()
            return target[key]
        },
        set(target,key, newValue) {
            const dep = getDep(target, key)
            target[key] = newValue
            dep.notify()
        }
    })
}


const info = reactive({
    counter: 100,
    name: 'xyz'
})

const foo = reactive({
    bar: 'barText'
})

watchEffect(function () {
    console.log('effect1', info.counter * 2, info.name)
})

watchEffect(function () {
    console.log('effect2', info.counter * info.counter)
})

watchEffect(function () {
    console.log('effect3', info.counter + 10, info.name )
})

watchEffect(function () {
    console.log('effect4', foo.bar)
})
// info.counter++
info.name = 'syc'
foo.bar = 456
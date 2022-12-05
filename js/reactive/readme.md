# 选择Proxy的理由

- Proxy劫持的是整个对象，新增属性无需处理
- 劫持更多的api
    - has：in操作符的捕获器
    - deleteProperty：delete操作符的捕获器
    - ..
- 性能
const http = require('http')

const server = http.createServer((req, res) => {
    res.write('hello')
    res.end()
})

server.listen(3000, () => {
    console.log('🚀 服务已启动！')
})
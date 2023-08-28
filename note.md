创建内容： app.post('posts', handler)

更新内容： app.patch('posts/:postId', handler)

删除内容： app.delete('posts/:postId', handler)

获取内容列表：app.get('posts', handler)

获取单个内容： app.get('posts/:postId', handler)

生成密钥和公钥：

- mkdir config
- cd config
- openssl
  - genrsa -out private.key 4096
  - rsa -in private.key -pubout -out public.key
  - exit

后端技术栈：`Express` `TypeScript` `MySQL`

应用架构：

1. app 应用
2. auth 身份验证
3. user 用户
4. post 内容
5. comment 评论
6. digg 点赞

router 路由
controller 控制器
middleware 中间件
service 服务

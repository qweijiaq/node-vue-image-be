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

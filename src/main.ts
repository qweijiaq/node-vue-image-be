import app from './app';
import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql';
import httpServer from './app/app.service';

httpServer.listen(Number(APP_PORT), () => console.log(`🚀 服务已启动！`));

// 测试数据库连接
connection.connect(error => {
  if (error) {
    console.log('数据库连接失败：', error.message);
    return;
  }
  console.log('🚗 数据库连接成功');
});

// const data = [
//   {
//     id: 1,
//     title: '第一',
//     content: '第一个内容',
//   },
//   {
//     id: 2,
//     title: '第二',
//     content: '第二个内容',
//   },
//   {
//     id: 3,
//     title: '第三',
//     content: '第三个内容',
//   },
// ];

// /*
//  * 获取内容列表
//  */
// app.get('/posts', (req: Request, res: Response) => {
//   res.send(data);
// });

// /*
//  * 获取单个内容
//  */
// app.get('/posts/:postId', (req: Request, res: Response) => {
//   const { postId } = req.params;
//   const post = data.filter(item => item.id === Number(postId));
//   res.send(post[0]);
// });

// /*
//  * 创建内容
//  */
// app.post('/posts', (req: Request, res: Response) => {
//   // 获取请求里的数据
//   const { content } = req.body;
//   // 创建响应状态码
//   res.statusCode = 201;
//   // 作出响应
//   res.send({
//     message: `成功创建了内容: ${content}`,
//   });
// });

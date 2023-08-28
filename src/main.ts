import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql';
import httpServer from './app/app.server';

httpServer.listen(Number(APP_PORT), () => console.log(`🚀 服务已启动！`));

// 测试数据库连接
connection.connect(error => {
  if (error) {
    console.log('😈 数据库连接失败：', error.message);
    return;
  }
  console.log('🚗 数据库连接成功');
});

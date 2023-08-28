import express from 'express';
import cors from 'cors';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatar/avatar.router';
import diggRouter from '../digg/digg.router';
import searchRouter from '../search/search.router';
import auditLogRouter from '../audit-log/audit-log.router';
import dashboardRouter from '../dashboard/dashboard.router';
import weixinLoginRouter from '../weixin-login/weixin-login.router';
import productRouter from '../product/product.router';
import paymentRouter from '../payment/payment.router';
import orderRouter from '../order/order.router';
import licenseRouter from '../license/license.router';
import subscriptionRouter from '../subscription/subscription.router';
import downloadRouter from '../download/download.router';
import paymentUrlRouter from '../payment-url/payment-url.router';
import { defaultErrorHandler } from './app.middleware';
import { currentUser } from '../auth/auth.middleware';
import { ALLOW_ORIGIN } from './app.config';

// 创建应用
const app = express();

// 添加 JSON 中间件
app.use(express.json());

// 处理 XML
app.use(express.text({ type: 'text/xml' }));

// 处理 Form
app.use(express.urlencoded({ extended: true }));

// 当前用户
app.use(currentUser);

// 跨域资源共享
app.use(
  cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Count',
  }),
);

// 使用路由
app.use(
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  commentRouter,
  avatarRouter,
  diggRouter,
  searchRouter,
  auditLogRouter,
  dashboardRouter,
  weixinLoginRouter,
  productRouter,
  paymentRouter,
  orderRouter,
  licenseRouter,
  subscriptionRouter,
  downloadRouter,
  paymentUrlRouter,
);

// 默认异常处理器
app.use(defaultErrorHandler);

// 导出应用
export default app;

import axios from 'axios';
import { WEIXIN_API_BASE_URL } from './app.config';

/**
 * HTTP 客户端 微信
 */
export const weixinApiHttpClient = axios.create({
  baseURL: WEIXIN_API_BASE_URL,
});

/**
 * HTTP 客户端
 */
export const httpClient = axios.create();

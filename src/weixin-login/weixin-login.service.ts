import path from 'path';
import fs from 'fs';
import Jimp from 'jimp';
import {
  WEIXIN_WEBSITE_APP_ID,
  WEIXIN_WEBSITE_APP_SECRET,
} from '../app/app.config';
import { weixinApiHttpClient, httpClient } from '../app/app.service';
import { UserData } from '../user/user.service';
import { createAvatar } from '../avatar/avatar.service';

/**
 * 微信登录 获取访问令牌
 */
export interface WeixinAccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope?: string;
  unionId?: string;
}

export const getWeixinAccessToken = async (code: string) => {
  // 查询符
  const accessTokenQueryString = new URLSearchParams({
    appid: WEIXIN_WEBSITE_APP_ID,
    secret: WEIXIN_WEBSITE_APP_SECRET,
    code,
    grant_type: 'authorization_code',
  }).toString();

  // 请求访问令牌
  const { data } = await weixinApiHttpClient.get(
    `oauth2/access_token?${accessTokenQueryString}`,
  );

  if (!data.access_token) {
    throw new Error('BAD_REQUEST');
  }

  // 提供令牌
  return data as WeixinAccessToken;
};

/**
 * 微信登录 获取用户信息
 */
export interface WeixinUserInfo {
  openid?: string;
  nickname?: string;
  sex?: number;
  language?: string;
  city?: string;
  province?: string;
  country?: string;
  headimgurl?: string;
  privileges?: Array<string>;
  unionid?: string;
}

export interface GetWeixinUserInfoOptions {
  access_token: string;
  openid: string;
}

export const getWeixinUserInfo = async (options: GetWeixinUserInfoOptions) => {
  const { access_token, openid } = options;

  // 查询符
  const userInfoQueryString = new URLSearchParams({
    access_token,
    openid,
  }).toString();

  // 请求微信用户信息
  const { data } = await weixinApiHttpClient.get(
    `userinfo?${userInfoQueryString}`,
  );

  if (!data.openid) {
    throw new Error('BAD_REQUEST');
  }

  // 提供令牌
  return data as WeixinUserInfo;
};

/**
 * 微信登录 后期处理
 */
export interface WeixinLoginPostProcessOptions {
  user?: UserData;
  weixinUserInfo: WeixinUserInfo;
}

export const weixinLoginPostProcess = async (
  options: WeixinLoginPostProcessOptions,
) => {
  const {
    user,
    weixinUserInfo: { headimgurl, unionid },
  } = options;

  // 下载头像
  if (!user.avatar) {
    // 头像地址
    const avatarUrl = headimgurl;
    // 下载头像文件
    const response = await httpClient.get(avatarUrl, {
      responseType: 'stream',
    });

    //  准备头像文件信息
    const mimetype = response.headers['content-type'];
    const size = response.headers['content-length'];
    const filename = unionid;
    const filePath = path.join('uploads', 'avatar', filename);
    const fileResizePath = path.join('uploads', 'avatar', 'resized', filePath);

    // 创建头像文件
    const fileWriter = fs.createWriteStream(filePath);
    response.data.pipe(fileWriter);

    // 处理头像文件
    fileWriter.on('finish', async () => {
      // 读取文件
      const image = await Jimp.read(filePath);

      // 调整尺寸
      image
        .cover(256, 256)
        .quality(100)
        .write(`${fileResizePath}-large`);
      image
        .cover(128, 128)
        .quality(100)
        .write(`${fileResizePath}-medium`);
      image
        .cover(64, 64)
        .quality(100)
        .write(`${fileResizePath}-small`);

      // 保存头像数据
      createAvatar({
        userId: user.id,
        mimetype,
        filename,
        size,
      });
    });
  }
};

import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import jimp from 'jimp';
import dayjs from 'dayjs';
import { imageResize, findFileById } from './file.service';
import { DATE_TIME_FORMAT } from '../app/app.config';
import { socketServer } from '../app/app.server';
import {
  getDownloadByToken,
  updateDownload,
} from '../download/download.service';

/**
 * 文件过滤器
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    // 测试文件类型
    const allowed = fileTypes.some(type => type === file.mimetype);
    if (allowed) {
      // 允许上传
      callback(null, true);
    } else {
      // 不允许上传
      callback(new Error('FILE_TYPE_NOT_ACCEPT'));
    }
  };
};

const fileUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);

/**
 * 创建一个 Multer
 */
const fileUpload = multer({
  dest: 'uploads/',
  fileFilter: fileUploadFilter,
});

/**
 * 文件拦截器
 */
export const fileInterceptor = fileUpload.single('file');

/**
 * 文件处理器
 */
export const fileProcessor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 文件路径
  const { path } = req.file;

  let image: jimp;

  try {
    // 读取图像文件
    image = await jimp.read(path);
  } catch (err) {
    return next(err);
  }

  // 准备文件数据
  const { imageSize, tags } = image['_exif'];

  // 在请求中添加文件数据
  req.fileMetadata = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags),
  };

  // 调整图像尺寸
  imageResize(image, req.file);

  // 下一步
  next();
};

/**
 * 文件下载守卫
 */
export const fileDownloadGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    query: { token, socketId },
    params: { fileId },
  } = req;

  try {
    // 检查 token
    if (!token) throw new Error('BAD_REQUEST');

    // 检查下载是否可用
    const download = await getDownloadByToken(token as string);
    const isValidDownload = download && !download.used;
    if (!isValidDownload) throw new Error('DOWNLOAD_INVALID');

    // 检查下载是否过期
    const isExpired = dayjs()
      .subtract(2, 'hours')
      .isAfter(download.created);
    if (isExpired) throw new Error('DOWNLOAD_EXPIRED');

    // 检查资源是否匹配
    const file = await findFileById(parseInt(fileId, 10));
    const isValidFile = file && file.postId === download.resourceId;
    if (!isValidFile) throw new Error('BAD_REQUEST');

    // 更新下载
    await updateDownload(download.id, {
      used: dayjs().format(DATE_TIME_FORMAT),
    });

    // 触发事件
    if (socketId) {
      socketServer.to(socketId as string).emit('fileDownloadUsed', download);
    }

    // 设置请求体
    req.body = { download, file };
  } catch (error) {
    return next(error);
  }

  next();
};

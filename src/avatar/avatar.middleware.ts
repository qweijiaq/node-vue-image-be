import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { fileFilter } from '../file/file.middleware';
import path from 'path';

/**
 * 文件过滤器
 */
const avatarUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);

/**
 * 创建一个 Multer
 */
const avatarUpload = multer({
  dest: 'uploads/avatar',
  fileFilter: avatarUploadFilter,
});

/**
 * 文件拦截器
 */
export const avatarInterceptor = avatarUpload.single('avatar');

/**
 * 头像处理器
 */
export const avatarProcessor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备文件信息
  const { file } = req;

  // 准备文件路径
  const filePath = path.join(file.destination, 'resized', file.filename);

  // 处理头像文件
  try {
    // 读取文件
    const image = await Jimp.read(file.path);

    // 调整尺寸
    image
      .cover(256, 256)
      .quality(85)
      .write(`${filePath}-large`);
    image
      .cover(128, 128)
      .quality(85)
      .write(`${filePath}-medium`);
    image
      .cover(64, 64)
      .quality(85)
      .write(`${filePath}-small`);
  } catch (error) {
    next(error);
  }

  // 下一步
  next();
};

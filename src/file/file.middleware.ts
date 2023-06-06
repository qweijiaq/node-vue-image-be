import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import jimp from 'jimp';
import { imageResize } from './file.service';

// 创建一个 multer
const fileUpload = multer({
  dest: 'uploads/',
});

// 文件拦截器
export const fileInterceptor = fileUpload.single('file');

// 文件处理器
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

  const { imageSize, tags } = image['_exif'];

  req.fileMetadata = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags),
  };

  // 调整图像尺寸
  imageResize(image, req.file);

  next();
};

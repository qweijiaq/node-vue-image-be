import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import jimp from 'jimp';
import { imageResize } from './file.service';

// 文件过滤器
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

// 创建一个 multer
const fileUpload = multer({
  dest: 'uploads/',
  fileFilter: fileUploadFilter,
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

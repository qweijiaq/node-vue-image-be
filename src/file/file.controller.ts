import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction, response } from 'express';
import _ from 'lodash';
import { createFile, findFileById, fileAccessControl } from './file.service';

/**
 * 上传文件
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 当前用户
  const { id: uid } = req.user;
  const userId = parseInt(uid, 10);
  // 所属内容
  const { post: pid } = req.query;
  const postId = parseInt(pid as string, 10);
  // 文件信息
  const fileInfo = _.pick(req.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);

  try {
    const data = await createFile({
      ...fileInfo,
      userId,
      postId,
      ...req.fileMetadata,
    });

    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

/**
 * 文件服务
 */
export const serve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 从地址参数里得到文件 ID
  const { fileId } = req.params;

  // 当前用户
  const { user: currentUser } = req;

  try {
    // 查找文件信息
    const file = await findFileById(parseInt(fileId, 10));
    // 检查权限
    await fileAccessControl({ file, currentUser });
    // 要提供的图像尺寸
    const { size } = req.query;
    if (!size) throw new Error('BAD_REQUEST');
    // 文件名与目录
    let filename = file.filename;
    let root = 'uploads';
    let resized = 'resized';

    if (size) {
      const imageSizes = ['large', 'medium', 'small'];
      // 检查文件尺寸是否可用
      if (!imageSizes.some(item => item === size)) {
        throw new Error('FILE_NOT_FOUND');
      }
      // 检查文件是否存在
      const fileExist = fs.existsSync(
        path.join(root, resized, `${filename}-${size}`),
      );
      // 设置文件名与目录
      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    // 作出响应
    res.sendFile(filename, {
      root,
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 文件信息
 */
export const metadata = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fileId } = req.params;

  // 当前用户
  const { user: currentUser } = req;

  try {
    const file = await findFileById(parseInt(fileId, 10));
    // 检查权限
    await fileAccessControl({ file, currentUser });
    const data = _.pick(file, ['id', 'size', 'width', 'height', 'metadata']);
    res.send(data);
  } catch (err) {
    next(err);
  }
};

/**
 * 文件下载
 */
export const download = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { file },
  } = req;

  try {
    const filePath = path.join('uploads', file.filename);

    // 设置头部
    res.header({
      'Content-Type': `${file.mimetype}`,
    });

    // 做出响应
    res.download(filePath, file.originalname);
  } catch (error) {
    next(error);
  }
};

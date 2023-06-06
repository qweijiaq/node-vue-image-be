import { Request, Response, NextFunction, response } from 'express';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';

// 上传文件
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: uid } = req.user;
  const { post: pid } = req.query;
  const user_id = parseInt(uid, 10);
  const post_id = parseInt(pid as string, 10);
  const fileInfo = _.pick(req.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);

  try {
    const data = await createFile({
      ...fileInfo,
      user_id,
      post_id,
    });

    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

// 文件服务
export const serve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 从地址参数里得到文件 ID
  const { fileId } = req.params;

  try {
    // 查找文件信息
    const file = await findFileById(parseInt(fileId, 10));
    // 作出响应
    res.sendFile(file.filename, {
      root: 'uploads',
      headers: {
        'Content-type': file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import { getTagByName, createTag } from './tag.service';

/**
 * 创建标签
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { name } = req.body;

  try {
    // 查看标签是否已经存在
    const tag = await getTagByName(name);

    if (tag) throw new Error('TAG_ALREADY_EXISTS');

    // 创建标签
    const data = await createTag({ name });

    // 做出响应
    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

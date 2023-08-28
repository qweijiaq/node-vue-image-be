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
  const { name } = req.body;
  try {
    // 查看标签是否已经存在
    const tag = await getTagByName(name);

    if (tag) throw new Error('TAG_ALREADY_EXISTS');

    const data = await createTag({ name });
    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import { createDownload, getDownloadById } from './download.service';
import { uid } from '../app/app.service';

/**
 * 创建下载
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { resourceType, resourceId, license },
    user: { id: userId },
  } = req;

  try {
    let licenseId: number | null;

    if (license) {
      licenseId = license.id;
    }

    const token = uid();

    const data = await createDownload({
      userId: parseInt(userId),
      licenseId,
      token,
      resourceType,
      resourceId,
    });

    const download = await getDownloadById(data.insertId);

    res.send(download);
  } catch (error) {
    next(error);
  }
};

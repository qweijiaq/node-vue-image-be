import { DownloadModel } from './download.model';
import { connection } from '../app/database/mysql';

/**
 * 创建下载
 */
export const createDownload = async (download: DownloadModel) => {
  // 准备查询
  const statement = `
    INSERT INTO download
    SET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, download);

  // 提供数据
  return data as any;
};

/**
 * 按 ID 调取下载
 */
export const getDownloadById = async (downloadId: number) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      download
    WHERE
      download.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, downloadId);

  // 提供数据
  return data[0] as DownloadModel;
};

/**
 * 按 Token 调取下载
 */
export const getDownloadByToken = async (token: string) => {
  // 准备查询
  const statement = `
    SELECT
      *
    FROM
      download
    WHERE
      download.token = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, token);

  // 提供数据
  return data[0] as DownloadModel;
};

/**
 * 更新下载
 */
export const updateDownload = async (
  downloadId: number,
  download: DownloadModel,
) => {
  // 准备查询
  const statement = `
    UPDATE download
    SET ?
    WHERE id = ?
  `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [download, downloadId]);

  // 提供数据
  return data as any;
};

/**
 * 统计下载次数
 */
export interface CountDownloadOptions {
  userId: number;
  datetime: string;
  type: string;
}

export const countDownloads = async (options: CountDownloadOptions) => {
  const { userId, datetime, type } = options;

  // 查询条件
  const whereUsed = 'download.used IS NOT NULL';
  const whereUserId = 'download.userId = ?';
  let whereDatetime = '';
  let whereType = '';

  switch (datetime) {
    case '1-day':
      whereDatetime = 'download.created > now() - INTERVAL 1 DAY';
      break;
    case '7-day':
      whereDatetime = 'download.created > now() - INTERVAL 7 DAY';
      break;
    case '1-month':
      whereDatetime = 'download.created > now() - INTERVAL 1 MONTH';
      break;
    case '3-month':
      whereDatetime = 'download.created > now() - INTERVAL 3 MONTH';
      break;
  }

  if (type === 'license') {
    whereType = 'download.licenseId IS NOT NULL';
  }

  if (type === 'subscription') {
    whereType = 'download.licenseId IS NULL';
  }

  // 准备查询
  const statement = `
    SELECT
      count(download.id) AS count
    FROM
      download
    WHERE
      ${whereUsed}
      AND ${whereUserId}
      AND ${whereDatetime}
      AND ${whereType}

  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  return data[0] as { count: number };
};

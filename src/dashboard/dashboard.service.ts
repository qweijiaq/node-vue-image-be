import { connection } from '../app/database/mysql';
import { allowedAccessCounts } from './dashboard.provider';
import { AccessCountListItem } from '../../dist/dashboard/dashboard.provider';

/**
 * 访问次数列表
 */

interface GetAccessCountsOptions {
  filter: {
    name: string;
    sql?: string;
    param?: string;
  };
}

export const getAccessCounts = async (options: GetAccessCountsOptions) => {
  const {
    filter: { sql: whereDateTimeRange },
  } = options;

  // 允许的动作
  const allowActions = allowedAccessCounts
    .map(accessCount => accessCount.action)
    .map(action => `'${action}'`)
    .join(',');

  // 允许的动作条件
  const andWhereActionIn = `AND action in (${allowActions})`;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereActionIn}
    GROUP BY
      access_log.action
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return allowedAccessCounts.map(accessCount => {
    const result = results.find(result => result.action === accessCount.action);
    accessCount.value = result && result.value ? result.value : 0;
    return accessCount;
  });
};

/**
 * 按动作分时段访问次数
 */
interface GetAccessCountByActionResult {
  action: string;
  datetime: string;
  value: number;
}

interface AccessCount {
  title: string;
  action: string;
  dataset: [Array<string>, Array<number>];
}

interface GetAccessCountByActionOptions {
  action: string;
  filter: {
    name: string;
    sql?: string;
    param?: string;
  };
}

export const getAccessCountByAction = async (
  options: GetAccessCountByActionOptions,
) => {
  const {
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
    action,
  } = options;

  // 查询条件
  const andWhereAction = 'AND action = ?';

  // SQL 参数
  const params = [action];

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      DATE_FORMAT(access_log.created, '${dateTimeFormat}') AS datetime,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereAction}
    GROUP BY
      access_log.action,
      DATE_FORMAT(access_log.created, '${dateTimeFormat}')
    ORDER BY
      DATE_FORMAT(access_log.created, '${dateTimeFormat}')
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);
  const results = data as Array<GetAccessCountByActionResult>;

  // 数据集合
  const dataset = results.reduce(
    (accumulator, result) => {
      const [datetimeArray, valueArray] = accumulator;
      datetimeArray.push(result.datetime);
      valueArray.push(result.value);
      return accumulator;
    },
    [[], []],
  );

  // 动作标题
  const title = allowedAccessCounts.find(
    accessCount => accessCount.action === action,
  ).title;

  // 提供数据
  return {
    title,
    action,
    dataset,
  } as AccessCount;
};

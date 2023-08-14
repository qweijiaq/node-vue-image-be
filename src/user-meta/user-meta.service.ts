import { UserMetaModel, UserMetaType } from './user-meta.model';
import { connection } from '../app/database/mysql';

/**
 * 创建用户 Meta
 */
export const createUserMeta = async (userMeta: UserMetaModel) => {
    // 准备查询
    const statement = `
      INSERT INTO user_meta
      SET ? 
    `;

    // 执行查询
    const [data] = await connection.promise().query(statement, userMeta)

    // 提供数据
    return data as any;
}

/**
 * 更新用户 Meta
 */
export const updateUserMeta = async (userMetaId: number, userMeta: UserMetaModel) => {
    // 准备查询
    const statement = `
      UPDATE user_meta
      SET ?
      WHERE user_meta.id = ?
    `;

    // SQL 参数
    const params = [userMeta, userMetaId]

    // 执行查询
    const [data] = await connection.promise().query(statement, params)

    // 提供数据
    return data as any;
}

/**
 * 按 Info 字段属性获取用户 Meta
 */
const getUserMetaByInfoProp = (type: string, infoPropName) => {
    return async (value: string | number) => {
        // 准备查询
        const statement = `
          SELECT
            *
          FROM
            user_meta
          WHERE
            user_meta.type = ?
            AND JSON_EXTRACT(user_meta.info, "$.${infoPropName}") = ?
          ORDER BY 
            user_meta.id DESC
          LIMIT
            1
        `;

        // SQL 参数
        const params = [type, value]

        // 执行查询
        const [data] = await connection.promise().query(statement, params)

        // 提供数据
        return data[0] ? data[0] as UserMetaModel : null
    }
}

export const getUserMetaByWeixinOpenId  = getUserMetaByInfoProp(
    UserMetaType.weixinUserInfo,
    'openid'
)

export const getUserMetaByWeixinUnionId  = getUserMetaByInfoProp(
    UserMetaType.weixinUserInfo,
    'unionid'
)
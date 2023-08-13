// 查询片段
export const sqlFragment = {
  user: `
    JSON_OBJECT(
        'id', user.id,
        'name', user.name,
        'avatar', IF(COUNT(avatar.id), 1, null)
    ) as user
    `,
  leftJoinUser: `
    LEFT JOIN user
      ON user.id = post.user_id
    LEFT JOIN avatar
      ON user.id = avatar.user_id
    `,
  totalComments: `
    (
      SELECT
        COUNT(comment.id)
      FROM
        comment
      WHERE
        comment.post_id = post.id
    ) as totalComments
  `,
  leftJoinOneFile: `
    LEFT JOIN LATERAL (
        SELECT *
        FROM file
        WHERE file.post_id = post.id
        ORDER BY file.id DESC
        LIMIT 1
    ) AS file ON post.id = file.post_id
    `,
  file: `
    CAST(
        IF(
        COUNT(file.id),
        GROUP_CONCAT(
            DISTINCT JSON_OBJECT(
            'id', file.id,
            'width', file.width,
            'height', file.height
            )
        ),
        NULL
        ) AS JSON
    ) AS file
    `,
  leftJoinTag: `
    LEFT JOIN
        post_tag ON post_tag.post_id = post.id
    LEFT JOIN
        tag ON post_tag.tag_id = tag.id
    `,
  tags: `
    CAST(
        IF(
        COUNT(tag.id),
        CONCAT(
            '[',
            GROUP_CONCAT(
                DISTINCT JSON_OBJECT(
                'id', tag.id,
                'name', tag.name
                )
            ),
            ']'
        ),
        NULL
        ) AS JSON
    ) AS tags
    `,
  totalDiggs: `
    (
        SELECT COUNT(user_digg_post.post_id)
        FROM user_digg_post
        WHERE user_digg_post.post_id = post.id
    ) AS totalDiggs
    `,
  innerJoinUserDiggPost: `
    INNER JOIN user_digg_post
        ON user_digg_post.post_id = post.id
    `,
  innerJoinOneFile: `
    INNER JOIN LATERAL (
        SELECT *
        FROM file
        WHERE file.post_id = post.id
        ORDER BY file.id DESC
        LIMIT 1
    ) AS file ON post.id = file.post_id
    `,
  innerJoinFile: `
    INNER JOIN file
        ON file.post_id = post.id
    `,
  leftJoinOneAuditLog: `
    LEFT JOIN LATERAL (
      SELECT *
      FROM audit_log
      WHERE audit_log.resourceId = post.id
      ORDER BY audit_log.id DESC
      LIMIT 1
    ) AS audit ON post.id = audit.resourceId
  `,
  audit: `
    CAST(
      IF(
        COUNT(audit.id),
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT(
            'id', audit.id,
            'status', audit.status
          )
        ),
        NULL
      ) AS JSON
    ) AS audit
  `,
};

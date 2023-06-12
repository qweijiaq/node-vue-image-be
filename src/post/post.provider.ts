// 查询片段
export const sqlFragment = {
  user: `
    JSON_OBJECT(
        'id', user.id,
        'name', user.name
    ) as user
    `,
  leftJoinUser: `
    LEFT JOIN user
      ON user.id = post.user_id
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
  totalLikes: `
    (
        SELECT COUNT(user_like_post.postId)
        FROM user_like_post
        WHERE user_like_post.postId = post.id
    ) AS totalLikes
    `,
  innerJoinUserLikePost: `
    INNER JOIN user_like_post
        ON user_like_post.postId = post.id
    `,
  innerJoinOneFile: `
    INNER JOIN LATERAL (
        SELECT *
        FROM file
        WHERE file.postId = post.id
        ORDER BY file.id DESC
        LIMIT 1
    ) AS file ON post.id = file.postId
    `,
  innerJoinFile: `
    INNER JOIN file
        ON file.postId = post.id
    `,
};

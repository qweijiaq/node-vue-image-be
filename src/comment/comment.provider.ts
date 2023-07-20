/**
 * SQL 查询片断
 */
export const sqlFragment = {
  leftJoinUser: `
      LEFT JOIN user
        ON user.id = comment.user_id
      LEFT JOIN avatar
        ON user.id = avatar.user_id
    `,
  user: `
      JSON_OBJECT(
        'id', user.id,
        'name', user.name,
        'avatar', IF(COUNT(avatar.id), 1, NULL)
      ) AS user
    `,
  leftJoinPost: `
      LEFT JOIN post
        ON post.id = comment.post_id
    `,
  post: `
      JSON_OBJECT(
        'id', post.id,
        'title', post.title
      ) AS post
    `,
  repliedComment: `
      (
        SELECT
          JSON_OBJECT(
            'id', repliedComment.id,
            'content', repliedComment.content
          )
        FROM
          comment repliedComment
        WHERE
          comment.parent_id = repliedComment.id
      ) AS repliedComment
    `,
  totalReplies: `
      (
        SELECT
          COUNT(reply.id)
        FROM
          comment reply
        WHERE
          reply.parent_id = comment.id
      ) AS totalReplies
    `,
};

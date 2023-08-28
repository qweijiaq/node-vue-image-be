export const licenseSqlFragment = {
  resource: `
      JSON_OBJECT(
        'id', license.resourceId,
        'type', license.resourceType,
        'title', post.title,
        'user', JSON_OBJECT(
          'id', author.id,
          'name', author.name,
          'avatar', IF(COUNT(authorAvatar.id), 1, NULL)
        )
      ) AS resource
    `,

  order: `
      JSON_OBJECT(
        'id', order.id,
        'payment', order.payment,
        'totalAmount', order.totalAmount
      ) AS \`order\`
    `,

  leftJoinPost: `
      LEFT JOIN post
        ON license.resourceId = post.id
    `,

  leftJoinOrder: `
      LEFT JOIN \`order\`
        ON license.orderId = order.id
    `,

  leftJoinLicenseUser: `
      LEFT JOIN user
        ON license.userId = user.id
      LEFT JOIN avatar
        ON user.id = avatar.userId
    `,

  leftJoinResourceUser: `
      LEFT JOIN user AS author
        ON author.id = post.userId
      LEFT JOIN avatar AS authorAvatar
        ON author.id = authorAvatar.userId
    `,
};

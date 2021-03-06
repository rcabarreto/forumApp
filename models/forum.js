

module.exports = (sequelize, DataTypes) => {
  const forum = sequelize.define('forum', {
    title: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(230),
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: ['public', 'private'],
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: ['open', 'readonly', 'closed'],
      defaultValue: 'open',
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numTopics: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`topics`.`id`) FROM `topics` WHERE `topics`.`forumId` = `forum`.`id`)'), 'numTopics']]),
    },
    numPosts: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`posts`.`id`) FROM `topics` INNER JOIN `posts` ON `posts`.`topicId` = `topics`.`id` WHERE `topics`.`forumId` = `forum`.`id`)'), 'numPosts']]),
    },
    numTopicsSub: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`topics`.`id`) FROM `topics` WHERE `topics`.`forumId` = `subForums`.`id`)'), 'numTopicsSub']]),
    },
    numPostsSub: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER, [[sequelize.literal('(SELECT COUNT(`posts`.`id`) FROM `topics` INNER JOIN `posts` ON `posts`.`topicId` = `topics`.`id` WHERE `topics`.`forumId` = `subForums`.`id`)'), 'numPostsSub']]),
    },

  });


  // retrieves all root forums
  forum.findAllForums = (forumId = null) => sequelize.models.forum
    .findAll({
      attributes: { include: ['numTopics', 'numPosts'] },
      where: { parentId: null, visibility: 'public' },
      include: [
        { model: sequelize.models.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] },
        {
          model: sequelize.models.forum, as: 'subForums', required: false, include: [{ model: sequelize.models.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }],
        },
        { model: sequelize.models.post, as: 'LastPost', include: [{ model: sequelize.models.user, attributes: ['id', 'first_name', 'last_name', 'display_name', 'email', 'profile'] }] },
      ],
      order: [
        ['featured', 'DESC'], ['updatedAt', 'DESC'],
      ],
    })
    .then(forums => forums, (err) => {
      Promise.reject(err);
    });


  return forum;
};

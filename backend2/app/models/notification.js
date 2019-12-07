
module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    id: {
      allowNull: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {});
  notification.associate = function (models) {
    // associations can be defined here
  };
  return notification;
};

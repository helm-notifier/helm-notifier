
module.exports = (sequelize, DataTypes) => {
  const subscription = sequelize.define('subscription', {
    id: {
      allowNull: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {});
  subscription.associate = function (models) {
    // associations can be defined here
  };
  return subscription;
};

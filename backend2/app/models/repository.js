
module.exports = (sequelize, DataTypes) => {
  const repository = sequelize.define('repository', {
    id: {
      allowNull: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // Todo: validate it is a valid URL
    },
    lastChecked: {
      type: DataTypes.DATE,
    },
  }, {});
  repository.associate = (models) => {
    models.repository.hasMany(models.chart);
  };
  return repository;
};

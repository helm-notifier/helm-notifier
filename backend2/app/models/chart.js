
module.exports = (sequelize, DataTypes) => {
  const chart = sequelize.define('chart', {
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
    },
    keywords: DataTypes.ARRAY(DataTypes.TEXT),
    latestVersion: DataTypes.STRING,
    appVersion: DataTypes.STRING,
    icon_url: DataTypes.STRING,
  }, {
    indexes: [
      {
        fields: ['repositoryId', 'name'],
      },
    ],
  });
  chart.associate = (models) => {
    models.chart.belongsTo(models.repository);
  };
  return chart;
};

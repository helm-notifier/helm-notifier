
module.exports = (sequelize, DataTypes) => {
  const chartVersion = sequelize.define('chartVersion', {
    id: {
      allowNull: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    appVersion: DataTypes.STRING,
    created: DataTypes.DATE,
    description: DataTypes.TEXT,
    digest: DataTypes.STRING,
    home: DataTypes.STRING,
    keywords: DataTypes.ARRAY(DataTypes.TEXT),
    maintainers: DataTypes.ARRAY(DataTypes.TEXT),
    sources: DataTypes.ARRAY(DataTypes.TEXT),
    urls: DataTypes.ARRAY(DataTypes.TEXT),
    version: DataTypes.STRING,
  }, {
    indexes: [
      {
        fields: ['chartId', 'version'],
      },
    ],
  });
  chartVersion.associate = (models) => {
    models.chartVersion.belongsTo(models.chart);
  };
  return chartVersion;
};

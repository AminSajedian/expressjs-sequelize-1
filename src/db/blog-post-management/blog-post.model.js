export default (sequelize, DataTypes) => {
  /*** sequelize.define(modelName, attributes, options); ***/
  const BlogPost = sequelize.define(
    /*** modelName***/
    "blog-post",
    {
      /*** attributes ***/
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(75),
        // allowNull: false,
      },
      body: {
        type: DataTypes.STRING(1000),
        // allowNull: false,
      },
    }
    /*** options ***/
  );

  return BlogPost;
};

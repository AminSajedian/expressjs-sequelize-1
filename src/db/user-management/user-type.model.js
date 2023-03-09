export default (sequelize, DataTypes) => {
  const UserType = sequelize.define(
    /*** modelName***/
    "user_type",
    {
      /*** attributes ***/
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userTypeName: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }
    /*** options ***/
  );
  return UserType;
};

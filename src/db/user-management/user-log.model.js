export default (sequelize, DataTypes) => {
  const UserLog = sequelize.define(
    /*** modelName***/
    "user_log",
    {
      /*** attributes ***/
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    }
    /*** options ***/
  );
  return UserLog;
};

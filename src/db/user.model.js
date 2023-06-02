export default (sequelize, DataTypes) => {
  /*** sequelize.define(modelName, attributes, options); ***/
  const User = sequelize.define(
    /*** modelName***/
    "user",
    {
      /*** attributes ***/
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        // defaultValue: "johndoe@gmail.com",
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(64),
        validate: {
          is: /^[0-9a-f]{64}$/i,
        },
      },
      firstName: {
        type: DataTypes.STRING(75),
        // allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(75),
        // allowNull: false,
      },
    }
    /*** options ***/
  );

  return User;
};

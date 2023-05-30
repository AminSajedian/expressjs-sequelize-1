export default (sequelize, DataTypes) => {
  /*** sequelize.define(modelName, attributes, options); ***/
  const UserAccount = sequelize.define(
    /*** modelName***/
    "user_account",
    {
      /*** attributes ***/
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userTypeId: {
        type: DataTypes.UUID,
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
      dateOfBirth: {
        type: DataTypes.DATE,
      },
      gender: {
        type: DataTypes.STRING(1),
        // M for Male
        // F for Female
      },
      isActive: {
        type: DataTypes.STRING(1),
        allowNull: false,
        // Y for Yes
        // N for No
      },
      contactNumber: {
        type: DataTypes.STRING(10),
      },
      smsNotificationActive: {
        type: DataTypes.STRING(1),
        // Y for Yes
        // N for No
      },
      emailNotificationActive: {
        type: DataTypes.STRING(1),
        // Y for Yes
        // N for No
      },
      userImage: {
        type: DataTypes.BLOB,
      },
    }
    /*** options ***/
  );

  return UserAccount;
};

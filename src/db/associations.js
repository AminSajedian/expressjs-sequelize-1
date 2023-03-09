function Associations(db) {
  const { UserAccount, UserType, UserLog } = db;

  /*** 1:N / S: UserType / T: UserAccount ***/
  UserType.hasMany(UserAccount, {
    foreignKey: "userTypeId",
  });
  UserAccount.belongsTo(UserType, {
    foreignKey: "userTypeId",
  });

  /*** 1:N / S: UserAccount / T: UserLog ***/
  UserAccount.hasMany(UserLog, {
    foreignKey: "userAccountId",
  });
  UserLog.belongsTo(UserAccount, {
    foreignKey: "userAccountId",
  });
}

export default Associations;

function Associations(db) {
  const { User, BlogPost } = db;

  /*** 1:N / S: User / T: BlogPost ***/
  User.hasMany(BlogPost, {
    foreignKey: "userId",
  });
  BlogPost.belongsTo(User, {
    foreignKey: "userId",
  });
}

export default Associations;

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate({ User }) {
    //   this.belongsTo(User);
    // }
  }
  CommentMovie.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      movieId: DataTypes.INTEGER,
      text: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'CommentMovie',
    },
  );
  return CommentMovie;
};

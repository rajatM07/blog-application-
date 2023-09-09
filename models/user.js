const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  // Correctly define your model attributes here
  title: {
    type: DataTypes.STRING,
    allowNull: false, // If this column cannot be null
  },
  img_url: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust allowNull based on your requirements
  },
  des: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust allowNull based on your requirements
  }
}, {
  // Other model options go here
  tableName: 'blog_info',
  timestamps:false
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

module.exports = User; // Export the User model

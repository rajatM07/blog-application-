const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const contact = sequelize.define('contact', {
  // Correctly define your model attributes here
  user_email: {
    type: DataTypes.STRING,
    allowNull: false, // If this column cannot be null
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust allowNull based on your requirements
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust allowNull based on your requirements
  }
}, {
  // Other model options go here
  tableName: 'user',
  timestamps:false
});

// `sequelize.define` also returns the model
console.log(contact === sequelize.models.contact); // true

module.exports = contact; // Export the User model

/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  // primaryKey:'id',
  attributes: {
    // id: { type: 'number', autoIncrement: true, },

    username: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    profilePic: {
      type: 'string',
      allowNull: true, // Allow null if user doesn't upload a profile pic initially
    },
  },
};

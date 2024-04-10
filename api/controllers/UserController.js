/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { bcrypt, jwt, HTTP_STATUS } = require('../../config/constants');

module.exports = {
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          msg: 'All fields are required',
        });
      }
      const uploadedFiles = await new Promise((resolve, reject) => {

        /*This below line shows the use of Sails' built-in file upload functionality
        req.file('profilePic').upload(...). => 'profilePic is the attribute name given in model for image.
        This method allows you to upload files using Sails' file upload handling.*/
        req.file('profilePic').upload({
          dirname: '/Users/ztlab137/Desktop/myslq_nest/tasksql/uploads',
        }, (error, files) => {
          if (error) {
            reject(error);
          } else {
            resolve(files);
          }
        });
      });

      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: 'No file uploaded.' });
      }

      const photoFilename = uploadedFiles[0].fd;

      const filePath = `/Users/ztlab137/Desktop/myslq_nest/tasksql/uploads/${photoFilename}`;

      const fileName = filePath.match(/\/([^\/]+)$/)[1];

      // Check if the User table exists
      const checkTableQuery = 'SHOW TABLES LIKE "User"';
      const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);

      // If the table doesn't exist, create it
      if (tableExistsResult.rows.length === 0) {
        const createTableQuery = `
            CREATE TABLE User (
              id INT AUTO_INCREMENT PRIMARY KEY,
              username VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL,
              profilePic VARCHAR(255) NOT NULL
            )
          `;
        await sails.sendNativeQuery(createTableQuery);
      }

      const userExist = 'SELECT email FROM User WHERE email = $1';
      const queryParams = [email];
      const userExistResult = await sails.sendNativeQuery(
        userExist,
        queryParams
      );
      console.log(userExistResult);
      if (userExistResult.rows.length > 0) {
        return res.status(HTTP_STATUS.ALREADY_EXISTS).json({
          success: false,
          msg: 'User already Exist',
        });
      }
      const hashpassword = await bcrypt.hash(password, 10);
      console.log(hashpassword);

      // Insert user data into the User table
      const insertUserQuery =
        'INSERT INTO User (username, email, password,profilePic) VALUES ($1, $2, $3, $4)';
      const insertUserResult = await sails.sendNativeQuery(insertUserQuery, [
        username,
        email,
        hashpassword,
        fileName,
      ]);

      if (insertUserResult.affectedRows > 0) {
        return res.status(HTTP_STATUS.CREATED).json({
          success: true,
          message: 'User created successfully',
          insertUserResult,
        });
      } else {
        return res.json({
          success: false,
          message: 'Failed to create user',
        });
      }
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).json({
        success: false,
        error: error.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({
          success: false,
          msg: 'All fields are required',
        });
      }
      const userExist = 'SELECT * FROM User WHERE email = $1';
      const queryParams = [email];
      const userExistResult = await sails.sendNativeQuery(
        userExist,
        queryParams
      );
      console.log(userExistResult);
      if (!userExistResult) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          msg: 'User does not exist',
        });
      }
      if (userExistResult.rows.length > 0) {
        const user = userExistResult.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch);
        if (passwordMatch) {
          const accessToken = jwt.sign(
            {
              user: {
                username: user.username,
                email: user.email,
                id: user.id,
              },
            },
            'thisisthesecretkey',
            { expiresIn: '5d' }
          );
          return res.status(HTTP_STATUS.SUCCESS).json({
            success: true,
            msg: 'login succcessfully',
            accessToken,
          });
        }
      }
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).json({
        success: false,
        msg: 'server error',
        error: error.message,
      });
    }
  },
};

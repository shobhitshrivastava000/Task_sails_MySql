// const multer = require('multer');
// const path = require('path');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: './uploads/profilePics/',
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // 1 MB limit
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single('profilePic');

// // Check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images only!');
//   }
// }

// createUser: async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({
//           success: false,
//           msg: err,
//         });
//       } else {
//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//           return res.status(HTTP_STATUS.BAD_REQUEST).json({
//             success: false,
//             msg: 'All fields are required',
//           });
//         }

//         // Check if the User table exists
//         const checkTableQuery = 'SHOW TABLES LIKE "User"';
//         const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);

//         // If the table doesn't exist, create it
//         if (tableExistsResult.rows.length === 0) {
//           const createTableQuery = `
//               CREATE TABLE User (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 username VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 profilePic VARCHAR(255)  // Add profilePic column
//               )
//             `;
//           await sails.sendNativeQuery(createTableQuery);
//         }

//         const userExist = 'SELECT email FROM User WHERE email = $1';
//         const queryParams = [email];
//         const userExistResult = await sails.sendNativeQuery(
//           userExist,
//           queryParams
//         );

//         if (userExistResult.rows.length > 0) {
//           return res.status(HTTP_STATUS.ALREADY_EXISTS).json({
//             success: false,
//             msg: 'User already Exist',
//           });
//         }

//         const hashpassword = await bcrypt.hash(password, 10);

//         // Get file path if uploaded
//         const profilePicPath = req.file ? req.file.path : null;

//         // Insert user data into the User table
//         const insertUserQuery =
//           'INSERT INTO User (username, email, password, profilePic) VALUES ($1, $2, $3, $4)';
//         const insertUserResult = await sails.sendNativeQuery(insertUserQuery, [
//           username,
//           email,
//           hashpassword,
//           profilePicPath, // Add profilePicPath to the query params
//         ]);

//         if (insertUserResult.affectedRows > 0) {
//           return res.status(HTTP_STATUS.CREATED).json({
//             success: true,
//             message: 'User created successfully',
//             insertUserResult,
//           });
//         } else {
//           return res.json({
//             success: false,
//             message: 'Failed to create user',
//           });
//         }
//       }
//     });
//   } catch (error) {
//     return res.status(HTTP_STATUS.SERVER_ERROR).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

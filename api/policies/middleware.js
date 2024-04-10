const jwt = require('jsonwebtoken');

const ValidateToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) {
      return res.json({
        success: false,
        message: 'Token is required',
      });
    }
    const decoded = jwt.verify(token, 'thisisthesecretkey');
    console.log(decoded);

    const userExistQuery = 'select * from User where id = $1';
    const queryparams = [decoded.user.id];
    const userExistQueryResult = await sails.sendNativeQuery(
      userExistQuery,
      queryparams
    );
    console.log(userExistQueryResult.rows);
    if (userExistQueryResult.rows.length === 0) {
      return res.json({
        message: 'User not found',
      });
    }
    console.log(decoded.user.id !== req.body.createdBy);
    if (decoded.user.id !== req.body.createdBy) {
      return res.json({
        message: 'Invalid User',
      });
    }

    return next();
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
module.exports = ValidateToken;

/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { HTTP_STATUS } = require("../../config/constants");

module.exports = {
  createTask: async (req, res) => {
    try {
      const { tasks, createdBy } = req.body;
      if (!tasks || !createdBy) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          successs: false,
          msg: 'All fields are req.',
        });
      }

      const checkTableQuery = 'SHOW TABLES LIKE "Task"';
      const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);

      // If the table doesn't exist, create it
      if (tableExistsResult.rows.length === 0) {
        const createTableQuery = `
              CREATE TABLE Task (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tasks VARCHAR(255) NOT NULL,
                createdBy VARCHAR(255) NOT NULL,
                FOREIGN KEY (createdBy) REFERENCES User(id)
              )
            `;
        await sails.sendNativeQuery(createTableQuery);
      }

      const userExistQuery = 'SELECT id from user where id = $1';
      console.log(userExistQuery);
      const queryParams = [createdBy];
      const userExistResult = await sails.sendNativeQuery(
        userExistQuery,
        queryParams
      );
      if (userExistResult.rows.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'User does not exist',
        });
      }

      const createTaskQuery =
        'INSERT INTO Task (tasks,createdBy) VALUES ($1,$2)';
      const queryParams2 = [tasks, createdBy];

      const queryResult = await sails.sendNativeQuery(
        createTaskQuery,
        queryParams2
      );

      if (queryResult.affectedRows > 0) {
        return res.status(HTTP_STATUS.CREATED).json({
          successs: true,
          message: 'Task created',
          queryResult,
        });
      }
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).json({
        error: error.message,
      });
    }
  },

  getTask: async (req, res) => {
    const createdBy = req.params.createdbyid;

    const findQuery = 'SELECT * FROM Task WHERE createdBy = $1';
    const queryParams = [createdBy];

    const userExistQuery = 'SELECT id from Task where createdBy = $1';
    console.log(userExistQuery);
    const queryParams2 = [createdBy];
    const userExistResult = await sails.sendNativeQuery(
      userExistQuery,
      queryParams2
    );
    if (userExistResult.rows.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'User does not exist',
      });
    }
    const findQueryResult = await sails.sendNativeQuery(findQuery, queryParams);
    console.log(findQueryResult.rows);
    return res.status(HTTP_STATUS.SUCCESS).json({
      success: 'true',
      message: 'All tasks ',
      tasks: findQueryResult.rows,
    });
  },

  updateTask: async (req, res) => {
    try {
      const { tasks } = req.body;
      if (!tasks) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          msg: 'Data field are required to update',
        });
      }
      const taskid = req.params.taskid;
      console.log(taskid);

      const userExistTask = 'SELECT id FROM Task WHERE id = $1';
      const queryparams = [taskid];
      const userExistTaskResult = await sails.sendNativeQuery(
      userExistTask,
      queryparams
      );
      if (userExistTaskResult.rows.length === 0) {
        return res.json({
          msg: 'No such task ',
        });
      }

      const updateTaskQuery = `
                          UPDATE Task
                          SET tasks = $1
                          WHERE id = $2
                          `;
      const queryparamsUpdate = [tasks,taskid];
      const updateTaskQueryResult = await sails.sendNativeQuery(
      updateTaskQuery,
      queryparamsUpdate
      );

      if (updateTaskQueryResult.affectedRows > 0) {
        return res.status(HTTP_STATUS.SUCCESS).json({
          success: true,
          message: 'Task updated successfully',
          updateTaskQueryResult,
        });
      }
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).json({
        success: false,
        msg:'server error',
        error: error.message,
      });
    }
  },

  deleteTask: async (req, res) => {
    try {
      
      const taskid = req.params.taskid;
      console.log(taskid);

      const userExistTask = 'SELECT id FROM Task WHERE id = $1';
      const queryparams = [taskid];
      const userExistTaskResult = await sails.sendNativeQuery(
      userExistTask,
      queryparams
      );
      if (userExistTaskResult.rows.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          msg: 'No such task ',
        });
      }

      const delteTaskQuery = `DELETE FROM Task WHERE id = $1`;
      const queryParamsDelete = [taskid];
      const deleteTaskQueryResult = await sails.sendNativeQuery(
        delteTaskQuery,
        queryParamsDelete
      );

      if (deleteTaskQueryResult.affectedRows > 0) {
        return res.status(HTTP_STATUS.SUCCESS).json({
          success: true,
          message: 'Task deleted successfully',
          deleteTaskQueryResult,
        });
      }
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).json({
        success: false,
        msg:'server error',
        error: error.message,
      });
    }
  },


};

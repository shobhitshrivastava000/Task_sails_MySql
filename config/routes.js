/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //user routes
  'POST /createuser/register': 'UserController.createUser',
  'POST /createuser/login': 'UserController.loginUser',

  //Task routes
  'POST /createtask': 'TaskController.createTask',
  'GET /createtask/:createdbyid': 'TaskController.getTask',
  'PUT /createtask/updatetask/:taskid': 'TaskController.updateTask',
  'DELETE /createtask/deletetask/:taskid': 'TaskController.deleteTask',
};

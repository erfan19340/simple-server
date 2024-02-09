const UserController = require('./UserController.js');
const AttachmentController = require('./AttachmentController.js');
const HomeController = require('./homeController.js')

exports.controllers = {
    user: new UserController(),
    attachment: new AttachmentController(),
    home: new HomeController()
};
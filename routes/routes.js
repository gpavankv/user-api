const UsersController = require('../controlllers/users_controller');
const cors = require('cors');

var whitelist = ['http://localhost:4200', 'http://192.168.0.21:3050', 'http://localhost']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports = (app) => {

    //Watch for incoming requests of method GET
    // to the route http://localhost:3050/api
    // app.get('/api', UsersController.greeting);

    app.get('/api/test', cors(),UsersController.test);

    app.post('/api/verifyuser', cors(), UsersController.verifyUser);
    app.get('/api/getallusers', UsersController.getAllUsers);

    app.post('/api/createuser', cors(), UsersController.createUser);
    app.post('/api/finduserbyemail', cors(), UsersController.findUserByEmail);
    app.put('/api/updateuser', cors(), UsersController.updateUser);
    app.post('/api/deleteuser', cors(), UsersController.deleteUser);

    app.post('/api/verifytoken', UsersController.verifyToken);



    // app.put('/api/user/:id', UsersController.edit);
    //
    // app.delete('/api/user/:id', UsersController.delete);
    //
    // app.get('/api/users', UsersController.index);

};
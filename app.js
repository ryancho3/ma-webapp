// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {

    //-- DEPENDENCY --//

    var express = require('express');
    var bodyParser = require('body-parser');

    var home_handler = require('./handler/home.js');
    var user_view_handler = require('./handler/user-view.js');
    var user_login_handler = require('./handler/user-login.js');
    var user_login_post_handler = require('./handler/user-login-post.js');
    var user_register_handler = require('./handler/user-register.js');
    var user_register_post_handler = require('./handler/user-register-post.js');
    var curriculum_view_handler = require('./handler/curriculum-view.js');
    var curriculum_list_handler = require('./handler/curriculum-list.js');
    var curriculum_add_handler = require('./handler/curriculum-add.js');
    var curriculum_post_handler = require('./handler/curriculum-post.js');

    //-- APP SETUP --//

    var app = express();
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use('/static', express.static('static'))
    app.use(bodyParser.urlencoded({extended:false}));

    app.get('/', home_handler);
    app.get('/home', home_handler);

    app.get('/user-view', user_view_handler);
    app.get('/user-login', user_login_handler);
    app.post('/user-login-post', user_login_post_handler);
    app.get('/user-register', user_register_handler);
    app.post('/user-register-post', user_register_post_handler);

    app.get('/curriculum-view', curriculum_view_handler);
    app.get('/curriculum-list', curriculum_list_handler);
    app.get('/curriculum-add', curriculum_add_handler);
    app.post('/curriculum-post', curriculum_post_handler);

    //-- APP START --//

    var port = process.env.PORT || 3000;
    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}

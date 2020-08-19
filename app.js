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
    var cookieParser = require('cookie-parser')

    var sessionMiddleware = require('./middleware/session.js');

    var homePageHandler = require('./handler/home_page_handler.js');
    var userPageHandler = require('./handler/user_page_handler.js');
    var loginPageHandler = require('./handler/login_page_handler.js');
    var loginPostHandler = require('./handler/login_post_handler.js');
    var logoutHandler    = require('./handler/logout_handler.js');
    var registerPageHandler = require('./handler/register_page_handler.js');
    var registerPostHandler = require('./handler/register_post_handler.js');
    var curriculumPageHandler       = require('./handler/curriculum_page_handler.js');
    var curriculumListPageHandler   = require('./handler/curriculum_list_page_handler.js');
    var curriculumCreatePageHandler = require('./handler/curriculum_create_page_handler.js');
    var curriculumCreatePostHandler = require('./handler/curriculum_create_post_handler.js');
    var tutorCurriculumListPageHandler   = require('./handler/tutor_curriculum_list_page_handler.js');
    var tutorCurriculumAddPostHandler    = require('./handler/tutor_curriculum_add_post_handler.js');
    var tutorCurriculumRemovePostHandler = require('./handler/tutor_curriculum_remove_post_handler.js');
    var tutorAvailabilityListPageHandler   = require('./handler/tutor_availability_list_page_handler.js');
    var tutorAvailabilityUpdatePostHandler = require('./handler/tutor_availability_update_post_handler.js');

    var appointmentCreatePageHandler = require('./handler/appointment_create_page_handler.js');
    var appointmentCreatePostHandler = require('./handler/appointment_create_post_handler.js');

    //-- APP SETUP --//

    var app = express();
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use('/static', express.static('static'))
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(sessionMiddleware);

    //-- APP HANDLERS --//

    app.get ('/', homePageHandler);
    app.get ('/user', userPageHandler);
    app.get ('/login', loginPageHandler);
    app.post('/login', loginPostHandler);
    app.get ('/logout', logoutHandler);
    app.get ('/register', registerPageHandler);
    app.post('/register', registerPostHandler);
    app.get ('/curriculum-view',   curriculumPageHandler);
    app.get ('/curriculum-list',   curriculumListPageHandler);
    app.get ('/curriculum-create', curriculumCreatePageHandler);
    app.post('/curriculum-create', curriculumCreatePostHandler);
    app.get ('/tutor-curriculum-list',        tutorCurriculumListPageHandler);
    app.post('/tutor-curriculum-add-post',    tutorCurriculumAddPostHandler);
    app.post('/tutor-curriculum-remove-post', tutorCurriculumRemovePostHandler);
    app.get ('/tutor-availability-list',        tutorAvailabilityListPageHandler);
    app.post('/tutor-availability-update-post', tutorAvailabilityUpdatePostHandler);
    app.get ('/appointment-create', appointmentCreatePageHandler);
    app.post('/appointment-create', appointmentCreatePostHandler);

    //-- APP START --//

    var port = process.env.PORT || 3000;
    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}

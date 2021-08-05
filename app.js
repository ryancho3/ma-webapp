// Include the cluster module
var cluster = require('cluster');
const { profile } = require('console');

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
    const path = require('path');
    var express = require('express');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser')

    var httpsRedirectMiddleware = require('./middleware/https_redirect_middleware.js');
    var sessionMiddleware = require('./middleware/session_middleware.js');

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
    var curriculumRemovePostHandler = require('./handler/curriculum_remove_post_handler.js');
    var curriculumHidePostHandler = require('./handler/curriculum_hide_post_handler.js');
    var tutorCurriculumListPageHandler   = require('./handler/tutor_curriculum_list_page_handler.js');
    var tutorCurriculumAddPostHandler    = require('./handler/tutor_curriculum_add_post_handler.js');
    var tutorCurriculumRemovePostHandler = require('./handler/tutor_curriculum_remove_post_handler.js');
    var tutorAvailabilityListPageHandler   = require('./handler/tutor_availability_list_page_handler.js');
    var tutorAvailabilityUpdatePostHandler = require('./handler/tutor_availability_update_post_handler.js');
    var tutorAvailabilityListPageHandler2   = require('./handler/tutor_availability_list_page_handler_2.js');
    var tutorAvailabilityListPageHandler3   = require('./handler/tutor_availability_list_page_handler_3.js');
    var appointmentPageHandler        = require('./handler/appointment_page_handler.js');
    var appointmentListPageHandler    = require('./handler/appointment_list_page_handler.js');
    var appointmentCreatePageHandler  = require('./handler/appointment_create_page_handler.js');
    var appointmentCreatePostHandler  = require('./handler/appointment_create_post_handler.js');
    var appointmentNotePostHandler    = require('./handler/appointment_note_post_handler.js');
    var appointmentArchivePostHandler = require('./handler/appointment_archive_post_handler.js');
    var lockedPageHandler = require('./handler/locked_page_handler.js');
    var accCreationPageHandler = require('./handler/acc_creation_page_handler.js');
    var accCreationPostHandler = require('./handler/acc_creation_post_handler.js');
    var adminCreationPageHandler = require('./handler/admin_creation_page_handler.js');
    var adminCreationPostHandler = require('./handler/admin_creation_post_handler.js');
    var pwdResetPageHandler = require('./handler/pwd_reset_page_handler.js');
    var pwdResetPostHandler = require('./handler/pwd_reset_post_handler.js');
    var profileUpdatePageHandler = require('./handler/profile_update_page_handler.js');
    var profileUpdatePostHandler = require('./handler/profile_update_post_handler.js')

    //-- APP SETUP --//

    var app = express();
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use('/static', express.static('static'))
    app.use('/content', express.static(path.join(__dirname, './content')));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(httpsRedirectMiddleware);
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
    app.post('/curriculum-remove', curriculumRemovePostHandler);
    app.post('/curriculum-hide', curriculumHidePostHandler);
    app.get ('/tutor-curriculum-list',        tutorCurriculumListPageHandler);
    app.post('/tutor-curriculum-add-post',    tutorCurriculumAddPostHandler);
    app.post('/tutor-curriculum-remove-post', tutorCurriculumRemovePostHandler);
    app.get ('/tutor-availability-list',        tutorAvailabilityListPageHandler);
    app.get ('/tutor-availability-list/2',        tutorAvailabilityListPageHandler2);
    app.get ('/tutor-availability-list/3',        tutorAvailabilityListPageHandler3);
    app.post('/tutor-availability-update-post', tutorAvailabilityUpdatePostHandler);
    app.get ('/appointment-view'    , appointmentPageHandler);
    app.get ('/appointment-list'    , appointmentListPageHandler);
    app.get ('/appointment-create'  , appointmentCreatePageHandler);
    app.post('/appointment-create'  , appointmentCreatePostHandler);
    app.post('/appointment-note'    , appointmentNotePostHandler);
    app.post('/appointment-archive' , appointmentArchivePostHandler);
    app.get ('/locked', lockedPageHandler);
    app.get ('/manualcreation', accCreationPageHandler);
    app.post('/manualcreation', accCreationPostHandler);
    app.get ('/newadmin', adminCreationPageHandler);
    app.post('/newadmin', adminCreationPostHandler);
    app.get ('/resetpassword', pwdResetPageHandler);
    app.post('/resetpassword', pwdResetPostHandler);
    app.get ('/updateprofile', profileUpdatePageHandler);
    app.post('/updateprofile', profileUpdatePostHandler);

    //-- APP START --//

    var port = process.env.PORT || 3000;
    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}

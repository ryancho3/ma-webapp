var nodemailer = require('nodemailer');
var appointmentService = require('../service/appointment_service.js');
var userService = require('../service/user_service.js');
var stringUtil = require('../util/string_util.js');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'matchbookfoundation@gmail.com',
      pass: 'collegespec'
    }
  });

function sendAppointmentEmailNotificationToTutor(input) {
    var userId = {};
    var email;
    userId.user_id = input['tutorUserId'];
    userService.loadUser(userId, function(err, output){
        if (err) {
            console.log('error while loading user');
            };
        userItem = output['userItem']
        email = userItem['email_lowercase'];
        var yyyymmdd = stringUtil.parseYYYYMMDDStringFromYYYYMMDDHH(input['yyyymmddhh']);
        var hh = stringUtil.parseHHStringFromYYYYMMDDHH(input['yyyymmddhh']);
        var mailOptions = {
          from: 'matchbookfoundation@gmail.com',
          to: '' + email,
          subject: '[Matchbook Academy] New Lesson Appointment on ' + stringUtil.parseDisplayStringFromYYYYMMDD(yyyymmdd),
          text: 'You have a new lesson appointment scheduled for ' + stringUtil.parseFullDayStringFromYYYYMMDD(yyyymmdd) + ', ' + stringUtil.parseDisplayStringFromYYYYMMDD(yyyymmdd) + ' at ' + hh + ':00.' + ' Log in to your account and add a Zoom or Google Meet link for your Mentee.'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        }
    );
}

function sendAppointmentEmailNotificationToStudent(input) {
  var userId = {};
  var email;
  userId.user_id = input['studentUserId'];
  userService.loadUser(userId, function(err, output){
      if (err) {
          console.log('error while loading user');
          };
      userItem = output['userItem']
      email = userItem['email_lowercase'];
      var yyyymmdd = stringUtil.parseYYYYMMDDStringFromYYYYMMDDHH(input['yyyymmddhh']);
      var hh = stringUtil.parseHHStringFromYYYYMMDDHH(input['yyyymmddhh']);
      var mailOptions = {
        from: 'matchbookfoundation@gmail.com',
        to: '' + email,
        subject: '[Matchbook Academy] New Lesson Appointment on ' + stringUtil.parseDisplayStringFromYYYYMMDD(yyyymmdd),
        text: 'You created a new lesson appointment scheduled for ' + stringUtil.parseFullDayStringFromYYYYMMDD(yyyymmdd) + ', ' + stringUtil.parseDisplayStringFromYYYYMMDD(yyyymmdd) + ' at ' + hh + ':00.' + ' Please make sure you meant to make this appointment. If not, you can cancel at matchbook.academy.'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      }
  );
}


module.exports.sendAppointmentEmailNotificationToTutor = sendAppointmentEmailNotificationToTutor;
module.exports.sendAppointmentEmailNotificationToStudent = sendAppointmentEmailNotificationToStudent;
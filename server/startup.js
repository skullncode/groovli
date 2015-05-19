/*
  Startup
  Collection of methods and functions to run on server startup.
 */
Meteor.startup(function() {

  /*
    Define environment variables.
   */
  var checkUser, i, id, len, results, user, users;
  process.env.MAIL_URL = 'smtp://postmaster@sandbox2db87eb90d224189a52300870b727b6b.mailgun.org:a7152d064c8de84f9c7fa484a73d0293@smtp.mailgun.org:587';

});
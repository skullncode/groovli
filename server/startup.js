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

  /*
    Generate Test Accounts
    Creates a collection of test accounts automatically on startup.
   */
  /*users = [
    {
      name: "Steve Urkel",
      email: "steve@urkel.com",
      password: "dididothat",
      roles: ['admin']
    }, {
      name: "Andy Admin",
      email: "admin@admin.com",
      password: "password",
      roles: ['admin']
    }, {
      name: "Beatrix Beta",
      email: "beatrix@beta.com",
      password: "password",
      roles: ['tester']
    }
  ];
  results = [];
  for (i = 0, len = users.length; i < len; i++) {
    user = users[i];
    checkUser = Meteor.users.findOne({
      "services.facebook.email": user.email
    });
    if (!checkUser) {
      id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: {
          name: user.name
        }
      });
      if (user.roles.length > 0) {
        results.push(Roles.addUsersToRoles(id, user.roles));
      } else {
        results.push(void 0);
      }
    } else {
      results.push(void 0);
    }
  }
  return results;*/
});
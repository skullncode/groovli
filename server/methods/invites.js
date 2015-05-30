Meteor.methods({
  addToInvitesList: function(invitee) {
    var emailExists, inviteCount;
    check(invitee, {
      email: String,
      fbID: String,
      requested: Number,
      invited: Boolean
    });
    emailExists = Invites.findOne({
      "email": invitee.email
    });
    if (emailExists) {
      throw new Meteor.Error("email-exists", "It looks like you've already signed up for our beta. Thanks!");
    } else {
      inviteCount = Invites.find({}, {
        fields: {
          "_id": 1
        }
      }).count();
      invitee.inviteNumber = inviteCount + 1;
      return Invites.insert(invitee, function(error) {
        if (error) {
          return console.log(error);
        }
      });
    }
  },
  sendInvite: function(invitee, url) {
    var token;
    check(invitee, {
      id: String,
      email: String
    });
    check(url, String);
    token = Random.hexString(10);
    return Invites.update(invitee.id, {
      $set: {
        token: token,
        dateInvited: (new Date()).getTime(),
        invited: true,
        accountCreated: false
      }
    }, function(error) {
      if (error) {
        return console.log(error);
      } else {
        Email.send({
          to: invitee.email,
          from: "Groovli Beta Invitation <noreply@groovli.com>",
          subject: "Welcome to the Groovli Beta!",
          html: Handlebars.templates['send-invite']({
            token: token,
            url: url,
            urlWithToken: url + ("/" + token)
          })
        });
      }
    });
  },
  validateBetaToken: function(user) {
    console.log('INSIDE BETA TOKEN VALIDATION METHOD!!!!');
    var id, testInvite;
    check(user, {
      email: String,
      betaToken: String
    });
    testInvite = Invites.findOne({
      email: user.email,
      token: user.betaToken
    }, {
      fields: {
        "_id": 1,
        "email": 1,
        "token": 1
      }
    });
    if (!testInvite) {
      throw new Meteor.Error("bad-match", "Hmm, this token doesn't match your email. Try again?");
    } else {
      /*id = Accounts.createUser({
        email: user.email,
        password: user.password
      });
      Roles.addUsersToRoles(id, ['tester']);*/
      /*return Invites.update(testInvite._id, {
        $set: {
          accountCreated: true
        },
        $unset: {
          token: ""
        }
      });*/ //MOVING THIS piece of code to separately MARK TOKEN USED after FB login is successful
      return true;
    }
  },
  markBetaTokenUsed: function(user) {
    console.log('INSIDE method to mark beta token used!!!');
    console.log(user);
    var id, testInvite;
    check(user, {
      email: String,
      betaToken: String
    });
    testInvite = Invites.findOne({
      email: user.email,
      token: user.betaToken
    }, {
      fields: {
        "_id": 1,
        "email": 1,
        "token": 1
      }
    });
     if (!testInvite) {
      throw new Meteor.Error("could not consume beta token", "Hmm, this token doesn't match your email. Try again?");
    } else {
    return Invites.update(testInvite._id, {
        $set: {
          accountCreated: true
        },
        $unset: {
          token: ""
        }
      });
    }
  },
  deleteInvite: function(emailAddress) {
    Invites.remove({email: emailAddress}, function(error) {
          if (error) {
            // display the error to the user
            return error;
          }
          else{
            //console.log('result');
          }
      })
  }
});
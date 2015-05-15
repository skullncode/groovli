Template.signup.created = function() {};

Template.signup.rendered = function() {
  return $('#application-signup').validate({
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      betaToken: {
        required: true
      }
    },
    messages: {
      emailAddress: {
        required: "Please enter your email address to sign up.",
        email: "Please enter a valid email address."
      },
      betaToken: {
        required: "A valid beta token is required to sign up."
      }
    },
    submitHandler: function() {
      var user;
      user = {
        email: $('[name="emailAddress"]').val().toLowerCase(),
        betaToken: $('[name="betaToken"]').val()
      };
      return Meteor.call('validateBetaToken', user, function(error) {
        if (error) {
          return alert(error.reason);
        } else {
          /*return Meteor.loginWithPassword(user.email, user.password, function(error) {
            if (error) {
              return alert(error.reason);
            } else {
              return Router.go('/dashboard');
            }
          });*/
          Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'read_stream', 'email', 'publish_actions', 'user_activities', 'user_interests', 'user_friends', 'user_about_me', 'user_status', 'user_posts', 'user_actions.music', 'user_actions.video', 'user_location', 'user_hometown']}, function(error){
            if (error) {
              throw new Meteor.Error("Facebook login failed");
            }
            else
            {
              //after logging in update FB friend list
              Meteor.call('updateFBFriendList');
              Router.go('/songboard');
            }
          });
        }
      });
    }
  });
};

Template.signup.helpers({
  betaToken: function() {
    return Session.get('betaToken');
  }
});

Template.signup.events({
  'submit form': function(e) {
    return e.preventDefault();
  }
});
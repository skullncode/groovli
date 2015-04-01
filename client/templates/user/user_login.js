Template.userLogin.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'read_stream', 'email', 'read_friendlists', 'publish_actions', 'user_activities', 'user_interests', 'user_friends', 'user_about_me', 'user_status', 'user_posts', 'user_actions.music', 'user_actions.video', 'user_location', 'user_hometown']}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else
                Router.go('/songboard');
        });
    },
 
    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
            else
                Router.go('/')
        })
    }
});
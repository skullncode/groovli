Template.userLogin.rendered = function() {
    //Session.set('umc', 0);  
};

Template.userLogin.helpers({
    notOnSignUpPage: function() {
        var currentRoute = Router.current().route.getName();
        if(currentRoute !== "signup/:token" && currentRoute !== "signup")
            return true;
        else
            return false;
    },
    anyUnreadMsgs: function() {
        //console.log('THIs is the result of unread msgs: ');
        //console.log(Session.get('umc') > 0);
        if(Session.get('umc') > 0)
            return true;
        else
            return false;
    },
    unreadMsgCount: function() {
        return Session.get('umc');
    }

});

Template.userLogin.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'read_stream', 'email', 'publish_actions', 'user_activities', 'user_interests', 'user_friends', 'user_about_me', 'user_status', 'user_posts', 'user_actions.music', 'user_actions.video', 'user_location', 'user_hometown']}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else
            {
                //after logging in update FB friend list
                Meteor.call('updateFBFriendList');
                Router.go('/songboard');
            }
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
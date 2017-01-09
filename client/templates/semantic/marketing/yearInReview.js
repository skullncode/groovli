Template.yearInReview.helpers({
	userFirstNameOnly: function()
	{
		return Meteor.user().profile.name.split(' ')[0];
	}
});

Template.yearInReview.events({
    'click #facebook-login': function(event) {
        //Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'read_stream', 'email', 'publish_actions', 'user_activities', 'user_interests', 'user_friends', 'user_about_me', 'user_status', 'user_posts', 'user_actions.music', 'user_actions.video', 'user_location', 'user_hometown']}, function(err){
          Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email', 'user_friends', 'user_posts']}, function(err){
            if (err) {
                /*amplitude.logEvent("facebook login failed");
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'landing',
                  eventAction: 'facebook login failed'
                });*/
                console.log('encountered an error while trying to login with facebook');
                console.log(err);
                throw new Meteor.Error("Facebook login failed");
            }
            else
            {
                //after logging in update FB friend list
                //console.log('successfully logged in with meteor!!!');
                //console.log(Meteor.user());
                //Meteor.call('updateFBFriendList', Meteor.user());
                /*amplitude.logEvent("click login with facebook button");
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'landing',
                  eventAction: 'login with facebook'
                });*/
                Meteor.call('getLatestStoriesFromDBAndFB');
                FlowRouter.go('/yir/'+Meteor.user()._id);
                //FlowRouter.go('/welcome');
            }
        });
    },

    'click #logout': function(event) {
        //console.log("GOING to log out now!!");
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
            else
            {
                //Router.go('/')
                //if(FlowRouter.current().path !== "/")
                //{
                    //console.log("NOT on homepage so will redirect to HOME!");
                    Session.set('ud', null);
                    FlowRouter.go('/yir');
                //}
                //else
                //    console.log('NOT DOING ANYTHING!!');
            }
        });
        return false;
    },

    'click #btnSeeYearInReview': function(event){
        FlowRouter.go('/yir/'+Meteor.user()._id);
    }
})
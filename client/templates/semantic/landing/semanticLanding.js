Template.semanticLanding.onRendered(function () {
  if(Meteor.user() && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
  {
    Meteor.call('addAdminRolesToKing', Meteor.user().services.facebook.email);
    Meteor.call('setUserBaseLocation', Meteor.user().services.facebook.id);
    //analytics.track("logged in user loaded home page");
    mixpanel.track("logged in user loaded home page");
  }
  else
  {
    //analytics.track("anonymous user loaded home page");
    mixpanel.track("anonymous user loaded home page");
  }
  getTrendingSongs();
  getRecentListens();
});

Template.semanticLanding.helpers({
  songsJustListened: function() {
    return Session.get('lp_recent');
  },
  trendingSongs: function() {
    //console.log('CHECKING length of friends songs: ' + Session.get('tastemakersSongsLength'));
    return Session.get('lp_trending');
  }
});

Template.semanticLanding.onRendered(function() {
  //$('.ui.dropdown.landingDropdownMenu').dropdown();
  Session.set("playerLoaded", false);
  Session.set("playerStarted", false);
  //Meteor.setTimeout(enableDropdown, 800);
});

Template.semanticLanding.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData');  
  });
  Session.set("playerLoaded", false);
  Session.set("playerStarted", false);
});

function getRecentListens(){
  Meteor.call('getLast20SongsForLandingPage', function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
        //console.log('GOT THIS BACK From the server: ');
        //console.log(result);
        Session.set('lp_recent', result)
      }
  });
}

function getTrendingSongs(){
  Meteor.call('getLast10TrendingSongsForLandingPage', function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
        //console.log('GOT THIS BACK From the server FOR TRENDING SONGS: ');
        //console.log(result);
        Session.set('lp_trending', result)
      }
  });
}

Template.semanticLanding.events({
    'click #facebook-login': function(event) {
        //Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'read_stream', 'email', 'publish_actions', 'user_activities', 'user_interests', 'user_friends', 'user_about_me', 'user_status', 'user_posts', 'user_actions.music', 'user_actions.video', 'user_location', 'user_hometown']}, function(err){
          Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email', 'user_friends', 'user_posts']}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else
            {
                //after logging in update FB friend list
                Meteor.call('updateFBFriendList');
                //Router.go('/songboard');
                FlowRouter.go('/songboard');
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
                    FlowRouter.go('/');
                //}
                //else
                //    console.log('NOT DOING ANYTHING!!');
            }
        });
        return false;
    },

    'click #clickHomeFromLanding': function(event) {
      FlowRouter.go('/songboard');
    }
});

/*function enableDropdown(){
  $('.ui.dropdown.landingDropdownMenu').dropdown();
}*/
var trendingSongsLoaded = new ReactiveVar(false);
var recentSongsLoaded = new ReactiveVar(false);

Template.mobLandingPage.onRendered(function () {
  if(Meteor.user() && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
  {
    Meteor.call('addAdminRolesToKing', Meteor.user().services.facebook.email);
    Meteor.call('setUserBaseLocation', Meteor.user().services.facebook.id);
    //analytics.track("logged in user loaded home page");
    mixpanel.track("logged in user loaded home page");
    amplitude.logEvent("logged in user loaded landing page", {
      user: Meteor.user()
    });
  }
  else
  {
    //analytics.track("anonymous user loaded home page");
    mixpanel.track("anonymous user loaded home page");
    amplitude.logEvent("anonymous user loaded landing page");
  }
  getTrendingSongs();
  getRecentListens();
});

Template.mobLandingPage.helpers({
  songsJustListened: function() {
    return Session.get('lp_recent');
  },
  trendingSongs: function() {
    //console.log('CHECKING length of friends songs: ' + Session.get('tastemakersSongsLength'));
    return Session.get('lp_trending');
  },
  trimmedTitle: function() {
    var splitString = this.st.split(' ');
    //console.log('this is the split string: ');
    //console.log(splitString);
    if(splitString.length > 3)
    {
      if(this.st.indexOf('(') >= 0)
      {
        return this.st.substring(0, this.st.indexOf('(')-1); 
      }
      else
      {
        //console.log('original: ');
        //console.log(this.st);
        //console.log('INDEX of last space: ');
        var indexOfLastShortenedSpace = this.st.substring(0,30).lastIndexOf(' ')+1; //approximately first 1300 characters of bio
        //console.log(indexOfLastShortenedSpace);
        return this.st.substring(0,indexOfLastShortenedSpace);
      }
    }
    else
    {
      return this.st;
    }    
  },
  trendingSongsLoaded: function() {
    return trendingSongsLoaded.get();
  },
  
  recentSongsLoaded: function() {
    return recentSongsLoaded.get();
  }
});

Template.mobLandingPage.onRendered(function() {
  //$('.ui.dropdown.landingDropdownMenu').dropdown();
  Session.set("playerLoaded", false);
  Session.set("playerStarted", false);
  //Meteor.setTimeout(enableDropdown, 800);
});

Template.mobLandingPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData');  
  });
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
        recentSongsLoaded.set(true);
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
        trendingSongsLoaded.set(true);
      }
  });
}

function fbSuccessCallback(){
  console.log("SUCCESS LOGGING INTO FB!!!!");
}

Template.mobLandingPage.events({
    'click #facebook-login': function(event) {
        //Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'read_stream', 'email', 'publish_actions', 'user_activities', 'user_interests', 'user_friends', 'user_about_me', 'user_status', 'user_posts', 'user_actions.music', 'user_actions.video', 'user_location', 'user_hometown']}, function(err){
          openFB.init({appId: '848177241914409'});
          openFB.login(function (response) {
              if (response.status === 'connected') {
                  if (response.authResponse) {
                      var accessToken = response.authResponse.accessToken;
                      console.log("SUCCESS LOGGING INTO FB!!!!");
                      console.log('THIIIIIS IS THE access Token: ');
                      console.log(accessToken);
                      console.log('this is hte response: ');
                      console.log(response);
                      /*openFB.api({
                          path: "/{your app version in facebook developer envi.}/me?",
                          params: { "access_token": accessToken, "?fields":"name,email,gender,user_birthday,locale,bio&access_token='"+accessToken+"'" },
                          success: function (response) {
                              var data = JSON.stringify(response);
                             // do whatever you want with the data for example
                             $(".data_div").html(data); 
                             $(".data_email").html(data.email);

                          },
                          error: function(err){
                          alert(err);
                         }
                      });*/
                  }
                  else { 
                    console.log("EMPTY RESPONSE ----- LOGGING INTO FB!!!!");
                  }
              }
              else { 
                console.log("error LOGGING INTO FB!!!!");
              }
          }, {scope: 'public_profile,email,user_friends,user_posts'});
          /*Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email', 'user_friends', 'user_posts']}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            else
            {
                //after logging in update FB friend list
                Meteor.call('updateFBFriendList', Meteor.user());
                //Router.go('/songboard');
                FlowRouter.go('/songboard');
            }
        });*/
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
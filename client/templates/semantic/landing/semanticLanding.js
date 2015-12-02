var trendingSongsLoaded = new ReactiveVar(false);
var recentSongsLoaded = new ReactiveVar(false);

Template.semanticLanding.onRendered(function () {
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

Template.semanticLanding.helpers({
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
      if(this.st.indexOf('(') > 0)
      {
        return this.st.substring(0, this.st.indexOf('(')-1); 
      }
      else if(this.st.indexOf('(') == 0)
      {
        if(this.st.indexOf(')') < 30)
          return this.st.substring(1, this.st.indexOf(')'));
        else
        {
          var putTogetherString = '';
          var count = 3;
          var index = 0;
          while(index < count)
          {
            putTogetherString += x.replace('(', '').replace(')', '');
            putTogetherString += " ";
            count++;
          }

          return putTogetherString;
        }
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
                Meteor.call('updateFBFriendList', Meteor.user());
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
    },

    'click #btnLrgScrnWatchHowGroovliWorks': function(event) {
      if($('#watchVimeoHowItWorksContainer').is(":visible"))
        {
          $('#watchVimeoHowItWorksContainer').slideUp();
          $('#btnLrgScrnWatchHowGroovliWorks').text('Watch how Groovli works!');
          $('#btnSmlScrnWatchHowGroovliWorks').text('Watch how Groovli works!');
          $('html, body').animate({
              scrollTop: 0
          }, 300);
          amplitude.logEvent('WATCH how it works video');
        }
        else
        {
          $('#watchVimeoHowItWorksContainer').slideDown();
          $('#btnLrgScrnWatchHowGroovliWorks').text('Hide Video');
          $('#btnSmlScrnWatchHowGroovliWorks').text('Hide Video');
          $('html, body').animate({
              scrollTop: $('#watchVimeoHowItWorksContainer').offset().top - 70
          }, 300);
          amplitude.logEvent('CLOSE how it works video');
        }
    },
    'click #btnSmlScrnWatchHowGroovliWorks': function(event) {
      if($('#watchVimeoHowItWorksContainer').is(":visible"))
        {
          $('#watchVimeoHowItWorksContainer').slideUp();
          $('#btnSmlScrnWatchHowGroovliWorks').text('Watch how Groovli works!');
          $('#btnLrgScrnWatchHowGroovliWorks').text('Watch how Groovli works!');
          $('html, body').animate({
              scrollTop: 0
          }, 300);
          amplitude.logEvent('WATCH how it works video');
        }
        else
        {
          $('#watchVimeoHowItWorksContainer').slideDown();
          $('#btnSmlScrnWatchHowGroovliWorks').text('Hide Video');
          $('#btnLrgScrnWatchHowGroovliWorks').text('Hide Video');
          $('html, body').animate({
              scrollTop: $('#watchVimeoHowItWorksContainer').offset().top - 70
          }, 300);
          amplitude.logEvent('CLOSE how it works video');
        }
    }
    
});

/*function enableDropdown(){
  $('.ui.dropdown.landingDropdownMenu').dropdown();
}*/
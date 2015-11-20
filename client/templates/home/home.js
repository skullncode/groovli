Template.home.rendered = function() {
  if(Meteor.user() && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
  {
    Meteor.call('addAdminRolesToKing', Meteor.user().services.facebook.email);
    Meteor.call('setUserBaseLocation', Meteor.user().services.facebook.id);
    //analytics.track("logged in user loaded home page");
    //mixpanel.track("logged in user loaded home page");
  }
  else
  {
    //analytics.track("anonymous user loaded home page");
    //mixpanel.track("anonymous user loaded home page");
  }
  getLast20Songs();
};

Template.home.helpers({
  landingPageSongList: function() {
    return Session.get('lp_slide_list');
  }
});

function getLast20Songs(){
  Meteor.call('getLast20SongsForLandingPage', function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
        //console.log('GOT THIS BACK From the server: ');
        //console.log(result);
        Session.set('lp_slide_list', result)
      }
  });
}
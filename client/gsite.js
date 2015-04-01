if (Meteor.isClient) {
  Meteor.startup(function() {
     Session.set('songs_loaded', false); 
  }); 
}
if (Meteor.isClient) {   
  Template.watchVimeoHowItWorksTemplate.helpers({
    vimeoOpen: function() {
      return Session.get('vimOpen');
    }
  });
}
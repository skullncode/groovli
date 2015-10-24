Template._header.helpers({
  currentlyOnHomePage: function(){
    //return Router.current().route.path() === '/';
    return FlowRouter.current().path === '/';
  },
  currentlyOnSongBoard: function() {
    FlowRouter.watchPathChange();
    var currentContext = FlowRouter.current();
    //console.log('IN HELPER:');
    //console.log("THIS IS THE currentContext");
    //console.log(currentContext);
    return currentContext.path === '/songboard';
  }
});
Template._header.events({
    'click #contactButton': function(event) {
    	//console.log('CLICKED contact form link!!!!');
    	slidePanel.overlay(true);
    	slidePanel.showPanel('contactForm');
    	Session.set('feedbackType', 'bug');
		Session.set('siteSpeed', 'fast');
    },
    'click #pollButton': function(event) {
    	//console.log('CLICKED contact form link!!!!');
    	slidePanel.overlay(true);
    	slidePanel.showPanel('pollForm');
    }
});


Template._header.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData');  
  });
});

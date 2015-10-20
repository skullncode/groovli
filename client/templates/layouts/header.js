Template.header.helpers({
  currentlyOnHomePage: function(){
    //return Router.current().route.path() === '/';
    var result = FlowRouter.current().path === '/';
    //console.log('CURRENTLY ON HOME PAGE: ' + result);
    //console.log(Meteor.user());
    return FlowRouter.current().path === '/' || FlowRouter.current().path === '/v2';
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

Template.header.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData');  
  });
});


/*Template.header.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData');  
  });
});*/
/*Template.header.events({
    'click #contactButton': function(event) {
    	//console.log('CLICKED contact form link!!!!');
    	//slidePanel.overlay(true);
    	//slidePanel.showPanel('contactForm');
    	Session.set('feedbackType', 'bug');
		Session.set('siteSpeed', 'fast');
    },
    'click #pollButton': function(event) {
    	//console.log('CLICKED contact form link!!!!');
    	slidePanel.overlay(true);
    	slidePanel.showPanel('pollForm');
    }
});*/
Template.header.helpers({
  currentlyOnHomePage: function(){
    return Router.current().route.path() === '/';
  }
});
Template.header.events({
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
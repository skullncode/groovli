if (Meteor.isClient) {
  Meteor.startup(function() {
     Session.set('songs_loaded', false);
  });
	Deps.autorun(function() {
		if(Meteor.user() && Meteor.user().services !== undefined && Meteor.user().services.facebook !== undefined)
			Session.set('ud', Meteor.user().services.facebook.id);
		else
			console.log('STILL DONT HAVE METEOR USER!!!');
		
		Meteor.subscribe('songs', Session.get('ud'));
	})
}
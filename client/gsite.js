if (Meteor.isClient) {
  Meteor.startup(function() {
     Session.set('songs_loaded', false);
     Session.set('activeTab', 'me');
     Session.set('animatedToSong', false);
     Session.set('mygroovsPlayedLength', 0);
     Session.set('tastemakersPlayedLength',0);
  });
	Deps.autorun(function() {
		if(Meteor.user() && Meteor.user().services !== undefined && Meteor.user().services.facebook !== undefined)
			Session.set('ud', Meteor.user().services.facebook.id);
		//else
			//console.log('STILL DONT HAVE METEOR USER!!!');
		
		Meteor.subscribe('songs', Session.get('ud'));
	})
}
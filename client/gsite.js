if (Meteor.isClient) {
  Meteor.startup(function() {
     Session.set('songs_loaded', false);
     Session.set('activeTab', 'me');
     Session.set('animatedToSong', false);
     Session.set('mygroovsPlayedLength', 0);
     Session.set('tastemakersPlayedLength',0);
     Session.set('globalPlayedLength',0);

    //blog client configuration
	//console.log('Blog: configuring comments.');
	Blog.config({
		comments: {
		  disqusShortname: 'groovli'
		}
	});

  });
	Deps.autorun(function() {
		if(Meteor.user() && Meteor.user().services !== undefined && Meteor.user().services.facebook !== undefined)
			Session.set('ud', Meteor.user().services.facebook.id);
		//else
			//console.log('STILL DONT HAVE METEOR USER!!!');
		
		Meteor.subscribe('songs', Session.get('ud'), null);

		Meteor.subscribe('artists');

		Meteor.subscribe('messages', Session.get('ud'));

		var msgCount = Messages.find({'to': String(Session.get('ud')), 'read': false}).fetch();
		//console.log('THIS IS THE MSG COUNT RESULT: ');
	    //console.log(msgCount);
	    if(msgCount.length > 0)
	    {
	    	//var s = new buzz.sound('/sounds/laser.ogg');
			//s.play();
	        Session.set('umc', msgCount.length);
	    }
	    else
	        Session.set('umc', 0);

		Meteor.subscribe('userStatus');
	})
}
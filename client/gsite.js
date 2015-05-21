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

	//FB SDK configuration
	/*window.fbAsyncInit = function() {
		FB.init({
		  appId      : '848177241914409',
		  status     : true,
		  xfbml      : true
		});
	};*/


  });
	Deps.autorun(function() {
		if(Meteor.user() && Meteor.user().services !== undefined && Meteor.user().services.facebook !== undefined)
			Session.set('ud', Meteor.user().services.facebook.id);
		//else
			//console.log('STILL DONT HAVE METEOR USER!!!');
		
		Meteor.subscribe('songs', Session.get('ud'));

		Meteor.subscribe('userStatus');
	})
}
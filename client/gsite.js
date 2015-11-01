if (Meteor.isClient) {
  Meteor.startup(function() {
     Session.set('songs_loaded', false);
     Session.set('activeTab', 'me');
     Session.set('animatedToSong', false);
     Session.set('mygroovsPlayedLength', 0);
     Session.set('tastemakersPlayedLength',0);
     Session.set('globalPlayedLength',0);
     Session.set('MyGroovsSkipCount', 50);
     Session.set('playlistLoadAmount', 2);
     Session.set('initialMyGroovsLoaded', false);

    //blog client configuration
	//console.log('Blog: configuring comments.');
	/*Blog.config({
		comments: {
		  disqusShortname: 'groovli'
		}
	});*/

	//analytics.load("CDGLDNcbyBEBdoLtea3ZcQq5PbI48oIz");
	//console.log("REACHED END OF MY GROOVS IS: " + Session.get('reachedEndofMyGroovs'));
	mixpanel.init("50bbe12ca3b86338fddb7eb652267601");

	var updateFBFriendListFunction = function () {
		//console.log('LOADING songboard and going to update the fb friendlist!');
		if(userCheck())
			Meteor.call('updateFBFriendList', Meteor.user());
	}

	var getLatestStoriesFromDBAndFBFunction = function () {
		//console.log('LOADING songboard and going to get the latest stories from db and fb!');
		if(userCheck())
			Meteor.call('getLatestStoriesFromDBAndFB');
	}

	var setBaseLocationForUsers = function () {
		if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
			Meteor.call('setLocationForUnsetUsers', Meteor.user().services.facebook.id);
	}
  	//resetSession();
  	if(userCheck())
  		Meteor.call('updateFBFriendList', Meteor.user());

  	Meteor.setInterval(updateFBFriendListFunction, 30000);

  	if(userCheck())
  		Meteor.call('getLatestStoriesFromDBAndFB');

  	Meteor.setInterval(getLatestStoriesFromDBAndFBFunction, 15000);

  	//if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
  	if(userCheck())
  	{
  		Meteor.call('addAdminRolesToKing', Meteor.user().services.facebook.email);
  		Meteor.call('setUserBaseLocation', Meteor.user().services.facebook.id);
  	}
  	Meteor.setInterval(setBaseLocationForUsers, 15000);
	/*Meteor.setInterval(
		function(){
			console.log('Refreshing and getting latest tracks from social networks.');
			Meteor.call('getLatestStoriesFromDBAndFB');
		}, 60000);*/

	//if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
	/*if(userCheck())
	{
		mixpanel.identify(Meteor.user()._id);
		mixpanel.people.set({
		    "$first_name": Meteor.user().services.facebook.first_name,
		    "$last_name": Meteor.user().services.facebook.last_name,
		    "$created": Meteor.user().createdAt,
		    "$email": Meteor.user().services.facebook.email,
		    "$ip": Meteor.user().status.lastLogin.ipAddr
		});
	}*/
  });



	Deps.autorun(function() {
		//if(Meteor.user() && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
		if(userCheck())
		{
			Session.set('ud', Meteor.user().services.facebook.id);
			//else
				//console.log('STILL DONT HAVE METEOR USER!!!');
			
			//STOPPED THIS subscription as it is already being done in the router
			//Meteor.subscribe('songs', Session.get('ud'));
			//subMgr.subscribe('songs', Session.get('ud'));

			Meteor.subscribe('messages', Session.get('ud'));
			//subMgr.subscribe('messages', Session.get('ud'));

			//Meteor.subscribe('artists'); COMMENTED OUT AND MOVED TO SEMANTIC BOARD PAGE

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
		}
		else
		{
			Session.set('ud', null);
		}
	}
	);
}

function userCheck(){
	return Meteor.user() && !_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook);
}
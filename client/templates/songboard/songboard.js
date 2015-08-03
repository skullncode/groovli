Template.songboard.rendered = function() {

	//Youtube iFrame API inclusion
	/*var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	tag.type = "text/javascript";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	console.log('FINISHEd script insertion!!!!');*/

	//MUUT JS inclusion
	/*tag = document.createElement('script');
	tag.src = "//cdn.muut.com/1/moot.min.js";
	tag.type = "text/javascript";
	firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	//MUUT CSS inclusion
	tag = document.createElement('link');
	tag.src = "//cdn.muut.com/1/moot.css";
	tag.type = "text/css";
	firstScriptTag = document.getElementsByTagName('link')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);*/
	mixpanel.init("1e7492b8c08e3a410424e0698a55df03");

	var updateFBFriendListFunction = function () {
		Meteor.call('updateFBFriendList');
	}

	var getLatestStoriesFromDBAndFBFunction = function () {
		Meteor.call('getLatestStoriesFromDBAndFB');
	}

	var setBaseLocationForUsers = function () {
		Meteor.call('setLocationForUnsetUsers', Meteor.user().services.facebook.id);
	}
  	//resetSession();
  	Meteor.call('updateFBFriendList');
  	Meteor.setInterval(updateFBFriendListFunction, 30000);
  	Meteor.call('getLatestStoriesFromDBAndFB');
  	Meteor.setInterval(getLatestStoriesFromDBAndFBFunction, 15000);

  	Meteor.call('addAdminRolesToKing', Meteor.user().services.facebook.email);
  	Meteor.call('setUserBaseLocation', Meteor.user().services.facebook.id);
  	Meteor.setInterval(setBaseLocationForUsers, 15000);
	/*Meteor.setInterval(
		function(){
			console.log('Refreshing and getting latest tracks from social networks.');
			Meteor.call('getLatestStoriesFromDBAndFB');
		}, 60000);*/

	mixpanel.identify(Meteor.user()._id);
	mixpanel.people.set({
	    "$first_name": Meteor.user().services.facebook.first_name,
	    "$last_name": Meteor.user().services.facebook.last_name,
	    "$created": Meteor.user().createdAt,
	    "$email": Meteor.user().services.facebook.email,
	    "$ip": Meteor.user().status.lastLogin.ipAddr
	});
};

Template.songboard.helpers({
	dimmedOverlay: function(){
		if(Session.get('playerStarted'))
			return 'hideDimmer';
		else
			return 'dimmed';
	},
	dimmedLoader: function(){
		if(Session.get('playerStarted'))
			return 'hideDimmer';
		else
			return 'musicLoader';
	},
	currentSongAlbumArt: function() {
		if(!_.isUndefined(Session.get('CS')) && !_.isUndefined(Session.get('CS').LFMLargeAlbumArt))
		{
			if(Session.get('CS').LFMLargeAlbumArt.indexOf('http://') !== -1)
				return "background-image: url("+Session.get('CS').LFMLargeAlbumArt+");background-size:cover;"
			else
				return "";
		}
		else
			return "";
	}
});
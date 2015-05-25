Template.songboard.rendered = function() {

	//Youtube iFrame API inclusion
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	tag.type = "text/javascript";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	//MUUT JS inclusion
	tag = document.createElement('script');
	tag.src = "//cdn.muut.com/1/moot.min.js";
	tag.type = "text/javascript";
	firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	//MUUT CSS inclusion
	tag = document.createElement('link');
	tag.src = "//cdn.muut.com/1/moot.css";
	tag.type = "text/css";
	firstScriptTag = document.getElementsByTagName('link')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


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
	}
});
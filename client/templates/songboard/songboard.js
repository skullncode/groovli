//subsMgr = new SubsManager();

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
		//console.log('LOADING songboard and going to update the fb friendlist!');
		Meteor.call('updateFBFriendList');
	}

	var getLatestStoriesFromDBAndFBFunction = function () {
		//console.log('LOADING songboard and going to get the latest stories from db and fb!');
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
	},
	songLoaded: function(){
		if(Session.get('playerStarted'))
			return true;
		else
			return false;
	}
});

Template.songboard.onCreated(function() {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
    	//console.log('STARTED to get subscription of songs!');
    	//console.log('SONG length: ');
    	//console.log(Songs.find().fetch().length);
    	var tastemakerSelector = getMongoSelectorForFriendSongs();
    	var globalSelector = getMongoSelectorForGlobal();
    	//self.subscribe('allSongsForSongBoard', Meteor.user().services.facebook.id);
    	self.subscribe('last50SongsForMyGroovs', Meteor.user().services.facebook.id);
    	self.subscribe('last50SongsForTastemakers', tastemakerSelector);
    	self.subscribe('last50SongsForGlobal', globalSelector);
    	//console.log('FINISHED getting subscription of songs!');
    	//console.log('SONG length NOW: ');
    	//console.log(Songs.find().fetch().length);
    }
  });
});


function getMongoSelectorForFriendSongs() {
  var counter = 0;
  var selector = "";
  var ender = "]}";
  var query = {};

  var userSelf = {
    "sharedBy.uid": Meteor.user().services.facebook.id
  };

  query["$nor"] = [];

  //first add self ID for exclusion from tastemaker list
  query["$nor"].push(userSelf);

  //if friends are unfollowed they need to be excluded from the tastemaker list also
  if(!_.isUndefined(Meteor.user().unfollowedFriends) && Meteor.user().unfollowedFriends.length > 0)
  {
    while(counter < Meteor.user().unfollowedFriends.length)
    {
      var unfollowedFriendObj = {
        "sharedBy.uid": Meteor.user().unfollowedFriends[counter].fbid
      };
      query["$nor"].push(unfollowedFriendObj);
      counter++;
    }
  }

  counter = 0;
  //if(Meteor.user().fbFriends.length > 1)
  if(!_.isUndefined(Meteor.user().tastemakers) && Meteor.user().tastemakers.length > 0)
  {
    query["$or"] = [];

    //while(counter < Meteor.user().fbFriends.length)
    while(counter < Meteor.user().tastemakers.length)
    {
      //if(Meteor.user().fbFriends.length === 1)
      //if(Meteor.user().tastemakers.length === 1)
        //query["sharedBy.uid"] = Meteor.user().tastemakers[counter].fbid;
      //else
      //{
        var additional = {
          "sharedBy.uid": Meteor.user().tastemakers[counter].fbid
        }
        query["$or"].push(additional);
      //}

      counter++;
    }
  }
  else
  {
    query["$or"] = [];
    //use a fake user to simplify not selecting anyone if tastemakers is empty
    var fakeUser = {
      "sharedBy.uid": String('testid_willnever_betrue')
    }
    query["$or"].push(fakeUser);
  }

  //console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED!!!!!');
  //console.log(query);

  return query;
}

function getMongoSelectorForGlobal() {
  var counter = 0;
  var selector = "";
  var ender = "]}";
  var query = {};

  var userSelf = {
    "sharedBy.uid": Meteor.user().services.facebook.id
  };

  query["$nor"] = [];

  //first add self ID for exclusion from Global list
  query["$nor"].push(userSelf);


  //if(!_.isUndefined(Meteor.user().fbFriends)) {
  if(!_.isUndefined(Meteor.user().tastemakers)) {
    //then add all of user's friends for exclusion from Global list
    //while(counter < Meteor.user().fbFriends.length)
    while(counter < Meteor.user().tastemakers.length)
    {
      //var unfollowedFriends = Meteor.user().unfollowedFriends;
      //if user is an unfollowed friend, i.e not showing up in the unfollowed friend lsit, then only they should be added to the NOR list for the global list
      //if((!_.isUndefined(unfollowedFriends) && _.isUndefined(_.findWhere(Meteor.user().unfollowedFriends, {fbid: Meteor.user().fbFriends[counter].fbid}))) || (_.isUndefined(unfollowedFriends)))
      //{
        var additional = {
          //"sharedBy.uid": Meteor.user().fbFriends[counter].fbid
          "sharedBy.uid": Meteor.user().tastemakers[counter].fbid
        };
        query["$nor"].push(additional);
      //}

      counter++;
    }
  }

  //console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED FOR THE GLOBAL LIST!!!!!');
  //console.log(query);

  return query;
}
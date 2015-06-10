Template.artistTabs.helpers({
	getSongsForArtist: function() {
		getSongsForSpecificArtist();
	},

	songsForArtist: function() {
		return Session.get(Router.current().params._name+'_as');
	},

	coverSongsForArtist: function()	{
		return Session.get(Router.current().params._name+'_acs');
	},

	artistSpecificActivePeople: function() {
		return Session.get(Router.current().params._name+'_ausers');
	},

	songCount: function() {
		//console.log('CHECKING SONG COUNT!!!');
		if(Session.get(Router.current().params._name+'_as_count') > 1 || Session.get(Router.current().params._name+'_as_count') === 0)
			return '<h2><strong>'+Session.get(Router.current().params._name+'_as_count')+'</strong></h2><p><small>songs on Groovli</small></p>';
		else if(Session.get(Router.current().params._name+'_as_count') === 1)
			return '<h2><strong>'+Session.get(Router.current().params._name+'_as_count')+'</strong></h2><p><small>song on Groovli</small></p>';
	},

	hasCoverSongs: function() {
		if(Session.get(Router.current().params._name+'_acs_count') > 0)
			return true;
		else
			return false;
	},

	hasUsers: function() {
		if(!_.isUndefined(Session.get(Router.current().params._name+'_ausers')) && Session.get(Router.current().params._name+'_ausers').length > 0)
			return true;
		else
			return false
	},

	userIsKing: function() {
		return isUserKing();
	}
});

Template.artistTabs.onRendered(function () {
  // Use the Packery jQuery plugin
  Session.set('reviewActive', false);
});

function isUserProfileYou()
{
	return Router.current().params._id === Meteor.user()._id;
}

function isUserKing()
{
	//return ((Meteor.user().services.facebook.id === '721431527969807') && isUserProfileYou()) ; // only check with Sandeep's FB ID
	return ((Meteor.user().services.facebook.email === 'reverieandreflection@gmail.com') && isUserProfileYou()) ; // only check with Sandeep's FB email id
}

function getSongsForSpecificArtist()
{
	//console.log('GOING TO GET LISTEN HISTORY FOR THIS USER: ' + uid);
	Meteor.call('getSongsForSpecificArtist', Router.current().params._name, function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	        // do something with result
	      //console.log(result);
	      //update listen history with song object and timestamp
	      var artSongs = _.map(result, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});
	      //console.log('GOT history BACK and modified it to be this: ' );
	      //console.log(lh);
	      Session.set(Router.current().params._name+'_as', artSongs);
	      Session.set(Router.current().params._name+'_as_count', artSongs.length);
	      getUsersFromSongList(artSongs);
	      getCoverSongsForSpecificArtist();
	    }
	});
}

function getCoverSongsForSpecificArtist()
{
	//console.log('GOING TO GET LISTEN HISTORY FOR THIS USER: ' + uid);
	Meteor.call('getCoverSongsForSpecificArtist', Router.current().params._name, function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	        // do something with result
	      //console.log(result);
	      //update listen history with song object and timestamp
	      var coverSongs = _.map(result, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});
	      //console.log('GOT history BACK and modified it to be this: ' );
	      //console.log(lh);
	      Session.set(Router.current().params._name+'_acs', coverSongs);
	      Session.set(Router.current().params._name+'_acs_count', coverSongs.length);
	      getUsersFromSongList(coverSongs);
	    }
	});
}

function getUsersFromSongList(songList)
{
	var userListForArtist = Session.get(Router.current().params._name+'_ausers');
	if(_.isUndefined(userListForArtist))
		userListForArtist = [];

	_.each(songList, function(x){
		if(!_.isUndefined(x.songObj) && !_.isUndefined(x.songObj.sharedBy))
		{
			_.each(x.songObj.sharedBy, function(y){
				if(!_.isEmpty(y) && y.uid !== Meteor.user().services.facebook.id && _.isUndefined(_.findWhere(userListForArtist, {uid: y.uid})))
				{
					userListForArtist.push(y)
				}
			});
		}
	});

	Session.set(Router.current().params._name+'_ausers', userListForArtist);
}

function getMutualListenHistory(lh, uid)
{
	if(isUserProfileYou())
	{
		Meteor.call('getMutualListenHistory', lh, uid, function(error, result) {
			if(error){
		        console.log(error.reason);
		    }
		    else{
		    	//console.log('MUTUAL LISTEN HISTORY SUCCESS: ');
		    	//console.log(result);
		    	var mlh = _.map(result, function(lis){ return {_id: lis._id, soc_id: lis.soc_id, soc_name: lis.soc_name, songObj: Songs.findOne({'sl': lis.sl})}});
		    	//console.log('THIS IS THE MAPPED MLH: ');
		    	//console.log(mlh);
		    	var cleanedMlh = [];
		    	var mlhAndCount = [];
		    	_.each(mlh, function(x) {
		    		//console.log('inside the mlh function: ');
		    		if(!_.isUndefined(x.songObj))
		    		{
			    		var foundListen = _.findWhere(cleanedMlh, {_id: x._id, soc_id: x.soc_id, soc_name: x.soc_name, sa: x.songObj.sa, st: x.songObj.st, sl: x.songObj.sl});
			    		//console.log('THIS IS THE FIND LOC: ' + foundListen);
			    		if(_.isUndefined(foundListen))
			    		{
			    			//console.log('PUSHING THIS link for the first time: ' + x.songObj.sl);

			    			cleanedMlh.push({_id: x._id, soc_id: x.soc_id, soc_name: x.soc_name, sa: x.songObj.sa, st: x.songObj.st, sl: x.songObj.sl});
			    			mlhAndCount.push({_id: x._id, soc_id: x.soc_id, soc_name: x.soc_name, sa: x.songObj.sa, st: x.songObj.st, sl: x.songObj.sl, listenCount: 1});
			    		}
			    		else
			    		{
			    			//console.log('PUSHING THIS link for not the first time: ' + x.songObj.sl);
			    			var loc = _.indexOf(cleanedMlh, foundListen);
			    			mlhAndCount[loc].listenCount += 1;
			    		}
		    		}
		    	});
		    	//console.log('THIS IS THE CLEANED mlh:');
		    	//console.log(mlhAndCount);
		    	Session.set(uid+'_mlh', mlhAndCount);
		    }
		});
	}
}

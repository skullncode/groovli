Template.profileTabs.helpers({
	retrieveListenHistoryForUser: function()
	{
		getListenHistoryForUser(Router.current().params._id);
	},

	listenHistoryForUser: function()
	{
		return Session.get(Router.current().params._id+'_lh');
	},

	mutualListenHistoryForUser: function()
	{
		return Session.get(Router.current().params._id+'_mlh');
	},

	mutualListenHistoryMatchCount: function()
	{
		if(!_.isUndefined(Session.get(Router.current().params._id+'_mlh')))
			return Session.get(Router.current().params._id+'_mlh').length;
		else 
			return 0;
	},

	historyCount: function()
	{
		return Session.get(Router.current().params._id+'_lh_count');
	},

	userProfileIsYou: function() {
		return isUserProfileYou();
	},

	userIsKing: function() {
		return isUserKing();
	},

	favoritesForUser: function()
	{
		return Favorites.find({'userId': String(Router.current().params._id)}).fetch();
	},

	faveCount: function()
	{
		return Favorites.find({'userId': String(Router.current().params._id)}).fetch().length;
	},

	pluralFaves: function() 
	{
		if(Favorites.find({'userId': String(Router.current().params._id)}).fetch().length > 1 || Favorites.find({'userId': String(Router.current().params._id)}).fetch().length == 0)
			return true;
		else
			return false;
	}
});

Template.profileTabs.onCreated(function () {
  var self = this;

  // Use self.subscribe with the data context reactively
  self.autorun(function () {
    /*var dataContext = Template.currentData();
    console.log("THIS IS THE SONG ID for faves: ");
    console.log(dataContext);*/
    self.subscribe("favoritesForSpecificUser", String(Router.current().params._id));
    /*var favesForThisUser = Favorites.find({'referenceId': String(Router.current().params._id)}).fetch();
    Session.set('fftu', favesForThisUser)*/
    //console.log('THIS IS THE RESULT OF FAVES FOR CURRENT SONG ');
    //console.log(favesForThisSong);
  });
});

Template.profileTabs.onRendered(function () {
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

function getListenHistoryForUser(uid)
{
	//console.log('GOING TO GET LISTEN HISTORY FOR THIS USER: ' + uid);
	Meteor.call('getListenHistoryForUser', uid, function(error,result){
	    if(error){
	        console.log(error.reason);
	    }
	    else{
	        // do something with result
			//console.log(result);
			//update listen history with song object and timestamp

			/*var lh = _.map(result, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});
			//console.log('GOT history BACK and modified it to be this: ' );
			//console.log(lh);*/

			if(!_.isEmpty(result))
			{
				//second object in result array is the mapped listen history which was previously done on client side
				Session.set(uid+'_lh', result[1]);
				Session.set(uid+'_lh_count', result[1].length);

				//first object in result array is the cleaned listen history that was used to do the mapping previously on the client side
				getMutualListenHistory(result[0], Router.current().params._id);
			}
	    }
	});
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

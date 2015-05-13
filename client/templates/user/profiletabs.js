Template.profileTabs.helpers({
	retrieveListenHistoryForUser: function()
	{
		getListenHistoryForUser(Router.current().params._id);
	},

	retrieveExistingSongsForReview: function()
	{
		getExistingSongsForReview();
	},

	retrievePendingSongsForReview: function()
	{
		getPendingSongsForReview();
	},

	listenHistoryForUser: function()
	{
		return Session.get(Router.current().params._id+'_lh');
	},

	mutualListenHistoryForUser: function()
	{
		return Session.get(Router.current().params._id+'_mlh');
	},

	existingSongsForReview: function() 
	{
		return Session.get(Router.current().params._id+'_esReview');
	},

	existingCount: function()
	{
		return Session.get(Router.current().params._id+'_esReviewCount');
	},

	pendingSongsForReview: function() 
	{
		return Session.get(Router.current().params._id+'_psReview');
	},

	pendingCount: function()
	{
		return Session.get(Router.current().params._id+'_psReviewCount');
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
	}
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
	      getMutualListenHistory(result, Router.current().params._id);
	      var lh = _.map(result, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});
	      //console.log('GOT history BACK and modified it to be this: ' );
	      //console.log(lh);
	      Session.set(uid+'_lh', lh);
	      Session.set(uid+'_lh_count', lh.length);
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
		    	var cleanedMlh = [];
		    	var mlhAndCount = [];
		    	_.each(mlh, function(x) {
		    		//console.log('inside the mlh function: ');
		    		var foundListen = _.findWhere(cleanedMlh, {_id: x._id, soc_id: x.soc_id, soc_name: x.soc_name, sa: x.songObj.sa, st: x.songObj.st, sl: x.songObj.sl});
		    		//console.log('THIS IS THE FIND LOC: ' + findLoc);
		    		if(_.isUndefined(foundListen))
		    		{
		    			cleanedMlh.push({_id: x._id, soc_id: x.soc_id, soc_name: x.soc_name, sa: x.songObj.sa, st: x.songObj.st, sl: x.songObj.sl});
		    			mlhAndCount.push({_id: x._id, soc_id: x.soc_id, soc_name: x.soc_name, sa: x.songObj.sa, st: x.songObj.st, sl: x.songObj.sl, listenCount: 1});
		    		}
		    		else
		    		{
		    			var loc = _.indexOf(cleanedMlh, foundListen);
		    			mlhAndCount[loc].listenCount += 1;
		    		}
		    	});
		    	//console.log('THIS IS THE CLEANED mlh:');
		    	//console.log(mlhAndCount);
		    	Session.set(uid+'_mlh', mlhAndCount);
		    }
		});
	}
}

function getExistingSongsForReview()
{
	Meteor.call('reviewExistingSongs', function(error, result) {
			if(error){
		        console.log(error.reason);
		    }
		    else{
		    	console.log('REVIEW EXISTING SUCCESS: ');
		    	//console.log(result);
		    	Session.set(Router.current().params._id+'_esReview', result);
		    	Session.set(Router.current().params._id+'_esReviewCount', result.length);
		    }
		});
}

function getPendingSongsForReview()
{
	Meteor.call('reviewPendingSongs', function(error, result) {
			if(error){
		        console.log(error.reason);
		    }
		    else{
		    	console.log('REVIEW PenDING SUCCESS: ');
		    	//console.log(result.length);
		    	Session.set(Router.current().params._id+'_psReview', result);
		    	Session.set(Router.current().params._id+'_psReviewCount', result.length);
		    }
		});
}
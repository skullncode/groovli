var recentListensLoaded = new ReactiveVar(false);

Template.recentListens.helpers({
	getListenHistory: function() {
		getListenHistoryForUser(FlowRouter.current().params._id);
	},
	recentListenHistoryExists: function() {
		if(!_.isEmpty(Session.get(FlowRouter.current().params._id+'_lh')))
			return true;
		else
			return false;
	},
	songsJustListened: function() {
		return Session.get(FlowRouter.current().params._id+'_lh');
	},
	listenedTimestamp: function() {
		if(!_.isUndefined(Session.get(FlowRouter.current().params._id+'_lh')))
			return new moment(this.timestamp).calendar();
	},
	imageActuallyExists: function() {
		if(this.songObj.iTunesLargeAlbumArt.indexOf("http") >= 0)
			return true;
		else
			return false;
	},
	recentListensLoaded: function() {
		return recentListensLoaded.get();
	}
});


function getListenHistoryForUser(uid)
{
	//console.log('GOING TO GET LISTEN HISTORY FOR THIS USER: ' + uid);
	//recentListensLoaded.set(false);
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
				Session.set(uid+'_lh', _.first(result[1],6));
				Session.set(uid+'_lh_count', result[1].length);
				recentListensLoaded.set(true);
				//first object in result array is the cleaned listen history that was used to do the mapping previously on the client side
				//getMutualListenHistory(result[0], FlowRouter.current().params._id);
			}
	    }
	});
}

/*function getMutualListenHistory(lh, uid)
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
}*/
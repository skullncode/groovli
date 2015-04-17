Template.listenHistory.helpers({
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

	historyCount: function()
	{
		return Session.get(Router.current().params._id+'_lh_count');
	},

	userProfileIsYou: function() {
		return Router.current().params._id === Meteor.user()._id;
	}
});

function getListenHistoryForUser(uid)
{
	console.log('GOING TO GET LISTEN HISTORY FOR THIS USER: ' + uid);
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
	Meteor.call('getMutualListenHistory', lh, uid, function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	console.log('MUTUAL LISTEN HISTORY SUCCESS: ');
	    	console.log(result);
	    	var mlh = _.map(result, function(lis){ return {timestamp: lis.timestamp, _id: lis._id, soc_id: lis.soc_id, soc_name: lis.soc_name, songObj: Songs.findOne({'sl': lis.sl})}});
	    	Session.set(uid+'_mlh', mlh);
	    }
	});
}
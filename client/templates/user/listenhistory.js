Template.listenHistory.helpers({
	retrieveListenHistoryForUser: function()
	{
		getListenHistoryForUser(Router.current().params._id);
	},

	listenHistoryForUser: function()
	{
		return Session.get(Router.current().params._id+'_lh');
	},

	historyCount: function()
	{
		return Session.get(Router.current().params._id+'_lh_count');
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
	      var lh = _.map(result, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});
	      //console.log('GOT history BACK and modified it to be this: ' );
	      //console.log(lh);
	      Session.set(uid+'_lh', lh);
	      Session.set(uid+'_lh_count', lh.length);
	    }
	});

}
Template.reviewPending.helpers({
	retrievePendingSongsForReview: function()
	{
		getPendingSongsForReview();
	},

	pendingSongsForReview: function() 
	{
		return Session.get('psReview');
	},

	pendingCount: function()
	{
		return Session.get('psReviewCount');
	},
});


function getPendingSongsForReview()
{
	Meteor.call('reviewPendingSongs', function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW PenDING SUCCESS: ');
	    	//console.log(result.length);
	    	Session.set('psReview', result);
	    	Session.set('psReviewCount', result.length);
	    }
	});
}
Template.reviewGenres.helpers({
	retrieveGenresForReview: function()
	{
		getGenresForReview();
	},

	existingGenresForReview: function() 
	{
		return Session.get('genReview');
	},

	existingCount: function()
	{
		return Session.get('genReviewCount');
	}
});

Template.reviewGenres.events({
	"click #getGenreDetails": function (event) {
      console.log('CLICKED set genres details button!!');
      Meteor.call('setDetailsForUnsetGenres');
      location.reload();
    }
});

function getGenresForReview()
{
	/*var result = Artists.find({}).fetch();
	Session.set('artistsReview', result);
	Session.set('artistsReviewCount', result.length);*/
	//Meteor.call('checkAndSetDetailsForSpecificGenre', 'metal');
		
	Meteor.call('reviewExistingGenres', function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW ARTIST SUCCESS: ');
	    	//console.log(result);
	    	Session.set('genReview', result);
	    	Session.set('genReviewCount', result.length);
	    }
	});
}


Template.reviewExisting.helpers({
	retrieveExistingSongsForReview: function()
	{
		getExistingSongsForReview();
	},

	existingSongsForReview: function() 
	{
		return Session.get('esReview');
	},

	existingCount: function()
	{
		return Session.get('esReviewCount');
	}
});

Template.reviewExisting.events({
	"click #getMissingAlbumArt": function (event) {
      console.log('CLICKED get missing album art button!!');
      var songList = Session.get('esReview');
      var x = 0;
      while(x < songList.length)
      {
      	if(!_.isUndefined(songList[x].LFMLargeAlbumArt) && songList[x].LFMLargeAlbumArt.indexOf('http') !== 0)
      	{
      		//console.log('THIS SONG: ' + songList[x].st + ' DOES NOT HAVE ALBUM ART!!!!');
      		Meteor.call('doManualLFMValidationForLink', songList[x].sl, songList[x].sa, songList[x].st, 'YT');
      	}
      	x++;	
      }
      //location.reload();
    }
});

function getExistingSongsForReview()
{
	//var result = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}).fetch();
	var result = Songs.find({}).fetch();
	Session.set('esReview', result);
	Session.set('esReviewCount', result.length);
	/*Meteor.call('reviewExistingSongs', function(error, result) {
		if(error){
	        console.log(error.reason);
	    }
	    else{
	    	//console.log('REVIEW EXISTING SUCCESS: ');
	    	//console.log(result);
	    	Session.set('esReview', result);
	    	Session.set('esReviewCount', result.length);
	    }
	});*/
}


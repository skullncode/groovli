Session.setDefault('existingCursor', 0);

Template.reviewExisting.helpers({
	retrieveExistingSongsForReview: function()
	{
		getExistingSongsForReview();
	},

	existingSongsForReview: function() 
	{
		//return Session.get('esReview');
		return Songs.find({},{limit:20,skip:Session.get('existingCursor')});
	},

	existingCount: function()
	{
		return Session.get('esReviewCount');
	},

	nextText: function() 
	{
		if(Number(Session.get('existingCursor')) < Number(Session.get('esReviewCount') - 20))
		{
			return (Number(Session.get('existingCursor')) + 20) + " - " + (Number(Session.get('existingCursor')) + 40);
		}
		
		return '';
	}, 

	prevText: function() 
	{
		if(Number(Session.get('existingCursor')) < 20)
		{
			return '';
		}

		return (Number(Session.get('existingCursor')) - 20) + " - " + (Number(Session.get('existingCursor')));
	}
});

Template.reviewExisting.events({
	/*"click #getMissingAlbumArt": function (event) {
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
    },*/
	"click .previous": function (event) {
		if(Number(Session.get('existingCursor')) > 19)
		{
      		Session.set('existingCursor', Number(Session.get('existingCursor')) - 20);
		}
    },
    "click .next": function (event) {
    	if(Number(Session.get('existingCursor')) < Number(Session.get('esReviewCount') - 20))
			Session.set('existingCursor', Number(Session.get('existingCursor')) + 20);
    }

});

function getExistingSongsForReview()
{
	//var result = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}).fetch();
	var result = Songs.find({}).count();
	//Session.set('esReview', result);
	//console.log('THIS IS THE SONG RESULT: ');
	//console.log(result);
	Session.set('esReviewCount', result);
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


Songs = new Mongo.Collection('songs');

fbGraphURLforFriends = 'https://graph.facebook.com/me/friends?access_token=#TOKEN#';


function swapHTTPWithHTTPSInYoutubeLink(link) {
	if(link.indexOf('https://') >= 0)
		return link;
	else
	{
		//console.log('THIS IS THE YOUTUBE LINK: ' + link);
		//console.log('SWAPPING OUT HTTP WITH HTTPS!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ');
		return link.replace('http://','https://');
	}
}

function cleanTrackQueryPriorToLastFMCheck(trackQuery)
{
	//clean up track information for searching Last.FM
	var insideBraces = '';
	if(trackQuery.indexOf('(') >= 0 && trackQuery.indexOf(')') >= 0)
	{
		insideBraces = trackQuery.substring(trackQuery.indexOf('(')+1,trackQuery.indexOf(')'));
		trackQuery = trackQuery.replace(insideBraces,' ');
		//console.log('what's inside the braces' + insideBraces);
	}
	else if(trackQuery.indexOf('[') >= 0 && trackQuery.indexOf(']') >= 0)
	{
		insideBraces = trackQuery.substring(trackQuery.indexOf('[')+1,trackQuery.indexOf(']'));
		trackQuery = trackQuery.replace(insideBraces,' ');
		//console.log('what's inside the braces' + insideBraces);
	}
	else if(trackQuery.indexOf('{') >= 0 && trackQuery.indexOf('}') >= 0)
	{
		insideBraces = trackQuery.substring(trackQuery.indexOf('{')+1,trackQuery.indexOf('}'));
		trackQuery = trackQuery.replace(insideBraces,' ');
		//console.log('what's inside the braces' + insideBraces);
	}

	trackQuery = trackQuery.replace('&', 'and');

	trackQuery = trackQuery.toUpperCase();
	trackQuery = trackQuery.replace('OFFICIAL MUSIC VIDEO',' ');
	trackQuery = trackQuery.replace('LYRICS',' ');
	trackQuery = trackQuery.replace('HD',' ');
	trackQuery = trackQuery.replace('OFFICIAL VIDEO',' ');
	trackQuery = trackQuery.replace('MUSIC VIDEO',' ');
	trackQuery = trackQuery.replace(' FT.',' ');
	//trackQuery = trackQuery.replace(' BY ',' ');

	//console.log('the track query ISSS1: '+ trackQuery);					

	//trackQuery = trackQuery.replace(/[^A-Za-z0-9']/g, ' '); //remove special characters - simpler regex
	trackQuery = trackQuery.replace(/[-'`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
	trackQuery = trackQuery.replace(/\s{2,}/g, ' '); //remove extra whitespace
	trackQuery = trackQuery.trim();

	return trackQuery;
}

Meteor.methods({

	insertNewSong: function(fbResult, network, linkType){
		var secureLink = swapHTTPWithHTTPSInYoutubeLink(fbResult.storyLink);
		var newSong = {
			sl: secureLink,
			dataSource: 'FB',
			type: linkType,
			sa: fbResult.storyTitle,
			st: fbResult.storyTitle,
			sharedBy: [{'uid':fbResult.uid, 'systemDate':fbResult.systemDate, 'msg':fbResult.msgWithStory, 'uname':Meteor.user().profile.name, '_id':Meteor.user()._id}],
			iTunesLargeAlbumArt: cleanTrackQueryPriorToLastFMCheck(fbResult.storyTitle), // in order to find the Song after itunes Validation completes
			LFMLargeAlbumArt: cleanTrackQueryPriorToLastFMCheck(fbResult.storyTitle), // in order to find the Song after lastFm Validation completes
			songSearchText: cleanTrackQueryPriorToLastFMCheck(fbResult.storyTitle),
			iTunesValid: 'PENDING',
			LFMValid: 'PENDING',
			//listenCount: 1,
			aeCount: 0,
			meCount: 0
		};

		var songWithSameID = Songs.findOne({sl: secureLink});

		if (!_.isUndefined(songWithSameID)) {
	      /*console.log('this sONG already EXISTS: ' + fbResult.storyLink);
	      console.log('THIS IS THE SONG WITH THE SAME ID OBJECT: ');
	      console.log(songWithSameID);*/

	      //if Song already exists we need to update the SharedBy to include that person's id ALSO:
	      var sharedByEntry = {'uid':fbResult.uid, 'systemDate':fbResult.systemDate, 'msg':fbResult.msgWithStory, 'uname':Meteor.user().profile.name, '_id':Meteor.user()._id}
	      var sameSongWithNewSharedByDeets = {
	      	sharedBy: sharedByEntry
	      }
	      /*var result = _.findWhere(songWithSameID.sharedBy, sharedByEntry);
	      console.log("THIIIIISSSSSSSSSSSSSSSSSSSSSSSS IS THE RESULT FOR SEARCHING FOR THE SHARED BY: ");
	      console.log(result);
	      console.log("THIS IS THE RESULT OF CHECKING IF THIS ^^^^^^^^^^ IS UNDEFINED OR NOT");
	      console.log(_.isUndefined(result));*/
	      if(_.isUndefined(_.findWhere(songWithSameID.sharedBy, sharedByEntry))) //CHECK TO SEE IF THIS SHARED BY HAS ALREADY BEEN added or not
	      {
	      	//console.log('THIS IS THE CURREnT SHARED BY OBJECT: ');
	      	//console.log(songWithSameID.sharedBy);
	      	//console.log('SHARED BY DOES NOT CONTAIN THIS ENTRY ');
	      	//console.log(sharedByEntry);
	      	//console.log('GOING TO UPDATE EXISTING SONG WITH new SHARED BY DEETS');
	      	Songs.update(songWithSameID._id, { $push: sameSongWithNewSharedByDeets });
	      }
	    }
	    else
	    {
	    	//console.log('this IS A FRESH SONG: ' + fbResult.storyTitle);
	    	Songs.insert(newSong);
	    }
	},

	//CHECK AND SEE WHY DEFTONES TEMPEST IS NOT COMING IN AFTER ITUNES VALIDATION!!!!!!

	updateTrackWithiTunesData: function(songLink, searchterms, iTunesResultObject, matchingWuzzyFactor, cleanedTrackDetails) {

		//console.log('JUST GOING TO UPDATE THIS SONG: ' + searchterms + ' with this detail: ');
		//console.log(iTunesResultObject);

		if (songLink.indexOf('youtube.com'))
		{
			var sid = songLink.substring(songLink.indexOf('v=')+2); 
			var searchString = 'https://www.youtube.com/watch?v=' + sid;
		}

		var iArtist = '';
		var iTitle = '';
		var iAlbumName = '';
		var iYear = '';
		var iGenre = '';
		var iTrackNumber = '';
		var iTrackCount = '';
		var iDiscCount = '';
		var iDiscNumber = '';
		var iTrackPrice = '';
		var iAlbumPrice = '';
		var iPriceCurrency = '';
		var iTrackURL = '';
		var iAlbumURL = '';
		var iTrackExplicit = '';
		var iAlbumExplicit = '';
		var iTrackDuration = '';
		var iMediumAlbumArt = '';
		var iLargeAlbumArt = '';

		if(iTunesResultObject.artistName != undefined && iTunesResultObject.artistName != ' ')
		{
			iArtist = iTunesResultObject.artistName;
		}

		if(iTunesResultObject.trackName != undefined && iTunesResultObject.trackName != ' ')
		{
			iTitle = iTunesResultObject.trackName;
		}

		if(iTunesResultObject.collectionName != undefined && iTunesResultObject.collectionName != ' ')
		{
			iAlbumName = iTunesResultObject.collectionName;
		}

		if(iTunesResultObject.releaseDate != undefined && iTunesResultObject.releaseDate != ' ')
		{
			iYear = iTunesResultObject.releaseDate;
		}

		if(iTunesResultObject.primaryGenreName != undefined && iTunesResultObject.primaryGenreName != ' ')
		{
			iGenre = iTunesResultObject.primaryGenreName;
		}

		if(iTunesResultObject.trackNumber != undefined && iTunesResultObject.trackNumber != ' ')
		{
			iTrackNumber = iTunesResultObject.trackNumber;
		}

		if(iTunesResultObject.trackCount != undefined && iTunesResultObject.trackCount != ' ')
		{
			iTrackCount = iTunesResultObject.trackCount;
		}

		if(iTunesResultObject.discCount != undefined && iTunesResultObject.discCount != ' ')
		{
			iDiscCount = iTunesResultObject.discCount;
		}

		if(iTunesResultObject.discNumber != undefined && iTunesResultObject.discNumber != ' ')
		{
			iDiscNumber = iTunesResultObject.discNumber;
		}

		if(iTunesResultObject.trackPrice != undefined && iTunesResultObject.trackPrice != ' ')
		{
			iTrackPrice = iTunesResultObject.trackPrice;
		}

		if(iTunesResultObject.collectionPrice != undefined && iTunesResultObject.collectionPrice != ' ')
		{
			iAlbumPrice = iTunesResultObject.collectionPrice;
		}

		if(iTunesResultObject.currency != undefined && iTunesResultObject.currency != ' ')
		{
			iPriceCurrency = iTunesResultObject.currency;
		}

		if(iTunesResultObject.trackViewUrl != undefined && iTunesResultObject.trackViewUrl != ' ')
		{
			iTrackURL = iTunesResultObject.trackViewUrl;
		}

		if(iTunesResultObject.collectionViewUrl != undefined && iTunesResultObject.collectionViewUrl != ' ')
		{
			iAlbumURL = iTunesResultObject.collectionViewUrl;
		}

		if(iTunesResultObject.trackExplicitness != undefined && iTunesResultObject.trackExplicitness != ' ')
		{
			iTrackExplicit = iTunesResultObject.trackExplicitness;
		}

		if(iTunesResultObject.collectionExplicitness != undefined && iTunesResultObject.collectionExplicitness != ' ')
		{
			iAlbumExplicit = iTunesResultObject.collectionExplicitness;
		}

		if(iTunesResultObject.trackTimeMillis != undefined && iTunesResultObject.trackTimeMillis != ' ')
		{
			iTrackDuration = iTunesResultObject.trackTimeMillis;
		}

		if(iTunesResultObject.artworkUrl60 != undefined && iTunesResultObject.artworkUrl60 != ' ')
		{
			iMediumAlbumArt = iTunesResultObject.artworkUrl60;
		}

		if(iTunesResultObject.artworkUrl100 != undefined && iTunesResultObject.artworkUrl100 != ' ')
		{
			iLargeAlbumArt = iTunesResultObject.artworkUrl100;
		}

		var iTunesSongProperties = { 
			sa: iArtist, 
			st: iTitle, 
			album: iAlbumName, 
			releaseDate: iYear, 
			genre: iGenre, 
			trackNumber: iTrackNumber, 
			trackCount: iTrackCount, 
			discCount: iDiscCount, 
			discNumber: iDiscNumber, 
			iTunesTrackPrice: iTrackPrice, 
			iTunesAlbumPrice: iAlbumPrice, 
			iTunesPriceCurrency: iPriceCurrency, 
			iTunesTrackURL: iTrackURL, 
			iTunesAlbumURL: iAlbumURL, 
			trackExplicitness: iTrackExplicit, 
			albumExplictness: iAlbumExplicit, 
			trackDuration: iTrackDuration, 
			iTunesLargeAlbumArt: iLargeAlbumArt, 
			iTunesMediumAlbumArt: iMediumAlbumArt,
			iTunesValid: 'VALID',
			wuzzyFactor: matchingWuzzyFactor,
			cleanedTrackSearchQuery: cleanedTrackDetails
		};

		//Songs.update({iTunesLargeAlbumArt: searchterms}, {$set: iTunesSongProperties}, function(error, result) {
		Songs.update({sl: searchString}, {$set: iTunesSongProperties}, function(error, result) {
	      if (error) {
	        // display the error to the user
	        console.log('ENCOUNTERED AN ERROR WHILE TRYING TO UPDATE THE SONG WITH ITUNES DATA: ' + error.reason);
	      }
	      else{
	      	//console.log('################ itunes UPDATE SUCCESS for: ' + searchterms);
	      }
		});
	},

	updateTrackWithLastFMData: function (trackquery, LFMlargeAlbumArt, LFMmediumAlbumArt, LFMArtist, LFMTitle, originalLinkToBeValidated) {
		console.log('INSIDE THE LAST FM UPDATE METHOD SONG SERVER CONTROLLER');

		var LFMSongProperties = { 
			sa: LFMArtist, 
			st: LFMTitle, 
			LFMLargeAlbumArt: LFMlargeAlbumArt, 
			LFMMediumAlbumArt: LFMmediumAlbumArt,
			LFMValid: 'VALID'
		};

		Songs.update({LFMLargeAlbumArt: trackquery}, {$set: LFMSongProperties}, function(error, result) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	//console.log('################ LAST FM UPDATE SUCCESS for: ' + trackquery);
	      }
		});

		/*
		
		Song.find({LFMLargeAlbumArt: trackquery}).exec(function(err, song) {
			if (err) insertNewErrorInLogTable('ENCOUNTERED ERROR while trying to find song to update with LAST FM data: ', err, null);
			if (! song) console.log('Failed to load Song ');
			console.log('this is the FOUND SONG in the backend DB: ');
			//console.log(song[0]);
		
			if(song.length > 0)
			{
				var conditions = { _id: song[0]._id };	
				var update = { $set: { sa: LFMArtist, st: LFMTitle, largeAlbumArt: LFMlargeAlbumArt, mediumAlbumArt: LFMmediumAlbumArt, LFMValid: 'VALID'}};
				var options = { upsert: true };

				Song.update(conditions, update, options, function(err) {
					if (err) {
							insertNewErrorInLogTable('ENCOUNTERED ERROR while trying to u spdate song with LAST FM data: ', err, null);
					} else {
						console.log('SUCCESSFULLY UPDATED track with LFM data: '+LFMArtist);
						sendUpdatedSongDetailsToFrontEnd(song[0].sl, socketObject, originalLinkToBeValidated, 'ADDED');
						//res.jsonp(song);
						markStoryAfterLastFmValidityCheck(song[0].sl, LFMDataFound);
					}
				});
			}
		});*/
	},

	updateListenCount: function(sid, type, count){
		//console.log('INSIDE THE UPDATE LISTEN couNT METHOD FOR SONG SERVER CONTROLLER');
		//console.log('going to update the listen count for: '+ sid);
		var searchString = '';
		if (type == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + sid;
		}

		Songs.update({'sl': searchString}, {$set: { listenCount: count }}, function(error, result) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	//console.log('################ listen count succesfully updated for: ' + searchString);
	      }
		});
	},
	//update Auto Error Count
	updateAEC: function(sid, type, count, errorCode){
		//console.log('INSIDE THE UPDATE LISTEN couNT METHOD FOR SONG SERVER CONTROLLER');
		console.log('going to update the auto error count for: '+ sid);
		var searchString = '';
		if (type == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + sid;
		}

		Songs.update({'sl': searchString}, {$set: { aeCount: count, error: errorCode }}, function(error, result) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ AUTO ERROR count succesfully updated for: ' + searchString);
	      }
		});
	},

	reviewExistingSongs: function() {
		console.log('GOING TO GET ALL EXISTING SONGS in the DB for review: ');
		var x = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'}]}).fetch()
		console.log('THIS IS THE LENGTH : ' + x.length);
		return x;
	},

	reviewPendingSongs: function() {
		console.log('GOING TO GET ALL PENDING SONGS in the DB for review: ');
		var y = Songs.find({$and: [{iTunesValid:'PENDING'},{LFMValid:'PENDING'}], manualApproval: {'$ne': 'VALID'}}).fetch()
		console.log('THIS IS THE LENGTH : ' + y.length);
		return y;
	}, 

	updateSongWithManualApproval: function(link, artist, title, updatedLink, validity) {
		var secureLink = swapHTTPWithHTTPSInYoutubeLink(link);
		var updatedSecureLink = swapHTTPWithHTTPSInYoutubeLink(updatedLink);
		var manualApprovalProperties = {
			sl: updatedSecureLink,
			sa: artist,
			st: title,
			manualApproval: validity
		};

		console.log('REACHEd THE Manual Approval method with this: ');
		console.log(manualApprovalProperties);

		Songs.update({sl: secureLink}, {$set: manualApprovalProperties}, function(error, result) {
	      if (error) {
	        // display the error to the user
	        console.log('ENCOUNTERED AN ERROR WHILE TRYING TO UPDATE THE SONG WITH ITUNES DATA: ' + error.reason);
	      }
	      else{
	      	console.log('################ successfully updated song with manual approval: ' + link);
	      	Meteor.call('doManualItunesValidationForLink', secureLink, 'YT');
	      }
		});
	}
});
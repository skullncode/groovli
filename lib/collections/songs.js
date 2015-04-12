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

	trackQuery = trackQuery.replace(/[^A-Za-z0-9']/g, ' '); //remove special characters - simpler regex
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
			sharedBy: [{'uid':fbResult.uid, 'systemDate':fbResult.systemDate, 'msg':fbResult.msgWithStory, 'uname':Meteor.user().profile.name}],
			iTunesLargeAlbumArt: cleanTrackQueryPriorToLastFMCheck(fbResult.storyTitle), // in order to find the Song after itunes Validation completes
			LFMLargeAlbumArt: cleanTrackQueryPriorToLastFMCheck(fbResult.storyTitle), // in order to find the Song after lastFm Validation completes
			songSearchText: cleanTrackQueryPriorToLastFMCheck(fbResult.storyTitle),
			iTunesValid: 'PENDING',
			LFMValid: 'PENDING',
			listenCount: 1,
			aeCount: 0,
			meCount: 0
		};

		var songWithSameID = Songs.findOne({sl: secureLink});
		if (songWithSameID) {
	      //console.log('this story already EXISTS: ' + fbResult.storyLink);
	    }
	    else
	    {
	    	//console.log('this IS A FRESH SONG: ' + fbResult.storyTitle);
	    	Songs.insert(newSong);
	    }
	},

	//CHECK AND SEE WHY DEFTONES TEMPEST IS NOT COMING IN AFTER ITUNES VALIDATION!!!!!!

	updateTrackWithiTunesData: function(searchterms, iTunesResultObject) {
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
			iTunesValid: 'VALID'
		};

		Songs.update({iTunesLargeAlbumArt: searchterms}, {$set: iTunesSongProperties}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ itunes UPDATE for: ' + searchterms);
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

		Songs.update({LFMLargeAlbumArt: trackquery}, {$set: LFMSongProperties}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ LAST FM UPDATE for: ' + trackquery);
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

		Songs.update({'sl': searchString}, {$set: { listenCount: count }}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      //else{
	      //	console.log('################ listen count succesfully updated for: ' + searchString);
	      //}
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

		Songs.update({'sl': searchString}, {$set: { aeCount: count, error: errorCode }}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ AUTO ERROR count succesfully updated for: ' + searchString);
	      }
		});
	},

	getSongsOfFriends: function()
	{
		//console.log('REACHED THE get SONGS of FRIENDS method!!!!');
		//console.log('this is the users friends now: ');
		console.log(Meteor.user().fbFriends);
	}
});
Stories = new Mongo.Collection('stories');
fbLimit = 50;
//fbGraphURL = 'https://graph.facebook.com/me/links?fields=id,from,name,message,link ,created_time&limit=#POST_LIMIT#&since=#LAST_TIME#&access_token=#TOKEN#';
//SINCE LINKS are STILL NOT FIXED BY FACEBOOK we are USING POSTS instead and it works fine so far
fbGraphURL = 'https://graph.facebook.com/me/posts?fields=id,from,name,message,link,created_time&limit=#POST_LIMIT#&since=#LAST_TIME#&access_token=#TOKEN#';
ytAPI_KEY ='AIzaSyBa-qA8oaPSih-gz3csSqvuXF7JJaWhUEY';
ytValidityCheckURL = 'https://www.googleapis.com/youtube/v3/videos?id=#VID_ID#&key=###API_KEY###&part=snippet,contentDetails,statistics,status';
iTunesAPIURL = 'https://itunes.apple.com/search?term=###TRACKQUERY###';
lastFmURL = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track=###TRACKQUERY###&api_key=3135d1eacd6085271c24a02d4195cccf&format=json';
wuzzyMatchThreshold = 0.60; //percentage %

if(Meteor.isServer) {
//if things are available in the DB for the user, then 
function getLatestDTForCurrentUser(stories) {
	console.log('CHECKING FOR LATEST DT for this user:' + Meteor.user().services.facebook.name);
	var userID = Meteor.user().services.facebook.id;
	var counter = 0;
	var largestDT = 0;
	while (counter < stories.length)
	{
		if(stories[counter].uid === userID) //match it with the required USER ID only then compare for dates
		{
			if(largestDT < stories[counter].systemDate)
			{
				largestDT = stories[counter].systemDate;
			}
		}

		counter++;
	}

	console.log('this is the latest timestamp: '+ largestDT);
	return largestDT;
}

function getStoriesFromFBOnly(dt, pagedQuery) {
	var updatedFBGetURL = '';
	if(_.isEmpty(pagedQuery))
	{
		if(dt === 0) // if last date time stamp is 0 then nothing has ever been brought in for this user; so just remove the SINCE limiter
			updatedFBGetURL = fbGraphURL.replace('#POST_LIMIT#',fbLimit).replace('&since=#LAST_TIME#','').replace('#TOKEN#',Meteor.user().services.facebook.accessToken);
		else
			updatedFBGetURL = fbGraphURL.replace('#POST_LIMIT#',fbLimit).replace('#LAST_TIME#',dt).replace('#TOKEN#',Meteor.user().services.facebook.accessToken);
	}
	else
	{
		console.log('GETTING MORE FB DATA USING PAGED QUERY!!!');
		updatedFBGetURL = pagedQuery;
	}
	console.log('THIS IS THE FB Graph GET URL: ' + updatedFBGetURL);
	var counter = 0;
	var ytCounter = 0;
	var foundYTLinkCollection = [];
	var fbResponse = Meteor.http.get(updatedFBGetURL,
		function(error, result) {
			if(!error && result.statusCode === 200) {
				console.log('THIs IS THE LENGTH OF THE RESULT: ' + result.data.data.length);
				//console.log('THIs IS THE PAGING OBJECT FROM THE FB RESULT: ');
				var nextPagingURL = '';
				if(!_.isUndefined(result.data.paging))
					nextPagingURL = result.data.paging.next;
				//console.log('GOT THIS result from FB GRAPH: ' + Object.keys(result.data.data[counter]));
				while(counter < result.data.data.length)
				{
					//is a valid YouTube link
					console.log('COUNTER now is: ' + counter);
					if(!_.isUndefined(result.data.data[counter].link) && result.data.data[counter].link.indexOf('youtube.com') >= 0)
					{
						console.log('THIS IS A YOUTUBE LINK: '+result.data.data[counter].link);
						console.log('MSG with LINK: '+result.data.data[counter].message);
						var foundYTLink = {
							storyId: result.data.data[counter].id,
							uid: result.data.data[counter].from.id,
							socNetwork: 'FB',
							msgWithStory: result.data.data[counter].message,
							storyLink: result.data.data[counter].link,
							storyTitle: result.data.data[counter].name,
							systemDate: new Date(result.data.data[counter].created_time).getTime() / 1000,
							humanDate: result.data.data[counter].created_time
						};

						foundYTLinkCollection.push(foundYTLink);

						ytCounter++;
					}
					counter++;
				}
				//console.log('Validating : ' + ytCounter + ' yt Links to check if they are songs from fB posts');
				performYoutubeValidation(foundYTLinkCollection);

				//COMMENT OUT TO LIMIT GETTING MORE POSTS!!!!! ONLY FOR TESTING!!!!!!@@@@
				if(!_.isUndefined(nextPagingURL) && !_.isEmpty(nextPagingURL))
				{
					getStoriesFromFBOnly(0,nextPagingURL);
				}
			}
			else// error is defined
			{
				console.log('ENCOUNTERED an error during FB graph get: ' + error);
			}
		}
	);
}

function cleanTrackQueryPriorToLastFMCheck(trackQuery)
{
	//clean up track information for searching Last.FM
	var insideBraces = '';
	if(trackQuery.indexOf('(') >= 0 && trackQuery.indexOf(')') >= 0)
	{
		insideBraces = trackQuery.substring(trackQuery.indexOf('(')+1,trackQuery.indexOf(')'));
		if(insideBraces.indexOf('feat') == -1 && insideBraces.indexOf('ft') == -1) //only remove text inside braces if it doesn't contain featured artist info
			trackQuery = trackQuery.replace(insideBraces,' ');
		//console.log('what's inside the braces' + insideBraces);
	}
	
	if(trackQuery.indexOf('[') >= 0 && trackQuery.indexOf(']') >= 0)
	{
		insideBraces = trackQuery.substring(trackQuery.indexOf('[')+1,trackQuery.indexOf(']'));
		if(insideBraces.indexOf('feat') == -1 && insideBraces.indexOf('ft') == -1) //only remove text inside braces if it doesn't contain featured artist info
			trackQuery = trackQuery.replace(insideBraces,' ');
		//console.log('what's inside the braces' + insideBraces);
	}
	
	if(trackQuery.indexOf('{') >= 0 && trackQuery.indexOf('}') >= 0)
	{
		insideBraces = trackQuery.substring(trackQuery.indexOf('{')+1,trackQuery.indexOf('}'));
		if(insideBraces.indexOf('feat') == -1 && insideBraces.indexOf('ft') == -1) //only remove text inside braces if it doesn't contain featured artist info
			trackQuery = trackQuery.replace(insideBraces,' ');
		//console.log('what's inside the braces' + insideBraces);
	}

	trackQuery = trackQuery.replace('&', ' ');

	trackQuery = trackQuery.toUpperCase();
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

//internal implementation of jaro winkler distance to replace Wuzzy NPM library
function wuzzyJaroWinkler(string1, string2) {
    var ch, i, j, jaro, matchWindow, numMatches, prefix, string1Matches, string2Matches, transpositions, windowEnd, windowStart, _i, _j, _k, _l, _len, _len1, _len2, _ref;
    if (string1.length > string2.length) {
      _ref = [string2, string1], string1 = _ref[0], string2 = _ref[1];
    }
    matchWindow = ~~Math.max(0, string2.length / 2 - 1);
    string1Matches = [];
    string2Matches = [];
    for (i = _i = 0, _len = string1.length; _i < _len; i = ++_i) {
      ch = string1[i];
      windowStart = Math.max(0, i - matchWindow);
      windowEnd = Math.min(i + matchWindow + 1, string2.length);
      for (j = _j = windowStart; windowStart <= windowEnd ? _j < windowEnd : _j > windowEnd; j = windowStart <= windowEnd ? ++_j : --_j) {
        if ((string2Matches[j] == null) && ch === string2[j]) {
          string1Matches[i] = ch;
          string2Matches[j] = string2[j];
          break;
        }
      }
    }
    string1Matches = string1Matches.join("");
    string2Matches = string2Matches.join("");
    numMatches = string1Matches.length;
    if (!numMatches) {
      return 0;
    }
    transpositions = 0;
    for (i = _k = 0, _len1 = string1Matches.length; _k < _len1; i = ++_k) {
      ch = string1Matches[i];
      if (ch !== string2Matches[i]) {
        transpositions++;
      }
    }
    prefix = 0;
    for (i = _l = 0, _len2 = string1.length; _l < _len2; i = ++_l) {
      ch = string1[i];
      if (ch === string2[i]) {
        prefix++;
      } else {
        break;
      }
    }
    jaro = ((numMatches / string1.length) + (numMatches / string2.length) + (numMatches - ~~(transpositions / 2)) / numMatches) / 3.0;
    return jaro + Math.min(prefix, 4) * 0.1 * (1 - jaro);
  };

function wuzzyMatchingAnalysisForiTunesData(searchTerms, iTunesResults, resultCount, checkingIndex)
{
	if(resultCount > 0) {
		//var checkingIndex = 0;
		var iTunesTitleArtist = '';
		//var result1 = 0;
		//var result2 = 0;
		if(iTunesResults[checkingIndex].kind === 'song')
		{
			//console.log('############CHECKING '+checkingIndex+' itunes RESULT!!!!');
			iTunesTitleArtist = iTunesResults[checkingIndex].artistName.toUpperCase() + ' ' + iTunesResults[checkingIndex].trackName.toUpperCase();
			iTunesTitleArtist = iTunesTitleArtist.replace(/\s{2,}/g, ' '); //remove extra whitespace
			//console.log('THIS IS THE '+checkingIndex+' iTunesTITLEartist: ' + iTunesTitleArtist);
			//console.log('THESE ARE THE SEARCH TERMS: ' + searchTerms);
			var result1 = wuzzyJaroWinkler(iTunesTitleArtist,searchTerms);			
			//console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%THE JARO WINKLER WUZZY MATCH % is: '+ result1);
			if(result1 >= wuzzyMatchThreshold) // match it only if it has at least 60% match
				return result1;
			else
				return 0;
		}
		else
			return 0;
	}
}

function wuzzyMatchingAnalysisForLFMData(searchTerms,lfmResults, count)
{
	var checkingIndex = 0;
	var lfmTitleArtist = '';
	var result1 = 0;
	var result2 = 0;
	searchTerms = searchTerms.toUpperCase();

	var matchedIndex1 = 0;
	var matchedIndex2 = 0;

	//determine starting index and only start from items that have album art
	var validCounter = 0;
	while(validCounter < count)
	{
		if(!_.isUndefined(lfmResults.trackmatches.track[validCounter]) && _.isUndefined(lfmResults.trackmatches.track[validCounter].image))
		{
			console.log('NO IMAGE FOUND ON Result NUMBER: ' + validCounter);
			validCounter++;
		}
		else
		{
			console.log('IMAGE FOUND ON Result NUMBER: ' + validCounter);
			checkingIndex = validCounter;
			if(validCounter === count-1)
				count = 1;

			validCounter = count;
		}
	}

	if(count > 1)
	{
		if(!_.isUndefined(lfmResults.trackmatches.track[checkingIndex]) && lfmResults.trackmatches.track[checkingIndex].artist !== '[unknown]')
		{
			console.log('############CHECKING FIRST LFM RESULT!!!!');
			lfmTitleArtist = lfmResults.trackmatches.track[checkingIndex].artist.toUpperCase() + ' ' + lfmResults.trackmatches.track[checkingIndex].name.toUpperCase();
			lfmTitleArtist = lfmTitleArtist.replace(/\s{2,}/g, ' '); //remove extra whitespace
			console.log('THIS IS THE FIRST LFMTITLEartist: ' + lfmTitleArtist);
			console.log('THESE ARE THE FIRST SEARCH TERMS: ' + searchTerms);
			result1 = wuzzyJaroWinkler(lfmTitleArtist,searchTerms);
			console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%THE JARO WINKLER WUZZY MATCH % is: '+ result1);
			if(!_.isUndefined(lfmResults.trackmatches.track[checkingIndex].image))
			{
				matchedIndex1 = checkingIndex;
			}
			else
			{
				matchedIndex1 = -1;
			}
		}

		checkingIndex += 1;

		if(!_.isUndefined(lfmResults.trackmatches.track[checkingIndex]) && lfmResults.trackmatches.track[checkingIndex].artist !== '[unknown]')
		{
			console.log('############CHECKING SECOND LFM RESULT!!!!');
			lfmTitleArtist = lfmResults.trackmatches.track[checkingIndex].artist.toUpperCase() + ' ' + lfmResults.trackmatches.track[checkingIndex].name.toUpperCase();
			lfmTitleArtist = lfmTitleArtist.replace(/\s{2,}/g, ' '); //remove extra whitespace
			console.log('THIS IS THE SECOND LFMTITLEartist: ' + lfmTitleArtist);
			console.log('THESE ARE THE SECOND SEARCH TERMS: ' + searchTerms);
			result2 = wuzzyJaroWinkler(lfmTitleArtist,searchTerms)
			console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%THE JARO WINKLER WUZZY MATCH % is: '+ result2);
			if(!_.isUndefined(lfmResults.trackmatches.track[checkingIndex].image))
			{
				matchedIndex2 = checkingIndex;
			}
			else if(matchedIndex1 !== -1)
			{
				matchedIndex2 = matchedIndex1;
			}

		}

		//console.log('image for result 1 is undefined: ' + _.isUndefined(lfmResults.trackmatches.track[1].image));
		//console.log('image for result 2 is undefined: ' + _.isUndefined(lfmResults.trackmatches.track[2].image));


		if(result1 >= wuzzyMatchThreshold && result2 >= wuzzyMatchThreshold && result1 >= result2)
		{
			console.log('both results are a good match; returning first result');
			//return 0;
			return matchedIndex1;

		}
		else if(result1 >= wuzzyMatchThreshold && result2 >= wuzzyMatchThreshold && result1 <= result2)
		{
			console.log('both results are a good match; returning second result');
			//return 1;
			return matchedIndex2;
		}
		else if(result1 >= wuzzyMatchThreshold && result2 < wuzzyMatchThreshold)
		{
			console.log('first result is better than second; returning first result');
			//return 0;
			return matchedIndex1;
		}
		else if(result2 >= wuzzyMatchThreshold && result1 < wuzzyMatchThreshold)
		{
			console.log('second result is better than first; returning second result');
			//return 1;
			return matchedIndex2;
		}
		else if(result1 < wuzzyMatchThreshold && result2 < wuzzyMatchThreshold)
		{
			console.log('both results are NOT a good match; returning -1');
			return -1;
		}
		else if(result1 == result2 && result1 >= wuzzyMatchThreshold)
		{
			console.log('both results are equal to each other; returning first result');
			//return 0;
			return matchedIndex1;
		}
		else
		{
			console.log('BAD RESULTS; returning -1');
			return -1;
		}
	}
	else if(count === 1)
	{
		console.log('#$#$#$#$##$#$ONLY ONE MATCH FROM LAST FM!!!!')
		if(lfmResults.trackmatches.track.artist !== '[unknown]')
		{
			//console.log('############CHECKING FIRST LFM RESULT!!!!');
			lfmTitleArtist = lfmResults.trackmatches.track.artist.toUpperCase() + ' ' + lfmResults.trackmatches.track.name.toUpperCase();
			lfmTitleArtist = lfmTitleArtist.replace(/\s{2,}/g, ' '); //remove extra whitespace
			console.log('THIS IS THE FIRST LFMTITLEartist: ' + lfmTitleArtist);
			console.log('THESE ARE THE FIRST SEARCH TERMS: ' + searchTerms);
			result1 = wuzzyJaroWinkler(lfmTitleArtist,searchTerms);
			console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%THE JARO WINKLER WUZZY MATCH % is: '+ result1);
		}

		if(result1 >= wuzzyMatchThreshold)
		{
			console.log('THE ONLY RESULT IS a good match; returning THE ONLY result');
			//return 0;
			return matchedIndex1;
		}
		else
		{
			console.log('THE ONLY RESULT IS BAD; returning -1');
			return -1
		}
	}
}

function siftThroughLastFMResults(lastFMData, originalLinkToBeValidated)
{
	var LFMResultList = lastFMData;//JSON.parse(lastFMData);//y.results.trackmatches.track[0]
	//console.log('this is the pure LASTFM body:');
	//console.log(lastFMData);
	//console.log('this is the LFM RESULT LIST: ' + LFMResultList);
	//if last.fm has a track match get the artist / song / album art details to update DB with
	var matchedIndex = 0;

	console.log('################AND THIS IS THE LFM results IF CONDITION 1: ' + LFMResultList.results);
	//console.log('################AND THIS IS THE LFM results IF CONDITION 2: ' + Object.keys(LFMResultList.results.trackmatches.track));
	//console.log('################AND THIS IS THE LFM results IF CONDITION 3: ' + LFMResultList.results.trackmatches.track.length);

	var lfmResultCount = parseInt(LFMResultList.results['opensearch:totalResults']);

	console.log('############################## THIS IS THE LFM RESULT COUNT: ' + lfmResultCount);

	if(lfmResultCount > 1)
	{
		if(LFMResultList.results !== undefined && LFMResultList.results.trackmatches.track !== undefined && LFMResultList.results.trackmatches.track.length > 0)
		{
			var LFMArtist = '';
			var LFMTitle = '';

			var matchedIndex = wuzzyMatchingAnalysisForLFMData(LFMResultList.results['opensearch:Query'].searchTerms,LFMResultList.results, lfmResultCount);

			console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$THE MATCHED INDEX AFTER WUZZY MATCHING: '+ matchedIndex);

			if(matchedIndex != -1)
			{
				console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$THE MATCHED INDEX AFTER MATCHING ANALYSIS: '+ matchedIndex);
				console.log('%%%%%%%%%% THIS IS THE MATCHED INDEX OBJECT: ');
				console.log(LFMResultList.results.trackmatches.track[matchedIndex])
				LFMArtist = LFMResultList.results.trackmatches.track[matchedIndex].artist;
				LFMTitle = LFMResultList.results.trackmatches.track[matchedIndex].name;

				var LFMlargeAlbumArt = '';
				var LFMmediumAlbumArt = '';
				if(LFMResultList.results.trackmatches.track[matchedIndex].image !== undefined)
				{
				  if(LFMResultList.results.trackmatches.track[matchedIndex].image.length === 4)
				  {
				    LFMlargeAlbumArt = LFMResultList.results.trackmatches.track[matchedIndex].image[3]['#text'];
				    LFMmediumAlbumArt = LFMResultList.results.trackmatches.track[matchedIndex].image[2]['#text'];
				  }
				  else if(LFMResultList.results.trackmatches.track[matchedIndex].image.length > 0)
				  {
				    var artIndex = LFMResultList.results.trackmatches.track[matchedIndex].image.length -1;
				    LFMlargeAlbumArt = LFMResultList.results.trackmatches.track[matchedIndex].image[artIndex]['#text'];
				  }

				  //updateTrackWithLastFMData(LFMResultList.results['opensearch:Query'].searchTerms, LFMlargeAlbumArt, LFMmediumAlbumArt, LFMArtist, LFMTitle, originalLinkToBeValidated);
				  
				  console.log('the MEDIUM result album art is: '+ LFMmediumAlbumArt);
				  console.log('the LARGE result album art is: '+ LFMlargeAlbumArt);
				  console.log('song TITLE result from LASTFM is: '+ LFMTitle);

				  Meteor.call('updateTrackWithLastFMData',LFMResultList.results['opensearch:Query'].searchTerms, LFMlargeAlbumArt, LFMmediumAlbumArt, LFMArtist, LFMTitle, originalLinkToBeValidated);
				}
				//no album art but artist and title are available
				else
				{
					Meteor.call('updateTrackWithLastFMData',LFMResultList.results['opensearch:Query'].searchTerms, 'none', 'none', LFMArtist, LFMTitle, originalLinkToBeValidated);
					console.log('NO ALBUM ART WAS FOUND IN LFM!!!');
				}
			}
		}
	}
	else if(lfmResultCount === 1) //ONLY GOT 1 result from LAST FM search
	{
		if(LFMResultList.results !== undefined && LFMResultList.results.trackmatches.track.artist !== undefined)
		{
			var LFMArtist = '';
			var LFMTitle = '';

			var matchedIndex = wuzzyMatchingAnalysisForLFMData(LFMResultList.results['opensearch:Query'].searchTerms,LFMResultList.results, lfmResultCount);

			console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$THE MATCHED INDEX AFTER WUZZY MATCHING: '+ matchedIndex);

			if(matchedIndex != -1)
			{
				console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$THE MATCHED INDEX AFTER MATCHING ANALYSIS: '+ matchedIndex);
				console.log('%%%%%%%%%% THIS IS THE MATCHED INDEX OBJECT: ');
				console.log(LFMResultList.results.trackmatches.track)
				LFMArtist = LFMResultList.results.trackmatches.track.artist;
				LFMTitle = LFMResultList.results.trackmatches.track.name;

				var LFMlargeAlbumArt = '';
				var LFMmediumAlbumArt = '';
				if(LFMResultList.results.trackmatches.track.image !== undefined)
				{
				  if(LFMResultList.results.trackmatches.track.image.length === 4)
				  {
				    LFMlargeAlbumArt = LFMResultList.results.trackmatches.track.image[3]['#text'];
				    LFMmediumAlbumArt = LFMResultList.results.trackmatches.track.image[2]['#text'];
				  }
				  else if(LFMResultList.results.trackmatches.track.image.length > 0)
				  {
				    var artIndex = LFMResultList.results.trackmatches.track.image.length -1;
				    LFMlargeAlbumArt = LFMResultList.results.trackmatches.track.image[artIndex]['#text'];
				  }

				  //updateTrackWithLastFMData(LFMResultList.results['opensearch:Query'].searchTerms, LFMlargeAlbumArt, LFMmediumAlbumArt, LFMArtist, LFMTitle, originalLinkToBeValidated);
				  
				  //console.log('the MEDIUM result album art is: '+ LFMmediumAlbumArt);
				  //console.log('the LARGE result album art is: '+ LFMlargeAlbumArt);
				  //console.log('song TITLE result from LASTFM is: '+ LFMTitle);

				  Meteor.call('updateTrackWithLastFMData',LFMResultList.results['opensearch:Query'].searchTerms, LFMlargeAlbumArt, LFMmediumAlbumArt, LFMArtist, LFMTitle, originalLinkToBeValidated);
				}
				//no album art but artist and title are available
				else
				{
					Meteor.call('updateTrackWithLastFMData',LFMResultList.results['opensearch:Query'].searchTerms, 'none', 'none', LFMArtist, LFMTitle, originalLinkToBeValidated);
					console.log('NO ALBUM ART WAS FOUND IN LFM!!!');
				}
			}
		}
	}
	else
	{
		console.log('LASt FM DOES NOT HAVE ANY ADDITIONAL DATA FOR THIS TRACK: ' + LFMResultList.results['opensearch:Query'].searchTerms);
		//normalizeSongsWithNoLastFMData(LFMResultList.results['opensearch:Query'].searchTerms, socketObject, originalLinkToBeValidated);
		//console.log(LFMResultList);
		//$scope.lastFMInvalid++;
		//$scope.currentStatus = 'SENDING: '+ $scope.lastFMSent + '-----VALIDATED: ' + $scope.lastFMValid + '-----INVALID: ' +$scope.lastFMInvalid;
	}
}

function getAdditionalMissingDataFromItunesAPI(linkToBeValidated) {
	var actualLink = linkToBeValidated.storyLink;
	var cleanedTrackDetails = '';
	cleanedTrackDetails = cleanTrackQueryPriorToLastFMCheck(linkToBeValidated.storyTitle).replace(/\s{2,}/g, '+');
	//console.log('SEARCHING FOR TRACK ON ITUNES API: '+cleanedTrackDetails);
	var updatediTunesAPIURL = iTunesAPIURL.replace('###TRACKQUERY###',cleanedTrackDetails);
		Meteor.http.get(updatediTunesAPIURL,
		function(error, result) {
			//console.log('SEARCHING FOR TRACK ON ITUNES API: '+cleanedTrackDetails);
			//console.log('THIS IS THE iTUNES RESULT STATUS CODE: ' + result.statusCode)
		  if(!error && result.statusCode === 200) {
		    // this callback will be called asynchronously
		    // when the response is available
		    var itunesResults = result.data;//JSON.parse(body);
		    //console.log('@@@@@@@@@@@@@@@@@@@@@@@@ THIS IS THE RESPONSE HEADER: '+cleanedTrackDetails);
		    //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% STARTING ONE ITUNES RESULT out of total of: '+itunesResults.resultCount);
		    if(itunesResults.resultCount > 0) // skip sifting through LFM results if there are no results
		    {
		    	//console.log('@@@@@@@@@@@@@@@@@@@@@@@@ THIS IS THE RESPONSE HEADER: '+cleanedTrackDetails);
		    	//console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% STARTING ONE ITUNES RESULT out of total of: '+itunesResults.resultCount);
		    	var counter = 0;
		    	var highestMatchingIndex = 0;
		    	var highestMatchingWuzzyFactor = 0;
		    	var currentMatchingWuzzyFactor = 0;
		    	var matchFound = false;
		    	while(counter < itunesResults.resultCount)
		    	{
				    //console.log('THIS IS THE iTUNES results: '+itunesResults.results[counter].artistName + ' - ' + itunesResults.results[counter].trackName);
				    //console.log('DOING WUZZY ANALYSIS OF result data!!!!');
				    if(counter < 10)
				    {
					    currentMatchingWuzzyFactor = wuzzyMatchingAnalysisForiTunesData(cleanedTrackDetails,itunesResults.results, itunesResults.resultCount, counter);
					    //console.log('WUZZY factor for current index: ' + counter + ' is : '+currentMatchingWuzzyFactor + ' and this is the track deets: '+itunesResults.results[counter].artistName + ' - ' + itunesResults.results[counter].trackName);
					    //console.log('CURRENT HIGHEST WUZZY FACTOR IS: ' + highestMatchingWuzzyFactor + ' and highest matching index is: ' + highestMatchingIndex);
					    if(currentMatchingWuzzyFactor > highestMatchingWuzzyFactor)
					    {
					    	highestMatchingWuzzyFactor = currentMatchingWuzzyFactor
					    	highestMatchingIndex = counter;
					    	matchFound = true;
					    }
					    else
					    {
					    	//console.log('NOTHING better found in ITUNES for this: ' + cleanedTrackDetails);
					    	//console.log('current highestMatchingWuzzyFactor is: ' + highestMatchingWuzzyFactor);
					    }

					    counter++;
					}
					else
						counter = itunesResults.resultCount;
				}
				//console.log('&&&&&&&&&&&&&&&&&&&&&&& ENDING ONE ITUNES RESULT!!!!');
				if(matchFound)
				{
					//console.log('&$&$&$----------------BEST MATCHING RESULT IS: ' + itunesResults.results[highestMatchingIndex].artistName + ' - ' + itunesResults.results[highestMatchingIndex].trackName);
					Meteor.call('updateTrackWithiTunesData',actualLink, cleanedTrackDetails, itunesResults.results[highestMatchingIndex], highestMatchingWuzzyFactor, cleanedTrackDetails);
				}
				//else //send to LAST FM for validation
				//{
				//console.log('going to get album art now from LastFM for: ' + cleanedTrackDetails);
				performLastFMValidationForYTLink(linkToBeValidated);
				//}
				
			}
			else
			{
				//console.log('@@@@@@@@@@@@@@@@@@@@@@@@ NO RESULTS FOUND FOR: '+cleanedTrackDetails);
				//console.log('SENDING TO LAST FM for validation!!!!');
				//console.log('NO RESULTS FOUND: '+body);
				performLastFMValidationForYTLink(linkToBeValidated);
			}
		  }
		  else
		  {
		  	//console.log('@@@@@@@@@@@@@@@@@@@@@@@@ THIS IS THE RESPONSE HEADER: '+cleanedTrackDetails);
		    //insertNewErrorInLogTable('REACHED iTUNES ERROR: ', error, null);
		    performLastFMValidationForYTLink(linkToBeValidated);
		  }
		});
}

function performLastFMValidationForYTLink(linkToBeValidated) {
	//console.log('INSIDE THE validation method for LAST FM INSIDE SONG SERVER CONTROLLER; this is the linkToBeValidated: ');
	//console.log(linkToBeValidated);
	//var linkToBeValidated = req.body.linkForValidation;
	//console.log('REACHED SERVER LAST FM Validation METHOD: ' + linkToBeValidated.storyTitle);
	var cleanedTrackDetails = '';
	cleanedTrackDetails = cleanTrackQueryPriorToLastFMCheck(linkToBeValidated.storyTitle);
	//console.log('THIS IS THE ORIGINAL TITILE: ' + linkToBeValidated.storyTitle);
	//console.log('this is the cleaned up TITLE: ' + cleanedTrackDetails);
	//console.log('finished initializing data prior to lastfm check!');
	var updatedLFMURL = lastFmURL.replace('###TRACKQUERY###',cleanedTrackDetails);
	Meteor.http.get(updatedLFMURL, 
		function(error, result) {
			if(!error && result.statusCode === 200) {
				// this callback will be called asynchronously
				// when the response is available
				var lfm = result.data;
				if(result != undefined) // skip sifting through LFM results if there are no results
				{
					console.log('REACHED LAST FM success: ');
					console.log(lfm);
					//console.log('THIS IS THE LFM results without drilling down further: '+lfm.results);
					//console.log('REACHED LAST FM success: '+lfm.results['opensearch:Query'].searchTerms);
					//console.log(body);
					siftThroughLastFMResults(lfm, linkToBeValidated.storyLink);
				}
				else
					console.log('ENCOUNTERED an eRROR in LFM validation method even though response was 200: '+response);
			}
			else
			{
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				console.log('REACHED LAST FM ERROR: ');
				console.log(error);
				//insertNewErrorInLogTable('REACHED LAST FM ERROR: ', error, null);
				//$scope.lastFMInvalid++;
				//$scope.currentStatus = 'SENDING: '+ $scope.lastFMSent + '-----VALIDATED: ' + $scope.lastFMValid + '-----INVALID: ' +$scope.lastFMInvalid;
			}
		});
}



function insertNewStory(fbResult, network, ytResult)
{
  	var newStory = {
		storyId: fbResult.storyId,
		uid:fbResult.uid,
		socNetwork: network,
		msgWithStory: fbResult.msgWithStory,
		storyLink: fbResult.storyLink,
		storyTitle: fbResult.storyTitle,
		systemDate: fbResult.systemDate,
		humanDate: fbResult.humanDate,
		ytCheck: ytResult,
		lastfmCheck: 'PENDING',
		iTunesCheck: 'PENDING',
	};

	var storyWithSameID = Stories.findOne({storyId: fbResult.storyId});
	if (storyWithSameID) {
      //console.log('this story already EXISTS: ' + fbResult.storyLink);
    }
    else
    {
    	//console.log('this IS A FRESH STORY: ' + fbResult.storyLink);
    	Stories.insert(newStory);
    }
}

function performYoutubeValidation(FBYTResultSet) 
{
	console.log('INSIDE SERVER SIDE YOUTUBE VALIDATION method');
	var counter = 0;
	//fist create VID ID set
	var vidIDSet = [];
	//assemble array of youtube link IDs
	while(counter < FBYTResultSet.length)
	{
		vidIDSet[counter] = FBYTResultSet[counter].storyLink.substring(FBYTResultSet[counter].storyLink.indexOf('v=')+2);
		vidIDSet[counter] = vidIDSet[counter].replace('&feature=youtu.be', ''); //last replace is to remove any possible unnecessary things from youtube links

		counter++;
	}
	counter = 0;
	var validCounter = 0;

	//start checking with youtube on music validity
	while(counter < vidIDSet.length)
	{
		var updatedYTCheckURL = ytValidityCheckURL.replace('###API_KEY###', ytAPI_KEY).replace('#VID_ID#',vidIDSet[counter]);
		Meteor.http.get(updatedYTCheckURL, 
		function(error, result) {
		  if(!error && result.statusCode === 200) {
		    var YTResultList = result.data;//JSON.parse(body);
			var counter = 0;
			var ytCounter = 0;
			var foundYTLinkCollection = [];

			if(YTResultList.items.length > 0)
	    	{
				var linkID = YTResultList.items[0].id;				
				var fbResult = FBYTResultSet[vidIDSet.indexOf(linkID)];

				//console.log('===============================================================');
				//console.log('THIS IS THE FB result BEFORE INSERTING NEW STORY: ');
				//console.log(fbResult);
				//console.log('AND THIS IS THE CATEGORY ID: ' +  YTResultList.items[0].snippet.categoryId);
				//console.log('AND THIS IS THE FULL VID ID SET: ');
				//console.log(vidIDSet);
				//console.log('AND THIS IS THE linkid : ' +  linkID);
				if(YTResultList.items[0].snippet.categoryId !== '10')
				{	
					//console.log(fbResult.storyLink + ' IS NOT A SONG!!!');
					insertNewStory(fbResult, 'FB', 'INVALID');
					//STOP INSERTING YOUTUBE LINKS THAT ARE NOT MUSIC CATEGORY///Meteor.call('insertNewSong',fbResult, 'FB', 'YOUTUBE');
				}
				else
				{
					//console.log(fbResult.storyLink + ' IS ACTUALLY A SONG!!!');
					insertNewStory(fbResult, 'FB', 'VALID');
					Meteor.call('insertNewSong',fbResult, 'FB', 'YOUTUBE');
					validCounter++;
					getAdditionalMissingDataFromItunesAPI(fbResult);
				}
				//console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
				//STOP DOING FURTHER VALIDATION FOR ALL YOUTUBE LINKS -- ONLY DO IT FOR MUSIC CATEGORIES//getAdditionalMissingDataFromItunesAPI(fbResult);
			}
		  }
		  else
		  {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    //console.log('ENCOUNTERED AN ERROR while trying to do YouTube validation!!!!');
		    //console.log(error);
		    //insertNewErrorInLogTable('ENCOUNTERED AN ERROR while trying to do YouTube validation!!!!', error, null);
		    //$scope.lastFMInvalid++;
		    //$scope.currentStatus = 'SENDING: '+ $scope.lastFMSent + '-----VALIDATED: ' + $scope.lastFMValid + '-----INVALID: ' +$scope.lastFMInvalid;
		  }
		});

	  counter++;
	}
}

Meteor.methods({
	getLatestStoriesFromDBAndFB: function() {
		var returnedStories = Stories.find({}).fetch();//uid:Meteor.user().services.facebook.id});
		if (! returnedStories) console.log('Failed to load Story ');

		//console.log('this is the RETURNED STORIES from the db: '+ Object.keys(returnedStories));
		//console.log('for this UID: ' + Meteor.user().services.facebook.id);
		//var authToken = $scope.authentication.user.providerData.accessToken;
		if(returnedStories.length > 0)
		{
			//console.log('THIS IS THE FOUND STORY');
			//console.log(returnedStories[0]);
		}
		else
		{
			console.log('NOTHING AVAILABLE IN DB!');
		}
		//getLatestDTForCurrentUser(returnedStories);
		getStoriesFromFBOnly(getLatestDTForCurrentUser(returnedStories), '');
	},

	doManualItunesValidationForLink: function(link, type) {
		console.log('reached manual itunes validation method with this link: ' + link);
		if(type === 'YT')
		{
			var linkID = link.substring(link.indexOf('v=')+2);
			var updatedYTCheckURL = ytValidityCheckURL.replace('###API_KEY###', ytAPI_KEY).replace('#VID_ID#',linkID);
			console.log('tHIS IS THE YT URL : ');
			console.log(updatedYTCheckURL);
			Meteor.http.get(updatedYTCheckURL, 
				function(error, result) {
				  if(!error && result.statusCode === 200) {
				    var YTResultList = result.data;//JSON.parse(body);
					var counter = 0;
					var ytCounter = 0;
					var foundYTLinkCollection = [];

					if(YTResultList.items.length > 0)
			    	{
						var linkID = YTResultList.items[0].id;
						var searchTitle = YTResultList.items[0].snippet.title;

						console.log('===============================================================');
						console.log('AND THIS IS THE CATEGORY ID: ' +  YTResultList.items[0].snippet.categoryId);
						
						console.log('AND THIS IS THE linkid : ' +  linkID);
						console.log('THIS IS THE SeARCH TERMS:' + searchTitle);
						if(YTResultList.items[0].snippet.categoryId !== '10')
						{	
							console.log(link + ' IS NOT A SONG!!!');
							
						}
						else
						{
							console.log(link + ' IS ACTUALLY A SONG!!!');
							var linkForValidation = { storyTitle: searchTitle, storyLink: link};
							//insertNewStory(fbResult, 'FB', 'VALID');
							//Meteor.call('insertNewSong',fbResult, 'FB', 'YOUTUBE');
							//validCounter++;
							getAdditionalMissingDataFromItunesAPI(linkForValidation);
						}
						//console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
						//STOP DOING FURTHER VALIDATION FOR ALL YOUTUBE LINKS -- ONLY DO IT FOR MUSIC CATEGORIES//getAdditionalMissingDataFromItunesAPI(fbResult);
					}
				  }
				});
		}

	},
	doItunesValidationUsingManualEdits: function(actualLink, searchText, type) {
		if(type === 'YT')
		{
			//console.log('DOING MANUAL ITUNES VALIDATION');
			cleanedTrackDetails = cleanTrackQueryPriorToLastFMCheck(searchText).replace(/\s{2,}/g, '+');
			//console.log('SEARCHING FOR TRACK ON ITUNES API: '+cleanedTrackDetails);
			var updatediTunesAPIURL = iTunesAPIURL.replace('###TRACKQUERY###',cleanedTrackDetails);
				Meteor.http.get(updatediTunesAPIURL,
				function(error, result) {
					//console.log('SEARCHING FOR TRACK ON ITUNES API: '+cleanedTrackDetails);
					//console.log('THIS IS THE iTUNES RESULT STATUS CODE: ' + result.statusCode)
				  if(!error && result.statusCode === 200) {
				    // this callback will be called asynchronously
				    // when the response is available
				    var itunesResults = result.data;//JSON.parse(body);
				    //console.log('@@@@@@@@@@@@@@@@@@@@@@@@ THIS IS THE RESPONSE HEADER: '+cleanedTrackDetails);
				    //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% STARTING ONE ITUNES RESULT out of total of: '+itunesResults.resultCount);
				    if(itunesResults.resultCount > 0) // skip sifting through LFM results if there are no results
				    {
				    	//console.log('@@@@@@@@@@@@@@@@@@@@@@@@ THIS IS THE RESPONSE HEADER: '+cleanedTrackDetails);
				    	//console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% STARTING ONE ITUNES RESULT out of total of: '+itunesResults.resultCount);
				    	var counter = 0;
				    	var highestMatchingIndex = 0;
				    	var highestMatchingWuzzyFactor = 0;
				    	var currentMatchingWuzzyFactor = 0;
				    	var matchFound = false;
				    	while(counter < itunesResults.resultCount)
				    	{
						    //console.log('THIS IS THE iTUNES results: '+itunesResults.results[counter].artistName + ' - ' + itunesResults.results[counter].trackName);
						    //console.log('DOING WUZZY ANALYSIS OF result data!!!!');
						    if(counter < 10)
						    {
							    currentMatchingWuzzyFactor = wuzzyMatchingAnalysisForiTunesData(cleanedTrackDetails,itunesResults.results, itunesResults.resultCount, counter);
							    //console.log('WUZZY factor for current index: ' + counter + ' is : '+currentMatchingWuzzyFactor + ' and this is the track deets: '+itunesResults.results[counter].artistName + ' - ' + itunesResults.results[counter].trackName);
							    //console.log('CURRENT HIGHEST WUZZY FACTOR IS: ' + highestMatchingWuzzyFactor + ' and highest matching index is: ' + highestMatchingIndex);
							    if(currentMatchingWuzzyFactor > highestMatchingWuzzyFactor)
							    {
							    	highestMatchingWuzzyFactor = currentMatchingWuzzyFactor
							    	highestMatchingIndex = counter;
							    	matchFound = true;
							    }
							    else
							    {
							    	//console.log('NOTHING better found in ITUNES for this: ' + cleanedTrackDetails);
							    	//console.log('current highestMatchingWuzzyFactor is: ' + highestMatchingWuzzyFactor);
							    }

							    counter++;
							}
							else
								counter = itunesResults.resultCount;
						}
						//console.log('&&&&&&&&&&&&&&&&&&&&&&& ENDING ONE ITUNES RESULT!!!!');
						if(matchFound)
						{
							//console.log('&$&$&$----------------BEST MATCHING RESULT IS: ' + itunesResults.results[highestMatchingIndex].artistName + ' - ' + itunesResults.results[highestMatchingIndex].trackName);
							Meteor.call('updateTrackWithiTunesData',actualLink, cleanedTrackDetails, itunesResults.results[highestMatchingIndex], highestMatchingWuzzyFactor, cleanedTrackDetails);
						}
						else //send to LAST FM for validation
						{
							//console.log('NOTHING found in ITUNES for this: ' + cleanedTrackDetails + ' so sending to LastFm for validation');
						}
						
					}
					else
					{
						//console.log('@@@@@@@@@@@@@@@@@@@@@@@@ NO RESULTS FOUND FOR: '+cleanedTrackDetails);
						//console.log('SENDING TO LAST FM for validation!!!!');
						//console.log('NO RESULTS FOUND: '+body);
					}
				  }
				  else
				  {
				  	console.log('@@@@@@@@@@@@@@@@@@@@@@@@ THIS IS THE RESPONSE HEADER: '+cleanedTrackDetails);
				    //insertNewErrorInLogTable('REACHED iTUNES ERROR: ', error, null);
				  }
				});
		}
	},
	doManualLFMValidationForLink: function(linkToBeValidated, artist, title, type) {
		console.log('reached manual LFM validation method with this artist: ' + artist);
		console.log('reached manual LFM validation method with this title: ' + title);
		if(type === 'YT')
		{
			var trackQuery = artist + " " + title;
			trackQuery = cleanTrackQueryPriorToLastFMCheck(trackQuery);
			var updatedLFMURL = lastFmURL.replace('###TRACKQUERY###',trackQuery);
			console.log('THIS IS THE TRACK QUERY FOR LFM VALIDATION: ' + trackQuery);
			console.log('THIS IS THE URL FOR LFM VALIDATION: ' + updatedLFMURL);
			Meteor.http.get(updatedLFMURL, 
				function(error, result) {
					if(!error && result.statusCode === 200) {
						// this callback will be called asynchronously
						// when the response is available
						var lfm = result.data;
						if(result != undefined) // skip sifting through LFM results if there are no results
						{
							console.log('REACHED LAST FM success: ');
							console.log(lfm);
							console.log('THIS IS THE LFM results without drilling down further: '+lfm.results);
							siftThroughLastFMResults(lfm, linkToBeValidated);
						}
						else
							console.log('ENCOUNTERED an eRROR in LFM validation method even though response was 200: '+response);
					}
					else
					{
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						console.log('REACHED LAST FM ERROR: ');
						console.log(error);
						//insertNewErrorInLogTable('REACHED LAST FM ERROR: ', error, null);
					}
				});
		}

	},
	getStoryCountForID: function(userID) {
		console.log('GETTING story count for : '+ userID);
		var x = Stories.find({'uid': userID}).fetch();
		console.log(x.length);
		return x.length;
	}
	/*,
	postInsert: function(postAttributes) {
		check(this.userId, String);
		check(postAttributes, {
		  title: String,
		  url: String
		});

		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink) {
		  return {
		    postExists: true,
		    _id: postWithSameLink._id
		  }
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
		  userId: user._id, 
		  author: user.username, 
		  submitted: new Date()
		});

		var postId = Posts.insert(post);

		return {
		  _id: postId
		};
	}*/
});
}
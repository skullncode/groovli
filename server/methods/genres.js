lfmGenreAPI = "http://ws.audioscrobbler.com/2.0/?method=tag.getInfo&tag=###GENRE_NAME###&api_key=3135d1eacd6085271c24a02d4195cccf&format=json";

Meteor.methods({
	//if Artist doesn't already exist in DB insert and return ID
  setDetailsForUnsetGenres: function() {
	    var uniqueGenres = getUniqueGenresFromArtistList();

		console.log('unique genres length is: ' + uniqueGenres.length);

	    //console.log('starting to set unset genre details');
	    var unsetGenres = 0;
	    _.each(uniqueGenres, function(z){
	    	//console.log('this is the cleaned genre name: ' + z);
	    	var foundGenre = Genres.findOne({'name': z});
	    	var foundBadGenre = BadGenres.findOne({'name': z});
	    	
	    	if(_.isUndefined(foundGenre) && _.isUndefined(foundBadGenre))//haven't found artist in db
	    	{
	    		//console.log('have not found GENRE in the DB: ' + z);
	    		//console.log('GOING to search and insert')
	    		getInfoForNonexistentGenreAndInsert(z);
	    		//unsetArtists++;
	    		//console.log('currently unset number of artists: ' + unsetArtists);
	    	}
	    	//else
	    		//console.log('already found this artist in the DB: ' + z);
	    });
	    console.log('FINISHED setting unset artist details');
	    //setDetailsForCoverArtists();
  	},
  	reviewExistingGenres: function() {
		//console.log('GOING TO GET ALL EXISTING SONGS in the DB for review: ');
		var x = Genres.find({}).fetch()
		//console.log('THIS IS THE LENGTH : ' + x.length);
		return x;
	},
	getSongsForSpecificGenreArtistList: function(artistsForGenre) {
		return getSongsForArtistList(artistsForGenre);
	},
	findGenreForRouting: function(genreName)
	{
		return Genres.findOne({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});
	},
	deleteGenreEntry: function(genreName) {
	    Genres.remove({name: genreName}, function(error) {
	          if (error) {
	            // display the error to the user
	            return error;
	          }
	          else{
	            //console.log('result');
	          }
	      })
  	},
  	doesGenreHavePage: function(genreName) {
  		//replace ampersand with AND so that check works correctly
		if(genreName.indexOf('&') >= 0)
		{
			genreName = genreName.replace(/&/g, 'and');
		}
		//console.log('SEARCHING TO SEE IF THIS SIMILAR ARTIST HAS A PAGE: ' + genreName);
  		var x = Genres.findOne({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});
  		//console.log("GOT THIS: ");
  		//console.log(x);
  		if(_.isEmpty(x))
  			return false;
  		else
  			return true;
  	},
  	checkAndSetDetailsForSpecificGenre: function(genreName) {
  		//console.log('CHECKING TO SEE IF THIS GENRE already has details in the DB: ' + genreName);
  		genreName = cleanGenreQuery(genreName);
  		var foundGenre = Genres.findOne({'name': genreName});
    	var foundBadGenre = BadGenres.findOne({'name': genreName});
    	
    	if(_.isUndefined(foundGenre) && _.isUndefined(foundBadGenre))//haven't found artist in db
    	{
    		//console.log('have not found genre in the DB: ' + genreName);
    		//console.log('GOING to search and insert')
    		getInfoForNonexistentGenreAndInsert(genreName);
    		//console.log('currently unset number of artists: ' + unsetArtists);
    	}
  	}
});

function getSongsForArtistList(artistList){
	//console.log('THIS IS THE ARTIST LIST in the SERVER METHOD: ');
	//console.log(artistList);
	var cleanedArtistList = [];
	var tempArtistName = '';
	_.each(artistList, function(z){
		if(_.has(z, 'name') && !_.isUndefined(z.name))
		{
			//console.log('THIS IS THE NAME: ');
			//console.log(z.name);
			if(z.name.indexOf(' and ') >= 0)
			{
				tempArtistName = z.name.replace(/ and /g, ' & ');
				cleanedArtistList.push(tempArtistName);
			}
			else
			{
				//console.log('ELSE CASE');
				cleanedArtistList.push(z.name);
			}
		}
		else if(_.has(z, 'sa') && !_.isUndefined(z.sa))
		{
			//console.log('THIS IS THE NAME: ');
			//console.log(z.sa);
			if(z.sa.indexOf(' and ') >= 0)
			{
				tempArtistName = z.sa.replace(/ and /g, ' & ');
				cleanedArtistList.push(tempArtistName);
			}
			else
			{
				//console.log('ELSE CASE');
				cleanedArtistList.push(z.sa);
			}
		}
	});
	//console.log('WITH THIS ARTIST LIST: ');
	//console.log(cleanedArtistList);
	var songsForThoseArtists = Songs.find({'sa': {$in: cleanedArtistList}}).fetch();
	//console.log('FOUND these many songs for those artists:' + songsForThoseArtists.length);
	return songsForThoseArtists;
}

function getUniqueGenresFromArtistList(){

	//get genres from ARTIST LIST
	var allGenres = Artists.find({}, {fields: {'genres':1}}).fetch();
    //console.log('FOUND THESE MANY GENRES : ' + allGenres.length);
    var cleanedGenres = [];

    _.each(allGenres, function(z){
    	_.each(z.genres, function(y){
	    	//console.log('CURRENT LENGTH OF CLEANED GENRES: ' + cleanedGenres.length);
	    	cleanedResult = cleanGenreQuery(y);
	    	if(!_.isNull(cleanedResult))
	    	{
	    		cleanedGenres.push(cleanedResult);
	    	}
    	});
    });

    //get genres from SONG LIST

    var songGenresResult = Songs.find({}, {fields: {'genre': 1}}).fetch();
    //console.log('GOT THESE DISTINCT SONG GENRES from the SONG table');
    //console.log(songGenres);

    _.each(songGenresResult, function(z){
    	//console.log('this is the GENRE: ');
    	//console.log(z.genre);
    	//console.log('CURRENT LENGTH OF CLEANED GENRES: ' + cleanedGenres.length);
    	//console.log('THIS IS THE GENRE BEFORE CLEANING: ' + z.genre);
    	var cleanedResult = cleanGenreQuery(z.genre);
    	//console.log('THIS IS THE GENRE AFTER CLEANING: ' + cleanedResult);
    	if(!_.isNull(cleanedResult) && !_.contains(cleanedResult, '/'))
    	{
    		cleanedGenres.push(cleanedResult);
    	}
    	else if(_.contains(cleanedResult, '/')) // split on / to get multiple genres
    	{
    		//console.log('THIS IS A MULTI GENRE entry: ');
    		//console.log(cleanedResult)
    		var splitGenres = cleanedResult.split('/');
    		_.each(splitGenres, function(a){
    			var b = cleanGenreQuery(a);
    			//console.log('this is the SINGLE ENTRY:');
    			//console.log(b);
    			cleanedGenres.push(b);
    		});
    	}
    });

    //console.log('after cleansing these genres are now at this length: ' + cleanedGenres.length)

    cleanedGenres = _.without(cleanedGenres, null, undefined, '', ' ');

    var unique = _.uniq(cleanedGenres, function(x){
	    return x;
	});

	return unique;
}

function setDetailsForCoverArtists(){
	var coverSongs = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'cover': true}, {fields: {'sa':1, 'cover': 1, 'coveredBy': 1, 'sl': 1}}).fetch();
    //console.log('FOUND THESE MANY SONGS without AID and that are valid: ' + allSongs.length);
    var coverArtists = _.uniq(coverSongs, function(x){
	    return x.coveredBy;
	});

	_.each(coverArtists, function(y){
		if(y.cover)
		{
			//console.log('THIS IS THE COVERED BY artist: '+ y.coveredBy);
			//console.log('this is the link: ' + y.sl);
			if(!_.isUndefined(y.coveredBy))
			{
				//console.log('actually found a covered by artist: ' + y.coveredBy);
				//console.log('GOING TO SEARCH AND SEE IF DETAILS already exist for this artist or not')
				foundArtist = Artists.findOne({'name': y.coveredBy});
				foundBadArtist = BadArtists.findOne({'sa': y.coveredBy});
				
				if(_.isUndefined(foundArtist) && _.isUndefined(foundBadArtist))//haven't found artist in db
				{
					//console.log('have not found artist in the DB: ' + y.coveredBy);
					//console.log('GOING to search and insert')
					getInfoForNonexistentArtistAndInsert(y.coveredBy);
					//unsetArtists++;
					//console.log('currently unset number of artists: ' + unsetArtists);
				}
				else
					console.log('already found this artist in the DB: ' + y.coveredBy);
			}
		}
	});
}


function getInfoForNonexistentGenreAndInsert(genreName)
{
	console.log('GENRE DOES NOT ALREADY EXIST IN THE DB!!!! SO GOING TO GET INFO ABOUT THEM AND INSERT IN DB!');
	var updatedAPI = lfmGenreAPI.replace("###GENRE_NAME###", genreName);
	Meteor.http.get(updatedAPI, 
		function(error, result) {
			if(!error && result.statusCode === 200) {
				console.log('REACHED LAST FM GENRE 200: ');
				// this callback will be called asynchronously
				// when the response is available
				var lfm = result.data;
				if(result != undefined && !_.isUndefined(lfm.tag)) // skip sifting through LFM results if there are no results
				{
					console.log('REACHED LAST FM GENRE success: ');
					//console.log(lfm);
					//console.log('and this is the sub fields:');
					//console.log(lfm.tag.wiki.summary);
					//console.log(lfm.tag.wiki.content);
					//console.log(lfm.artist.tags);
					//console.log(lfm.artist.bio);
					//console.log(lfm.artist.bio.placeformed);
					var newGenre = {};
					newGenre.name = lfm.tag.name;

					if(!_.isUndefined(lfm.tag.wiki.summary))
					{
						newGenre.summary = lfm.tag.wiki.summary;
					}

					if(!_.isUndefined(lfm.tag.wiki.content))
					{
						newGenre.content = lfm.tag.wiki.content;
					}

					//console.log('this is the object created for ' + genreName);
					//console.log(newArtist);
					if(_.isUndefined(Genres.findOne({'name': genreName})))
					{
						console.log('INSERTED THIS GENRE: ' + genreName);
						Genres.insert(newGenre);
					}
					else
					{
						console.log('GENRE FOUND IN DB SO WILL BE SKIPPED: ' + genreName);
					}

					//return Artists.findOne({'_id': insertedArtist});
					//console.log('THIS IS THE FOUND ARTIST from DB: ');
					//console.log(foundNewArtist);
				}
				else
				{
					console.log('ENCOUNTERED an eRROR in LFM GENRE validation method even though response was 200: ');
					console.log(result);
					//console.log('LFM RESULT: ' + lfm.message);
					//console.log('THIS WAS THE ARTIST: ' + genreName);
					BadGenres.insert({'name': genreName});
				}
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

function cleanGenreQuery(genreQuery)
{
	if(!_.isNull(genreQuery) && !_.isUndefined(genreQuery) && !_.isEmpty(genreQuery))
	{
		//console.log('THIS IS HTE GENRE QUERY for cleanup ');
		//console.log(genreQuery);
		//clean up track information for searching Last.FM
		genreQuery = genreQuery.replace(/ & /g, ' and ');
		genreQuery = genreQuery.replace(/&/g, 'n');

		genreQuery = genreQuery.replace(/-/g, ' ');
	    genreQuery = genreQuery.replace(/'n'/g, ' and ');
		genreQuery = genreQuery.trim();

		return genreQuery.toLowerCase();
	}
	else
		return null;
}
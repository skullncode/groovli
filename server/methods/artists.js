lfmArtistAPI = "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=###ARTIST_NAME###&api_key=3135d1eacd6085271c24a02d4195cccf&format=json";

Meteor.methods({
	//if Artist doesn't already exist in DB insert and return ID
  setDetailsForUnsetArtists: function() {
    console.log('reached the artist method');
    var allSongs = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'aid': { $exists: false }}, {fields: {'sa':1}}).fetch();
    console.log('FOUND THESE MANY SONGS without AID and that are valid: ' + allSongs.length);
    var uniqueArtists = _.uniq(allSongs, function(x){
	    return x.sa;
	});
	console.log('unique artist lenght is: ' + uniqueArtists.length);
    //console.log('UNIQUE artists are: ');
    //console.log(uniqueArtists);

    //getInfoForNonexistentArtistAndInsert('Limp Bizkit - Thieves');

    console.log('starting to set unset artist details');
    var unsetArtists = 0;
    _.each(uniqueArtists, function(y){
    	//console.log('this is the original artist name: ' + y.sa)
    	y.sa = cleanArtistQuery(y.sa);
    	//console.log('this is the cleaned artist name: ' + y.sa);
    	var foundArtist = Artists.findOne({'name': y.sa});
    	var foundBadArtist = BadArtists.findOne({'sa': y.sa});
    	
    	if(_.isUndefined(foundArtist) && _.isUndefined(foundBadArtist))//haven't found artist in db
    	{
    		//console.log('have not found artist in the DB: ' + y.sa);
    		//console.log('GOING to search and insert')
    		getInfoForNonexistentArtistAndInsert(y.sa);
    		unsetArtists++;
    		//console.log('currently unset number of artists: ' + unsetArtists);
    	}
    	else
    		console.log('already found this artist in the DB: ' + y.sa);
    });
    console.log('FINISHED setting unset artist details');
  },
  	reviewExistingArtists: function() {
		//console.log('GOING TO GET ALL EXISTING SONGS in the DB for review: ');
		var x = Artists.find({}).fetch()
		//console.log('THIS IS THE LENGTH : ' + x.length);
		return x;
	},
	findArtistForRouting: function(artistName)
	{
		return Artists.findOne({'name': {$regex: new RegExp('^' + artistName, 'i')}});
	},
	deleteArtistEntry: function(artistName) {
	    Artists.remove({name: artistName}, function(error) {
	          if (error) {
	            // display the error to the user
	            return error;
	          }
	          else{
	            //console.log('result');
	          }
	      })
  	},
  	doesArtistHavePage: function(artistName) {
  		//replace ampersand with AND so that check works correctly
		if(artistName.indexOf('&') >= 0)
		{
			artistName = artistName.replace(/&/g, 'and');
		}
		//console.log('SEARCHING TO SEE IF THIS SIMILAR ARTIST HAS A PAGE: ' + artistName);
  		var x = Artists.findOne({'name': {$regex: new RegExp(artistName + '$', 'i')}});
  		//console.log("GOT THIS: ");
  		//console.log(x);
  		if(_.isEmpty(x))
  			return false;
  		else
  			return true;
  	},
  	checkAndSetDetailsForSpecificArtist: function(artistName) {
  		//console.log('CHECKING TO SEE IF THIS ARTIST already has details in the DB: ' + artistName);
  		artistName = cleanArtistQuery(artistName);
  		var foundArtist = Artists.findOne({'name': artistName});
    	var foundBadArtist = BadArtists.findOne({'sa': artistName});
    	
    	if(_.isUndefined(foundArtist) && _.isUndefined(foundBadArtist))//haven't found artist in db
    	{
    		//console.log('have not found artist in the DB: ' + y.sa);
    		//console.log('GOING to search and insert')
    		getInfoForNonexistentArtistAndInsert(artistName);
    		//console.log('currently unset number of artists: ' + unsetArtists);
    	}
  	}
});


function getInfoForNonexistentArtistAndInsert(artistName)
{
	//console.log('ARTIS DOES NOT ALREADY EXIST IN THE DB!!!! SO GOING TO GET INFO ABOUT THEM AND INSERT IN DB!');
	var updatedAPI = lfmArtistAPI.replace("###ARTIST_NAME###", artistName);
	Meteor.http.get(updatedAPI, 
		function(error, result) {
			if(!error && result.statusCode === 200) {
				// this callback will be called asynchronously
				// when the response is available
				var lfm = result.data;
				if(result != undefined && !_.isUndefined(lfm.artist)) // skip sifting through LFM results if there are no results
				{
					//console.log('REACHED LAST FM success: ');
					//console.log(lfm);
					//console.log('and this is the sub fields:');
					//console.log(lfm.artist.similar);
					//console.log(lfm.artist.tags);
					//console.log(lfm.artist.bio);
					//console.log(lfm.artist.bio.placeformed);
					var newArtist = {};
					newArtist.name = lfm.artist.name;

					if(!_.isUndefined(lfm.artist.image[0]))
					{
						newArtist.smallImage = lfm.artist.image[0];
					}

					if(!_.isUndefined(lfm.artist.image[1]))
					{
						newArtist.mediumImage = lfm.artist.image[1];
					}

					if(!_.isUndefined(lfm.artist.image[2]))
					{
						newArtist.largeImage = lfm.artist.image[2];
					}

					if(!_.isUndefined(lfm.artist.image[3]))
					{
						newArtist.megaImage = lfm.artist.image[3];
					}

					if(!_.isUndefined(lfm.artist.bio) && !_.isUndefined(lfm.artist.bio.content))
					{
						newArtist.bio = lfm.artist.bio.content;
					}


					if(!_.isUndefined(lfm.artist.bio.yearformed))
					{
						newArtist.began = lfm.artist.bio.yearformed
					}

					if(!_.isUndefined(lfm.artist.bio.yearformed))
					{
						newArtist.placeBegan = lfm.artist.bio.placeformed
					}

					if(!_.isUndefined(lfm.artist.similar.artist) && !_.isEmpty(lfm.artist.similar.artist))
					{
						newArtist.similar = [];
						_.each(lfm.artist.similar.artist, function(x){
							newArtist.similar.push(x.name);
						});
					}

					if(!_.isUndefined(lfm.artist.tags.tag) && !_.isEmpty(lfm.artist.tags.tag))
					{
						newArtist.genres = [];
						_.each(lfm.artist.tags.tag, function(x){
							newArtist.genres.push(x.name);
						});
					}

					//console.log('this is the object created for ' + artistName);
					//console.log(newArtist);
					if(_.isUndefined(Artists.findOne({'name': artistName})) && _.isUndefined(Artists.findOne({'largeImage.#text': newArtist.largeImage['#text']})))
					{
						Artists.insert(newArtist);
					}
					/*else
					{
						console.log('FOUND IN DB SO WILL BE SKIPPED: ' + artistName);
					}*/

					//return Artists.findOne({'_id': insertedArtist});
					//console.log('THIS IS THE FOUND ARTIST from DB: ');
					//console.log(foundNewArtist);
				}
				else
				{
					//console.log('ENCOUNTERED an eRROR in LFM validation method even though response was 200: '+response);
					//console.log('LFM RESULT: ' + lfm.message);
					//console.log('THIS WAS THE ARTIST: ' + artistName);
					BadArtists.insert({'sa': artistName});
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

function cleanArtistQuery(trackQuery)
{
	//clean up track information for searching Last.FM
	trackQuery = trackQuery.replace(/&/g, 'and');

	trackQuery = trackQuery.toUpperCase();
	trackQuery = trackQuery.replace('LYRICS',' ');
	trackQuery = trackQuery.replace('HD',' ');
	trackQuery = trackQuery.replace('OFFICIAL VIDEO',' ');
	trackQuery = trackQuery.replace('MUSIC VIDEO',' ');
	trackQuery = trackQuery.replace(' FT.',' ');
	//trackQuery = trackQuery.replace(' BY ',' ');

	//console.log('the track query ISSS1: '+ trackQuery);					

	//trackQuery = trackQuery.replace(/[^A-Za-z0-9']/g, ' '); //remove special characters - simpler regex
	trackQuery = trackQuery.replace(/['`~@#$%^&*()_|+=?;:",<>\{\}\[\]\\\/]/gi, ' ');
	trackQuery = trackQuery.replace(/\s{2,}/g, ' '); //remove extra whitespace
	trackQuery = trackQuery.trim();

	return trackQuery.toLowerCase();
}
Template.songDetails.helpers({
  songPlaying: function() {
  	var cs = Session.get('CS');
    if(cs !== undefined && cs !== {} && cs !== [])
  		return true;
  	else
  		return false;
  },

  currentSong: function() {
  	var cs = Session.get('CS');
    if(cs !== undefined && cs !== {} && cs !== [])
		return cs;
  },

  /*checkForGenre: function(genreName) {
    doesGenreHavePage(genreName);
  },
  genreExists: function(cleaned) {
    return Session.get(cleaned+'_hasPage');
  },*/
  hasGenres: function() {
    if(!_.isEmpty(currentSong))
    {
      var ca = Artists.findOne({name: currentSong.sa})
      if((!_.isUndefined(currentSong.genre) && !_.isEmpty(currentSong.genre)) || (!_.isUndefined(ca) && !_.isUndefined(ca.genres) && !_.isEmpty(ca.genres)))
        return true;
      else
        return false;
    }
    else
      return false;
  },
  extendedGenres: function() {
    if(!_.isUndefined(currentSong.sa))
    {
      var artName = currentSong.sa;
      if(artName.indexOf('&') >= 0)
      {
        artName = artName.replace(/&/g, 'and');
      }

      var artGenres = [];

      var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
      //console.log("GOT THIS: ");
      //console.log(x);
      if(_.isEmpty(x) || _.isUndefined(x.genres))
      {
        //console.log('1st case');
        currentSong.genre = currentSong.genre.replace(/-/g, ' ');
        currentSong.genre = currentSong.genre.replace(/'n'/g, ' and ');
        var justItunesGenres = currentSong.genre.split('/');
        return justItunesGenres;
      }
      else if(!_.isUndefined(x.genres))
      {
        //console.log('2nd case');

        //console.log('BEFORE CLEANING: ');
        //console.log(x.genres);
        x.genres = _.map(x.genres, function(z){
          if(!_.isNull(z) && !_.isUndefined(z) && !_.isEmpty(z))
            return z.replace(/-/g, ' ');
        });

        x.genres = _.uniq(x.genres);

        //console.log('AFTER CLEANING: ');
        //console.log(x.genres);

        if(!_.contains(x.genres,null) && !_.contains(x.genres,'all') && !_.contains(x.genres,undefined))
        {
          //console.log('NO INSTANCE OF NULL or ALL, so returning as is:');
          //console.log(x.genres);
          return x.genres;
        }
        else
        {
          //console.log('In SECOND CASE');
          var cleaned = x.genres;
          //console.log('BEFORE SPLICE 1:');
          //console.log(cleaned);
          cleaned = _.without(cleaned, null, undefined, 'all'); 
          //console.log('BEFORE RETURNING:');
          //console.log(cleaned);
          if(!_.isEmpty(cleaned))
          {
            //console.log('cleaned is NOT EEEEEMPTY!!!');
            return cleaned;
          }
          else
          {
            //console.log('cleaned is EMPTY!!!');
            currentSong.genre = currentSong.genre.replace(/-/g, ' ');
            currentSong.genre = currentSong.genre.replace(/'n'/g, ' and ');
            var justItunesGenres = currentSong.genre.split('/');
            return justItunesGenres;
          }
        }
      }
    }
  },

  ampersandRemovedArtistName: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs) && !_.isUndefined(cs.sa))
    {
      var originalArtistName = cs.sa;
      if(originalArtistName.indexOf('&') >= 0)
      {
        originalArtistName = originalArtistName.replace(/&/g, 'and');
      }

      return originalArtistName;
    }
  },
  
  artistTrackAreNotSame: function() {
  	//console.log('CHECKING for artist and track!!');
  	var cs = Session.get('CS');
  	if(cs.sa !== cs.st)
  	{
  		//console.log('ARTIST and track are not the same');
  		return true;
  	}
  	else
  		return false;
  },

  remixedByDeets: function() {
    if(_.isUndefined(this.remixedBy) || _.isEmpty(this.remixedBy))
      return 'unknown'
    else
      return this.remixedBy;
  },

  albumDeetsNotEmpty: function() {
  	var cs = Session.get('CS');
    //console.log('CHECKING if ALBUM deets are empty!!');
    //console.log('ALBUM IS ['+cs.album+']');
  	return (cs.album !== undefined && cs.album !== "");
  },

  formattedReleaseDate: function() {
  	var cs = Session.get('CS');
  	var formattedDate = new Date(cs.releaseDate).getFullYear();
  	return formattedDate;
  },

  currentSongHasEncounteredAnError: function() {
    //console.log('INSIDE THE SONG ERROR CHECKER!!!!');
    if(Session.get('SongErroneous'))
    {
      console.log('THERE IS AN ACTUAL ERROR WITH THE SONG!!!!');
    }
  },

  sharedByDetailsForCurrentSong: function() {
      var shareCounter = 0;
      var globalIDsThatSharedThisSong = [];
      while(shareCounter < this.sharedBy.length)
      {
        //console.log('INSIDE SHARE COUNTER: for this length: '+this.sharedBy.length);
        //console.log('INSIDE FRIEND COUNTER: for this length: '+Meteor.user().fbFriends.length);
        //console.log('FRIEND COUNTER IS:  '+ friendCounter);
        if(_.isUndefined(_.findWhere(globalIDsThatSharedThisSong, {p_id: this.sharedBy[shareCounter]._id})) && _.isUndefined(_.findWhere(globalIDsThatSharedThisSong, {personid_sysdate: this.sharedBy[shareCounter].uid + "_" + this.sharedBy[shareCounter].systemDate})))
        {
          globalIDsThatSharedThisSong.push({personID: this.sharedBy[shareCounter].uid, personName: this.sharedBy[shareCounter].uname, personTimestamp: new moment(this.sharedBy[shareCounter].systemDate * 1000).format('llll'), p_id: this.sharedBy[shareCounter]._id, personid_sysdate: this.sharedBy[shareCounter].uid + "_" + this.sharedBy[shareCounter].systemDate});
        }
        
        shareCounter++;
      }
      //console.log('THIS IS THE SHARED BY DETAILS: ');
      //console.log(globalIDsThatSharedThisSong);
      //globalIDsThatSharedThisSong = _.uniq(Session.get('CS').sharedBy, function(x){return x._id;})
      return globalIDsThatSharedThisSong;
    },
  artistHasPage: function() {
    if(Session.get('artistHasPage'))
    {
      if(!_.isUndefined(currentSong.sa))
        currentSong.sa = currentSong.sa.replace(/&/g, 'and');

      return true;
    }
    else
      return false;
  },
  coveringArtistHasPage: function() {
    if(Session.get('coveringArtistHasPage'))
    {
      if(!_.isUndefined(currentSong.sa))
        currentSong.coveredBy = currentSong.coveredBy.replace(/&/g, 'and');
      return true;
    }
    else
      return false;
  },
  ampersandRemovedCoveringArtistName: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs) && !_.isUndefined(cs.coveredBy))
    {
      var coveringArtistName = cs.coveredBy;
      if(coveringArtistName.indexOf('&') >= 0)
      {
        coveringArtistName = coveringArtistName.replace(/&/g, 'and');
      }

      return coveringArtistName;
    }
  },
  checkIfArtistHasPage: function(artistName) {
    doesArtistHavePage(artistName, 'original');
  },
  checkIfCoveringArtistHasPage: function(artistName) {
    doesArtistHavePage(artistName, 'cover');
  },
  currentSongID: function() {
    if(!_.isUndefined(Session.get('CS')))
    {
      //console.log('GOT A CURRENT SONG ID: ' + Session.get('CS').sl);
      return Session.get('CS').sl;
    }
    else
      return '';
  }
});

Template.songDetails.events({
  'click #shareFbButton': function(e) {
    //console.log('CLICKED share button!');
    var cs = Session.get('CS');
    if(cs !== undefined && cs !== {} && cs !== [])
    {
      //console.log(FB);
      FB.init({
            //appId      : '848177241914409', //dev app
            appId      : '1555076711418973', //prod app
            xfbml      : true,
            version    : 'v2.2'
          });
      FB.ui({
        method: 'share',
        href: cs.sl,
      },
      // callback
      function(response) {
        if (response && !response.error_code) {
          //console.log('THIs IS THE RESPONSE!')
          var sharedFBObject = {
            storyTitle: '',
            uid: Meteor.user().services.facebook.id,
            msgWithStory: 'shared from Groovli',
            storyLink: cs.sl,
            systemDate: new moment().unix()
          };
          /*Meteor.call('insertNewSong',sharedFBObject, 'FB', 'YOUTUBE');*/ // COMMENTED OUT NOW as song is automatically being pulled in via FB
          updateSongSourceTabInHistory(sharedFBObject);
          toastr.success('Song shared successfully!');
        } else {
          toastr.error('Error while sharing song!');
        }
      });
    }
    return true;
  }
});

/*
function doesGenreHavePage(genreName) {
  console.log('CHECKING IF THIS GENRE has a page or not: ' + genreName);
  Meteor.call('doesGenreHavePage', genreName, function(error,result){
        if(error){
          console.log('Encountered error while trying to check if artist has page: ' + error)
        }
        else{
            // do something with result
          console.log('received genre page result: ' + result);
          Session.set(genreName+'_hasPage', result);
        };
    });
}*/

function doesArtistHavePage(artName, mode) {
  if(!_.isUndefined(artName))
  {
    if(artName.indexOf('&') >= 0)
    {
      artName = artName.replace(/&/g, 'and');
    }

    var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
    //console.log("GOT THIS: ");
    //console.log(x);
    if(_.isEmpty(x))
    {
      if(mode === 'original')
        Session.set('artistHasPage', false);
      else if(mode === 'cover')
        Session.set('coveringArtistHasPage', false);
    }
    else
    {
      if(mode === 'original')
        Session.set('artistHasPage', true);
      else if(mode === 'cover')
        Session.set('coveringArtistHasPage', true);
    }
  }
  /*
  Meteor.call('doesArtistHavePage', artName, function(error,result){
        if(error){
          console.log('Encountered error while trying to check if artist has page: ' + error)
        }
        else{
            // do something with result
          //console.log('received artist page result: ' + result);
          Session.set('artistHasPage', result);
        };
    });*/
}
var currentSongArtistObj = new ReactiveVar(null);
var coveringArtistObj = new ReactiveVar(null);
var genresForArtistPageLoaded = new ReactiveVar(false);

Template.semanticDetails.helpers({
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
  extendedGenresLoaded:function() {
    return genresForArtistPageLoaded.get();
  },
  extendedGenres: function() {
    return Genres.find();
  },
  artistIDForName: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs) && !_.isUndefined(cs.sa) && !_.isNull(currentSongArtistObj.get()))
    {
      /*var foundArtist = Artists.findOne({'name': {$regex: new RegExp('^' + cs.sa + '$', 'i')}});
      if(!_.isUndefined(foundArtist))
        return foundArtist._id;*/
      if(!_.isUndefined(currentSongArtistObj.get()))
        return currentSongArtistObj.get()._id;
    }
  },
  
  coveringArtistIDForName: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs) && !_.isUndefined(cs.sa) && !_.isNull(coveringArtistObj.get()))
    {
      /*var foundArtist = Artists.findOne({'name': {$regex: new RegExp('^' + cs.sa + '$', 'i')}});
      if(!_.isUndefined(foundArtist))
        return foundArtist._id;*/
      if(!_.isUndefined(coveringArtistObj.get()))
        return coveringArtistObj.get()._id;
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
  artistHasPage: function() {
    if(Session.get('artistHasPage'))
    {
      //console.log('########################## replacement ERRRROR 1');
      //console.log(currentSong.sa);
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
      //console.log('########################## replacement ERRRROR 2');
      //console.log(currentSong.coveredBy);
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


Template.semanticDetails.events({
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

Template.semanticDetails.onCreated(function () {
  var self = this;

  // Use self.subscribe with the data context reactively
  self.autorun(function () {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
    {
      //console.log("GONNNA get extended genres for this song: ");
      //console.log(getExtendedGenreListForCurrentSong());
      var genListForCurrentSong = getExtendedGenreListForCurrentSong();
      if(!_.isEmpty(genListForCurrentSong))
        self.subscribe('genresForArtistPage', genListForCurrentSong, {onReady: genreSubForArtistPageLoaded});
    }
  });
});

function doesArtistHavePage(artName, mode) {
  if(!_.isUndefined(artName))
  {
    if(artName.indexOf('&') >= 0)
    {
      artName = artName.replace(/&/g, 'and');
    }

    var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
    if(mode === 'original')
      currentSongArtistObj.set(x);
    else if(mode === 'cover')
      coveringArtistObj.set(x);
    //console.log("#########################################################GOT THIS ARTIST: ");
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
}

function genreSubForArtistPageLoaded(){
  genresForArtistPageLoaded.set(true);
}

function getExtendedGenreListForCurrentSong(){
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
      //console.log('########################1st case');
      //console.log(currentSong.genre);
      if(!_.isUndefined(currentSong.genre))
      {
        currentSong.genre = currentSong.genre.replace(/-/g, ' ');
        currentSong.genre = currentSong.genre.replace(/'n'/g, ' and ');
        var justItunesGenres = currentSong.genre.split('/');
        //console.log(justItunesGenres);
        //return justItunesGenres;
        return _.first(justItunesGenres, 4);
      }
      else
        return [];
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
        //return x.genres;
        return _.first(x.genres, 4);
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
          //console.log(justItunesGenres);
          //return justItunesGenres;
          return _.first(justItunesGenres, 4);
        }
      }
    }
  }
}
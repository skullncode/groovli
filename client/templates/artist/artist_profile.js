Template.artistProfile.helpers({
  getArtist: function() {
    Session.set(Router.current().params._name+'_artObj', null)
    getArtistForRouting();
  },
  artistObject: function() {
    var artObj = Session.get(Router.current().params._name+'_artObj');
    if(!_.isNull(artObj) && !_.isUndefined(artObj) && !_.isEmpty(artObj.genres) && !_.isUndefined(artObj.genres))
    {
      artObj.genres = _.without(artObj.genres, null, undefined, 'all', 'under 2000 listeners');
    }
    return artObj;    
  },

  songsForArtist: function() {
    if(!_.isUndefined(Session.get(Router.current().params._name+'as')) && !_.isEmpty(Session.get(Router.current().params._name+'_as')))
      return Session.get(Router.current().params._name+'_as');
  },
  artistImage: function() {
    if(!_.isUndefined(this.largeImage['#text']) && !_.isEmpty(this.largeImage['#text']))
      return '<img class="artistProfileImage" src="'+this.largeImage['#text']+'">';
    else
      return '<h4>NO ARTIST IMAGE AVAILABLE</h4>';
  },
  cleanedSimilarURL: function() {
    var cleaned = this.replace(',', ' ');
    //cleaned = cleaned.replace(' . ', ' '); doesn't work with S. Carey
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    //replace ampersand with AND so that check works correctly
    if(cleaned.indexOf('&') >= 0)
    {
      cleaned = cleaned.replace(/&/g, 'and');
    }
    doesArtistHavePage(cleaned);
    if(Session.get(cleaned+'_hasPage'))
      return '<a href="/artist/'+cleaned+'"><span class="btn btn-info btn-xs" data-toggle="tooltip" data-placement="top" title="'+cleaned+' page""><b>'+cleaned+'</b></span></a>';
    else
      return '<span class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="No music of this artist has been brought into Groovli yet; be the first! Share some music of '+cleaned+'!">'+cleaned+'</span>';
  },
  hasSimilar: function() {
    if(!_.isUndefined(this.similar) && !_.isEmpty(this.similar))
      return true;
    else
      return false;
  },
  hasGenres: function() {
    if(!_.isUndefined(this.genres) && !_.isEmpty(this.genres))
      return true;
    else
      return false;
  },
  cleanedGenre: function() {
    //console.log('THIS IS GENRE pre-cleansing:');
    //console.log(this);
    var cleaned = this.replace(/-/g, ' ');
    cleaned = cleaned.replace(/'n'/g, ' and ');
    //console.log('THIS IS GENRE post-cleansing:');
    //console.log(cleaned);
    return cleaned;
  },
  checkForGenre: function(genreName) {
    doesGenreHavePage(genreName);
  },
  genreExists: function(cleaned) {
    return Session.get(cleaned+'_hasPage');
  },
  hasCoverSongs: function() {
    if(Session.get(Router.current().params._name+'_acs_count') > 0)
      return true;
    else
      return false;
  },
  bioEmpty: function() {
    return _.isEmpty(this.bio);
  },
  cleanedBio: function() {
    this.bio = this.bio.replace(/(\r\n|\n|\r)/gm,"");//remove extra line breaks
    this.bio = this.bio.replace(/\s{2,}/g, ' '); //remove extra whitespace
    var textToRemove = '<a href=\"http:\/\/www.last.fm\/music\/###ARTIST_NAME###\">Read more about ###ARTIST_NAME### on Last.fm<\/a>.\n    \n    \nUser-contributed text is available under the Creative Commons By-SA License and may also be available under the GNU FDL.';
    textToRemove = textToRemove.replace(/(\r\n|\n|\r)/gm,"");//remove extra line breaks
    textToRemove = textToRemove.replace(/\s{2,}/g, ' '); //remove extra whitespace
    var urlArtistText = Router.current().params._name;
    while(urlArtistText.indexOf(' ') >= 0)
    {
      urlArtistText = urlArtistText.replace(' ', '+');
    }
    textToRemove = textToRemove.replace('###ARTIST_NAME###', urlArtistText);
    textToRemove = textToRemove.replace('###ARTIST_NAME###', Router.current().params._name);
    //console.log('this is the bio:');
    //console.log(this.bio);
    //console.log('this is the bio text to remove: ');
    //console.log(textToRemove);
    //console.log('this is the urlArtistText: ');
    //console.log(urlArtistText);
    return this.bio.replace(textToRemove, '');
  },
  songCount: function()
  {
    //console.log('CHECKING SONG COUNT!!!');
    if(Session.get(Router.current().params._name+'_as_count') > 1 || Session.get(Router.current().params._name+'_as_count') === 0)
      return '<h2><strong>'+Session.get(Router.current().params._name+'_as_count')+'</strong></h2><p><small>songs on Groovli</small></p>';
    else if(Session.get(Router.current().params._name+'_as_count') === 1)
      return '<h2><strong>'+Session.get(Router.current().params._name+'_as_count')+'</strong></h2><p><small>song on Groovli</small></p>';
  },
  albumCount: function() 
  {
    if(!_.isUndefined(Session.get(Router.current().params._name+'_as')) && !_.isEmpty(Session.get(Router.current().params._name+'_as')))
    {
      var albumList = _.uniq(Session.get(Router.current().params._name+'_as'), function(x){
        return x.songObj.album;
      });

      if(albumList.length > 1 || albumList.length === 0)
        return '<h2><strong>'+albumList.length+'</strong></h2><p><small>albums</small></p>';
      else if(albumList.length === 1)
        return '<h2><strong>'+albumList.length+'</strong></h2><p><small>album</small></p>';
    }
  },
  coverSongCount: function() 
  {
    //console.log('checking cover songs!!');
    if(!_.isUndefined(Session.get(Router.current().params._name+'_acs_count')))
    {
      //console.log('covers are valid!!!');
      if(Session.get(Router.current().params._name+'_acs_count') > 1 || Session.get(Router.current().params._name+'_acs_count') === 0)
        return '<h2><strong>'+Session.get(Router.current().params._name+'_acs_count')+'</strong></h2><p><small>covers</small></p>';
      else if(Session.get(Router.current().params._name+'_acs_count') === 1)
        return '<h2><strong>'+Session.get(Router.current().params._name+'_acs_count')+'</strong></h2><p><small>cover</small></p>';
    }
  },
  artistPageExists: function() 
  {
    if(!_.isUndefined(Session.get(Router.current().params._name+'_artObj')))
      return true;
    else
      return false;
  }
});

function getArtistForRouting()
{
  //console.log('GETTING artist for routing now: ' + Router.current().params._name);
  Meteor.call('findArtistForRouting', Router.current().params._name, function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
        Session.set(Router.current().params._name+'_artObj', result);
      }
  });
}


function doesGenreHavePage(genreName) {
  //console.log('CHECKING IF THIS GENRE has a page or not: ' + genreName);
  Meteor.call('doesGenreHavePage', genreName, function(error,result){
        if(error){
          console.log('Encountered error while trying to check if artist has page: ' + error)
        }
        else{
            // do something with result
          //console.log('received genre page result: ' + result);
          Session.set(genreName+'_hasPage', result);
        };
    });
}

function doesArtistHavePage(artName) {
  //console.log('CLIENT METHOD: SEARCHING TO SEE IF THIS SIMILAR ARTIST HAS A PAGE: ' + artName);
  var x = Artists.findOne({'name': {$regex: new RegExp('^' + artName + '$', 'i')}});
  //console.log("GOT THIS: ");
  //console.log(x);
  if(_.isEmpty(x))
  {
    //return false;
    Session.set(artName+'_hasPage', false);
  }
  else
  {
    //return true;
    Session.set(artName+'_hasPage', true);
  }
  /*Meteor.call('doesArtistHavePage', artName, function(error,result){
        if(error){
          console.log('Encountered error while trying to check if artist has page: ' + error)
        }
        else{
            // do something with result
          //console.log('received artist page result: ' + result);
          Session.set(artName+'_hasPage', result);
        };
    });*/
}
Template.genreProfile.helpers({
  getGenre: function() {
    Session.set(Router.current().params._name+'_genObj', 'initial_blank'); //so that not found template isn't intermittently shown before getting genre
    //getGenreForRouting();
    var genreForPage = Genres.findOne({'name': {$regex: new RegExp('^' + Router.current().params._name + '$', 'i')}})
    if(!_.isEmpty(genreForPage))
    {
      Session.set(Router.current().params._name+'_genObj', genreForPage);
      getArtistsForGenres();
    }
    else
      Session.set(Router.current().params._name+'_genObj', null);
  },
  genreObject: function() {
    return Session.get(Router.current().params._name+'_genObj');
  },

  artistName: function() {
    if(_.has(this, 'name')) // has returned object from ARTISTS table
      return this.name;
    else if(_.has(this, 'sa')) //has returned object from song table
      return this.sa;
  },

  genreArtists: function() {
    var allArtistsForGenre = _.uniq(Session.get(Router.current().params._name+'_arts'), function(x){
      if(_.has(x, 'name'))
        return x.name;
      else if(_.has(x, 'sa'))
        return x.sa;
    });
    //console.log('THIS IS THE ARTIST LIST before calling for SONGS:');
    //console.log(allArtistsForGenre);
    getSongsForSpecificGenre(allArtistsForGenre);
    return allArtistsForGenre;
  },
  genreArtistsForCollage: function() {
    return _.sample(Session.get(Router.current().params._name+'_arts'), 20);
  },
  genreArtistImage: function() {
    if(_.has(this, 'mediumImage'))  // has returned object from ARTISTS table
      return this.mediumImage["#text"];
    else if(_.has(this, 'iTunesMediumAlbumArt')) // has returned object from SONGS table
      return this.iTunesMediumAlbumArt;
  },
  songsForArtist: function() {
    if(!_.isUndefined(Session.get(Router.current().params._name+'as')) && !_.isEmpty(Session.get(Router.current().params._name+'_as')))
      return Session.get(Router.current().params._name+'_as');
  },
  cleanedSimilarURL: function() {
    if(_.has(this, 'name')) // has returned object from ARTISTS table
    {
      var cleaned = this.name.replace(',', ' ');
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
        return '<span class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="No info exists yet for '+cleaned+', within Groovli">'+cleaned+'</span>';
    }
    else if(_.has(this, 'sa')) //has returned object from song table
    {
      var cleaned = this.sa.replace(',', ' ');
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
        return '<span class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="No info exists yet for '+cleaned+', within Groovli">'+cleaned+'</span>';
    }
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
  hasCoverSongs: function() {
    if(Session.get(Router.current().params._name+'_acs_count') > 0)
      return true;
    else
      return false;
  },
  bioEmpty: function() {
    return _.isEmpty(this.content);
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
  artistHasPage: function() {
    return Session.get('artistHasPage');
  },
  songCount: function()
  {
    //console.log('CHECKING SONG COUNT!!!');
    if(Session.get(Router.current().params._name+'_gs_count') > 1 || Session.get(Router.current().params._name+'_gs_count') === 0)
      return '<h2><strong>'+Session.get(Router.current().params._name+'_gs_count')+'</strong></h2><p><small>songs on Groovli</small></p>';
    else if(Session.get(Router.current().params._name+'_gs_count') === 1)
      return '<h2><strong>'+Session.get(Router.current().params._name+'_gs_count')+'</strong></h2><p><small>song on Groovli</small></p>';
  },
  genrePercentage: function()
  {
    //console.log('CHECKING SONG COUNT!!!');
    if(Session.get(Router.current().params._name+'_gs_count') >= 1)
    {
      //var x = (Session.get(Router.current().params._name+'_gs_count') / Songs.find({}).count()) * 100;
      var x = (Session.get(Router.current().params._name+'_gs_count') / Session.get('tsc')) * 100;
      //console.log('THIS IS THE PERCENTAGE');
      //console.log(x);
      if(x >= 1)
        x = Math.round(x);
      else
        x = x.toFixed(1);
      return '<h2><strong>'+x+'%</strong></h2><p><small>of all songs</small></p>';
    }
    else
      return '';
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
  artistCount: function()
  {
    var allArtistsForGenre = _.uniq(Session.get(Router.current().params._name+'_arts'), function(x){
      if(_.has(x, 'name'))
        return x.name;
      else if(_.has(x, 'sa'))
        return x.sa;
    });
    if(allArtistsForGenre.length > 1 || allArtistsForGenre.length === 0)
    {
      return '<h2><strong>'+allArtistsForGenre.length+'</strong></h2><p><small>artists</small></p>';
    }
    else if(allArtistsForGenre.length = 1)
    {
      return '<h2><strong>'+allArtistsForGenre.length+'</strong></h2><p><small>artist</small></p>';
    }
    else
      return '';
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
  genrePageExists: function()
  {
    //if(!_.isUndefined(Session.get(Router.current().params._name+'_genObj')))
    //console.log('GENRE OBJECT CURRENTLY IS: ');
    //console.log(Session.get(Router.current().params._name+'_genObj'));
    if(!_.isEmpty(Session.get(Router.current().params._name+'_genObj')))
      return true;
    else
      return false;
  }
});

/*
function getGenreForRouting()
{
  //console.log('GETTING artist for routing now: ' + Router.current().params._name);
  Meteor.call('findGenreForRouting', Router.current().params._name, function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
          //console.log('GOT THIS BACK for GENRE OBJECT: ' + Router.current().params._name);
          //console.log(result);
          Session.set(Router.current().params._name+'_genObj', result);
      }
  });
}*/

function getArtistsForGenres() {
  //console.log('GETTING ARTISTS FOR GENRES NOW!');
  var genreName = Router.current().params._name;
  var artistsForGenre = [];
  var originalGenreName = genreName;

  var x = Artists.find({'genres': {$regex: new RegExp(genreName, 'i')}}, {fields: {'name':1, 'mediumImage': 1}}).fetch();
  //console.log('1 - GOT THESE MANY Artists with this genre name: ' + genreName);
  //console.log(x.length);
  if(!_.isEmpty(x)){
    _.each(x, function(artistObj){
      //console.log('THIS IS WHAT IS GETTING PUSHED');
      //console.log(artistObj);
      artistsForGenre.push(artistObj);
    })
  }
  //GET WITH UPDATED GENRE NAME REPLACING space with dash, still from ARTISTS table
  //genreName = genreName.replace(/ /g, '-');
  //search for artists replacing each space with a dash and then searching again rather than a global replacement
  while(_.contains(genreName, ' '))
  {
    genreName = genreName.replace(' ', '-');
    x = Artists.find({'genres': {$regex: new RegExp(genreName, 'i')}}, {fields: {'name':1, 'mediumImage': 1}}).fetch();
    if(!_.isEmpty(x)){
      _.each(x, function(artistObj){
        //console.log('THIS IS WHAT IS GETTING PUSHED');
        //console.log(artistObj);
        artistsForGenre.push(artistObj);
      })
    }
  }

  //FINALLY LOOK FOR GENRE IN SONG TABLE and RETURN ARTIST Details

  x = Songs.find({'genre': {$regex: new RegExp(originalGenreName, 'i')}}, {fields: {'sa':1, 'iTunesMediumAlbumArt': 1}}).fetch();
  //console.log('3 - GOT THESE MANY SONGS with this genre name: ' + originalGenreName);
  //console.log(x.length);

  if(!_.isEmpty(x)){
    _.each(x, function(artistObj){
      //console.log('THIS IS WHAT IS GETTING PUSHED');
      //console.log(artistObj);
      artistsForGenre.push(artistObj);
    })
  }

  //console.log('3 - ARTISTS FOR GENRES RIGHT NOW IS: ');
  //console.log(artistsForGenre);

  //REMOVE ANY DUPLICATE ARTISTS
  var uniqArtistsForGenre = _.uniq(artistsForGenre, function(z){
    if(_.has(z, 'name'))
      return z.name;
    else if(_.has(z, 'sa'))
      return z.sa;
  });

  //console.log('4 - FINAL UNIQUE ARTISTS FOR GENRES RIGHT NOW IS: ');
  //console.log(uniqArtistsForGenre);

  Session.set(Router.current().params._name+'_arts', uniqArtistsForGenre);

  /*Meteor.call('getArtistsForGenres', Router.current().params._name, function(error, result){
    if(error){
        console.log(error.reason);
    }
    else{
        // do something with result
      //console.log('GOT THIS BACK for ARTISTS of genre: ' + Router.current().params._name);
      //console.log(result);
      Session.set(Router.current().params._name+'_arts', result);
    }
  });*/
}

function getSongsForSpecificGenre(genreSpecificArtistList)
{
  //console.log('GOING TO GET SPECIFIC SONGS FOR THIS GENRE: ' + Router.current().params._name);
  Meteor.call('getSongsForSpecificGenreArtistList', genreSpecificArtistList, function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
        
        //update listen history with song object and timestamp
        //console.log('THIS IS THE RESULT OF SONGS FOR THE SPECIFIC GENRE: ' + Router.current().params._name);
        //console.log(result);
        //var genreArtSongs = _.map(result, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});
        
        Session.set(Router.current().params._name+'_gs', result[0]);
        Session.set(Router.current().params._name+'_gs_count', result[0].length);
        Session.set('tsc', result[1]);

        getUsersFromSongList(result[0]);
        //getCoverSongsForSpecificArtist();
      }
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


function getUsersFromSongList(songList)
{
  var userListForGenres = Session.get(Router.current().params._name+'_gusers');
  if(_.isUndefined(userListForGenres))
    userListForGenres = [];

  _.each(songList, function(x){
    if(!_.isUndefined(x.songObj) && !_.isUndefined(x.songObj.sharedBy))
    {
      _.each(x.songObj.sharedBy, function(y){
        if(!_.isEmpty(y) && y.uid !== Meteor.user().services.facebook.id && _.isUndefined(_.findWhere(userListForGenres, {uid: y.uid})))
        {
          userListForGenres.push(y)
        }
      });
    }
  });

  Session.set(Router.current().params._name+'_gusers', userListForGenres);

  getUsersFromChatter();
}

function getUsersFromChatter()
{
  var userListForGenres = Session.get(Router.current().params._name+'_gusers');
  var genrePage = Router.current().params._name+"_genre_group";
  if(_.isUndefined(userListForGenres))
    userListForGenres = [];

  var genreMsgs = Messages.find({'to': String(genrePage)}, {sort: { 'timestamp': 1 }}).fetch();

  //console.log('THIS IS THE ARTIST MSGS: ');
  //console.log(artistMsgs);

  _.each(genreMsgs, function(x){
    //console.log('analyzing this message ') ;
    //console.log(x);
    if(x.from !== Meteor.user().services.facebook.id && _.isUndefined(_.findWhere(userListForGenres, {uid: x.from})))
    {
      //console.log('FOUND THIS USER TO ADD TO the list: ') ;
      //console.log(x);
      var chatterUser = {
        _id: x.fromProfileID,
        uid: x.from,
        uname: x.fromName
      };
      userListForGenres.push(chatterUser)
    }
  });

  Session.set(Router.current().params._name+'_gusers', userListForGenres);
}
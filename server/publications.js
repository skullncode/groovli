var songboardPagingLimit = 10;

Meteor.publish('listensForCurrentSong', function(linktype, linkSID) {
  if(linktype === 'YOUTUBE')
  {
    searchString = 'https://www.youtube.com/watch?v=' + linkSID;
    Counts.publish(this, 'listenCounterForYTSong', Listens.find({'sl': searchString}));
  }
});

Meteor.publish('ratingsForCurrentSong', function(linktype, linkSID) {
  if(linktype === 'YOUTUBE')
  {
    searchString = 'https://www.youtube.com/watch?v=' + linkSID;
    return Ratings.find({ 'sl': searchString});
  }
});


//FOR my groovs DATE range feature
Meteor.publish('30songsForMyGroovsBasedOnYearSelection', function(userID, cursorSkipAmount, yr, selGen) {
  //console.log("RCHD the my groovs year publication server method: ");
  //console.log('************************************THIS IS THE YEART: ');
  //console.log(yr);
  //console.log('%%%%%%%%%%%%%%%%%% this is the SELECTED genres: ');
  //console.log(selGen);
  if(_.isNull(yr))
  {
    //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% YEAR is NULL!!!! Will get latest year from server")
    yr = getLatestYearForMyGroovs(userID);
    //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% YEAR is now got!!!! this is the LAST YEAR: ");
    //console.log(yr);
  }

  if(userID !== null)
  {
    //console.log("%%%%%%%%%%%%%%%%%%%NOW Year aint NULL; gonna get year based MY GROOOOOOVS");

    var beginDate = new Date('January 1, '+ String(yr)).getTime()/1000;
    yr++;
    var endDate = new Date('January 1, '+ String(yr)).getTime()/1000;

    //console.log("BEGIN YEAR - DATE: ");
    //console.log(beginDate);
    //console.log("END YEAR - DATE: ");
    //console.log(endDate);
 
    //console.log("FOR THAT LIST OF SELECTED genres we got this list of matching artists: ");
    //console.log(genArtistList);
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,//2,
    sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    //var x = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userID), 'sharedBy.systemDate': { '$gt' : beginDate , '$lt' : endDate }}]},options).fetch();
    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$GOT THIS RESULT FOR YEARRRRRR selectioN: ");
    //console.log(x.length);
    if(_.isEmpty(selGen))
      return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'sharedBy': { $elemMatch: { uid: String(userID), systemDate: { '$gte' : beginDate , '$lt' : endDate }}}},options);
    else if(!_.isEmpty(selGen))
    {
      var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
      return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'sharedBy': { $elemMatch: { uid: String(userID), systemDate: { '$gte' : beginDate , '$lt' : endDate }}}, 'sa': {$in: genArtistList}},options);
    }
  }
});


Meteor.publish('counterForMyGroovsBasedOnYearSelection', function(userID, yr, selGen) {
  if(_.isNull(yr))
  {
    yr = getLatestYearForMyGroovs(userID);
  }
  if(userID !== null)
  {
    var beginDate = new Date('January 1, '+ String(yr)).getTime()/1000;
    yr++;
    var endDate = new Date('January 1, '+ String(yr)).getTime()/1000;

    if(_.isEmpty(selGen))
      Counts.publish(this, 'songCountForMyGroovsBasedOnYearSelection', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'sharedBy': { $elemMatch: { uid: String(userID), systemDate: { '$gte' : beginDate , '$lt' : endDate }}}}));
    else if(!_.isEmpty(selGen))
    {
      var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
      Counts.publish(this, 'songCountForMyGroovsBasedOnYearSelection', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'sharedBy': { $elemMatch: { uid: String(userID), systemDate: { '$gte' : beginDate , '$lt' : endDate }}}, 'sa': {$in: genArtistList}}));
    }
  }
});


//FOR FLYLIST FEATURE
Meteor.publish('30songsForMyGroovsBasedOnGenreSelection', function(userID, cursorSkipAmount, selGen) {
  if(userID !== null && !_.isEmpty(selGen))
  {
    //console.log("GOT THIS LIST OF selected genres: ");
    //console.log(selGen);
    var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
    //console.log("FOR THAT LIST OF SELECTED genres we got this list of matching artists: ");
    //console.log(genArtistList);
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,//2,
    sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    //var x = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userID), sa: {$in: genArtistList}}]},options).fetch();
    //console.log("GOT THIS RESULT FOR genre selectioN: ");
    //console.log(x);
    return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userID), sa: {$in: genArtistList}}]},options);
  }
});

Meteor.publish('counterForMyGroovsBasedOnGenreSelection', function(userID, selGen) {
  if(userID !== null && !_.isEmpty(selGen))
  {
    var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
    //console.log("THIS IS THE GEN artist list: ");
    //console.log(genArtistList);
    Counts.publish(this, 'songCountForMyGroovsBasedOnGenreSelection', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userID), sa: {$in: genArtistList}}]}));
  }
});

Meteor.publish('30songsForMyGroovs', function(userID, cursorSkipAmount) {
  if(userID !== null)
  {
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,//2,
    sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userID)}]},options);
  }
});

Meteor.publish('counterForMyGroovs', function(userID) {
  if(userID !== null)
  {
    Counts.publish(this, 'songCountForMyGroovs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userID)}]}));
  }
});

Meteor.publish('userSpecificCounterForRatings', function(userID) {
  if(userID !== null)
  {
    /*console.log('########################THIS IS THE RATING count for this user: ');
    console.log(userID);
    console.log(Ratings.find({'uid': userID}).count());*/
    Counts.publish(this, 'ratingCountForUser', Ratings.find({'uid': userID}));
  }
});

//FOR FLYLIST FEATURE
Meteor.publish('30songsForTastemakersBasedOnGenreSelection', function(sel, selGen, cursorSkipAmount) {
  //console.log("******************-----reached TASTEMAKER GENRE SELECTION subscription!!!");
  //console.log(sel);

  //console.log("GETTING ARTIST list for genres: ");
  var artistListForGenres = getArtistListForGenres(selGen);
  //console.log(artistListForGenres);

  sel = addSongValidatorsAndGenArtistListToQuery(sel, artistListForGenres, "tastemakers")

  //console.log("*****************THIS IS THE UPDATED QUERY SELECTOR: ");
  //console.log(sel);

  if(sel !== null)
  {
    //console.log("GOT THIS LIST OF selected genres: ");
    //console.log(selGen);
    //var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
    //console.log("FOR THAT LIST OF SELECTED genres we got this list of matching artists: ");
    //console.log(genArtistList);
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,//2,
    sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};

    var y = Songs.find(sel, options).fetch();
    //console.log("%%%%%%%%%%%%%%%%%%%%%%IS THE LENGTH OF THE Tastemaker GENRE selector main SUBSCRIPTIONNNNNNZNZNZ : ");
    //console.log(y.length);

    return Songs.find(sel, options);
  }
});

Meteor.publish('counterForTastemakersBasedOnGenreSelection', function(sel, selGen) {
  if(!_.isEmpty(sel))
  {
    var artistListForGenres = getArtistListForGenres(selGen);
    sel = addSongValidatorsAndGenArtistListToQuery(sel, artistListForGenres, "tastemakers");
    //console.log("TASTEMAKER - GENRE - Counter - THIS IS THE updated selector: ");
    //console.log(sel);
    var x = Songs.find(sel).fetch().length;
    //console.log("***************************************THIS IS THE LENGTH OF THE Tastemaker GENRE selector : ");
    //console.log(x);
    Counts.publish(this, 'songCountForTastemakersBasedOnGenreSelection', Songs.find(sel));
  }
});

Meteor.publish('30songsForTastemakers', function(sel, cursorSkipAmount) {
  if(sel !== null)
  {
    //console.log("############### reached tastemaker selector: ");
    //console.log(sel);
    sel = addSongValidatorsToSelector(sel, "tastemakers"); //added it as it was returning and playing invalid songs too! NOT GOOD!

    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,
    sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    return Songs.find(sel, options);
  }
});

Meteor.publish('counterForTastemakers', function(sel) {
  if(sel !== null)
  {
    sel = addSongValidatorsToSelector(sel, "tastemakers"); //added it as it was returning and playing invalid songs too! NOT GOOD!
    Counts.publish(this, 'songCountForTastemakers', Songs.find(sel));
  }
});

//FOR my groovs DATE range feature
Meteor.publish('30songsForGlobalBasedOnYearSelection', function(excludedIds, yr, selGen, cursorSkipAmount) {
  //console.log("RCHD the my groovs year publication server method: ");
  //console.log('************************************THIS IS THE YEART: ');
  //console.log(yr);
  //console.log('%%%%%%%%%%%%%%%%%% this is the SELECTED genres: ');
  //console.log(selGen);

  if(_.isNull(yr))
  {
    //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% YEAR is NULL!!!! Will get latest year from server")
    yr = getLatestYearForMyGroovs(userID);
    //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% YEAR is now got!!!! this is the LAST YEAR: ");
    //console.log(yr);
  }

  if(excludedIds !== null)
  {
    //console.log("%%%%%%%%%%%%%%%%%%%NOW Year aint NULL; gonna get year based MY GROOOOOOVS");

    var beginDate = new Date('January 1, '+ String(yr)).getTime()/1000;
    yr++;
    var endDate = new Date('January 1, '+ String(yr)).getTime()/1000;

    //console.log("BEGIN YEAR - DATE: ");
    //console.log(beginDate);
    //console.log("END YEAR - DATE: ");
    //console.log(endDate);

    //'sharedBy': { $elemMatch: { uid: String(userID), systemDate: { '$gte' : beginDate , '$lt' : endDate }}}
    //{$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'sharedBy': { $elemMatch: { uid: {"$nin":['721431527969807','10153166103642774', '10205130516756424']}, systemDate: { '$gte' : 1420050600 , '$lt' : 1451586600 }}}}

    //console.log('************************************THIS IS THE GLOBAL SELECTOR: ');
    //console.log(sel);
    //var globalYearQuery = {$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'sharedBy': { $elemMatch: { uid: {"$nin":excludedIds}, systemDate: { '$gte' : beginDate , '$lt' : endDate }}}};
    var globalYearQuery = getMongoSelectorForGlobalYearSelection(excludedIds, beginDate, endDate, selGen);
    //console.log('################ this is the global year query!!!:');
    //console.log(globalYearQuery);
 
    //console.log("FOR THAT LIST OF SELECTED genres we got this list of matching artists: ");
    //console.log(genArtistList);
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,//2,
    sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    //var x = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userID), 'sharedBy.systemDate': { '$gt' : beginDate , '$lt' : endDate }}]},options).fetch();
    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$GOT THIS RESULT FOR YEARRRRRR selectioN: ");
    //console.log(x.length);
    /*if(_.isEmpty(selGen))
    {
      console.log("%%%%%%%%%%%%%%%%%%%%%%%THIS IS HTE RESULT OF THE global query: ");
      console.log(Songs.find(globalYearQuery, options).count());
      return Songs.find(globalYearQuery, options);
    }
    else if(!_.isEmpty(selGen))
    {*/
      //var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
      return Songs.find(globalYearQuery, options);
    //}
  }
});


Meteor.publish('counterForGlobalBasedOnYearSelection', function(excludedIds, yr, selGen) {
  if(_.isNull(yr))
  {
    yr = getLatestYearForMyGroovs(userID);
  }

  if(excludedIds !== null)
  {
    var beginDate = new Date('January 1, '+ String(yr)).getTime()/1000;
    yr++;
    var endDate = new Date('January 1, '+ String(yr)).getTime()/1000;

    var globalYearQuery = getMongoSelectorForGlobalYearSelection(excludedIds, beginDate, endDate, selGen);

    /*if(_.isEmpty(selGen))
      Counts.publish(this, 'songCountForGlobalBasedOnYearSelection', Songs.find(globalYearQuery));
    else if(!_.isEmpty(selGen))
    {*/
      //var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
      Counts.publish(this, 'songCountForGlobalBasedOnYearSelection', Songs.find(globalYearQuery));
    //}
  }
});


//FOR FLYLIST FEATURE
Meteor.publish('30songsForGlobalBasedOnGenreSelection', function(sel, selGen, cursorSkipAmount) {
  //console.log("%%%%%%%%%%%%%%%%%%%%%%%GLOBAL GENRE SELECTION publication code!!!!!");
  //console.log("******************-----reached Global GENRE SELECTION subscription!!!");
  //console.log(sel);

  //console.log("GETTING ARTIST list for genres - GLOBAL: ");
  var artistListForGenres = getArtistListForGenres(selGen);
  //console.log(artistListForGenres);

  sel = addSongValidatorsAndGenArtistListToQuery(sel, artistListForGenres, "global")

  //console.log("*****************THIS IS THE UPDATED GLOBAL QUERY SELECTOR: ");
  //console.log(sel);

  if(sel !== null)
  {
    //console.log("GOT THIS LIST OF selected genres: ");
    //console.log(selGen);
    //var genArtistList = cleanListOfArtistsFromDB(getArtistsForGenreList(selGen));
    //console.log("FOR THAT LIST OF SELECTED genres we got this list of matching artists: ");
    //console.log(genArtistList);
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,//2,
    sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    
    return Songs.find(sel, options);
  }
});

Meteor.publish('counterForGlobalBasedOnGenreSelection', function(sel, selGen) {
  if(!_.isEmpty(sel))
  {
    var artistListForGenres = getArtistListForGenres(selGen);
    sel = addSongValidatorsAndGenArtistListToQuery(sel, artistListForGenres, "global");
    Counts.publish(this, 'songCountForGlobalBasedOnGenreSelection', Songs.find(sel));
  }
});

Meteor.publish('30songsForGlobal', function(sel, cursorSkipAmount) {
  if(sel !== null)
  {
    sel = addSongValidatorsToSelector(sel, "global"); //added it as it was returning and playing invalid songs too! NOT GOOD!

    //console.log("*****************THIS IS THE UPDATED GLOBAL QUERY SELECTOR: ");
    //console.log(sel);

    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: songboardPagingLimit,
    sort: {'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    return Songs.find(sel, options);
  }
});

Meteor.publish('counterForGlobal', function(sel) {
  if(sel !== null)
  {
    sel = addSongValidatorsToSelector(sel, "global"); //added it as it was returning and playing invalid songs too! NOT GOOD!
    Counts.publish(this, 'songCountForGlobal', Songs.find(sel));
  }
});

Meteor.publish('allSongsForSpecificArtist', function(artistID, cursorSkipAmount) {
  //console.log('ALL songs for artist- FROM THE PUBLISHing CODE; this is the artist ID to get data for: ' + artistID);
  if(artistID !== null)
  {
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: 5,//2,
    sort: {'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};

    var foundArtist = Artists.findOne(String(artistID));

    if(!_.isUndefined(foundArtist))
    {
      //console.log("FOUND THIS ONE ARTIST FOR THIS ID: ");
      //console.log(foundArtist);
      var artistName = foundArtist.name;

      if(artistName.indexOf(' & ') >= 0)
      {
        //console.log('IN FIRST IF CONDITION');
        //console.log(artistName);
        var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options).fetch();
        if(!_.isEmpty(x))
        {
          //console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
          //return x;
          return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
        }
        else
        {
          artistName = artistName.replace(/ & /g, ' and ');
          //console.log('DID not find anything with just &; replaced with AND and now searching again!');
          //console.log(artistName);
          return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
        }
      }
      else if(artistName.indexOf(' and ') >= 0)
      {
        //console.log('IN SECOND IF CONDITION');
        //console.log(artistName);
        var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options).fetch();
        if(!_.isEmpty(x))
        {
          //console.log('THIS IS THE artist specific song LENGTH : ' + x.length);
          //return x;
          return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
        }
        else
        {
          artistName = artistName.replace(/ and /g, ' & ');
          //console.log('DID not find anything with just AND; replaced with & and now searching again!');
          //console.log(artistName);
          return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
        }
      }
      else
      {
        //console.log('IN ELSE CONDITION');
        return Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}, options);
      }
    }
    else
    {
      //console.log("DID not find any artist!!!! ");
      return Songs.find('no artist found');
    }    
  }
});


Meteor.publish('allSongsForSpecificGenre', function(genArtistList, cursorSkipAmount) {
  //console.log('############################# reached song pub for specific genre: ');
  //console.log(genArtistList);
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the cursorSkipAmountr: ' + cursorSkipAmount);

  var songIDsForThisGenre = getSongIDsForArtistListForGenrePage(genArtistList);

  var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      /*"iTunesMediumAlbumArt": 0, 
      "iTunesLargeAlbumArt": 0, */
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: 5,
    sort: {'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};
    //return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{'sharedBy.uid': String(userID)}, options);
    //was returning only songs for that user so had to change it; original publish selection was wrong and was not removing extra fields
    //return Songs.find({'sharedBy.uid': String(userID), $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options);
    return Songs.find({'_id': {$in: songIDsForThisGenre}}, options);
});

Meteor.publish('counterForGenreSpecificSongs', function(genArtistList) {
  var songIDsForThisGenre = getSongIDsForArtistListForGenrePage(genArtistList);
  Counts.publish(this, 'songCountForGenreSpecificSongs', Songs.find({'_id': {$in: songIDsForThisGenre}}));
});



Meteor.publish('counterForArtistSpecificSongs', function(artistID) {
  if(artistID !== null)
  {
    var foundArtist = Artists.findOne(String(artistID));

    if(!_.isUndefined(foundArtist))
    {
      //console.log("FOUND THIS ONE ARTIST FOR THIS ID: ");
      //console.log(foundArtist);
      var artistName = foundArtist.name;

      if(artistName.indexOf(' & ') >= 0)
      {
        //console.log('IN FIRST IF CONDITION');
        //console.log(artistName);
        var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}).fetch();
        if(!_.isEmpty(x))
        {
          Counts.publish(this, 'songCountForArtistSpecificSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}]}));
        }
        else
        {
          artistName = artistName.replace(/ & /g, ' and ');
          Counts.publish(this, 'songCountForArtistSpecificSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}]}));
        }
      }
      else if(artistName.indexOf(' and ') >= 0)
      {
        //console.log('IN SECOND IF CONDITION');
        //console.log(artistName);
        var x = Songs.find({sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}).fetch();
        if(!_.isEmpty(x))
        {
          Counts.publish(this, 'songCountForArtistSpecificSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}]}));
        }
        else
        {
          artistName = artistName.replace(/ and /g, ' & ');
          Counts.publish(this, 'songCountForArtistSpecificSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}]}));
        }
      }
      else
      {
        //console.log('IN ELSE CONDITION');
        Counts.publish(this, 'songCountForArtistSpecificSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{sa: {$regex: new RegExp('^' + artistName + '$', 'i')}}]}));
      }
    }
    else
    {
      //console.log("DID not find any artist!!!! ");
      Counts.publish(this, 'songCountForArtistSpecificSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{_id: 'no artist found'}]}));
    }  
  }
});

Meteor.publish('counterForAllSongs', function(userID) {
  if(userID !== null)
  {
    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$GONNA GET THE TOTAL SONG COUNT IN DB!!!!");
    var x = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}).count();
    //console.log(x);
    Counts.publish(this, 'songCountForAllSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}));
  }
});

Meteor.publish('flylistsForSpecificUser', function(userID) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the SONG ID to get data for: ' + songID);
  if(userID !== null)
  {
    //need to return only comments for that song
    return Flylists.find({'fbID': String(userID)});
  }
});

Meteor.publish('commentsForSpecificSong', function(songID) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the SONG ID to get data for: ' + songID);
  if(songID !== null)
  {
    //need to return only comments for that song
    return Comments.find({'referenceId': String(songID)});
  }
});

Meteor.publish('favoritesForSpecificSong', function(songID) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the SONG ID to get data for: ' + songID);
  if(songID !== null)
  {
    //need to return only favorites for that song
    return Favorites.find({'referenceId': String(songID)});
  }
});

Meteor.publish('favoritesForSpecificUser', function(userID, cursorSkipAmount) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; TO GET FAVORITES FOR THIS USER: ' + userID);
  if(userID !== null)
  {
    //need to return only favorites for that user
    return Favorites.find({'userId': String(userID)},{limit: 5,sort: {'favoritedAt': -1 }, skip: cursorSkipAmount});
  }
});

Meteor.publish('favoriteCountForSpecificUser', function(userID) {
  if(userID !== null)
  {
    //need to return only favorites for that user
    //return Favorites.find({'userId': String(userID)});
    Counts.publish(this, 'faveCounterForUser', Favorites.find({'userId': String(userID)}));
  }
});


Meteor.publish('allSongsForSpecificUser', function(userID, cursorSkipAmount) {
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the userID: ' + userID);
  //console.log('METHOD 1 - FROM THE PUBLISHing CODE; this is the cursorSkipAmountr: ' + cursorSkipAmount);
  if(userID !== null)
  {
    var options = {
      fields: {
      "songSearchText": 0, 
      "aeCount": 0, 
      "meCount": 0, 
      "iTunesValid": 0, 
      "LFMValid": 0, 
      "cleanedTrackSearchQuery": 0, 
      "wuzzyFactor": 0, 
      "error": 0, 
      "LFMLargeAlbumArt": 0, 
      "LFMMediumAlbumArt": 0, 
      "iTunesAlbumURL": 0, 
      "iTunesAlbumPrice": 0,
      "iTunesPriceCurrency": 0,
      "iTunesTrackPrice": 0,
      "iTunesTrackURL": 0,
      "discCount": 0,
      "discNumber": 0
    },
    limit: 5,//2,
    sort: {'sharedBy.systemDate': -1 },
    skip: cursorSkipAmount};

    var targetedUser = Meteor.users.findOne({_id: userID});
    if(!_.isUndefined(targetedUser))
    {
      var socID = targetedUser.services.facebook.id;
      if(!_.isEmpty(socID) && !_.isNull(socID))
      {
        //need to return only songs for that user
        return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(socID)}]}, options);
      }
    }
    else
      return null;
    }
});



Meteor.publish('topTastemakersForSpecificUser', function(userID, tastemakerIDs) {
  //console.log('%%%%%%%%%%%%%FROM THE PUBLISHing CODE; TO GET top tastemakers FOR THIS USER: ' + userID);
  //console.log('%%%%%%%%%%%%%FROM THE PUBLISHing CODE; TO GET top tastemakers FOR THIS existing tastemakers: ');
  //console.log(tastemakerIDs);

  if(!_.isNull(userID))
  {
    //sample query
    //{'$nor': [{'services.facebook.id': "10153166103642774"}, {'services.facebook.id': "721431527969807"}, {'services.facebook.id': "10205130516756424"}]
    var options = {limit: 4};

    var query = {};

    var userSelf = {
      'services.facebook.id': userID
    };

    query["$nor"] = [];

    //first add self ID for exclusion from top tastemaker list
    query["$nor"].push(userSelf);

    _.each(tastemakerIDs, function(x){
      var t = {
        'services.facebook.id': x.fbid
      };

      //add all tastemakers to be excluded
      query["$nor"].push(t);
    });

    //console.log('this is the resultant count of TOP TASTEMAKERS: ');
    //console.log(Meteor.users.find(query).count());

    return Meteor.users.find(query,options);
  }
});

Meteor.publish("userObjectForProfilePage", function (userID) {
  //return Songs.find({iTunesValid:'PENDING'});
  //console.log('METHOD 2 - FROM THE PUBLISHING CODE: getting USER profile object for this USER ID: ' + userID)

  if(userID !== null)
  {
    //console.log('THIS IS THE user ID that will be publishing for: ' + this.userId)
    var options = {
      fields: 
        {
          "services.facebook": 1,
          "emails.address[0]": 1,
          "profile": 1,
          "fbFriends": 1,
          "tastemakers": 1,
          "unfollowedFriends": 1,
          "createdAt": 1,
          "status": 1,
          "baseLocation": 1
        }};
    var targetedUser = Meteor.users.findOne(userID);
    if(!_.isUndefined(targetedUser) && !_.isEmpty(targetedUser))
    {
      //console.log('FOUND AN ACTUAL USER OBJECT FOR THIS USER ID: ' + userID);
      return Meteor.users.find({_id: userID}, options);
    }
    else
    {
      //console.log('DID NOT FIND SHIT FOR THIS USER ID: ' + userID);
      //this.error(new Meteor.Error("erroneous-user", "Can't find this user!"));
      //console.log("THIS IS THE SUB OBJECT:");
      //console.log(this);
      //this.stop();
      return Meteor.users.find({_id: userID}, options);//Meteor.users.find({_id: userID}, options);
    }
  } else {
    this.ready();
  }
});

Meteor.publish("genreObjectForProfilePage", function (genreID) {
  //return Songs.find({iTunesValid:'PENDING'});
  //console.log('METHOD 2 - FROM THE PUBLISHING CODE: getting USER profile object for this USER ID: ' + userID)

  /*
  if(this.userId !== null)
  {
    var genreForPage = Genres.findOne({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});

    if(!_.isUndefined(genreForPage) && !_.isEmpty(genreForPage))
    {
      //console.log('FOUND A VALID GENRE!!!');
      return Genres.find({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});
    }
    else
    {
      //console.log('NO GENRE FOUND!!!');
      this.error(new Meteor.Error("erroneous-genre", "Can't find this genre!"));
      return Genres.find({'name': {$regex: new RegExp('^' + genreName + '$', 'i')}});
    }
  }*/
  //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ reached the genre profile page: "+ genreID);
  return Genres.find(String(genreID));
});



Meteor.publish("genresForArtistPage", function (genreList) {
  //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ reached the PUBS for specific genres for artist page: "+ genreList);
  var fixedToLowerCaseGenres = [];

  _.each(genreList, function(z){
    fixedToLowerCaseGenres.push(z.toString().toLowerCase());
  });

  //console.log('######################### this is the fixed genre list: ');
  //console.log(fixedToLowerCaseGenres);

  return Genres.find({'name': {$in: fixedToLowerCaseGenres}}, {fields:{"_id": 1, "name": 1}});
});

Meteor.publish("artistsForGenre", function(genreName) {
  return Artists.find({'genres': {$regex: new RegExp(genreName, 'i')}}, {fields: {'name':1}});
});

Meteor.publish("userData", function () {
  if (this.userId) {
    //console.log('THIS IS THE user ID that will be publishing for: ' + this.userId)
    return Meteor.users.find({_id: this.userId},
     {
      fields: 
        {
          "services.facebook": 1,
          "emails.address[0]": 1,
          "roles": 1,
          "profile": 1,
          "fbFriends": 1,
          "tastemakers": 1,
          "unfollowedFriends": 1,
          "createdAt": 1,
          "status": 1,
          "baseLocation": 1,
          "notifsEnabled": 1
        }
     });
  } else {
    this.ready();
  }
});

Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
});


Meteor.publish('artistObjectForProfilePage', function (artistID){

  return Artists.find(String(artistID));

});

Meteor.publish('followersForUser', function (userObj, cursorSkipAmount){ 
  if(!_.isNull(userObj))
  {
    return Meteor.users.find({'tastemakers.fbid': String(userObj.services.facebook.id)},{
        fields: 
          {
            "profile": 1,
            "services.facebook": 1,
            'status': 1,
            "tastemakers": 1
          },
          limit: 12,
          skip: cursorSkipAmount
       });
  }
  else
  {
    this.error(new Meteor.Error("erroneous-user", "Can't find this user!"));
    return Meteor.users.find({'tastemakers.fbid': String(1)}); 
  }
}); 

Meteor.publish('artistsForSite', function (){ 
  return Artists.find({},
     {
      fields: 
        {
          "name": 1,
          "genres": 1,
          'mediumImage': 1
        }
     });
}); 

Meteor.publish('messagesForEntity', function(userID) {
  //console.log('INSIDE THE messages publish function with this userID: ');
  //console.log(userID);
  if(userID !== null)
  {
    //var foundMsgs = Messages.find({$or: [{'from': String(userID)},{'to': String(userID)}]});
    //console.log('THIS IS THE MESSAGES FOUND:')
    //console.log(foundMsgs.fetch());
    //return foundMsgs;
    return Messages.find({$or: [{'from': String(userID)},{'to': String(userID)}]});
  }
});

Meteor.publish('messagesBetweenYouAndOtherUser', function(loggedInUser, friendUserID) {
  //console.log('##################################INSIDE THE messages publish function with this userID: ');
  //console.log(loggedInUser);
  //console.log('$$$$$$$$$$$$$$$$$ aaaaaand this is the friend IDD: ');
  //console.log(friendUserID);
  if(!_.isNull(loggedInUser) && !_.isNull(friendUserID))
  {
    //var foundMsgs = Messages.find({$or: [{'from': String(userID)},{'to': String(userID)}]});
    //console.log('THIS IS THE MESSAGES FOUND:')
    //console.log(foundMsgs.fetch());
    //return foundMsgs;
    return Messages.find({$or: [{$and: [{'from': String(loggedInUser), 'to': String(friendUserID)}]}, {$and: [{'from': String(friendUserID), 'to': String(loggedInUser)}]}]});
  }
});

Meteor.publish('messagesForSidebarExcludingGenreAndArtistGroupMessages', function(loggedInUser) {
  //console.log('INSIDE THE messages publish function with this userID: ');
  //console.log(userID);
  if(!_.isNull(loggedInUser))
  {
    var artistGenreMsgIDs = [];
    var foundMsgs = Messages.find({from: String(loggedInUser), to: {$regex: new RegExp('genre_group', 'i')}}).fetch();
    //console.log('THIS IS THE  GENRE GROUP MESSAGES FOUND:');
    //console.log(foundMsgs);
    _.each(foundMsgs, function(z){
      artistGenreMsgIDs.push(z._id);
    });

    foundMsgs = Messages.find({from: String(loggedInUser), to: {$regex: new RegExp('artist_group', 'i')}}).fetch();

    _.each(foundMsgs, function(z){
      artistGenreMsgIDs.push(z._id);
    });

    //console.log("############this is the list of msg IDs to be ignored:");
    //console.log(artistGenreMsgIDs);
    //return foundMsgs;
    return Messages.find({$or: [{'from': String(loggedInUser)}, {'to': String(loggedInUser)}], '_id': {$nin: artistGenreMsgIDs}});
  }
});

Meteor.publish('messagesBetweenYouAndUnknownUsers', function(loggedInUser, friendlist) {
  //console.log('INSIDE THE messages publish function with this userID: ');
  //console.log(userID);
  if(!_.isNull(loggedInUser))
  {
    var artistGenreMsgIDs = [];
    var foundMsgs = Messages.find({from: String(loggedInUser), to: {$regex: new RegExp('genre_group', 'i')}}).fetch();
    //console.log('THIS IS THE  GENRE GROUP MESSAGES FOUND:');
    //console.log(foundMsgs);
    _.each(foundMsgs, function(z){
      artistGenreMsgIDs.push(z._id);
    });

    foundMsgs = Messages.find({from: String(loggedInUser), to: {$regex: new RegExp('artist_group', 'i')}}).fetch();

    _.each(foundMsgs, function(z){
      artistGenreMsgIDs.push(z._id);
    });

    var friendIDsToIgnore = [];

    _.each(friendlist, function(z){
      friendIDsToIgnore.push(z.services.facebook.id);
    });

    var x = Messages.find({$or: [{$and: [{'from': String(loggedInUser), 'to': {$nin: friendIDsToIgnore}}]}, {$and: [{'from': {$nin: friendIDsToIgnore}, 'to': String(loggedInUser)}]}], '_id': {$nin: artistGenreMsgIDs}});
    //console.log('############################# this is the messages list for OTHERRRRRSS: ');
    //console.log(x.fetch().length);
    return x;
  }
});

Meteor.publish('unreadMsgCountForLoggedInUser', function(loggedInUser) {
   if(!_.isNull(loggedInUser))
  {
    Counts.publish(this, 'unreadMsgCounterForLoggedInUser', Messages.find({'to': loggedInUser, 'read': false}));
  }
});


Meteor.publish('userStatus', function() {
  return Meteor.users.find({'status.online': true }, 
  { 
    fields: 
    {
      "status": 1
    }
  });
});

Meteor.publish('masterUserData', function(cursorSkipAmount) {
  return Meteor.users.find({},{
          limit: 10,
          sort: {'createdAt': -1, 'status.lastLogin.date': -1},
          skip: cursorSkipAmount
       });
});

Meteor.publish('masterUserCount', function(loggedInUser) {
   if(!_.isNull(loggedInUser))
  {
    Counts.publish(this, 'counterForAllUsers', Meteor.users.find({}));
  }
});

Meteor.publish('reviewExistingSongs', function(cursorSkipAmount) {
  return Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},{
          limit: 10,
          sort: {'sharedBy.systemDate': -1},
          skip: cursorSkipAmount
       });
});

Meteor.publish('existingSongCount', function(loggedInUser) {
  if(!_.isNull(loggedInUser))
  {
    Counts.publish(this, 'counterForExistingSongs', Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}));
  }
});

Meteor.publish('reviewPendingSongs', function(cursorSkipAmount) {
  return Songs.find({$and: [{iTunesValid:'PENDING'},{LFMValid:'PENDING'}], manualApproval: {'$ne': 'VALID'}},{
          limit: 10,
          sort: {'sharedBy.systemDate': -1},
          skip: cursorSkipAmount
       });
});

Meteor.publish('pendingSongCount', function(loggedInUser) {
  if(!_.isNull(loggedInUser))
  {
    Counts.publish(this, 'counterForPendingSongs', Songs.find({$and: [{iTunesValid:'PENDING'},{LFMValid:'PENDING'}], manualApproval: {'$ne': 'VALID'}}));
  }
});

Meteor.publish('reviewInvalidSongs', function(cursorSkipAmount) {
  return Songs.find({$or: [{iTunesValid:'INVALID'},{LFMValid:'INVALID'},{manualApproval:'INVALID'}], manualApproval: {'$ne': 'VALID'}},{
          limit: 10,
          sort: {'sharedBy.systemDate': -1},
          skip: cursorSkipAmount
       });
});

Meteor.publish('invalidSongCount', function(loggedInUser) {
  if(!_.isNull(loggedInUser))
  {
    Counts.publish(this, 'counterForInvalidSongs', Songs.find({$or: [{iTunesValid:'INVALID'},{LFMValid:'INVALID'},{manualApproval:'INVALID'}], manualApproval: {'$ne': 'VALID'}}));
  }
});

Meteor.publish('reviewArtists', function(cursorSkipAmount) {
  return Artists.find({},{
          limit: 10,
          skip: cursorSkipAmount
       });
});

Meteor.publish('artistCount', function(loggedInUser) {
  if(!_.isNull(loggedInUser))
  {
    Counts.publish(this, 'counterForArtists', Artists.find({}));
  }
});

Meteor.publish('reviewGenres', function(cursorSkipAmount) {
  return Genres.find({},{
          limit: 10,
          skip: cursorSkipAmount
       });
});

Meteor.publish('genreCount', function(loggedInUser) {
  if(!_.isNull(loggedInUser))
  {
    Counts.publish(this, 'counterForGenres', Genres.find({}));
  }
});


Meteor.publish('/invites', function() {
  //console.log("INSIDE THE INVITES publishing code: ");
  //console.log(this.userId);
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    //console.log("USER IS IN ADMIN ROLE");
    return Invites.find({}, {
      fields: {
        "_id": 1,
        "inviteNumber": 1,
        "requested": 1,
        "email": 1,
        "fbID": 1,
        "token": 1,
        "dateInvited": 1,
        "invited": 1,
        "accountCreated": 1
      }
    });
  }
  else
  {
    //console.log("USER IS not an admin");
    return Invites.find({});
  }
});

Meteor.publish('inviteCount', function() {
  return Invites.find({}, {
    fields: {
      "_id": 1
    }
  });
});

function getMongoSelectorForGlobalYearSelection(exIDs, bDate, eDate, selGen) {
  //{$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], 'sharedBy': { $elemMatch: { uid: {"$nin":excludedIds}, systemDate: { '$gte' : beginDate , '$lt' : endDate }}}};

  //console.log("############## GOING TO EXCLUDE THEEEEEEEEEEEEEEEESE IDs: ");
  //console.log(exIDs);

  var counter = 0;
  var query = {};

  //SONG VALIDATORS - BEGIN
  if(_.isUndefined(query["$or"])) //only initialize it if not already initialized!
      query["$or"] = [];

  query["$or"].push({iTunesValid:'VALID'});
  query["$or"].push({LFMValid:'VALID'});
  query["$or"].push({manualApproval:'VALID'});
  //SONG VALIDATORS - END

  /* REMOVING NIN object and trying to use $nor instead*/
  /*
  var exIDObj = {'$nin': exIDs};

  var dateInclusion = { '$gte' : bDate , '$lt' : eDate };
  var uidSysDateObj = {'uid': exIDObj, 'systemDate': dateInclusion}

  var innerElemMatchObj = {'$elemMatch': uidSysDateObj};

  query['sharedBy'] = innerElemMatchObj;*/

  //NEW REPLACEMENT CODE FOR ABOVE SECTION

  var dateInclusion = { '$gte' : bDate , '$lt' : eDate };
  var uidSysDateObj = {'systemDate': dateInclusion}

  var innerElemMatchObj = {'$elemMatch': uidSysDateObj};

  query['sharedBy'] = innerElemMatchObj;

  query["$nor"] = [];

  _.each(exIDs, function(x){
    var t = {
      'sharedBy.uid': x
    };

    //add all tastemakers to be excluded
    query["$nor"].push(t);
  });

  //NEW REPLACEMENT CODE FOR ABOVE SECTION

  if(!_.isUndefined(selGen) && !_.isEmpty(selGen))
  {
    var artistListForGenres = getArtistListForGenres(selGen);
    var saObject = {};
    saObject = {"$in": artistListForGenres};
    query["sa"] = saObject;
  }

  return query;
}


function getArtistListForGenres(selgen)
{
  return cleanListOfArtistsFromDB(getArtistsForGenreList(selgen));
}

function addSongValidatorsAndGenArtistListToQuery(query, artlist, mode)
{
  if(_.isUndefined(query["$and"]) && mode === 'tastemakers') //only initialize it if not already initialized!
    query["$and"] = [];

  if(mode === 'tastemakers')
  {
    if(_.isUndefined(query["$or"])) //only initialize it if not already initialized!
      query["$or"] = [];

    var orObject = {};
    orObject["$or"] = [];
    orObject["$or"].push({iTunesValid:'VALID'});
    orObject["$or"].push({LFMValid:'VALID'});
    orObject["$or"].push({manualApproval:'VALID'});
    //VALID song selectors 
    query["$and"].push(orObject);
  }
  else if(mode === 'global')
  {
    if(_.isUndefined(query["$or"])) //only initialize it if not already initialized!
      query["$or"] = [];

    query["$or"].push({iTunesValid:'VALID'});
    query["$or"].push({LFMValid:'VALID'});
    query["$or"].push({manualApproval:'VALID'});
  }

  //GENRE selectors / Artist filters
  var saObject = {};
  saObject = {"$in": artlist};
  query["sa"] = saObject;
  //query["sa"].push(saObject);

  return query;
}

function addSongValidatorsToSelector(sel, mode){
  if(_.isUndefined(sel["$and"]) && mode === 'tastemakers') //only initialize it if not already initialized!
    sel["$and"] = [];

  if(mode === 'tastemakers')
  {
    if(_.isUndefined(sel["$or"])) //only initialize it if not already initialized!
      sel["$or"] = [];

    var orObject = {};
    orObject["$or"] = [];
    orObject["$or"].push({iTunesValid:'VALID'});
    orObject["$or"].push({LFMValid:'VALID'});
    orObject["$or"].push({manualApproval:'VALID'});
    //VALID song selectors 
    sel["$and"].push(orObject);
  }
  else if(mode === 'global')
  {
    if(_.isUndefined(sel["$or"])) //only initialize it if not already initialized!
      sel["$or"] = [];

    sel["$or"].push({iTunesValid:'VALID'});
    sel["$or"].push({LFMValid:'VALID'});
    sel["$or"].push({manualApproval:'VALID'});
  }

  return sel;
}

function getLatestYearForMyGroovs(fbid)
{
  var latestYear = Songs.find({'sharedBy.uid': String(fbid)}, {sort: {'sharedBy.systemDate': -1}, limit: 1}).fetch();
    //console.log("Got the last year object!!");
    //console.log(latestYear[0].sharedBy.length);
    var ly = 0;
    if(!_.isUndefined(latestYear[0]))
    {
      _.each(latestYear[0].sharedBy, function(x){
        //console.log("THIS IS THE last sharedby object: ");
        //console.log(x)
        if(x.uid==fbid){
          //console.log("Last song was shared in : ");
          //console.log(new Date(x.systemDate * 1000).getFullYear());
          ly = new Date(x.systemDate * 1000).getFullYear();
        }
      });
    }
    return ly;
}


function getSongIDsForArtistListForGenrePage(artistList){
  //console.log('*********************THIS IS THE ARTIST LIST in the SERVER METHOD: ');
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
  var songsForThoseArtists = [];
  var tempSongs = [];
  _.each(cleanedArtistList, function(x){
    //tempSongs = Songs.find({sa: {$regex: new RegExp(x, 'i')}, $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}).fetch();
    tempSongs = Songs.find({sa: {$regex: new RegExp('^' + x + '$', 'i')}, $or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}).fetch();
    songsForThoseArtists.push.apply(songsForThoseArtists, tempSongs);
  });
  //var songsForThoseArtists = Songs.find({'sa': {$in: cleanedArtistList}}).fetch();
  //console.log('FOUND these many songs for those artists:' + songsForThoseArtists.length);
  //return songsForThoseArtists;

  var genreArtSongs = _.map(songsForThoseArtists, function(lis){ return {timestamp: lis.timestamp, songObj: Songs.findOne({'sl': lis.sl})}});

  //console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  var genArtSongIDs = [];
  _.each(genreArtSongs, function(z){
    genArtSongIDs.push(z.songObj._id)
  });

  //console.log("THISISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS THE SONG IDSSSS: ")
  //console.log(genArtSongIDs);

  return genArtSongIDs;
}

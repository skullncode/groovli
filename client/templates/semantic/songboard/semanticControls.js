nextPressed = false;
previousPressed = false;

//SONG state VARS
currentTab = 'me';
mySongs = [];
friendSongs = [];
globalSongs = [];
searchResultSongs = [];
mySongsPlayLog = [];
friendSongsPlayLog = [];
globalSongsPlayLog = [];
musicHistory = [];
currentHistoryIndex = 0;
currentSong = [];
currentID = '';
lastAction = 'next';
reachedEndOfStream = false;
playableTabs = [];
//END SONG state VARS
availableSongs = [];

Template.semanticControls.onRendered(function () {
  fixSemanticGrids();
});

/**
* Makes sure the positional 'wide' class is present for every device-specific semantic-ui rule
*/
function fixSemanticGrids() {
  var deviceList = ['computer', 'tablet', 'mobile'];
  $('.wide.column').each(function (i, e) { 
    var classes = $(e).attr('class').split(/\s+/);
    var newClasses = new Array();
    $.each(classes, function (j, c) {
      if($.inArray(c, deviceList) >= 0 && j > 0 && 'wide' != classes[j-1]) {
        newClasses.push('wide');
      }
      newClasses.push(c);
    });
    $(e).attr('class', newClasses.join(' '));
  });
};

Template.semanticControls.helpers({
  currentlyOnSongboard: function(){
    //if(!_.isUndefined(Router.current().route))
      //return Router.current().route.path() === '/songboard';
    //else
      //console.log('CHECKING TO SEE if playercontrols is required and if currently on SONGBOARD path!!');
      //console.log('THIS IS THE CURRENT PATH: ');
      //console.log(FlowRouter.current().path);
      return FlowRouter.current().path === '/songboard';
  },
  encounteredErroneousSong: function() {
    if(Session.get('SongErroneous'))
    {
      //console.log("SONG IS ERRONEOUS YAWWWWWW!!!!!!!");
      dealWithErroneousSong();
    }
  }
});

Template.semanticControls.events({
    'click #nextButton': function(event) {
        nextSong();
    },

    'click #previousButton': function(event) {
        previousSong();
    },
    'click #hideShowVideo': function(event) {
        if($('#responsivePlayerContainer').is(":visible"))
        {
          $('#responsivePlayerContainer').slideUp();
          mixpanel.track('hide video');
        }
        else
        {
          $('#responsivePlayerContainer').slideDown();
          mixpanel.track('show video');
        }
    }
});

function nextSong() {
  //console.log('HISTORY GETTING!!!!!: ' + getHistory());
  //console.log('PRESSED NEXTTTT!!!!!');
  mixpanel.track("clicked next button");
  Session.set('animatedToSong', false);
  if(!nextPressed)
  {
    //console.log("NEXT PRESSED!");
    nextPressed = true;
    if(nextPressedSelectNewOrAdvanceThruHistory())
    {
      selectNewRandomSongAndPush();
      //selectNewRandomSong();
    }
    else
    {
      selectShareFromControls(getHistory()[getCurrentHistoryIndex()], getSongs(getHistory()[getCurrentHistoryIndex()].sourceTab), getHistory()[getCurrentHistoryIndex()].sourceTab);
    }
    nextPressed = false;
  }
  else
  {
    //console.log('*************************nothing pressed, because NEXT press TOOOOOOO FAST!!!!');
    nextPressed = false;
  }
}

function previousSong() {
  //console.log('PRESSED PREvioussss!!!!!');
  //mixpanel.track("clicked previous button");
  Session.set('animatedToSong', false);
  if(!previousPressed)
  {
    previousPressed = true;
    if(previousPressedNotReachedBeginning())
    {
      selectShareFromControls(getHistory()[getCurrentHistoryIndex()], getSongs(getHistory()[getCurrentHistoryIndex()].sourceTab), getHistory()[getCurrentHistoryIndex()].sourceTab);
    }
    previousPressed = false;
  }
  else
  {
    //console.log('*************************nothing pressed, because PREvious press TOOOOOOO FAST!!!!');
    previousPressed = false;
  }
}

function dealWithErroneousSong() {
  currentSong.aeCount += 1;
  Meteor.call('updateAEC', currentID, 'yt', currentSong.aeCount, Session.get('YTErrorCode'));
  Session.set('YTErrorCode', 0);
  toastr.error("Encountered an error when trying to play the following song: <br> "+currentSong.st+" by " + currentSong.sa);
  Session.set('SongErroneous',false);
  if(lastAction === 'next')  
    nextSong();
  else if(lastAction === 'previous')
    previousSong();
}

function thereAreStillPlayableSongs() {
  if(Session.get('mygroovsPlayedLength') < getSongsLength('me') || Session.get('tastemakersPlayedLength') < getSongsLength('friends') || Session.get('globalPlayedLength') < getSongsLength('global'))
  {
    return true;
  }
  else // both tabs have been played out so reset history
  {
    //console.log('$#$#$#$#$#$##$#$# NOTHING IS AVAILABLE IN  TABS TO PLAYY');
    setReachedEndOfStream(true);
    return false;
  }
}

function getRandomSongTabThatStillHasUnplayedSongs()
{
  var playableTabsLength = Session.get('playableTabs').length;
  //console.log('@#@#@#@#@#@NUMBER OF PLAYABLE TABS: ' + playableTabsLength);
  //var selectedTabList = Session.get('selectedTabs');
  var randomlySelectedTabIndex = _.random(playableTabsLength-1);
  //console.log('THIS IS THE RANDOMLY SELECTED TAB INDEX: ' + randomlySelectedTabIndex);
  var selectedTab = Session.get('playableTabs')[randomlySelectedTabIndex];

  //console.log('CURRENTLY SELECTED RANDOM TAB IS: ' + selectedTab);
  //console.log('CURRENT SELECTED TAB LIST IS : ');
  //console.log(selectedTabList);
  //STOP USING SELECTEDTAB list - will not be deselecting individual tabs!!!
  /*while(_.isUndefined(_.findWhere(selectedTabList, selectedTab))) 
  {
    console.log('RANDOMLY SELECTED TAB IS NOT A TAB THE USER WANTS TO LISTEN TO; so getting another tab!!!!');
    randomlySelectedTabIndex = _.random(playableTabsLength-1);
    selectedTab = Session.get('playableTabs')[randomlySelectedTabIndex];
    console.log('NEW TAB SELECTION TAB IS: ' + selectedTab);
  }*/


  //REPLACED THIS IF condition with method to check it better and fix bug found by Babu in first Semantic UI test
  //if(Session.get('mygroovsPlayedLength') < getSongsLength('me') || Session.get('tastemakersPlayedLength') < getSongsLength('friends') || Session.get('globalPlayedLength') < getSongsLength('global'))
  if(areThereAnyMoreSongsToPlayBasedOnCurrentlyPlayableTabs())
  {
    if(selectedTab === 'me')
    {
      if(Session.get('mygroovsPlayedLength') < getSongsLength(selectedTab))
      {
        //console.log('RETURNING THIS TAB FOR RANDOM PLAY: MY GROOVS');
        return 'me';
      }
      else
      {
        return getRandomSongTabThatStillHasUnplayedSongs();
        //console.log('################################## MY GROOVS HAS RUN OUT OF TRACKS TO PLAY SO CANNOT SELECT FROM THIS ANYMORE!');
      }
    }

    if(selectedTab === 'friends')
    {
      if(Session.get('tastemakersPlayedLength') < getSongsLength('friends'))
      {
        //console.log('RETURNING THIS TAB FOR RANDOM PLAY: TASTEMAKERSSSSSS');
        return 'friends';
      }
      else
      {
        return getRandomSongTabThatStillHasUnplayedSongs();
        //console.log('################################## TASTEMAKERSSS HAS RUN OUT OF TRACKS TO PLAY SO CANNOT SELECT FROM THIS ANYMORE!');
      }
    }

    if(selectedTab === 'global')
    {
      if(Session.get('globalPlayedLength') < getSongsLength('global'))
      {
        //console.log('RETURNING THIS TAB FOR RANDOM PLAY: GLOBAL LIST');
        return 'global';
      }
      else
      {
        return getRandomSongTabThatStillHasUnplayedSongs();
        //console.log('################################## GLOBAL TAB HAS RUN OUT OF TRACKS TO PLAY SO CANNOT SELECT FROM THIS ANYMORE!');
      }
    }
  }
  else // both tabs have been played out so reset history
  {
    //console.log('$#$#$#$#$#$##$#$# NOTHING IS AVAILABLE IN  TABS TO PLAYY');
    setReachedEndOfStream(true);
    return null;
  }
}

function areThereAnyMoreSongsToPlayBasedOnCurrentlyPlayableTabs()
{
  //console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$################# currently PLAYABLE TABS are:');
  //console.log(Session.get('playableTabs'));
  var songsStillAvailableToPlay = false;
  _.each(Session.get('playableTabs'), function(z){
    if(z == 'me')
    {
      if(Session.get('mygroovsPlayedLength') < getSongsLength('me'))
      {
        songsStillAvailableToPlay = true;
      }
      else
      {
        songsStillAvailableToPlay = false;
      }
    }
    else if(z == 'friends')
    {
      if(Session.get('tastemakersPlayedLength') < getSongsLength('friends'))
      {
        songsStillAvailableToPlay = true;
      }
      else
      {
        songsStillAvailableToPlay = false;
      }
    }
    else if(z == 'global')
    {
      if(Session.get('globalPlayedLength') < getSongsLength('global'))
      {
        songsStillAvailableToPlay = true;
      }
      else
      {
        songsStillAvailableToPlay = false;
      }
    }
  });

  /*if(songsStillAvailableToPlay)
    console.log('################ THERE ARE STILL SONGS TO BE PLAYED!!!!!');
  else
    console.log('################ NO MORE SONGS AVAILABLE TO PLAYYYYYYYY!!!!');*/

  return songsStillAvailableToPlay;
}

function selectNewRandomSongAndPush() {
  //console.log('selecting random song and pushing to playyyyyyyyyyyyyy!');
  //using same if condition for flylist OR even without flylist; i.e. selGens empty OR even NOT
  if(_.isUndefined(Session.get('selGens')) || _.isEmpty(Session.get('selGens')) || !_.isEmpty(Session.get('selGens')))
  {
    var selectedTab = getRandomSongTabThatStillHasUnplayedSongs();
    //console.log('***************************** THIS IS THE SELECTED TAB We GOT BACK: ' + selectedTab);
    if(!_.isNull(selectedTab) && !_.isUndefined(selectedTab))
    {
      //console.log('@#@#@#@#@#@#@#HAVE RANDOMLY SELECTED THIS TAB FOR THE NEXT SONG: ' + selectedTab);
      var songsLength = getSongsLength(selectedTab);
      var invalidTries = 0;
      
      var randomChoice = _.random(songsLength-1);

      //console.log('&&^&^&^&^^&^&^&^^&&^^&^THIS IS THE ZEROTH ITEM IN THE CURRENT SELECTED TAB: ' + getSongAtIndex(selectedTab,0).st);
      //console.log('THIS IS THE LENGTH ITEM IN THE CURRENT SELECTED TAB: ' + getSongAtIndex(selectedTab,songsLength-1).st);

      //console.log('ABOUT TO CHECK FOR HISTORY AND GENRES!!!');

      while(songAlreadyExistsInHistory(getSongAtIndex(selectedTab,randomChoice)) && !hasReachedEndOfStream())
      {
        //console.log('INSIDE WHILE IN RANDOM AND PUSH METHOD');
        randomChoice = _.random(songsLength-1);
      }

      updatePlayCountPerTab(selectedTab, randomChoice);

      /*console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ this is the current play length for my groovs:");
      console.log(Session.get('mygroovsPlayedLength'));
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ this is the current play length for tastemakers:");
      console.log(Session.get('tastemakersPlayedLength'));
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ this is the current play length for globalll:");
      console.log(Session.get('globalPlayedLength'));
      console.log("###############################!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ this is the TOTAL LENGTH for my groovs:");
      console.log(getSongsLength('me'));
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ this is the TOTAL LENGTH for tastemakers:");
      console.log(getSongsLength('friends'));
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ this is the TOTAL LENGTH for globalll:");
      console.log(getSongsLength('global'));*/


      if(!hasReachedEndOfStream())
      {
        //console.log('#################################DECIDED on this SONG: '+ getSongAtIndex('me',randomChoice).st + '!!!!! PUSHING NOW');
        //console.log('#################################DECIDED on this SONG: '+ getSongAtIndex(selectedTab,randomChoice).st + '!!!!! PUSHING NOW');
        selectShareFromControls(getSongAtIndex(selectedTab,randomChoice), getSongs(selectedTab), getSongAtIndex(selectedTab,randomChoice).sourceTab);
      }
      else
      {
        resetCurrentHistoryIndex();
        //console.log('REACHED END OF YOUR PLAYLIST; resetting history position');
        selectShareFromControls(getSongInHistoryAtIndex(0), getSongs(getSongInHistoryAtIndex(0).sourceTab), getSongInHistoryAtIndex(0).sourceTab);
      }
    }
    else //reached end of stream
    {
      //setReachedEndOfStream(true);
      resetCurrentHistoryIndex();
      toastr.info("No more songs available for current page selection: <br><br><b><i> going back to the beginning of play history for current page selections! </i></b>");
      //console.log('REACHED END OF YOUR PLAYLIST; resetting history position');
      //selectShareFromControls(getSongInHistoryAtIndex('me',0), getSongs('me'), getSongAtIndex('me',randomChoice).sourceTab);
      selectShareFromControls(getSongInHistoryAtIndex(0), getSongs(getSongInHistoryAtIndex(0).sourceTab), getSongInHistoryAtIndex(0).sourceTab);
    }
  }
  else //genres have been selected
  {
    var selectedSongsForGenre = Session.get('genl');
    var songsLength = Session.get('genl').length;
    var randomChoice = _.random(songsLength-1);

    //console.log('IN GENRE SELECTION METHOD:');

    var tabOfRandomSong = null;
    var reachedEndOfGenreList = false;

    if(Session.get('genPlayedLength') >= songsLength)
    {
      reachedEndOfGenreList = true;
    }

    tabOfRandomSong = getTabWhereLinkIDResides(selectedSongsForGenre[randomChoice].sl);
    //var currentGenrePlayedLength = Session.get('genPlayedLength');
    //console.log('1 - THIS SONG: ' + selectedSongsForGenre[randomChoice].st + ' RESIDES IN THIS TAB: ' + tabOfRandomSong);

    if(!reachedEndOfGenreList)
    {
      //console.log('THIS IS THE GEN PLAYED LENGTH : ' + Session.get('genPlayedLength'));
      //console.log('THIS IS THE TOTAL SONG LENGTH : ' + songsLength);
      //console.log('00000000 INSIDE WHILE LOOP');
      while(_.isNull(tabOfRandomSong) || (songAlreadyExistsInHistory(selectedSongsForGenre[randomChoice]) && !reachedEndOfGenreList))
      {
        //console.log('111111 INSIDE WHILE LOOP');
        while(_.isNull(tabOfRandomSong))
        {
          //console.log('THIS SONG RESIDES IN THE NULL TAB and so the play length will be incremented by 1 regardless!!!');
          //console.log('3 - THIS SONG: ' + selectedSongsForGenre[randomChoice].st + ' RESIDES IN THIS TAB: ' + tabOfRandomSong);
          Session.set('genPlayedLength', Session.get('genPlayedLength')+1);
          //console.log('THIS IS THE GEN PLAYED LENGTH : ' + Session.get('genPlayedLength'));
          //console.log('THIS IS THE TOTAL SONG LENGTH : ' + songsLength);
          //console.log('222222 INSIDE WHILE LOOP');
          randomChoice = _.random(songsLength-1);
          tabOfRandomSong = getTabWhereLinkIDResides(selectedSongsForGenre[randomChoice].sl);
          if(Session.get('genPlayedLength') >= songsLength)
          {
            tabOfRandomSong = 'notNull';
            reachedEndOfGenreList = true;
          }
        }

        while(songAlreadyExistsInHistory(selectedSongsForGenre[randomChoice]) && !reachedEndOfGenreList)
        {
          //console.log('INSIDE RANDOM GENRE SELECTION SONG METHOD');
          //console.log('THIS IS THE GEN PLAYED LENGTH : ' + Session.get('genPlayedLength'));
          //console.log('THIS IS THE TOTAL SONG LENGTH : ' + songsLength);
          //console.log('3333333 INSIDE WHILE LOOP');
          randomChoice = _.random(songsLength-1);
          tabOfRandomSong = getTabWhereLinkIDResides(selectedSongsForGenre[randomChoice].sl);
          //console.log('2 - THIS SONG: ' + selectedSongsForGenre[randomChoice].st + ' RESIDES IN THIS TAB: ' + tabOfRandomSong);
          if(Session.get('genPlayedLength') >= songsLength)
          {
            reachedEndOfGenreList = true;
            tabOfRandomSong = 'notNull';
          }
        }
      }

      if(Session.get('genPlayedLength') >= songsLength)
      {
        reachedEndOfGenreList = true;
        tabOfRandomSong = 'notNull';
      }
    }

    if(Session.get('genPlayedLength') < songsLength)
    {
      if(!hasReachedEndOfStream())
      {
        //console.log('THIS RANDOM SONG resides in this tab: ');
        //console.log(tabOfRandomSong);
        //console.log('5 - THIS SONG: ' + selectedSongsForGenre[randomChoice].st + ' RESIDES IN THIS TAB: ' + tabOfRandomSong);
        selectShareFromControls(selectedSongsForGenre[randomChoice], getSongs(tabOfRandomSong), tabOfRandomSong);
        //console.log('3 - gen play length increased by 1');
        Session.set('genPlayedLength', Session.get('genPlayedLength')+1);
        //console.log('FINISHED SELECTING SONG!!!');
        //console.log('song number: ' + Session.get('genPlayedLength') + ' is ' + selectedSongsForGenre[randomChoice].st + ' by ' + selectedSongsForGenre[randomChoice].sa);
      }
      else
      {
        resetCurrentHistoryIndex();
        selectShareFromControls(getSongInHistoryAtIndex(0), getSongs(getSongInHistoryAtIndex(0).sourceTab), getSongInHistoryAtIndex(0).sourceTab);
      }
    }
    else
    {
      toastr.info("Reached end of flylist; no more songs available for current genre selection: <br><br><b><i>" + Session.get('selGens') + "</i></b><br><br> going back to the beginning of play history!");
      resetCurrentHistoryIndex();
      selectShareFromControls(getSongInHistoryAtIndex(0), getSongs(getSongInHistoryAtIndex(0).sourceTab), getSongInHistoryAtIndex(0).sourceTab);
    }
  }
}

function songIndexWithinList(song, songList) {
  //console.log("THIS IS THE SONG OBJECT in index method: ");
  //console.log(song);
  //console.log("THIS IS THE SONG LIST in index method: ");
  //console.log(songList);

  //console.log('')
  var c = 0;
    if(song !== undefined)
    {
      //console.log(song);
      while(c < songList.length){
        if(song.sl === songList[c].sl)
        {
          //console.log('INSIDE THE SONG INDEX METHOD - this is the TRACK TITLE: ' + songList[c].st);
          //console.log('INSIDE THE SONG INDEX METHOD: ' + c);
          return c;
        }
        else
          c++;
      }
      return -1;
  }
}

function updatePlayCountPerTab(tab, selectedChoice)
{
  var currentCount = 0;
  if(tab === 'me')
  {
    currentCount = Session.get('mygroovsPlayedLength');
    currentCount++;
    Session.set('mygroovsPlayedLength', currentCount);

    //console.log('HISTORY COUNT: CURRENT MY GROOVS PLAY LENGTH IS: ' + Session.get('mygroovsPlayedLength'));
  }
  else if(tab === 'friends')
  {
    currentCount = Session.get('tastemakersPlayedLength');
    currentCount++;
    Session.set('tastemakersPlayedLength', currentCount);

    //console.log('HISTORY COUNT: CURRENT TASTEMAKERSSSSSS PLAY LENGTH IS: ' + Session.get('tastemakersPlayedLength'));
  }
  else if(tab === 'global')
  {
    currentCount = Session.get('globalPlayedLength');
    currentCount++;
    Session.set('globalPlayedLength', currentCount);

    //console.log('HISTORY COUNT: CURRENT GLOBAL PLAY LENGTH IS: ' + Session.get('globalPlayedLength'));
  }

  //console.log('COMBINED MUSIC LENGTH IS: ' + getCombinedMusicLength());
}

setShareByLinkID = function(linkID) {
  //console.log('setting sHARE by LINK ID: ');
  var currentTab = Session.get('activeTab');
  //console.log('######################### SETTING THE SHARE by LINK ID: ' + linkID);
  //console.log('######################### THIS IS THE CURRENT ACTIVE TAB AS PER THE SESSION VAR: ' + currentTab);
  //switchTabIfNotAlreadyFocusedForSelectedSong(getTabWhereLinkIDResides(linkID));
  var songObj = getSongObjectForSong(currentTab, linkID);
  if(songObj !== null)
    setShare(songObj);
}

function getSongObjectForSongLink(tab, songLink) {
  if(tab == 'me')
  {
    var foundSong = _.findWhere(mySongs,{sl: songLink});
    if(!_.isNull(foundSong))
      return foundSong;
    else
      return null;
  }
  else if(tab == 'friends')
  {
    var foundSong = _.findWhere(friendSongs,{sl: songLink});
    if(!_.isNull(foundSong))
      return foundSong;
    else
      return null;
  }
  else if(tab == 'global')
  {
    var foundSong = _.findWhere(globalSongs,{sl: songLink});
    if(!_.isNull(foundSong))
      return foundSong;
    else
      return null;
  }
  else if(tab == 'search')
  {
    var foundSong = _.findWhere(searchResultSongs,{sl: songLink});
    if(!_.isNull(foundSong))
      return foundSong;
    else
      return null;
  }
  else
    return null
}

//////////////////////// STOPPED HEREEEE!!!! FIX THIS part and use the newly created song items for each tab
///and also the new session var for playable tabs

function getTabWhereLinkIDResides(linkID) {

  if(!_.isEmpty(_.where(mySongs,{sl: linkID})))
    return 'me';
  else if(!_.isEmpty(_.where(friendSongs,{sl: linkID})))
    return 'friends';
  else if(!_.isEmpty(_.where(globalSongs,{sl: linkID})))
    return 'global';
  else if(!_.isEmpty(_.where(searchResultSongs,{sl: linkID})))
    return 'search';
  else
    return null;
}

function setShare(currentShare)
{
  //console.log('SETTING THE SHARE TO THIS: ');
  //console.log(currentShare);
  setCurrentSong(currentShare);
  if(isHistoryEmpty())
  {
    //analytics.track("started play history");
    mixpanel.track("started play history");
    iHist(false);    
    pushToHistory(currentShare);
    decrementHistoryBy1();
    //console.log('BLANK: this is the current history length: ' + SongState.getHistoryLength());
    //console.log('BLANK: this is the current history index: '+ SongState.getCurrentHistoryIndex());
  }
  else
  { 
    //if(!SongState.songExistsInHistory()) //if song doesn't exist in history
    if(!songAlreadyExistsInHistory(getCurrentSong())) //if song doesn't exist in history
    {
      pushToHistory(currentShare);       
    }
  }
}

resetPlayedLengthSpecificToTab = function(tab)
{
  if(tab === 'me')
  {
    Session.set('mygroovsPlayedLength', 0);
  }
  else if(tab === 'friends')
  {
    Session.set('tastemakersPlayedLength', 0);
  }
  else if(tab === 'global')
  {
    Session.set('globalPlayedLength', 0);
  }
  else if(tab === 'all')
  {
    Session.set('mygroovsPlayedLength', 0);
    Session.set('tastemakersPlayedLength', 0);
    Session.set('globalPlayedLength', 0);
  }
}

function selectShareFromControls(share, shares, tab) {
  //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!INSIDE SHARE SELECTION FROM METHOD');
  //console.log('##############THIS IS the SELECTED SHARE:');
  //console.log('THIS IS THE TAB THAT THE SELECTED SONG BELONGS TO: ' + tab);
  //console.log(share.st);
  //var chosenIndex = shares.indexOf(share) + 2;
  if(tab === 'me')
  {
    //$('#songTabs a[href="#mygroovs"]').tab('show');
    $('#mygroovsTabHeader').click();
    Session.set('activeTab', 'me');
  }
  else if(tab === 'friends')
  {
    //$('#songTabs a[href="#tastemakers"]').tab('show');
    $('#tastemakersTabHeader').click();
    Session.set('activeTab', 'friends');
  }
  else if(tab === 'global')
  {
    //$('#songTabs a[href="#global"]').tab('show');
    $('#globalTabHeader').click();
    Session.set('activeTab', 'global');
  }
  else if(tab === 'search')
  {
    //$('#songTabs a[href="#global"]').tab('show');
    $('#sresultsTabHeader').click();
    Session.set('activeTab', 'search');
  }
  var chosenIndex = songIndexWithinList(share,shares) + 1;// + 2;
  //console.log('################################## TRACK TITLE WITHIN ENTIRE LIST:' + share.st);//shares[chosenIndex].st)';
  //console.log('THIS IS THE TAB!!!: '+ tab);
  if(tab === 'me')
  {
    var firstSongObject = document.querySelector('.songBrowserItem:nth-child(1)');
    var selectedRandomSongLink = document.querySelector('.songBrowserItem:nth-child('+chosenIndex+')');
    var selectedRandomSongObject = document.querySelector('.songBrowserItem:nth-child('+chosenIndex+')');
    //console.log('**************THIS IS THE CHOSEN INDEX: '+chosenIndex);
    //console.log('**************THIS IS THE CHOSEN SONG OBJECT: ');
    //console.log(selectedRandomSongObject);
    //setShare(share);
    //incrementListenCount();
    $(selectedRandomSongLink).click();
  }
  else if(tab === 'friends') 
  {
    var firstSongObject = document.querySelector('.tastemakersongItem:nth-child(1)');
    var selectedRandomSongLink = document.querySelector('.tastemakersongItem:nth-child('+chosenIndex+')');
    var selectedRandomSongObject = document.querySelector('.tastemakersongItem:nth-child('+chosenIndex+')');
    //console.log('**************THIS IS THE CHOSEN INDEX: '+chosenIndex);
    //console.log('**************THIS IS THE CHOSEN SONG OBJECT: ');
    //console.log(selectedRandomSongObject);
    //setShare(share);
    //incrementListenCount();
    $(selectedRandomSongLink).click();
  }
  else if(tab === 'global') 
  {
    var firstSongObject = document.querySelector('.globalsongItem:nth-child(1)');
    var selectedRandomSongLink = document.querySelector('.globalsongItem:nth-child('+chosenIndex+')');
    var selectedRandomSongObject = document.querySelector('.globalsongItem:nth-child('+chosenIndex+')');
    //console.log('**************THIS IS THE CHOSEN INDEX: '+chosenIndex);
    //console.log('**************THIS IS THE CHOSEN SONG OBJECT: ');
    //console.log(selectedRandomSongObject);
    //setShare(share);
    //incrementListenCount();
    $(selectedRandomSongLink).click();
  }
  else if(tab === 'search') 
  {
    var firstSongObject = document.querySelector('.searchresultItem:nth-child(1)');
    var selectedRandomSongLink = document.querySelector('.searchresultItem:nth-child('+chosenIndex+')');
    var selectedRandomSongObject = document.querySelector('.searchresultItem:nth-child('+chosenIndex+')');
    //console.log('**************THIS IS THE CHOSEN INDEX: '+chosenIndex);
    //console.log('**************THIS IS THE CHOSEN SONG OBJECT: ');
    //console.log(selectedRandomSongObject);
    //setShare(share);
    //incrementListenCount();
    $(selectedRandomSongLink).click();
  }
} 


//SongState Methods: USING <functionName> = function () {...} format so that it is globally accessible
   function resetSession() {
      Session.set({
        'currentTab': 'me',
        'mySongs': [],
        'friendSongs': [],
        'globalSongs': [],
        'musicHistory': [],
        'currentHistoryIndex': 0,
        'currentSong': {},
        'currentID': '',
        'lastAction': 'next',
        'reachedEndOfStream': false
      });
   }

   function getCurrentSong() {
     return currentSong;
   }

   function getSongObjectForSong(tab, linkID) {
    var counter = 0;
    if(tab === 'me')
    {
      while(counter < mySongs.length)
      {
        var lid = mySongs[counter].sl.substring(mySongs[counter].sl.indexOf('v=')+2);
        if(linkID === lid)
          return mySongs[counter];
        else
          counter++;
      }
      return null;
    }
    else if(tab === 'friends')
    {
      while(counter < friendSongs.length)
      {
        var lid = friendSongs[counter].sl.substring(friendSongs[counter].sl.indexOf('v=')+2);
        if(linkID === lid)
          return friendSongs[counter];
        else
          counter++;
      }
      return null;
    }
    else if(tab === 'global')
    {
      while(counter < globalSongs.length)
      {
        var lid = globalSongs[counter].sl.substring(globalSongs[counter].sl.indexOf('v=')+2);
        if(linkID === lid)
          return globalSongs[counter];
        else
          counter++;
      }
      return null;
    }
    else if(tab === 'search')
    {
      //console.log('searching for song in SEARCH TAB!!!!!');
      while(counter < searchResultSongs.length)
      {
        //console.log("SEARCHING FOR song in search result songs:");
        //console.log(searchResultSongs[counter]);
        //console.log('THIS IS THE LINK ID: ');
        var lid = searchResultSongs[counter].sl.substring(searchResultSongs[counter].sl.indexOf('v=')+2);
        //console.log(lid);
        //console.log("THIS IS THE SEARCH RESULT LINK ID: ");
        //console.log(linkID);
        if(linkID === lid)
          return searchResultSongs[counter];
        else
          counter++;
      }
      return null;
    }
   }

   function setCurrentSong(s) {
     //console.log('SETTING the current song to : '+ s.st);
     currentSong = s;
     currentID = s.sl.substring(s.sl.indexOf('v=')+2); //currentID is set directly in set current share
     Session.set('CS', s);
   }
   
   updateMySongs = function(sh, tab) {
    //console.log('UPDATING my songs via songstate service');
    var counter = 0;
    if(tab === 'me')
    {
      //console.log('UPDATING SONGS For MY GROOOOOOOOVS TAB: ');
      while(counter < sh.length)
      {
        sh[counter].sourceTab = 'me';
        //console.log('THIS IS THE UPDATTTTTED SONG OBJECT: ');
        //console.log(sh[counter]);
        counter++;
      }
      Session.set('mLen', sh.length); //me length
      mySongs = sh;
    }
    else if(tab === 'friends')
    {
      //console.log('UPDATING SONGS For TASTEMAKERSSSSSS TAB: ');
      while(counter < sh.length)
      {
        sh[counter].sourceTab = 'friends';
        //console.log('THIS IS THE UPDATTTTTED SONG OBJECT: ');
        //console.log(sh[counter]);
        counter++;
      }
      Session.set('fLen', sh.length); //friends length
      friendSongs = sh;
    }
    else if(tab === 'global')
    {
      //console.log('UPDATING SONGS For global TAB: ');
      while(counter < sh.length)
      {
        sh[counter].sourceTab = 'global';
        //console.log('THIS IS THE UPDATTTTTED SONG OBJECT: ');
        //console.log(sh[counter]);
        counter++;
      }
      Session.set('gLen', sh.length); //friends length
      globalSongs = sh;
    }
    else if(tab === 'search')
    {
      //console.log('UPDATING SONGS For search TAB: ');
      while(counter < sh.length)
      {
        sh[counter].sourceTab = 'search';
        //console.log('THIS IS THE UPDATTTTTED SONG OBJECT: ');
        //console.log(sh[counter]);
        counter++;
      }
      Session.set('sLen', sh.length); //friends length
      searchResultSongs = sh;
      //console.log("THIS IS THE search results songs now!!!!!!!!!!");
      //console.log(searchResultSongs);
    }
   }
   
   function getSongsLength(tab) {
     if(tab === 'me')
       return mySongs.length;
     else if(tab === 'friends')
       return friendSongs.length;
     else if(tab === 'global')
       return globalSongs.length;
     else if(tab === 'search')
       return searchResultSongs.length; 
   }
   
   function getSongs(tab) {
     if(tab === 'me')
       return mySongs;
     else if(tab === 'friends')
       return friendSongs;
     else if(tab === 'global')
       return globalSongs;
     else if(tab === 'search')
       return searchResultSongs;   
   }
   
   function getSongAtIndex(tab, i) {
     if(tab === 'me')
       return mySongs[i];
     else if(tab === 'friends')
       return friendSongs[i];
     else if(tab === 'global')
       return globalSongs[i];     
   }

   function getSongInHistoryAtIndex(i) {
     return musicHistory[i];
   }
   
   function isHistoryEmpty() {
     //console.log('CHECK IF HISTORY is EMPTY!!!!');
     if (musicHistory === [] || musicHistory === null || musicHistory === undefined || musicHistory === '' || musicHistory.length === 0)
       return true;
     else
       return false;
   }
   
   //initializeHistory
   iHist = function (externalCall) {
     //console.log('music History IS this right now before resetting: ');
     //console.log(musicHistory);
     musicHistory = [];
     resetSession();
     //console.log('music History IS this right now AFTER initializing and resetting: ');
     //console.log(musicHistory);
     if(externalCall)
     {
       resetCurrentHistoryIndex();
     }
   }
   
   function pushToHistory(s) {
     //console.log('pushing this to the musicHistory'+ s.st);
     //s.sourceTab = Session.get('activeTab');
     musicHistory.push(s);
     currentHistoryIndex = musicHistory.length - 1;
     //console.log('CURRENT HISTORY IS: ');
     //console.log(musicHistory);
   }

   function selectAndHighlightSongAfterSharing() {
    $($('.songBrowserItem')[0]).addClass('green selected');
    //$('.selected .overlay').addClass('nowplaying');
    Meteor.setTimeout(animateToMyGroovListAfterSharingSong, 500);
   }

   function animateToMyGroovListAfterSharingSong()
   {
    switchTabToMyGroovsIfNotAlreadyFocusedForSelectedSong('me');
   }

   updateSongSourceTabInHistory = function(updatedSong) {
    var found = _.findWhere(musicHistory, {'sl': updatedSong.storyLink});
    found.sourceTab = 'me';
    setCurrentSong(found);
    if(FlowRouter.current().path == '/semanticboard') //only switch to my groovs tab if currently on semantic board / home page
    {
      Meteor.setTimeout(selectAndHighlightSongAfterSharing, 15000); //was originally 500 milliseconds ; changed it to 10 seconds so that song is pulled in by then
    }
   }

   /*setSongObjectBasedOnSearchResult = function(songLink) { OLDER SEARCH METHOD - BEFORE SEMANTIC UI
    //console.log("REACHED PLayer controls with this songid: ");
    //console.log(songLink);

    var searchedSongTab = getTabWhereLinkIDResides(songLink);
    //console.log('FOUND THE SONG IN THIS TAB:');
    //console.log(searchedSongTab);
    !_.isNull(searchedSongTab)
    {
      var searchedSong = getSongObjectForSongLink(searchedSongTab, songLink);
      //console.log('FOUND THE SONG OBJECT:');
      //console.log(searchedSong);
      if(!_.isNull(searchedSong))
        selectShareFromControls(searchedSong, getSongs(searchedSongTab), searchedSongTab);
      else
        toastr.error("Searched song is outside current song scope!");
    }
    //setCurrentSong(found);

    //selectShareFromControls(getSongAtIndex(selectedTab,randomChoice), getSongs(selectedTab), getSongAtIndex(selectedTab,randomChoice).sourceTab);
   }*/

   setSongObjectBasedOnSearchResult = function(searchedSong) {
    //console.log("REACHED PLayer controls with this songid: ");
    //console.log(songObj);

    //var searchedSong = getSongObjectForSongLink('search', songLink);

    //console.log("FOUND THIS OBJECT: " );
    //console.log(searchedSong);

    selectShareFromControls(searchedSong, getSongs('search'), 'search');

   }
   
   function getCurrentHistoryIndex() {
     return currentHistoryIndex;
   }
   
   function resetCurrentHistoryIndex() {
    currentHistoryIndex = 0;
   }

   function incrementHistoryBy1() {
      currentHistoryIndex++;
   }

   function decrementHistoryBy1() {
      if(currentHistoryIndex >= 1)
        currentHistoryIndex--;
   }
   
   function getHistory() {
     return musicHistory;
   }

   /*remsrchrsltsfrmhistory = function() {
    console.log("THIS IS THE CURRENT history: ");
    console.log(getHistory());
    var histWithoutSearchResults = _.reject(getHistory(), function(obj){ return obj.sourceTab === "search"; });
    musicHistory = histWithoutSearchResults;
    console.log("THIS IS THE NEW HISTORY without search results: ");
    console.log(getHistory());
   }*/
   
   getHistoryLength = function() {
     return musicHistory.length;
   }
   
   function setCurrentHistoryIndexToIndexOfThisSong(s) {
     currentHistoryIndex = musicHistory.indexOf(s);
   }
 
   function songAlreadyExistsInHistory(s) {
    c = 0;
    if(!_.isUndefined(s))// !== undefined)
    {
      //console.log('INSIDE THE HISTORY CHECK METHOD: ');
      //console.log(s.st);
      //console.log('CURRENT MUSIC HISTORY: ');
      //console.log(musicHistory);
      var match = _.where(musicHistory, {sl: s.sl});
      //console.log('HISTORY CHECK MATCH IS: ');
      //console.log(match);
      if(_.isEmpty(match))
        return false;
      else
        return true;
    }
    else
    {
      //console.log('hISTORY CHECK METHOD --- INVALID SONG SELECTION -- try again!!!');
      return true;
    }
   }
   
   function atEndOfHistory() {
      if((currentHistoryIndex === musicHistory.length-1) && musicHistory.length > 0)
      {
        //console.log('at the end of the musicHistory');
        return true;
      }
      else
      {
        //console.log('NOT AT HISTORY END!');
        return false;
      }
   }
   
   function getCurrentID() {
     return currentID;
   }
   
   incrementListenCount = function() {
     currentSong.listenCount += 1;
     //console.log('INSIDE INCREMENT LISTEN COUNT METHOD in song state service!!!!!');
     //OLD UPDATE LISTEN COUNT METHOD//Meteor.call('updateListenCount', getCurrentID(), 'yt', currentSong.listenCount);

     Meteor.call('insertSongListen', getCurrentID(), 'yt');

      mixpanel.track('increment song listen count', {
        songID: getCurrentID(),
        currentListenCount: currentSong.listenCount,
        type: 'yt'
      });
   }

   function getCombinedMusicLength() {
    var totalLength = 0;
    if(mySongs.length > 0)
    {
      totalLength += mySongs.length;
      //console.log('MY SONGS LENGTH IS: ' + mySongs.length);
    }

    if(friendSongs.length > 0)
    {
      totalLength += friendSongs.length;
      //console.log('TASTEMAKERS SONG LENGTH IS: ' + friendSongs.length);
    }

    if(globalSongs.length > 0)
      totalLength += globalSongs.length;

    /*if(totalLength > 0)
      totalLength -= 1;*/

    return totalLength;
   }
   
   function nextPressedSelectNewOrAdvanceThruHistory() {
    //console.log('this is the current history index - NEXT PRESSED:' + getCurrentHistoryIndex());
    setLastActionAsNext();


    if(isHistoryEmpty())
    {
      setReachedEndOfStream(false);
      //console.log("nothing in here so pushing the first random choice i got");

      iHist(false);
      return true;
    }
    else
    {
      //if(getHistoryLength() < getSongsLength('me')-1)
      //console.log('CHECKING HISTORY LENGTH : HISTORY LENGTH IS: ' + getHistoryLength());
      //console.log('CHECKING HISTORY LENGTH : COMBINED HISTORY LENGTH IS: ' + getCombinedMusicLength());
      if(getHistoryLength() < getCombinedMusicLength())
        setReachedEndOfStream(false);
      else
        setReachedEndOfStream(true);

      if(atEndOfHistory())//it is at the end of the random linklist, then add the next choice
      {
        //console.log("at the end of linklist getting new random choice");
        return true;
      }     
      else //if not at the end of the linklist then just move to the next one
      {
        //analytics.track("next song in history");
        mixpanel.track("next song in history");
        incrementHistoryBy1();
        return false;
      } 
    }
   }

   function previousPressedNotReachedBeginning() {
    //console.log('this is the current musicHistory index - PREVIOUS PRESSED:' + getCurrentHistoryIndex());
    setLastActionAsPrevious();
    if(getCurrentHistoryIndex() >= 1)
    {
      decrementHistoryBy1();
      //console.log('this is the current musicHistory index after PRESSING PREVIOUS:' + getCurrentHistoryIndex());
      if(isHistoryEmpty())
      {
          setReachedEndOfStream(false);
      }
      else
      {
        if(getHistoryLength() < getSongsLength('me')-1)
          setReachedEndOfStream(false);
        else
          setReachedEndOfStream(true);
      }
      //console.log('musicHistory hasnt reached beginning');
      //analytics.track("click previous song");
      mixpanel.track("click previous song");
      return true;
    }
    else
      return false;
   }
   
   function setLastActionAsNext() {
      lastAction = 'next'; 
   }
   
   function setLastActionAsPrevious() {
      lastAction = 'previous'; 
   }
   
   function getLastAction() {
      return lastAction;
   }
   
   function setReachedEndOfStream(state) {
      reachedEndOfStream = state;
   } 

   function hasReachedEndOfStream() {
      return reachedEndOfStream;
   }

   function songIsInSelectedGenres(s) {
      //console.log("REACHED genre selection method!!!");
      var selectedGenres = Session.get('selGens');
      if(!_.isUndefined(selectedGenres) && !_.isEmpty(selectedGenres))
      {
        var artistOfRandomlyChosenSong = s.sa;
        var foundArtist = Artists.findOne({name: artistOfRandomlyChosenSong});
        if(!_.isUndefined(foundArtist) && !_.isUndefined(foundArtist.genres))
        {
          //console.log('this is the randomly chosen Artist: ');
          //console.log(foundArtist);
          //console.log('this is the selected genres:');
          //console.log(selectedGenres);
          var genreResult = _.intersection(foundArtist.genres, selectedGenres);
          if(_.isEmpty(genreResult)) //if there are no matches between selected genres and the current artist's genres then return false
          {
            //console.log('THIS ARTIST DOES NOT MATCH WITH THE SELECTED GENRE!!!');
            //console.log(foundArtist.name)
            return false;
          }
          else
          {
            //console.log('THIS ARTIST MATCHES with the selected genre!!!!');
            //console.log(foundArtist.name)
            return true
          }
        }
        else //no genres found for this artist or artist object not found, so don't play a song by this artist in genre selection mode
        {
          return false;
        }
      }
      else
      {
        //console.log('GENRE SELECTION IS EMPTY!!!');
        return true;
      }
   }

   function selectedSongIsInvalid(randomSong) {
      if(randomSong.iTunesValid === 'VALID' || randomSong.LFMValid === 'VALID')
      {
        //console.log('////////////////// this random song: ' + randomSong.sl + ' is VALID');
        return false;
      }
      else
      {
        //console.log('////////////////// this random song: ' + randomSong.sl + ' is INNNNNNVALID');
        return true;
      }
   }
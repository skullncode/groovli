nextPressed = false;
previousPressed = false;

//SONG state VARS
currentTab = 'me';
mySongs = [];
friendSongs = [];
globalSongs = [];
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

Template.playerControls.helpers({
  currentlyOnSongboard: function(){
    return Router.current().route.path() === '/songboard';
  },
  encounteredErroneousSong: function() {
    if(Session.get('SongErroneous'))
    {
      //console.log("SONG IS ERRONEOUS YAWWWWWW!!!!!!!");
      dealWithErroneousSong();
    }
  }
});

Template.playerControls.events({
    'click .glyphicon-step-forward': function(event) {
        nextSong();
    },

    'click .glyphicon-step-backward': function(event) {
        previousSong();
    }
});

function nextSong() {
	//console.log('HISTORY GETTING!!!!!: ' + getHistory());
	//console.log('PRESSED NEXTTTT!!!!!');
  Session.set('animatedToSong', false);
	if(!nextPressed)
	{
		nextPressed = true;
		if(nextPressedSelectNewOrAdvanceThruHistory())
		{
			selectNewRandomSongAndPush();
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

  Session.set('SongErroneous',false);
  if(lastAction === 'next')  
    nextSong();
  else if(lastAction === 'previous')
    previousSong();
}

// PROBLEMS: CURRENTLY  GOING IN INFINITE LOOP AFTER RUNNING OUT OF SONGS TO PlAY IN ONE TAB
// FIX THAT, so that it knows to not choose any more songs from one tab
//NOW USE COPY of songs list copy to remove the played song from the copy array once played, 
//that way once the copy array is empty that means there's nothing left to play


function getRandomSongTabThatStillHasUnplayedSongs()
{
  var playableTabsLength = Session.get('playableTabs').length;
  //console.log('@#@#@#@#@#@NUMBER OF PLAYABLE TABS: ' + playableTabsLength);
  var randomlySelectedTabIndex = _.random(playableTabsLength-1);
  //console.log('THIS IS THE RANDOMLY SELECTED TAB INDEX: ' + randomlySelectedTabIndex);
  var selectedTab = Session.get('playableTabs')[randomlySelectedTabIndex];
  if(Session.get('mygroovsPlayedLength') < getSongsLength('me') || Session.get('tastemakersPlayedLength') < getSongsLength('friends') || Session.get('globalPlayedLength') < getSongsLength('global'))
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

function selectNewRandomSongAndPush() {
  var selectedTab = getRandomSongTabThatStillHasUnplayedSongs();
  //console.log('***************************** THIS IS THE SELECTED TAB We GOT BACK: ' + selectedTab);
  if(selectedTab !== null && selectedTab !== undefined)
  {
    //console.log('@#@#@#@#@#@#@#HAVE RANDOMLY SELECTED THIS TAB FOR THE NEXT SONG: ' + selectedTab);
    var songsLength = getSongsLength(selectedTab);
    var invalidTries = 0;
  	
    var randomChoice = _.random(songsLength-1);

    //console.log('&&^&^&^&^^&^&^&^^&&^^&^THIS IS THE ZEROTH ITEM IN THE CURRENT SELECTED TAB: ' + getSongAtIndex(selectedTab,0).st);
    //console.log('THIS IS THE LENGTH ITEM IN THE CURRENT SELECTED TAB: ' + getSongAtIndex(selectedTab,songsLength-1).st);

    while(songAlreadyExistsInHistory(getSongAtIndex(selectedTab,randomChoice)) && !hasReachedEndOfStream())
  	{
  		//console.log('INSIDE WHILE IN RANDOM AND PUSH METHOD');
  		randomChoice = _.random(songsLength-1);
  	}

    updatePlayCountPerTab(selectedTab, randomChoice);

  	if(!hasReachedEndOfStream())
  	{
  		////console.log('#################################DECIDED on this SONG: '+ getSongAtIndex('me',randomChoice).st + '!!!!! PUSHING NOW');
      //console.log('#################################DECIDED on this SONG: '+ getSongAtIndex(selectedTab,randomChoice).st + '!!!!! PUSHING NOW');
  		//selectShareFromControls(getSongAtIndex('me',randomChoice), getSongs('me'), getSongAtIndex('me',randomChoice).sourceTab);
      selectShareFromControls(getSongAtIndex(selectedTab,randomChoice), getSongs(selectedTab), getSongAtIndex(selectedTab,randomChoice).sourceTab);
  	}
  	else
  	{
  		resetCurrentHistoryIndex();
  		//console.log('REACHED END OF YOUR PLAYLIST; resetting history position');
  		//selectShareFromControls(getSongInHistoryAtIndex('me',0), getSongs('me'), getSongAtIndex('me',randomChoice).sourceTab);
      selectShareFromControls(getSongInHistoryAtIndex(0), getSongs(getSongInHistoryAtIndex(0).sourceTab), getSongInHistoryAtIndex(0).sourceTab);
  	}
  }
  else //reached end of stream
  {
    //setReachedEndOfStream(true);
    resetCurrentHistoryIndex();
    //console.log('REACHED END OF YOUR PLAYLIST; resetting history position');
    //selectShareFromControls(getSongInHistoryAtIndex('me',0), getSongs('me'), getSongAtIndex('me',randomChoice).sourceTab);
    selectShareFromControls(getSongInHistoryAtIndex(0), getSongs(getSongInHistoryAtIndex(0).sourceTab), getSongInHistoryAtIndex(0).sourceTab);
  }
}

function songIndexWithinList(song, songList) {
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

//////////////////////// STOPPED HEREEEE!!!! FIX THIS part and use the newly created song items for each tab
///and also the new session var for playable tabs

function getTabWhereLinkIDResides(linkID) {
  var counter = 0;
  if(mySongs.length > 0) //need to check if it resides in my groovs Tab
  {
    while(counter < mySongs.length)
    {
      var lid = mySongs[counter].sl.substring(mySongs[counter].sl.indexOf('v=')+2);
      if(linkID === lid)
      {
        //console.log('THIS SONG: ' + mySongs[counter].st + ' FOUND INSIDE tHIS TAB: ' + mySongs[counter].sourceTab);
        return mySongs[counter].sourceTab; //song found in my groovs Tab
      }
      else
        counter++;
    }
  }

  counter = 0;

  if(friendSongs.length > 0) //need to check if it resides in my groovs Tab
  {
    while(counter < friendSongs.length)
    {
      var lid = friendSongs[counter].sl.substring(friendSongs[counter].sl.indexOf('v=')+2);
      if(linkID === lid)
      {
        //console.log('THIS SONG: ' + friendSongs[counter].st + ' FOUND INSIDE tHIS TAB: ' + friendSongs[counter].sourceTab);
        return mySongs[counter].sourceTab; //song found in my groovs Tab
      }
      else
        counter++;
    }
  }
}

function setShare(currentShare)
{
  //console.log('SETTING THE SHARE TO THIS: ');
  //console.log(currentShare);
  setCurrentSong(currentShare);
  if(isHistoryEmpty())
  {
    //mixpanel.track("started play history");
    initializeHistory();    
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
    //SongState.setCurrentHistoryIndexToIndexOfThisSong(currentShare);
    
    //console.log('NOT BLANK: this is the current history length: ' + SongState.getHistoryLength());
    //console.log('NOT BLANK: this is the current history index: '+ SongState.getCurrentHistoryIndex());
    //console.log('and this is the history so far: ');
    //console.log(SongState.getHistory());
  }
  //SongState.getAvgSongRating();
}

function selectShareFromControls(share, shares, tab) {
	//console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!INSIDE SHARE SELECTION FROM METHOD');
	//console.log('##############THIS IS the SELECTED SHARE:');
	//console.log(share.st);
  //var chosenIndex = shares.indexOf(share) + 2;
  if(tab === 'me')
  {
    $('#songTabs a[href="#mygroovs"]').tab('show');
  }
  else if(tab === 'friends')
  {
    $('#songTabs a[href="#tastemakers"]').tab('show');
  }
  else if(tab === 'global')
  {
    $('#songTabs a[href="#global"]').tab('show');
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
    setShare(share);
    incrementListenCount();
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
    setShare(share);
    incrementListenCount();
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
    setShare(share);
    incrementListenCount();
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
      //console.log('UPDATING SONGS For TASTEMAKERSSSSSS TAB: ');
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
    //console.log('SONG STATE LENGTH: ' + mySongs.length);
   }
   
   function getSongsLength(tab) {
     if(tab === 'me')
       return mySongs.length;
     else if(tab === 'friends')
       return friendSongs.length;
     else if(tab === 'global')
       return globalSongs.length;     
   }
   
   function getSongs(tab) {
     if(tab === 'me')
       return mySongs;
     else if(tab === 'friends')
       return friendSongs;
     else if(tab === 'global')
       return globalSongs;     
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
     //if(tab === 'me')
     return musicHistory[i];
     /*else if(tab === 'friends')
       return friendSongs[i];
     else if(tab === 'global')
       return globalSongs[i];     */
   }
   
   function isHistoryEmpty() {
     //console.log('CHECK IF HISTORY is EMPTY!!!!');
     if (musicHistory === [] || musicHistory === null || musicHistory === undefined || musicHistory === '' || musicHistory.length === 0)
       return true;
     else
       return false;
   }
   
   function initializeHistory() {
     musicHistory = [];
     resetSession();
   }
   
   function pushToHistory(s) {
     //console.log('pushing this to the musicHistory'+ s.st);
     //s.sourceTab = Session.get('activeTab');
     musicHistory.push(s);
     currentHistoryIndex = musicHistory.length - 1;
     //console.log('CURRENT HISTORY IS: ');
     //console.log(musicHistory);
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
   
   getHistoryLength = function() {
     return musicHistory.length;
   }
   
   function setCurrentHistoryIndexToIndexOfThisSong(s) {
     //console.log('INSIDE CURRENT HISTORY INDEX SETTING METHOD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: ' + musicHistory.indexOf(s));
     //console.log('THIS IS THE SONG OBJECT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
     //console.log(s);
     currentHistoryIndex = musicHistory.indexOf(s);
   }
 
   function songAlreadyExistsInHistory(s) {
    c = 0;
    if(s !== undefined)
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
      /*
      while(c < musicHistory.length){
        if(s.sl === musicHistory[c].sl)
        {
          console.log('found a match with : ' + s.st + ' AND ' + musicHistory[c].st);
          return true;
        }
        else
          c++;
      }
      return false;*/
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
   
   function incrementListenCount() {
     currentSong.listenCount += 1;
     //console.log('INSIDE INCREMENT LISTEN COUNT METHOD in song state service!!!!!');
     Meteor.call('updateListenCount', getCurrentID(), 'yt', currentSong.listenCount);
     //$http({method: 'PUT', url: '/lc/' + currentID + '/yt/' + currentSong.listenCount}).
     /*$http.put('/lc/' + currentID + '/yt/' + currentSong.listenCount).
       success(function(data, status) {
         if(status === 200)
           console.log('this is the successful data: '+ data);
         else
           console.log('this is the non-200 data: ' + data);
       }).
       error(function(data, status) {
         //console.log('ERROR!!!!!! this is the status: ' + status + ' and this is the data: ' + data);
     });*/
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

      initializeHistory();
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
        //mixpanel.track("next song in history");
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
      //mixpanel.track("click previous song");
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
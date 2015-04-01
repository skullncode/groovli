nextPressed = false;
previousPressed = false;

//SONG state VARS
currentTab = 'me';
mySongs = [];
friendSongs = [];
globalSongs = [];
musicHistory = [];
currentHistoryIndex = 0;
currentSong = [];
currentID = '';
lastAction = 'next';
reachedEndOfStream = false;
//END SONG state VARS

Template.playerControls.helpers({
  currentlyOnSongboard: function(){
    return Router.current().route.path() === '/songboard';
  },
  encounteredErroneousSong: function() {
    if(Session.get('SongErroneous'))
    {
      console.log("SONG IS ERRONEOUS YAWWWWWW!!!!!!!");
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
	console.log('PRESSED NEXTTTT!!!!!');
	if(!nextPressed)
	{
		nextPressed = true;
		if(nextPressedSelectNewOrAdvanceThruHistory())
		{
			selectNewRandomSongAndPush();
		}
		else
		{
			selectShareFromControls(getHistory()[getCurrentHistoryIndex()], getSongs('me'));
		}
		nextPressed = false;
	}
	else
  {
		console.log('*************************nothing pressed, because NEXT press TOOOOOOO FAST!!!!');
    nextPressed = false;
  }
}

function previousSong() {
	console.log('PRESSED PREvioussss!!!!!');
	if(!previousPressed)
	{
		previousPressed = true;
		if(previousPressedNotReachedBeginning())
		{
			selectShareFromControls(getHistory()[getCurrentHistoryIndex()], getSongs('me'));
		}
		previousPressed = false;
	}
	else
  {
		console.log('*************************nothing pressed, because PREvious press TOOOOOOO FAST!!!!');
    previousPressed = false;
  }
}

function dealWithErroneousSong() {
  currentSong.aeCount += 1;
  Meteor.call('updateAEC', currentID, 'yt', currentSong.aeCount, Session.get('YTErrorCode'));
  Session.set('YTErrorCode', 0);
  //musicHistory = musicHistory.pop();
  //decrementHistoryBy1();
  //decrementHistoryBy1();
  Session.set('SongErroneous',false);
  if(lastAction === 'next')  
    nextSong();
  else if(lastAction === 'previous')
    previousSong();
}

function selectNewRandomSongAndPush() {
	var songsLength = getSongsLength('me');
  var invalidTries = 0;
	
	var randomChoice = Math.floor(Math.random() * songsLength);
	if(randomChoice >= 1)
	{
		randomChoice = randomChoice - 1; 
	}// - 1);
	//console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^ THIS IS THE RANDOM CHOICE number:" + randomChoice);
	//var adjustedListPosition = randomChoice + 2;
	//console.log('inside new random song and push method');

	//console.log('THIS IS THE RANDOM CHOICE:');
	//console.log(randomChoice);

	//OLD NON-WORKING HISTORY CHECKER//while(_.contains(SongState.getHistory(), SongState.getSongAtIndex('me',randomChoice)) && SongState.getHistoryLength() <= SongState.getSongsLength('me'))
	while(songAlreadyExistsInHistory(getSongAtIndex('me',randomChoice)) && !hasReachedEndOfStream())
	{
		//console.log('INSIDE WHILE IN RANDOM AND PUSH METHOD');
		randomChoice = Math.floor(Math.random() * songsLength);
		if(randomChoice >= 1)
		{
			randomChoice = randomChoice - 1; 
		}
	}

  //check if chosen index is invalid or not
  //first get rid of 
  while(selectedSongIsInvalid(getSongAtIndex('me',randomChoice)))
  {
    //console.log('INSIDE RANDOM PUSH METHOD - SONG VALIDATION SECTION');
    randomChoice = Math.floor(Math.random() * songsLength);
    if(randomChoice >= 1)
    {
      randomChoice = randomChoice - 1; 
    }

    if(invalidTries === 5)
    {
      //console.log('TRIED TO FIND A REPLACEMENT For AN INVALID SONG - TOOOO MANY TIMES');
      break;
    }

    invalidTries++;
  }

	if(!hasReachedEndOfStream())
	{
		//console.log('#################################DECIDED on this SONG: '+ getSongAtIndex('me',randomChoice).st + '!!!!! PUSHING NOW');
		selectShareFromControls(getSongAtIndex('me',randomChoice), getSongs('me'));
	}
	else
	{
		//console.log('REACHED END OF YOUR PLAYLIST; resetting history position');
		resetCurrentHistoryIndex();
		//console.log('REACHED END OF YOUR PLAYLIST; resetting history position');
		selectShareFromControls(getSongInHistoryAtIndex('me',0), getSongs('me'));
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
	    		//console.log('INSIDE THE SONG INDEX METHOD: ' + c);
	    		return c;
	    	}
	    	else
	    		c++;
	    }
	    return -1;
	}
}

setShareByLinkID = function(linkID) {
  var songObj = getSongObjectForSong('me', linkID);
  if(songObj !== null)
    setShare(songObj);
}

function setShare(currentShare)
{
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

function selectShareFromControls(share, shares) {
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!INSIDE SHARE SELECTION FROM METHOD');
	console.log('##############THIS IS the SELECTED SHARE:');
	console.log(share.st);
  //var chosenIndex = shares.indexOf(share) + 2;
  var chosenIndex = songIndexWithinList(share,shares) + 1;// + 2;
  console.log('################################## TRACK TITLE WITHIN ENTIRE LIST:' + shares[chosenIndex]);
  var firstSongObject = document.querySelector('.songBrowserItem:nth-child(1)');
  var selectedRandomSongLink = document.querySelector('.songBrowserItem:nth-child('+chosenIndex+')');
  var selectedRandomSongObject = document.querySelector('.songBrowserItem:nth-child('+chosenIndex+')');
  //console.log('**************THIS IS THE CHOSEN INDEX: '+chosenIndex);
  //console.log('**************THIS IS THE CHOSEN SONG OBJECT: ');
  //console.log(selectedRandomSongObject);
  setShare(share);
  incrementListenCount();
  $(selectedRandomSongLink).click();
  removeAndAddSelectedClassToSelectedSong(selectedRandomSongObject);
 
  $('#personalVidList').animate({scrollTop: $(selectedRandomSongObject).offset().top - $(firstSongObject).offset().top}, 800);
  //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!FINISHED SHARE SELECTION FROM METHOD');
}  

function removeAndAddSelectedClassToSelectedSong(selectedSong) {
	 //CHANGE SELECTED CLASS
    $('.selected').removeClass('selected');
    $(selectedSong).addClass('selected');
    //END CHANGE SELECTED CLASS
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
   }

   function setCurrentSong(s) {
     //console.log('SETTING the current song to : '+ s.st);
     currentSong = s;
     currentID = s.sl.substring(s.sl.indexOf('v=')+2); //currentID is set directly in set current share
     Session.set('CS', s);
   }
   
   updateMySongs = function(sh) {
    //console.log('UPDATING my songs via songstate service');
    mySongs = sh;
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

   function getSongInHistoryAtIndex(tab, i) {
     if(tab === 'me')
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
     musicHistory.push(s);
     currentHistoryIndex = musicHistory.length - 1;
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
      //console.log('LENGTH of HISTORY: ' + musicHistory.length);
      while(c < musicHistory.length){
        if(s.sl === musicHistory[c].sl)
          return true;
        else
          c++;
      }
      return false;
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
   
   //method to update the auto error count for a video
   function updateAEC() {
     currentSong.aeCount += 1;
     /*$http.put('/aec/' + currentID + '/yt/' + currentSong.aeCount).
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

   function updateSongRating(userRating) {
     //console.log('#####################INSIDE UPDATE SONG RATING METHOD in song state service!!!!! : ' + userRating);
     /*$http.put('/rs/' + currentID + '/yt/' + userRating).
       success(function(data, status) {
         if(status === 200)
           console.log('this is the successful data: '+ data);
         else
           console.log('this is the non-200 data: ' + data);
       }).
       error(function(data, status) {
         console.log('ERROR!!!!!! this is the status: ' + status + ' and this is the data: ' + data);
     });*/
   }

   function getAvgSongRating() {
    //console.log('INSIDE GET AVERAGE SONG RATING method!!!!');
    //console.log('GETTING RATINGS FOR THIS SONG: ' + currentSong.sa + ' - ' + currentSong.st + ': ' + currentID);
    /*$http.get('/rs/yt/' +currentID).
    success(function(data, status, headers, config) {
      console.log('no issues with get average song rating method');
      //$scope.currentStatus = "songs loaded";
    }).
    error(function(data, status, headers, config) {
      console.log('ENCOUNTERED AN ERROR in client DB & FB method!!!!');
      console.log(data);
    });*/
   }

   function nextPressedSelectNewOrAdvanceThruHistory() {
    //console.log('this is the current history index - NEXT PRESSED:' + getCurrentHistoryIndex());
    setLastActionAsNext();

    if(isHistoryEmpty())
    {
      setReachedEndOfStream(false);
      //console.log("nothing in here so pushing the first random choice i got");

      initializeHistory();
      //selectNewRandomSongAndPush();
      return true;
    }
    else
    {
      if(getHistoryLength() < getSongsLength('me')-1)
        setReachedEndOfStream(false);
      else
        setReachedEndOfStream(true);

      if(atEndOfHistory())//it is at the end of the random linklist, then add the next choice
      {
        //console.log("at the end of linklist getting new random choice");
        //selectNewRandomSongAndPush();
        return true;
      }     
      else //if not at the end of the linklist then just move to the next one
      {
        //mixpanel.track("next song in history");
        incrementHistoryBy1();
        //selectShareFromControls(SongState.getHistory()[SongState.getCurrentHistoryIndex()],SongState.getSongs('me'));
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
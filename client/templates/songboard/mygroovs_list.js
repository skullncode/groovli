var fullSongList = {};
Session.set('playerStarted', false);

Template.mygroovsList.helpers({
  songs: function() {
  	//Session.set('personalSongList', Songs.find());
    fullSongList = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }});
    var songCollection = fullSongList.fetch();
    //songCollectionLength = songCollection.length;
    //console.log('#$#$#$#$$###$ SETTING Song LENGTH!!!!! ' + songCollection.length);
    Session.set('pSongsLength', songCollection.length);
    updateMySongs(songCollection, 'me');
    updatePlayableTabsIfNecessary();
    return fullSongList;
  },

  songsLoaded: function() {
    //console.log('CHECKING if SONGS ARE LOADED OR NOT!!!!!!!!');
    if(Session.get('pSongsLength') > 0 && Session.get('playerLoaded'))//&& !Session.get('playerStarted'))
      return true;
    else
      return false;
  },

  startPlayer: function() {
    if(!Session.get('playerStarted'))
    {
      //console.log('SONGS apparently loaded!!! STARTINGGGG PLAYERR!!!');
      initializePlayableTabs();
      $(".glyphicon-step-forward").click();
      Session.set('playerStarted', true);
      Session.set('playerLoaded', false);
      Session.set('activeTab', 'me');
    }
  },

  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'me') {
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  }
});

function updatePlayableTabsIfNecessary() {
  var temp = Session.get('playableTabs');
  if(!_.isUndefined(temp))
  {
    if(_.indexOf(temp, 'me') === -1)
    {
      if(Session.get('pSongsLength') > 0)
      {
        temp.push('me');
        Session.set('playableTabs',temp);
      }
    }
  }
}

function initializePlayableTabs()
{
  //console.log('INITIALIZING PLAYABLE TABS');
  Session.set('playableTabs', []);
  var temp = [];
  if(Session.get('pSongsLength') > 0)
  {
    temp.push('me');
    Session.set('playableTabs',temp);
  }

  if(Session.get('tastemakersSongsLength') > 0)
  {
    temp.push('friends');
    Session.set('playableTabs',temp);
  }

  if(Session.get('globalSongsLength') > 0)
  {
    temp.push('global');
    Session.set('playableTabs',temp);
  }
  
}

function animateListToCurrentlyPlayingSong() {
  //console.log('ANIMATING LIST WITHIN MY GROOVS TAB');
  //$('#songTabs a[href="#mygroovs"]').tab('show'); 
  var currentScrollOffset = $('#mygroovsList').scrollTop();//$("#personalVidList").scrollTop();
  $('#mygroovsList').animate({scrollTop: $(".thumbnail.songBrowserItem.selected").offset().top - 140 + currentScrollOffset}, 500);
  Session.set('animatedToSong', true);
  //$('#mygroovsList').animate({scrollTop: $(selectedRandomSongObject).offset().top - $(firstSongObject).offset().top}, 800);
}

function switchTabIfNotAlreadyFocusedForSelectedSong(songSourceTab){
  if(songSourceTab !== Session.get('activeTab'))
  {
    //console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'me')
    {
      //console.log('switching TABS from tastemakers list to my groovs');
      $('#songTabs a[href="#mygroovs"]').tab('show');
    }
  }
  else
    //console.log('not switching tabs as active tab and song source tab is the same!!!');

  //animateListToCurrentlyPlayingSong(); DOES NOT WORK AS DELAY IS REQUIRED
  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 500);
}


/*
function animateListToCurrentlyPlayingSong(currentShare) {
  console.log('ANIMATING to this song in the list: ');
  console.log(currentShare);
  var listName = '';
  if(currentShare !== null)
  {
    if(currentShare.sourceTab === 'me')
    {
      listName = '#mygroovsList';
    }
    else if(Session.get('activeTab') === 'friends')
    {
      listName = '#tastemakersList';
    }
  }
  else //if share is being triggered from youtube player then it will be the first tab
  {
    listName = '#mygroovsList';
  }

  if(currentShare.sourceTab === 'me')// && Session.get('activeTab') !== 'me')
    $('#songTabs a[href="#mygroovs"]').tab('show');
  else if(currentShare.sourceTab === 'friends')// && Session.get('activeTab') !== 'friends')
    $('#songTabs a[href="#tastemakers"]').tab('show');

  var currentScrollOffset = $(listName).scrollTop();//$("#personalVidList").scrollTop();
  $(listName).animate({ scrollTop: $(".thumbnail.shareBrowserItem.selected").offset().top - 140 + currentScrollOffset}, 500);
}*/
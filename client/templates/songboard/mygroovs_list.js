var fullSongList = {};
Session.set('playerStarted', false);

Template.mygroovsList.helpers({
  songs: function() {
    fullSongList = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }});
    var songCollection = fullSongList.fetch();
    //console.log('#$#$#$#$$###$ SETTING Song LENGTH!!!!! ' + songCollection.length);
    Session.set('pSongsLength', songCollection.length);
    updateMySongs(songCollection, 'me');
    updatePlayableTabsIfNecessary();
    return fullSongList;
  },

  songsLoaded: function() {
    //console.log('CHECKING if SONGS ARE LOADED OR NOT!!!!!!!!');
    //var anySongsloaded = (Session.get('pSongsLength') > 0 || Session.get('tastemakersSongsLength') > 0 || Session.get('globalSongsLength') > 0);
    var anySongsProcessedAndLoaded = (Session.get('mLen') > 0 || Session.get('fLen') > 0 || Session.get('gLen') > 0);
    //if(Session.get('pSongsLength') > 0 && Session.get('playerLoaded'))//&& !Session.get('playerStarted'))
    if(anySongsProcessedAndLoaded && Session.get('playerLoaded'))
      return true;
    else
      return false;
  },

  myGroovsExist: function() {
    if(Session.get('mLen') > 0)
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
      //Session.set('activeTab', 'me'); // removed this as auto scrolling wasn't happening on first song load!!!
    }
  },

  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    //console.log('ANIMATING TO CURRENTLY PLAYING SONG!!!!');
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'me') {
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  },
  deselectedTab: function(){
    if(_.isUndefined(_.findWhere(Session.get('selectedTabs'), 'me')))
      return 'dimmedTab';
    else
      return 'hideDimmer';
  }
});

function updatePlayableTabsIfNecessary() {
  var temp = Session.get('playableTabs');
  if(!_.isUndefined(temp))
  {
    if(_.indexOf(temp, 'me') === -1)
    {
      //if(Session.get('pSongsLength') > 0)
      if(Session.get('mLen') > 0)
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
  //if(Session.get('pSongsLength') > 0)
  if(Session.get('mLen') > 0)
  {
    temp.push('me');
    Session.set('playableTabs',temp);
  }

  //if(Session.get('tastemakersSongsLength') > 0)
  if(Session.get('fLen') > 0)
  {
    temp.push('friends');
    Session.set('playableTabs',temp);
  }

  //if(Session.get('globalSongsLength') > 0)
  if(Session.get('gLen') > 0)
  {
    temp.push('global');
    Session.set('playableTabs',temp);
  }

  Session.set('selectedTabs', temp); //based on playable tabs but determines what tabs have been chosen by the user  
}

function animateListToCurrentlyPlayingSong() {
  //console.log('animating this list to the currently playing song!!!!');
  //$('#songTabs a[href="#mygroovs"]').tab('show'); 
  var currentScrollOffset = $('#mygroovsList').scrollTop();//$("#personalVidList").scrollTop();
  if(!_.isUndefined($(".thumbnail.songBrowserItem.selected").offset()))
  {
    $('#mygroovsList').animate({scrollTop: $(".thumbnail.songBrowserItem.selected").offset().top - 140 + currentScrollOffset}, 500);
    Session.set('animatedToSong', true);
  }
  else
  {
    Session.set('animatedToSong', false);
  }
  //$('#mygroovsList').animate({scrollTop: $(selectedRandomSongObject).offset().top - $(firstSongObject).offset().top}, 800);
}

switchTabIfNotAlreadyFocusedForSelectedSong = function (songSourceTab){
  if(songSourceTab !== Session.get('activeTab'))
  {
    //console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'me')
    {
      //console.log('switching TABS from tastemakers list to my groovs');
      $('#songTabs a[href="#mygroovs"]').tab('show');
    }
  }
  
  //console.log('going to call list animation method now!');
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
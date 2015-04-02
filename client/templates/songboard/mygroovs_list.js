var fullSongList = {};
Session.set('playerStarted', false);

Template.mygroovsList.helpers({
  songs: function() {
  	//Session.set('personalSongList', Songs.find());
    fullSongList = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: { 'sharedBy.systemDate': -1 }});
    var songCollection = fullSongList.fetch();
    //songCollectionLength = songCollection.length;
    //console.log('#$#$#$#$$###$ SETTING Song LENGTH!!!!! ' + songCollection.length);
    Session.set('pSongsLength', songCollection.length);
    updateMySongs(songCollection, 'me');
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
      console.log('SONGS apparently loaded!!! STARTINGGGG PLAYERR!!!');
      $(".glyphicon-step-forward").click();
      Session.set('playerStarted', true);
      Session.set('playerLoaded', false);
      Session.set('activeTab', 'me');
    }
  },

  animateListToCurrentlyPlayingSong: function() {
    if(Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'me') {
      console.log('ANIMATING LIST WITHIN MY GROOVS TAB');
      $('#songTabs a[href="#mygroovs"]').tab('show'); 
      var currentScrollOffset = $('#mygroovsList').scrollTop();//$("#personalVidList").scrollTop();
      $('#mygroovsList').animate({scrollTop: $(".thumbnail.songBrowserItem.selected").offset().top - 140 + currentScrollOffset}, 500);
      //$('#mygroovsList').animate({scrollTop: $(selectedRandomSongObject).offset().top - $(firstSongObject).offset().top}, 800);
    }
  }

});

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
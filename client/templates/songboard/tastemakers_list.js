var tastemakerSongList = {};

Template.tastemakersList.helpers({
  songs: function() {
    //Session.set('personalSongList', Songs.find());
    //if(!_.isUndefined(Meteor.user().fbFriends) || !_.isUndefined(Meteor.user().tastemakers)) {
    if(!_.isUndefined(Meteor.user().tastemakers)) {
      var sel = getMongoSelectorForFriendSongs();
      tastemakerSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }});
      var songCollection = tastemakerSongList.fetch();
      songCollectionLength = songCollection.length;
      //console.log('THIS IS THE TASTMAKERS SONG LIST!!!!!!!!');
      //console.log(tastemakerSongList);
      Session.set('tastemakersSongsLength', songCollection.length);
      updateMySongs(songCollection, 'friends');
      updatePlayableTabsIfNecessary();
      return tastemakerSongList;
    }
    else
      return [];
  },

  songOfFriendsExist: function() {
    //console.log('CHECKING length of friends songs: ' + Session.get('tastemakersSongsLength'));
    if(Session.get('tastemakersSongsLength') > 0)
      return true;
    else
      return false;
  },

  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'friends') {
      //console.log('SWITCHING TAB IF NOT ALREADY FOCUSED CURRENTLY PLAYING SOnG!!!!');
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  }
});

function updatePlayableTabsIfNecessary() {
  var temp = Session.get('playableTabs');
  if(!_.isUndefined(temp))
  {
    if(_.indexOf(temp, 'friends') === -1)
    {
      if(Session.get('tastemakersSongsLength') > 0)
      {
        temp.push('friends');
        Session.set('playableTabs',temp);
      }
    }
  }
}

function getMongoSelectorForFriendSongs() {
  var counter = 0;
  var selector = "";
  var ender = "]}";
  var query = {};

  var userSelf = {
    "sharedBy.uid": Meteor.user().services.facebook.id
  };

  query["$nor"] = [];

  //first add self ID for exclusion from tastemaker list
  query["$nor"].push(userSelf);

  //if(Meteor.user().fbFriends.length > 1)
  if(Meteor.user().tastemakers.length > 1)
    query["$or"] = [];

  //while(counter < Meteor.user().fbFriends.length)
  while(counter < Meteor.user().tastemakers.length)
  {
    //if(Meteor.user().fbFriends.length === 1)
    if(Meteor.user().tastemakers.length === 1)
      query["sharedBy.uid"] = Meteor.user().tastemakers[counter].fbid;
    else
    {
      var additional = {
        "sharedBy.uid": Meteor.user().tastemakers[counter].fbid
      }
      query["$or"].push(additional);
    }

    counter++;
  }

  //console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED!!!!!');
  //console.log(query);

  return query;
}

function animateListToCurrentlyPlayingSong()
{
  //console.log('ANIMATING LIST WITHIN TASTEMAKERSSSSSSS TAB');
  //$('#songTabs a[href="#tastemakers"]').tab('show'); 
  var currentScrollOffset = $('#tastemakersList').scrollTop();//$("#personalVidList").scrollTop();
  $('#tastemakersList').animate({scrollTop: $(".thumbnail.tastemakersongItem.selected").offset().top - 140 + currentScrollOffset}, 500);
  //$('#tastemakersList').animate({scrollTop: $(selectedRandomSongObject).offset().top - $(firstSongObject).offset().top}, 800);
  Session.set('animatedToSong', true);
}


function switchTabIfNotAlreadyFocusedForSelectedSong(songSourceTab){
  if(songSourceTab !== Session.get('activeTab'))
  {
    //console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'friends')
    {
      //console.log('switching TABS from my groovs list to tastemakers');
      $('#songTabs a[href="#tastemakers"]').tab('show');
    }
  }
  else
    //console.log('not switching tabs as active tab and song source tab is the same!!!');

  //animateListToCurrentlyPlayingSong(); DOES NOT WORK AS DELAY IS REQUIRED
  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 500);
}
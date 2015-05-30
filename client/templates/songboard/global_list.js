var globalSongList = {};

Template.globalList.helpers({
  songs: function() {
    //Session.set('personalSongList', Songs.find());
    var sel = getMongoSelectorForGlobal();
    globalSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }, limit: 200});
    var songCollection = globalSongList.fetch();
    songCollectionLength = songCollection.length;
    //console.log('THIS IS THE GLOBAL SONG LIST!!!!!!!!');
    //console.log(globalSongList);
    Session.set('globalSongsLength', songCollection.length);
    updateMySongs(songCollection, 'global');
    updatePlayableTabsIfNecessary();
    return globalSongList;
  },

  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    //console.log('GOING TO SWITCH AND ANIMATE LIST NOW: ');
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'global') {
      //console.log('SWITCHING TAB IF NOT ALREADY FOCUSED CURRENTLY PLAYING SOnG!!!!');
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  },
  globalSongsExist: function() {
    //console.log('CHECKING length of friends songs: ' + Session.get('tastemakersSongsLength'));
    if(Session.get('globalSongsLength') > 0)
      return true;
    else
      return false;
  },
  deselectedTab: function(){
    if(_.isUndefined(_.findWhere(Session.get('selectedTabs'), 'global')))
      return 'dimmedTab';
    else
      return 'hideDimmer';
  }
});


function updatePlayableTabsIfNecessary() {
  var temp = Session.get('playableTabs');
  if(!_.isUndefined(temp))
  {
    if(_.indexOf(temp, 'global') === -1)
    {
      if(Session.get('globalSongsLength') > 0)
      {
        temp.push('global');
        Session.set('playableTabs',temp);
      }
    }
  }
}

function getMongoSelectorForGlobal() {
  var counter = 0;
  var selector = "";
  var ender = "]}";
  var query = {};

  var userSelf = {
    "sharedBy.uid": Meteor.user().services.facebook.id
  };

  query["$nor"] = [];

  //first add self ID for exclusion from Global list
  query["$nor"].push(userSelf);


  //if(!_.isUndefined(Meteor.user().fbFriends)) {
  if(!_.isUndefined(Meteor.user().tastemakers)) {
    //then add all of user's friends for exclusion from Global list
    //while(counter < Meteor.user().fbFriends.length)
    while(counter < Meteor.user().tastemakers.length)
    {
      //var unfollowedFriends = Meteor.user().unfollowedFriends;
      //if user is an unfollowed friend, i.e not showing up in the unfollowed friend lsit, then only they should be added to the NOR list for the global list
      //if((!_.isUndefined(unfollowedFriends) && _.isUndefined(_.findWhere(Meteor.user().unfollowedFriends, {fbid: Meteor.user().fbFriends[counter].fbid}))) || (_.isUndefined(unfollowedFriends)))
      //{
        var additional = {
          //"sharedBy.uid": Meteor.user().fbFriends[counter].fbid
          "sharedBy.uid": Meteor.user().tastemakers[counter].fbid
        };
        query["$nor"].push(additional);
      //}

      counter++;
    }
  }

  //console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED FOR THE GLOBAL LIST!!!!!');
  //console.log(query);

  return query;
}

function animateListToCurrentlyPlayingSong()
{
  //console.log('ANIMATING TO THe currentLY SELECTED SONG IN THE GLOBAL LIST!!!!');
  var currentScrollOffset = $('#globalList').scrollTop();//$("#personalVidList").scrollTop();
  $('#globalList').animate({scrollTop: $(".thumbnail.globalsongItem.selected").offset().top - 140 + currentScrollOffset}, 500);
  //$('#globalList').animate({scrollTop: $(selectedRandomSongObject).offset().top - $(firstSongObject).offset().top}, 800);
  Session.set('animatedToSong', true);
}


function switchTabIfNotAlreadyFocusedForSelectedSong(songSourceTab){
  if(songSourceTab !== Session.get('activeTab'))
  {
    console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'global')
    {
      console.log('switching TABS to global');
      $('#songTabs a[href="#global"]').tab('show');
    }
  }
  else
    //console.log('not switching tabs as active tab and song source tab is the same!!!');

  //animateListToCurrentlyPlayingSong(); DOES NOT WORK AS DELAY IS REQUIRED
  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 500);
}
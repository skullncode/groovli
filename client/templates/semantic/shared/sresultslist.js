Session.setDefault('usrchResults', []);

Template.sresultslist.helpers({
  songs: function() {
    //Session.set('personalSongList', Songs.find());
    //if(!_.isUndefined(Meteor.user().fbFriends) || !_.isUndefined(Meteor.user().tastemakers)) {
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().tastemakers) && !_.isEmpty(Session.get('usrchResults'))) {
      /*globalSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }, limit: 200});
      var songCollection = globalSongList.fetch();
      songCollectionLength = songCollection.length;
      //console.log('THIS IS THE TASTMAKERS SONG LIST!!!!!!!!');
      //console.log(tastemakerSongList);
      Session.set('gLen', songCollection.length);
      updateMySongs(songCollection, 'global');
      //initializePlayableTabs(); NOT required if publication is not being initially limited
      updatePlayableTabsIfNecessary();*/
      updateMySongs(Session.get('usrchResults'), 'search');
      return Session.get('usrchResults');
      //return globalSongList;
    }
    else
      return [];
  },
  searchResultsExist: function() {
    //console.log('CHECKING length of friends songs: ' + Session.get('tastemakersSongsLength'));
    if(Session.get('usrchResults').length > 0)
      return true;
    else
      return false;
  },
  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    //console.log('ANIMATING TO CURRENTLY PLAYING SONG!!!!');
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'search') {
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  },
  searchResultsLength: function() {
    return Session.get('usrchResults').length;
  },
  genresSelected: function() {
    if(!_.isEmpty(Session.get('selGens')))
      return true;
    else
      return false;
  }
});


function updatePlayableTabsIfNecessary() {
  var temp = Session.get('playableTabs');
  if(!_.isUndefined(temp))
  {
    if(_.indexOf(temp, 'global') === -1)
    {
      //if(Session.get('tastemakersSongsLength') > 0)
      if(Session.get('gLen') > 0)
      {
        temp.push('global');
        Session.set('playableTabs',temp);
      }
    }
  }
}

function animateListToCurrentlyPlayingSong()
{
  /*var songContainer = document.getElementById("srchresultList")
  var selSong = document.getElementsByClassName("searchresultItem selected");
  if(!_.isEmpty(selSong))
  {
    //songContainer.parentNode.scrollTop = selSong.item().offsetTop
    songContainer.scrollTop = selSong.item().offsetTop - 50;
    Session.set('animatedToSong', true);
  }*/
  if(!_.isUndefined($('.searchresultItem.selected')[0]))
  {
    $('#srchresultList').animate({ scrollTop: $('.searchresultItem.selected')[0].offsetTop - 50}, 500);
    Session.set('animatedToSong', true);
  }
}


function switchTabIfNotAlreadyFocusedForSelectedSong(songSourceTab){
  //console.log("checking for TAB SWITCHING NOW:");
  //console.log(songSourceTab);
  //console.log("ACTIVE TAB IS: ");
  //console.log(Session.get('activeTab'));
  if(songSourceTab !== Session.get('activeTab'))
  {
    //console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'search')
    {
      //console.log('switching TABS from my groovs list to tastemakers');
      //$('#songTabs a[href="#tastemakers"]').tab('show');
      $('#sresultsTabHeader').click();
    }
  }

  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 800);
}

/*Template.sresultslist.events({
    "click #btnClearSearchHistory": function (event) {
      remsrchrsltsfrmhistory();
      Session.set('usrchResults', []);
    }
});*/
Session.setDefault('existingSGCursor', 0);
Session.setDefault('sgSongsLoaded', false)
var pagedGlistSongsLoaded = new ReactiveVar(false);
var pagingLimit = 10;
//Session.setDefault('sgSongCursor', undefined)

Template.sglist.helpers({
  songs: function() {
    //Session.set('personalSongList', Songs.find());
    //if(!_.isUndefined(Meteor.user().fbFriends) || !_.isUndefined(Meteor.user().tastemakers)) {
      //removed check of TASTEMAKERS AS IT IS NOT RELEVANT IN THIS SECTION BUT IS REQUIRED IN THE GLOBAL MONGO SELECTOR
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user())) {
      var sel = getMongoSelectorForGlobal();
      globalSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }, limit: 200});
      var songCollection = globalSongList.fetch();
      songCollectionLength = songCollection.length;
      //console.log('THIS IS THE TASTMAKERS SONG LIST!!!!!!!!');
      //console.log(tastemakerSongList);
      Session.set('gLen', songCollection.length);
      updateMySongs(songCollection, 'global');
      //initializePlayableTabs(); NOT required if publication is not being initially limited
      //updatePlayableTabsIfNecessary();
      initializePlayableTabs();
      return globalSongList;
    }
    else
      return [];
  },
  globalSongsExist: function() {
    //console.log('CHECKING length of friends songs: ' + Session.get('tastemakersSongsLength'));
    if(Session.get('gLen') > 0)
      return true;
    else
      return false;
  },
  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    //console.log('ANIMATING TO CURRENTLY PLAYING SONG!!!!');
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'global') {
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  },
  sgLength: function() {
    return Session.get('gLen');
  },
  genresSelected: function() {
    if(!_.isEmpty(Session.get('selGens')))
      return true;
    else
      return false;
  },
  fixGSongCursor: function() {
    if(Session.get('existingSGCursor') > Session.get('sgSongCount')) //If page count is past total count then reset back to 0
    {
      //console.log("current cursor IS PAST song COUNT!!!");
      //var newCursorPosition = Session.get('tmSongCount') - pagingLimit
      Session.set('existingSGCursor', 0);
    }
  },
  pagedGlistSongsLoaded: function() {
    //console.log('############## this is the paged g list songs loaded reactive var value: ');
    //console.log(pagedGlistSongsLoaded.get());
    return pagedGlistSongsLoaded.get();
  },
  currentCursorPosition: function() {
      var x = Number(Session.get('existingSGCursor')) + 1;
      var y = Number(Session.get('existingSGCursor')) + pagingLimit;
      if(y > Number(Session.get('sgSongCount')))
        y = Number(Session.get('sgSongCount'));
      return  x + '-' + y;
  },
  sgSongCount: function() {
    return Session.get('sgSongCount');
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
  if(!_.isUndefined(Meteor.user().tastemakers) && !_.isEmpty(Meteor.user().tastemakers)) {
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
  /*var songContainer = document.getElementById("sgList")
  var selSong = document.getElementsByClassName("globalsongItem selected");
  if(!_.isEmpty(selSong))
  {
    //songContainer.parentNode.scrollTop = selSong.item().offsetTop
    songContainer.scrollTop = selSong.item().offsetTop - 50;
    Session.set('animatedToSong', true);
  }*/
  if(!_.isUndefined($('.globalsongItem.selected')[0]))
  {
    $('#sgList').animate({ scrollTop: $('.globalsongItem.selected')[0].offsetTop - 50}, 500);
    Session.set('animatedToSong', true);
  }
}


function switchTabIfNotAlreadyFocusedForSelectedSong(songSourceTab){
  if(songSourceTab !== Session.get('activeTab'))
  {
    //console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'global')
    {
      //console.log('switching TABS from my groovs list to tastemakers');
      //$('#songTabs a[href="#tastemakers"]').tab('show');
      $('#globalTabHeader').click()
    }
  }

  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 800);
}

/*BEGIN - PAGINATING RELATED CODE*/

Template.sglist.events({
    "click #previousSGS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get('existingSGCursor')) > (pagingLimit - 1))
      {
        //console.log('INSIDE if condition!!');
        pagedGlistSongsLoaded.set(false);
        Session.set('existingSGCursor', Number(Session.get('existingSGCursor')) - pagingLimit);
        iHist(true);
        resetPlayedLengthSpecificToTab('global');
      }
      else
      {
        toastr.info("Reached most recent page of Tastemakers; <br><br><b><i>try moving forward (->) and listening to older groovs of your friends!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
      mixpanel.track('paged backwards for global songs');
    },

    "click #nextSGS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get('existingSGCursor')) < Number(Session.get('sgSongCount') - pagingLimit))
      {
        //console.log('INSIDE if condition!!');
        pagedGlistSongsLoaded.set(false);
        Session.set('existingSGCursor', Number(Session.get('existingSGCursor')) + pagingLimit);
        iHist(true);
        resetPlayedLengthSpecificToTab('global');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached oldest page of Tastemakers; <br><br><b><i>try moving backward (<-) and listening to newer groovs of your friends!</i></b><br><br>");
      }
      mixpanel.track('paged forward for global songs');
    }
});

Template.sglist.onCreated(function() {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      if(_.isEmpty(Session.get('selGens')))
      {
        iHist(true);
        resetPlayedLengthSpecificToTab('global');
        var sgSelector = getMongoSelectorForGlobal();
        self.subscribe("counterForGlobal", sgSelector)
        Session.set('sgSongCount', Counts.get('songCountForGlobal'));
        //console.log('THIS IS THE global selector:');
        //console.log(sgSelector);
        self.subscribe('30songsForGlobal', sgSelector, Session.get('existingSGCursor'), {onReady: onSGSubReady});
      }
      else if(!_.isEmpty(Session.get('selGens')))//FOR NEW FLYLIST FILTER FEATUREEEE
      {
        iHist(true);
        resetPlayedLengthSpecificToTab('global');
        //console.log("**************************in Global list to refresh GENRE SPECIFIC subscription!!!!!");
        var sgSelector = getMongoSelectorForGlobal();
        Session.set('sgSongsLoaded', false);
        self.subscribe("counterForGlobalBasedOnGenreSelection", sgSelector, Session.get('selGens'))
        Session.set('sgSongCount', Counts.get('songCountForGlobalBasedOnGenreSelection'));
        self.subscribe('30songsForGlobalBasedOnGenreSelection', sgSelector, Session.get('selGens'), Session.get('existingSGCursor'), {onReady: onSGSubReady});
        //console.log("**************************in Global list - FINISHED refreshing GENRE SPECIFIC subscription!!!!!");
      }
    }
  });
});

function onSGSubReady()
{
  //console.log('*******************My GLOBAL grooooooovs subscription finally ready!!!!');
  //console.log('THIS IS THE SONG COUNT NOW: ');
  var sgSelector = getMongoSelectorForGlobal();  
  var result = Songs.find(sgSelector, {sort: { 'sharedBy.systemDate': -1 }}).count();
  pagedGlistSongsLoaded.set(true);
  //console.log(result);
  if(result > 0)
  {
    Session.set('sgSongsLoaded', true);
  }
  else
  {
    Session.set('sgSongsLoaded', false);
  }
}

/*END - PAGINATING RELATED CODE*/
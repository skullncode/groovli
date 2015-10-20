Session.setDefault('existingSGCursor', 0);
Session.setDefault('sgSongsLoaded', false)
//Session.setDefault('sgSongCursor', undefined)

Template.globalPage.helpers({
  songs: function() {
    //Session.set('personalSongList', Songs.find());
    //if(!_.isUndefined(Meteor.user().fbFriends) || !_.isUndefined(Meteor.user().tastemakers)) {
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().tastemakers)) {
      if(!_.isUndefined(Session.get('glSelyr')))
      {
        var sel = getMongoSelectorForGlobal();
        globalSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }, limit: 200});
        console.log("THIS IS HTE global selector $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$:");
        console.log(sel);
        var songCollection = globalSongList.fetch();
        songCollectionLength = songCollection.length;
        console.log('%%%%%%%%%%%^%^%^%^%^%^%^%^%^%%^%^THIS IS THE GLOBAL year based  SONG LIST!!!!!!!!');
        console.log(songCollection);
        Session.set('gLen', songCollection.length);
        updateMySongs(songCollection, 'global');
        initializePlayableTabs(); //NOT required if publication is not being initially limited
        updatePlayableTabsIfNecessary();
        return globalSongList;
      }
      else
      {
        return null;
      }
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
  startPlayer: function() {
    if(!Session.get('playerStarted') && Session.get('playerLoaded'))
    {
      $('.step.forward.icon').click();
      Session.set('playerStarted', true);
      Session.set('playerLoaded', false);
    }
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
      //var newCursorPosition = Session.get('tmSongCount') - 30
      Session.set('existingSGCursor', 0);
    }
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

getIDsToExcludeForGlobalFilter = function() {
  var idsToExclude = [];
  idsToExclude.push(Meteor.user().services.facebook.id)
  var counter = 0;
  if(!_.isUndefined(Meteor.user().tastemakers)) {
    //then add all of user's friends for exclusion from Global list
    //while(counter < Meteor.user().fbFriends.length)
    while(counter < Meteor.user().tastemakers.length)
    {
      idsToExclude.push(Meteor.user().tastemakers[counter].fbid);
      counter++;
    }
  }
  return idsToExclude;
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

Template.globalPage.events({
    "click #previousSGS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get('existingSGCursor')) > 29)
      {
        //console.log('INSIDE if condition!!');
        Session.set('existingSGCursor', Number(Session.get('existingSGCursor')) - 30);
        iHist(true);
        resetPlayedLengthSpecificToTab('global');
      }
      else
      {
        toastr.info("Reached most recent page of Global Groovs; <br><br><b><i>try moving forward (->) and listening to older groovs of the global community!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
      mixpanel.track('paged backwards for global page');
    },

    "click #nextSGS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get('existingSGCursor')) < Number(Session.get('sgSongCount') - 30))
      {
        //console.log('INSIDE if condition!!');
        Session.set('existingSGCursor', Number(Session.get('existingSGCursor')) + 30);
        iHist(true);
        resetPlayedLengthSpecificToTab('global');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached oldest page of Global Groovs; <br><br><b><i>try moving backward (<-) and listening to newer groovs of the global community!</i></b><br><br>");
      }
      mixpanel.track('paged forwards for global page');
    }
});

Template.globalPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      /*(_.isEmpty(Session.get('selGens')))
      {
        var sgSelector = getMongoSelectorForGlobal();
        self.subscribe("counterForGlobal", sgSelector)
        Session.set('sgSongCount', Counts.get('songCountForGlobal'));
        //console.log('THIS IS THE global selector:');
        //console.log(sgSelector);
        self.subscribe('30songsForGlobal', sgSelector, Session.get('existingSGCursor'), {onReady: onSGSubReady});
      }
      else if(!_.isEmpty(Session.get('selGens')))//FOR NEW FLYLIST FILTER FEATUREEEE
      {*/
      if(_.isUndefined(Session.get('glSelyr')) || _.isNumber(Session.get('glSelyr')))
      {
        console.log("**************************in Global list to refresh yr SPECIFIC subscription!!!!!");
        //var sgSelector = getMongoSelectorForGlobal();

        var excludedIDsForGlobalFilter = getIDsToExcludeForGlobalFilter();
        console.log("THESE IDS will be excluded from GLOBAL selector: ");
        console.log(excludedIDsForGlobalFilter);

        Session.set('sgSongsLoaded', false);

        //console.log("GONNA GETTTT SUBSS FOR GLOBAL PAGE with this year: ");
        //console.log("DR IS: ");
        //console.log(Session.get('gldr'));
        //console.log("SEL YEAR IS: ");
        //console.log(Session.get('glSelyr'));
        self.subscribe("counterForGlobalBasedOnYearSelection", excludedIDsForGlobalFilter, Session.get('glSelyr'), Session.get('selGens'))
        Session.set('sgSongCount', Counts.get('songCountForGlobalBasedOnYearSelection'));
        self.subscribe('30songsForGlobalBasedOnYearSelection', excludedIDsForGlobalFilter, Session.get('glSelyr'), Session.get('selGens'), Session.get('existingSGCursor'), {onReady: onSGSubReady});
        console.log("**************************in Global list - FINISHED refreshing year SPECIFIC subscription!!!!!");
      }
      //}
    }
  });
});

function onSGSubReady()
{
  console.log('*******************My GLOBAL grooooooovs subscription finally ready!!!!');
  console.log('THIS IS THE SONG COUNT NOW: ');
  var sgSelector = getMongoSelectorForGlobal();  
  var result = Songs.find(sgSelector, {sort: { 'sharedBy.systemDate': -1 }}).count();
  console.log(result);
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
Session.setDefault('existingTMCursor', 0);
Session.setDefault('tmSongsLoaded', false)

Session.setDefault('tmspRndmzd', false);
//Session.setDefault('tmSongCursor', undefined)
var pagedTMlistSongsLoaded = new ReactiveVar(false);
var pagingLimit = 10;


Template.stmlist.helpers({
  songs: function() {
    //Session.set('personalSongList', Songs.find());
    //if(!_.isUndefined(Meteor.user().fbFriends) || !_.isUndefined(Meteor.user().tastemakers)) {
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().tastemakers) && !_.isEmpty(Meteor.user().tastemakers)) 
    {
      if(Session.get('tmSongsLoaded') && _.isEmpty(Session.get('selGens')))
      {
        var sel = getMongoSelectorForFriendSongs();
        //tastemakerSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }});
        tastemakerSongList = Songs.find(sel, {sort: { 'sharedBy.systemDate': -1 }}); //ADDED limitation to reduce amount of data being used for tastemakers list
        var tmsCollection = tastemakerSongList.fetch();
        songCollectionLength = tmsCollection.length;
        //console.log('THIS IS THE TASTMAKERS SONG LIST!!!!!!!!');
        //console.log(tastemakerSongList);
        Session.set('fLen', tmsCollection.length);
        updateMySongs(tmsCollection, 'friends');
        //updatePlayableTabsIfNecessary();
        initializePlayableTabs();
        return tastemakerSongList;
      }
      else if(!_.isEmpty(Session.get('selGens')))//FOR NEW FLYLIST FILTER FEATUREEEE
      {
        //console.log("in TASTEMAKERS SOngs helper to return back genre selected SONGSSS!!!!");
        if(!_.isEmpty(Session.get('genl')))
        {
          var tstmkrsForSelGens = [];
          var sel = getMongoSelectorForFriendSongs();
          tastemakerSongList = Songs.find(sel,{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }});
          var tstmkrsForSelGens = tastemakerSongList.fetch();
          //console.log("THIS IS THE Sub list length for the Tastemakers tab:");
          //console.log(tstmkrsForSelGens.length);
          Session.set('fLen', tstmkrsForSelGens.length);
          updateMySongs(tstmkrsForSelGens, 'friends');
          initializePlayableTabs();
          return tstmkrsForSelGens;
        }
      }
      else
        return [];
    }
    else
      return [];
  },
  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    //console.log('ANIMATING TO CURRENTLY PLAYING SONG!!!!');
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'friends') {
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  },
  tmLength: function() {
    return Session.get('fLen');
  },
  tastemakerSongsExist: function() {
    if(Session.get('fLen') > 0)
      return true;
    else
      return false;
  },
  genresSelected: function() {
    if(!_.isEmpty(Session.get('selGens')))
      return true;
    else
      return false;
  },
  fixTMSongCursor: function() {
    if(Session.get('existingTMCursor') > Session.get('tmSongCount')) //If page count is past total count then reset back to 0
    {
      console.log("current cursor IS PAST song COUNT!!!");
      var newCursorPosition = Session.get('tmSongCount') - pagingLimit
      Session.set('existingTMCursor', 0);
    }
  },
  pagedTMlistSongsLoaded: function() {
    return pagedTMlistSongsLoaded.get();
  },
  currentCursorPosition: function() {
      var x = Number(Session.get('existingTMCursor')) + 1;
      var y = Number(Session.get('existingTMCursor')) + pagingLimit;
      if(y > Number(Session.get('tmSongCount')))
        y = Number(Session.get('tmSongCount'));
      return  x + '-' + y;
  },
  tmSongCount: function() {
    return Session.get('tmSongCount');
  },
  randomizeSongPageSelectionOnFirstLoad: function() {
    //console.log('THIS IS THE THE SONGS Loaded value ;');
    //console.log(pagedTMlistSongsLoaded.get());
    if(pagedTMlistSongsLoaded.get() && !Session.get('tmspRndmzd') && Session.get('tmSongCount') > 0)
    {
      //console.log('GONNA RANDOMIZE PAGE SELECTION NOWWWWWWWW!!!!');
      Session.set('tmspRndmzd', true);
      var x = _.range(0, Session.get('tmSongCount'), pagingLimit);
      var y = _.random(x.length-1)
      if(y > 0)
      {
        pagedTMlistSongsLoaded.set(false);
        Session.set('existingTMCursor', x[y]);
        iHist(true);
        resetPlayedLengthSpecificToTab('friends');
      }
      /*else
        console.log('randomly selected index is 0 so nothing has to be done!');*/
    }
  }
});


function updatePlayableTabsIfNecessary() {
  var temp = Session.get('playableTabs');
  if(!_.isUndefined(temp))
  {
    if(_.indexOf(temp, 'friends') === -1)
    {
      //if(Session.get('tastemakersSongsLength') > 0)
      if(Session.get('fLen') > 0)
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

  //console.log('##################################### this is the unfollowed friends length: ');
  //console.log(Meteor.user().unfollowedFriends);
  //if friends are unfollowed they need to be excluded from the tastemaker list also
  if(!_.isUndefined(Meteor.user().unfollowedFriends))
  {
    if(Meteor.user().unfollowedFriends.length > 0)
    {
      while(counter < Meteor.user().unfollowedFriends.length)
      {
        var unfollowedFriendObj = {
          "sharedBy.uid": Meteor.user().unfollowedFriends[counter].fbid
        };
        query["$nor"].push(unfollowedFriendObj);
        counter++;
      }
    }
  }

  counter = 0;
  //if(Meteor.user().fbFriends.length > 1)
  if(!_.isUndefined(Meteor.user().tastemakers) && !_.isEmpty(Meteor.user().tastemakers))
  {
    query["$or"] = [];
    if(Meteor.user().tastemakers.length > 0)
    {
      //while(counter < Meteor.user().fbFriends.length)
      while(counter < Meteor.user().tastemakers.length)
      {
        //if(Meteor.user().fbFriends.length === 1)
        //if(Meteor.user().tastemakers.length === 1)
          //query["sharedBy.uid"] = Meteor.user().tastemakers[counter].fbid;
        //else
        //{
          var additional = {
            "sharedBy.uid": Meteor.user().tastemakers[counter].fbid
          }
          query["$or"].push(additional);
        //}

        counter++;
      }
    }
  }
  else
  {
    //console.log('NOOOOOOOOOOOOOOOOOOO TASTEMAKERS FOR THIS USER:');
    query["$or"] = [];
    //use a fake user to simplify not selecting anyone if tastemakers is empty
    var fakeUser = {
      "sharedBy.uid": String('testid_willnever_betrue')
    }
    query["$or"].push(fakeUser);
  }

  //console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED!!!!!');
  //console.log(query);

  return query;
}

function animateListToCurrentlyPlayingSong()
{
  /*var songContainer = document.getElementById("tmList")
  var selSong = document.getElementsByClassName("tastemakersongItem selected");
  if(!_.isEmpty(selSong))
  {
    //songContainer.parentNode.scrollTop = selSong.item().offsetTop
    songContainer.scrollTop = selSong.item().offsetTop - 50;
    Session.set('animatedToSong', true);
  }*/
  if(!_.isUndefined($('.tastemakersongItem.selected')[0]))
  {
    $('#tmList').animate({ scrollTop: $('.tastemakersongItem.selected')[0].offsetTop - 50}, 500);
    Session.set('animatedToSong', true);
  }
}


function switchTabIfNotAlreadyFocusedForSelectedSong(songSourceTab){
  if(songSourceTab !== Session.get('activeTab'))
  {
    //console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'friends')
    {
      //console.log('switching TABS from my groovs list to tastemakers');
      //$('#songTabs a[href="#tastemakers"]').tab('show');
      $('#tastemakersTabHeader').click()
    }
  }

  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 800);
}

/*BEGIN - PAGINATING RELATED CODE*/

Template.stmlist.events({
    "click #previousTMS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get('existingTMCursor')) > (pagingLimit - 1))
      {
        //console.log('INSIDE if condition!!');
        pagedTMlistSongsLoaded.set(false);
        Session.set('existingTMCursor', Number(Session.get('existingTMCursor')) - pagingLimit);
        iHist(true);
        resetPlayedLengthSpecificToTab('friends');
      }
      else
      {
        toastr.info("Reached most recent page of Tastemakers; <br><br><b><i>try moving forward (->) and listening to older groovs of your friends!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
      mixpanel.track('paged backwards for tastemakers');
    },

    "click #nextTMS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get('existingTMCursor')) < Number(Session.get('tmSongCount') - pagingLimit))
      {
        //console.log('INSIDE if condition!!');
        pagedTMlistSongsLoaded.set(false);
        Session.set('existingTMCursor', Number(Session.get('existingTMCursor')) + pagingLimit);
        iHist(true);
        resetPlayedLengthSpecificToTab('friends');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached oldest page of Tastemakers; <br><br><b><i>try moving backward (<-) and listening to newer groovs of your friends!</i></b><br><br>");
      }
      mixpanel.track('paged forwards for tastemakers');
    }
});

Template.stmlist.onCreated(function() {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      if(_.isEmpty(Session.get('selGens')))
      {
        iHist(true);
        resetPlayedLengthSpecificToTab('friends');
        var stmSelector = getMongoSelectorForFriendSongs();
        self.subscribe("counterForTastemakers", stmSelector)
        Session.set('tmSongCount', Counts.get('songCountForTastemakers'));
        self.subscribe('30songsForTastemakers', stmSelector, Session.get('existingTMCursor'), {onReady: onTMSubReady});
      }
      else if(!_.isEmpty(Session.get('selGens')))//FOR NEW FLYLIST FILTER FEATUREEEE
      {
        //console.log("in TASTEMAKERS list to refresh subscription!!!!!");
        iHist(true);
        resetPlayedLengthSpecificToTab('friends');
        var stmSelector = getMongoSelectorForFriendSongs();
        Session.set('tmSongsLoaded', false);
        self.subscribe("counterForTastemakersBasedOnGenreSelection", stmSelector, Session.get('selGens'))
        Session.set('tmSongCount', Counts.get('songCountForTastemakersBasedOnGenreSelection'));
        self.subscribe('30songsForTastemakersBasedOnGenreSelection', stmSelector, Session.get('selGens'), Session.get('existingTMCursor'), {onReady: onTMSubReady});
      }
    }
  });
});

function onTMSubReady()
{
  //console.log('TM SUBS IS FINALLY DONE - tastemaker subscription finally ready!!!!');
  //console.log('THIS IS THE tastemaker SONG COUNT NOW: ');

  pagedTMlistSongsLoaded.set(true);
  //if(_.isEmpty(Session.get('selGens')))
    var stmSelector = getMongoSelectorForFriendSongs();  
  //else if(!_.isEmpty(Session.get('selGens')))
    //var stmSelector = getMongoSelectorForGenreBasedSelectionWithinFriendSongs();

  var result = Songs.find(stmSelector, {sort: { 'sharedBy.systemDate': -1 }}).count();
  //console.log(result);
  if(result > 0)
  {
    Session.set('tmSongsLoaded', true);
  }
  else
  {
    Session.set('tmSongsLoaded', false);
  }
}

/*END - PAGINATING RELATED CODE*/
var fullSongList = {};
Session.setDefault('playerStarted', false);

Session.setDefault('existingMGCursor', 0);
Session.setDefault('mgSongsLoaded', false)

Session.setDefault('mgspRndmzd', false);
//Session.setDefault('mgSongCursor', undefined)
var pagedMGlistSongsLoaded = new ReactiveVar(false);

var pagingLimit = 10;


Template.smglist.helpers({
  songs: function() {
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      if(Session.get('mgSongsLoaded') && _.isEmpty(Session.get('selGens')))
      {
        //console.log("SOMETHING CHANGED - REFRESHING SONG LIST!!!!");
        fullSongList = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }});
        var mgsCollection = fullSongList.fetch();
        //console.log('#$#$#$#$$###$ SETTING Song LENGTH!!!!! ' + mgsCollection.length);
        Session.set('mLen', mgsCollection.length);
        //console.log('GOING TO UPDATE MY SONGS with this song Collection: ');
        //console.log(mgsCollection);
        updateMySongs(mgsCollection, 'me');
        updatePlayableTabsIfNecessary();
        return fullSongList;
      }
      else if(!_.isEmpty(Session.get('selGens')))//FOR NEW FLYLIST FILTER FEATUREEEE
      {
        //console.log('GENRES have been selected now SO I CAN REFRESH THE SONG list FOR your GROOVS!!!!');
        if(!_.isEmpty(Session.get('genl')))
        {
          var myGroovsForSelGens = [];
          fullSongList = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }});
          var myGroovsForSelGens = fullSongList.fetch();
          //console.log("THIS IS THE Sub list length for the My Groovs tab:");
          //console.log(myGroovsForSelGens.length);
          Session.set('mLen', myGroovsForSelGens.length);
          updateMySongs(myGroovsForSelGens, 'me');

          if(Session.get('existingMGCursor') > Session.get('mgSongCount')) //If page count is past total count then reset back to 0
          {
            //console.log("current cursor IS PAST song COUNT!!!");
            var newCursorPosition = Session.get('mgSongCount') - pagingLimit

            if(newCursorPosition >= 0)
              Session.set('existingMGCursor', newCursorPosition);
            else
              Session.set('existingMGCursor', 0);
          }

          return myGroovsForSelGens;
        }
      }
      else
      {
        return null;
      }
    }
    else
    {
      return null;
    }
  },

  songsLoaded: function() {
    //console.log('CHECKING if SONGS ARE LOADED OR NOT!!!!!!!!');
    var anySongsProcessedAndLoaded = (Session.get('mLen') > 0 || Session.get('fLen') > 0 || Session.get('gLen') > 0);
    //console.log('HAS THE PLAYER LOADED OR NOT:');
    //console.log(Session.get('playerLoaded'));
    if(anySongsProcessedAndLoaded && Session.get('playerLoaded') && Session.get('mgspRndmzd') && Session.get('tmspRndmzd') && Session.get('sgspRndmzd') && pagedMGlistSongsLoaded.get() && Session.get('tmlsld') && Session.get('glsld'))
      return true;
    else
      return false;
  },

  mgSongsLoaded: function() {
    return Session.get('mgSongsLoaded');
  },

  myGroovsExist: function() {
    if(Session.get('mLen') > 0)
      return true;
    else
      return false;
  },
  fixMGSongCursor: function() {
    if(Session.get('existingMGCursor') > Session.get('mgSongCount')) //If page count is past total count then reset back to 0
    {
      //console.log("current cursor IS PAST song COUNT!!!");
      //var newCursorPosition = Session.get('tmSongCount') - pagingLimit
      Session.set('existingMGCursor', 0);
    }
  },
  startPlayer: function() {
    if(!Session.get('playerStarted') && Session.get('playerLoaded') && Session.get('mgspRndmzd') && pagedMGlistSongsLoaded.get())
    {
      //console.log('SONGS apparently loaded!!! STARTINGGGG PLAYERR!!!');
      initializePlayableTabs();
      //$(".glyphicon-step-forward").click();
      //$(".fa-step-forward").click();
      $('.step.forward.icon').click();
      Session.set('playerStarted', true);
      //Session.set('reachedEndofMyGroovs', false);
      Session.set('playerLoaded', false);
      //Session.set('activeTab', 'me'); // removed this as auto scrolling wasn't happening on first song load!!!
    }
  },

  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    //console.log('ANIMATING TO CURRENTLY PLAYING SONG!!!!');
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'me') {
      //console.log("##################gonna switch tabs and animate!!!!");
      //.log("############### THIS Is the selected song source tab: ");
      //console.log(Session.get('CS').sourceTab);
      switchTabToMyGroovsIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
      //console.log("############### caaaaaaalllleed tab switching method!!!!!");
    }
  },
  /*deselectedTab: function(){
    if(_.isUndefined(_.findWhere(Session.get('selectedTabs'), 'me')))
      return 'dimmedTab';
    else
      return 'hideDimmer';
  },*/
  mgLength: function() {
    return Session.get('mLen');
  },
  moreThan30SongsForGenList: function()
  {
    return (Session.get('mgSongCount') > pagingLimit);
  },
  flylistLoadedAndNoMatchingSongs: function() 
  {
    if(!_.isEmpty(Session.get('selGens')) && Session.get('mgSongCount') == 0)
    {
      return true;
    }
  },
  pagedMGlistSongsLoaded: function() {
    return pagedMGlistSongsLoaded.get();
  },
  currentCursorPosition: function() {
      var x = Number(Session.get('existingMGCursor')) + 1;
      var y = Number(Session.get('existingMGCursor')) + pagingLimit;
      if(y > Number(Session.get('mgSongCount')))
        y = Number(Session.get('mgSongCount'));
      return  x + '-' + y;
  },
  mgSongCount: function() {
    return Session.get('mgSongCount');
  },
  randomizeSongPageSelectionOnFirstLoad: function() {
    if(pagedMGlistSongsLoaded.get() && !Session.get('mgspRndmzd') && Session.get('mgSongCount') > 0)
    {
      //console.log('GONNA RANDOMIZE PAGE SELECTION NOWWWWWWWW!!!!');
      var x = _.range(0, Session.get('mgSongCount'), pagingLimit);
      var y = _.random(x.length-1)
      if(y > 0)
      {
        //console.log('GONNA RELOAD PAGE TO RANDOMIZE SELECTION');
        pagedMGlistSongsLoaded.set(false);
        Session.set('existingMGCursor', x[y]);
        iHist(true);
        resetPlayedLengthSpecificToTab('me');
      }
      //console.log('my groovs has been randomized now!!!');
      Session.set('mgspRndmzd', true);
    }
    else if(pagedMGlistSongsLoaded.get() && Session.get('mgSongCount') == 0)
    {
      //console.log('user does not have any personal groovs so randomization is done!!!!');
      Session.set('mgspRndmzd', true);
    }
  }
});

function checkToSeeIfPlayerHasStillNotStartedAndEncounteredAnError() {
    if(!Session.get('playerStarted'))
    {
      //console.log('player HAS STILL NOT STARTED!!! something is wrong!!!');
      location.reload();
    }
    else{
      //console.log('ALL IS FINE, player has started!!!!!');
      clearInterval(Session.get('pcintid'));
      //console.log('CLEARED INTERVAL!!! NO MORE CHECKS WILL BE DONE!!!');
    }
  }

//resetSession();

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

//function initializePlayableTabs()
initializePlayableTabs = function()
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

  //Session.set('selectedTabs', temp); //based on playable tabs but determines what tabs have been chosen by the user  
}

function animateListToCurrentlyPlayingSong() {
  //if(!_.isUndefined($('.songBrowserItem.selected')[0]))
  //{
    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$######################################$$$$$$$$$$$$$$$$$$$$$$$$$$$$ this is the selected song: ");
    //console.log($('.songBrowserItem.selected')[0]);
    if(!_.isUndefined($('.songBrowserItem.selected')[0]))
    {
      $('#mgList').animate({ scrollTop: $('.songBrowserItem.selected')[0].offsetTop - 50}, 500);
      Session.set('animatedToSong', true);
    }
  //}
}

switchTabToMyGroovsIfNotAlreadyFocusedForSelectedSong = function(songSourceTab){
  //console.log("in tab switchingngggggggggg method!!!!!!!!!!");
  if(songSourceTab !== Session.get('activeTab'))
  {
    //console.log('DECIDING WHAT TAB TO SWITCH TO!!!!');
    if(songSourceTab === 'me')
    {
      //console.log('switching TABS from tastemakers list to my groovs');
      //$('#songTabs a[href="#mygroovs"]').tab('show');
      $('#mygroovsTabHeader').click()
    }
  }
  
  //console.log('@@@@@@@@@@@@@@@@@@@@going to call list animation method now!');
  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 800);
}

/*BEGIN - PAGINATING RELATED CODE*/

Template.smglist.events({
    "click #previousMGS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get('existingMGCursor')) > (pagingLimit - 1))
      {
        //console.log('INSIDE if condition!!');
        pagedMGlistSongsLoaded.set(false);
        Session.set('existingMGCursor', Number(Session.get('existingMGCursor')) - pagingLimit);
        iHist(true);
        resetPlayedLengthSpecificToTab('all');
      }
      else
      {
        toastr.info("Reached most recent page of My Groovs; <br><br><b><i>try moving forward (->) and listening to your older groovs!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
      amplitude.logEvent('paged backwards for my groovs');
      ga('send', {
          hitType: 'event',
          eventCategory: 'songboard',
          eventAction: 'paged backwards for my groovs'
      });
    },

    "click #nextMGS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get('existingMGCursor')) < Number(Session.get('mgSongCount') - pagingLimit))
      {
        //console.log('INSIDE if condition!!');
        pagedMGlistSongsLoaded.set(false);
        Session.set('existingMGCursor', Number(Session.get('existingMGCursor')) + pagingLimit);
        iHist(true);
        resetPlayedLengthSpecificToTab('all');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached oldest page of My Groovs; <br><br><b><i>try moving backward (<-) and listening to your newer groovs!</i></b><br><br>");
      }
      amplitude.logEvent('paged forwards for my groovs');
      ga('send', {
          hitType: 'event',
          eventCategory: 'songboard',
          eventAction: 'paged forwards for my groovs'
      });
    }
});

Template.smglist.onRendered(function () {
  //console.log('RENDERING THE GLOBAL PAGE AGAIN!!!!');
  pagedMGlistSongsLoaded.set(false); //this enables the page to get randomized on EVERY SINGLE LOAD not just a page refresh
  Session.set('mgspRndmzd', false);
});

Template.smglist.onCreated(function() {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      //console.log("LOADING THE HOME mode!!!!!");
      //console.log('GONNA get subscription of songs for MY GROOVS with this cursor!');
      //console.log(Session.get('existingMGCursor'));
      //console.log('SONG length: ');
      //console.log(Songs.find().fetch().length);
      //self.subscribe('allSongsForSongBoard', Meteor.user().services.facebook.id);
      if(_.isEmpty(Session.get('selGens')))
      {
        iHist(true);
        resetPlayedLengthSpecificToTab('me');
        self.subscribe("counterForMyGroovs", Meteor.user().services.facebook.id);
        Session.set('mgSongCount', Counts.get('songCountForMyGroovs'));
        self.subscribe('30songsForMyGroovs', Meteor.user().services.facebook.id, Session.get('existingMGCursor'), {onReady: onMGSubReady});
      }
      else if(!_.isEmpty(Session.get('selGens')))//FOR NEW FLYLIST FILTER FEATUREEEE
      {
        iHist(true);
        resetPlayedLengthSpecificToTab('me');
        Session.set('mgSongsLoaded', false);
        //console.log('GENRE selection Changed gonna subscribe again!!!');
        self.subscribe("counterForMyGroovsBasedOnGenreSelection", Meteor.user().services.facebook.id, Session.get('selGens'))
        Session.set('mgSongCount', Counts.get('songCountForMyGroovsBasedOnGenreSelection'));
        self.subscribe('30songsForMyGroovsBasedOnGenreSelection', Meteor.user().services.facebook.id, Session.get('existingMGCursor'), Session.get('selGens'), {onReady: onMGSubReady});
      }
    }
  });
  var y = setInterval(checkToSeeIfPlayerHasStillNotStartedAndEncounteredAnError, 45000); //changed from 7 seconds check interval to 45 seconds check
  Session.set('pcintid', y); //player check interval id
});

function onMGSubReady()
{
  //console.log('My grooooooovs subscription finally ready!!!!');
  //console.log('THIS IS THE SONG COUNT NOW: ');
  pagedMGlistSongsLoaded.set(true);
  var result = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }}).count();
  //console.log(result);
  if(result > 0)
  {
    Session.set('mgSongsLoaded', true);
  }
  else
  {
    Session.set('mgSongsLoaded', false);
  }
}

/*END - PAGINATING RELATED CODE*/
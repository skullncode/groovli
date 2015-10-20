var fullSongListByYear = {};

Session.setDefault('existingMGCursor', 0);
Session.setDefault('mgSongsLoaded', false)
//Session.setDefault('mgSongCursor', undefined)


Template.mygroovList.helpers({
  songs: function() {
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      if(!_.isUndefined(Session.get('selyr')))//FOR NEW FLYLIST FILTER FEATUREEEE
      {
        console.log('%%%%%%%%%%%%%%%%%%%%%%YEAR has been selected now SO I CAN REFRESH THE SONG list FOR your GROOVS!!!!');
        /*if(!_.isEmpty(Session.get('genl')))
        {*/
          var myGroovsForSelYear = [];

          fullSongListByYear = Songs.find({'sharedBy.uid': String(Meteor.user().services.facebook.id)},{sort: {'sharedBy.uid': 1, 'sharedBy.systemDate': -1 }});
          var myGroovsForSelYear = fullSongListByYear.fetch();
          console.log("THIS IS THE Sub list BY YEARRRRRRR length for the My Groovs tab:");
          console.log(myGroovsForSelYear.length);
          Session.set('mLen', myGroovsForSelYear.length);
          updateMySongs(myGroovsForSelYear, 'me');
          initializeMyGroovTabs();
          updatePlayableTabsIfNecessary();
          
          return myGroovsForSelYear;
        //}
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
  totalMyGroovsLength: function() {
    return Session.get('mgSongCount');
  },

  songsLoaded: function() {
    //console.log('CHECKING if SONGS ARE LOADED OR NOT!!!!!!!!');
    var anySongsProcessedAndLoaded = (Session.get('mLen') > 0 || Session.get('fLen') > 0 || Session.get('gLen') > 0);
    //console.log('HAS THE PLAYER LOADED OR NOT:');
    //console.log(Session.get('playerLoaded'));
    if(anySongsProcessedAndLoaded && Session.get('playerLoaded'))
      return true;
    else
      return false;
  },
  fixMGSongCursor: function() {
    if(Session.get('existingMGCursor') > Session.get('mgSongCount')) //If page count is past total count then reset back to 0
    {
      //console.log("current cursor IS PAST song COUNT!!!");
      //var newCursorPosition = Session.get('tmSongCount') - 30
      Session.set('existingMGCursor', 0);
    }
  },
  mgSongsLoaded: function() {
    return Session.get('mgSongsLoaded');
  },

  myGroovsExist: function() {
    if(Session.get('mLen') > 0)
    {
      if(!Session.get('playerStarted'))
      {

      }
      return true;
    }
    else
      return false;
  },

  switchTabsAndAnimateListToCurrentlyPlayingSong: function() {
    //console.log('ANIMATING TO CURRENTLY PLAYING SONG!!!!');
    if(!Session.get('animatedToSong') && Session.get('CS') !== undefined && Session.get('CS').sourceTab === 'me') {
      switchTabIfNotAlreadyFocusedForSelectedSong(Session.get('CS').sourceTab);
    }
  },
  mgLength: function() {
    return Session.get('mLen');
  },
  startPlayer: function() {
    if(!Session.get('playerStarted') && Session.get('playerLoaded'))
    {
      $('.step.forward.icon').click();
      Session.set('playerStarted', true);
      Session.set('playerLoaded', false);
    }
  },
  nextText: function() 
  {
    if(Number(Session.get('existingMGCursor')) < Number(Session.get('mgSongCount') - 30))
    {
      return (Number(Session.get('existingMGCursor')) + 30) + " - " + (Number(Session.get('existingMGCursor')) + 60);
    }
    
    return '';
  }, 

  prevText: function() 
  {
    if(Number(Session.get('existingMGCursor')) < 30)
    {
      return '';
    }

    return (Number(Session.get('existingMGCursor')) - 30) + " - " + (Number(Session.get('existingMGCursor')));
  },
  moreThan30SongsForGenList: function()
  {
    return (Session.get('mgSongCount') > 30);
  },
  flylistLoadedAndNoMatchingSongs: function() 
  {
    if(!_.isEmpty(Session.get('selGens')) && Session.get('mgSongCount') == 0)
    {
      return true;
    }
  }
});

/*function checkToSeeIfPlayerHasStillNotStartedAndEncounteredAnError() {
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
  }*/


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

function initializeMyGroovTabs()
//initializePlayableTabs = function()
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
  //console.log('animating MGLIST to the currently playing song!!!!');
  //$('#songTabs a[href="#mygroovs"]').tab('show'); 
  /*var songContainer = document.getElementById("mgList")
  var selSong = document.getElementsByClassName("songBrowserItem selected");
  if(!_.isEmpty(selSong))
  {
    //songContainer.parentNode.scrollTop = selSong.item().offsetTop
    songContainer.scrollTop = selSong.item().offsetTop - 50;
    Session.set('animatedToSong', true);
  }*/
  /*var currentScrollOffset = $('#mgList').scrollTop();//$("#personalVidList").scrollTop();
  if(!_.isUndefined($(".thumbnail.songBrowserItem.selected").offset()))
  {
    $('#mgList').animate({scrollTop: $(".thumbnail.songBrowserItem.selected").offset().top - 200 + currentScrollOffset}, 500);
    Session.set('animatedToSong', true);
  }
  else
  {
    Session.set('animatedToSong', false);
  }*/
  if(!_.isUndefined($('.songBrowserItem.selected')[0]))
  {
    $('#mgList').animate({ scrollTop: $('.songBrowserItem.selected')[0].offsetTop - 50}, 500);
    Session.set('animatedToSong', true);
  }
}

function switchTabIfNotAlreadyFocusedForSelectedSong(songSourceTab){
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
  
  //console.log('going to call list animation method now!');
  Meteor.setTimeout(animateListToCurrentlyPlayingSong, 800);
}

/*BEGIN - PAGINATING RELATED CODE*/

Template.mygroovList.events({
    "click #previousMGS": function (event) {
      //console.log('CLICKED PREVIOUS button');
      if(Number(Session.get('existingMGCursor')) > 29)
      {
        //console.log('INSIDE if condition!!');
        Session.set('existingMGCursor', Number(Session.get('existingMGCursor')) - 30);
        iHist(true);
        resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        toastr.info("Reached most recent page of My Groovs; <br><br><b><i>try moving forward (->) and listening to your older groovs!</i></b><br><br>");
        //console.log('INSIDE else condition!!');
      }
      mixpanel.track('paged backwards for my groovs page');
    },

    "click #nextMGS": function (event) {
      //console.log('CLICKED next button');
      if(Number(Session.get('existingMGCursor')) < Number(Session.get('mgSongCount') - 30))
      {
        //console.log('INSIDE if condition!!');
        Session.set('existingMGCursor', Number(Session.get('existingMGCursor')) + 30);
        iHist(true);
        resetPlayedLengthSpecificToTab('me');
      }
      else
      {
        //console.log('INSIDE else condition!!');
        toastr.info("Reached oldest page of My Groovs; <br><br><b><i>try moving backward (<-) and listening to your newer groovs!</i></b><br><br>");
      }
      mixpanel.track('paged forwards for my groovs page');
    }
});

Template.mygroovList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    //var postId = FlowRouter.getParam('postId');
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      //console.log('GONNA get subscription of songs for MY GROOVS SPECIFIC to a YEAR with this cursor!');
      //console.log(Session.get('selyr'));
      //console.log(Session.get('existingMGCursor'));
      //console.log('SONG length: ');
      //console.log(Songs.find().fetch().length);
      //self.subscribe('allSongsForSongBoard', Meteor.user().services.facebook.id);
      if(_.isUndefined(Session.get('selyr')) || _.isNumber(Session.get('selyr')))
      {
        iHist(true);
        resetPlayedLengthSpecificToTab('me');
        Session.set('mgSongsLoaded', false);
        self.subscribe("counterForMyGroovsBasedOnYearSelection", Meteor.user().services.facebook.id, Session.get('selyr'), Session.get('selGens'))
        Session.set('mgSongCount', Counts.get('songCountForMyGroovsBasedOnYearSelection'));
        self.subscribe('30songsForMyGroovsBasedOnYearSelection', Meteor.user().services.facebook.id, Session.get('existingMGCursor'), Session.get('selyr'), Session.get('selGens'), {onReady: onMGSubReady});
      }
      else
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% did not get shit!");
    }
  });
  /*var y = setInterval(checkToSeeIfPlayerHasStillNotStartedAndEncounteredAnError, 7000);
  Session.set('pcintid', y); //player check interval id*/
});

function onMGSubReady()
{
  //console.log('My grooooooovs subscription finally ready!!!!');
  //console.log('THIS IS THE SONG COUNT NOW: ');
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
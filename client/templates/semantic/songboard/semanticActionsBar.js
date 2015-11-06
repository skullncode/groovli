//Session.setDefault("scmntsVisible", false);
var songCommentsVisible = new ReactiveVar(false);
var songMuted = new ReactiveVar(false);
var songVolume = new ReactiveVar(100);

Template.semanticActionsBar.helpers({
  songPlaying: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isEmpty(cs))
      return true;
    else
      return false;
  },
  commentCountForSong: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(Session.get(cs._id+"_commentsForSong")))
      return Session.get(cs._id+"_commentsForSong").length;
    else
      return 0;
  },
  commentsVisible: function() {
    return songCommentsVisible.get();
  },
  songLinkToBeShared: function() {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs))
      return cs.sl;
  },
  songMuted: function() {
    return songMuted.get();
  },
  playerVol: function() {
    return songVolume.get();
  }
});


Template.semanticActionsBar.events({
    'click #hideShowComments': function(event) {
        if($('#commentSection').is(":visible"))
        {
          //$('.fa-comments').removeClass('commentsShown');
          //$('.fa-comments').addClass('commentsNotShown');
          $('#commentSection').slideUp();
          mixpanel.track('hide comments for song');
          //Session.set("scmntsVisible", false);
          songCommentsVisible.set(false);
        }
        else
        {
          //$('.fa-comments').removeClass('commentsNotShown');
          //$('.fa-comments').addClass('commentsShown');
          $('#commentSection').slideDown();
          mixpanel.track('show comments for song');
          //Session.set("scmntsVisible", true);
          songCommentsVisible.set(true);
        }
    },
    'click #toggleMute': function(event) {
        songMuted.set(!songMuted.get());
        toggleMute();
        songVolume.set(getPlayerVol());
    },
    'click #increaseVolume': function(event) {
        if(songVolume.get() < 100) {
          setPlayerVol(getPlayerVol()+5);
          songVolume.set(getPlayerVol()+5);
          if(songVolume.get() > 0 && songMuted.get())
          {
            songMuted.set(false);
            toggleMute();
          }
        }
    },
    'click #decreaseVolume': function(event) {
        if(songVolume.get() > 0) {
          setPlayerVol(getPlayerVol()-5);
          songVolume.set(getPlayerVol()-5);
          if(songVolume.get() === 0 && !songMuted.get())
          {
            songMuted.set(true);
            toggleMute();
          }
        }
    },
    'click #shareFbButton': function(e) {
        //console.log('CLICKED share button!');
        var cs = Session.get('CS');
        if(cs !== undefined && cs !== {} && cs !== [])
        {
          //console.log(FB);
          FB.init({
                //appId      : '848177241914409', //dev app
                appId      : '1555076711418973', //prod app
                xfbml      : true,
                version    : 'v2.2'
              });
          FB.ui({
            method: 'share',
            href: cs.sl,
          },
          // callback
          function(response) {
            if (response && !response.error_code) {
              //console.log('THIs IS THE RESPONSE!')
              var sharedFBObject = {
                storyTitle: '',
                uid: Meteor.user().services.facebook.id,
                msgWithStory: 'shared from Groovli',
                storyLink: cs.sl,
                systemDate: new moment().unix()
              };
              /*Meteor.call('insertNewSong',sharedFBObject, 'FB', 'YOUTUBE');*/ // COMMENTED OUT NOW as song is automatically being pulled in via FB
              //updateSongSourceTabInHistory(sharedFBObject);
              mixpanel.track('shared song to FB');
              toastr.success('Song shared successfully!');
            } else {
              toastr.error('Error while sharing song!');
            }
          });
        }
        return true;
  }
});
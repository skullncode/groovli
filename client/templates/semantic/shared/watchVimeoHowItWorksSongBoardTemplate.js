Session.setDefault('vimOpen', false);

if (Meteor.isClient) {   
  Template.watchVimeoHowItWorksSongBoardTemplate.helpers({
    vimeoOpen: function() {
      playPauseVideoWhenVimeoClosesOpens();
      return Session.get('vimOpen');
    }
  });

  Template.watchVimeoHowItWorksSongBoardTemplate.events({
    "click #btnCloseVimeoDemoOnSongBoard": function (event) {
      if($('#watchVimeoHowItWorksContainer').is(":visible"))
      {
        $('#watchVimeoHowItWorksContainer').slideUp();
        $('html, body').animate({
            scrollTop: 0
        }, 300);
        amplitude.logEvent('CLOSE how it works video - SONGBOARD');
        ga('send', {
            hitType: 'event',
            eventCategory: 'songboard',
            eventAction: 'CLOSE how it works video - SONGBOARD'
          });
        Session.set('vimOpen', false);
      }
      return true;
    }
  });
}
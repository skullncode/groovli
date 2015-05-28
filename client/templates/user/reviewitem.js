if (Meteor.isClient) { 
  Template.reviewItem.helpers({
    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.sl.substring(this.sl.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
    },

    songItemTimeStamp: function() {
    	return new moment(this.timestamp).format('llll');    
  	},
    userProfileIsNotYou: function() {
      return Router.current().params._id !== Meteor.user()._id;
    },
    pendingIsInvalid: function() {
      return this.manualApproval === 'INVALID';
    },
    albumDeetsNotEmpty: function() {
      return (this.album !== undefined && this.album !== "");
    },
    sharedByDetailsForCurrentSong: function() {
      var shareCounter = 0;
      var globalIDsThatSharedThisSong = [];
      while(shareCounter < this.sharedBy.length)
      {
        //console.log('INSIDE SHARE COUNTER: for this length: '+this.sharedBy.length);
        //console.log('INSIDE FRIEND COUNTER: for this length: '+Meteor.user().fbFriends.length);
        //console.log('FRIEND COUNTER IS:  '+ friendCounter);
        globalIDsThatSharedThisSong.push({personID: this.sharedBy[shareCounter].uid, personName: this.sharedBy[shareCounter].uname, personTimestamp: new moment(this.sharedBy[shareCounter].systemDate * 1000).format('llll'), p_id: this.sharedBy[shareCounter]._id});
        
        shareCounter++;
      }
      return globalIDsThatSharedThisSong;
    },
    albumArt: function() {
      if(!_.isUndefined(this.LFMLargeAlbumArt) && this.LFMLargeAlbumArt.indexOf('http') === 0)
        return '<img src="'+this.LFMLargeAlbumArt+'" height="100px" width="100px">';
      else if((!_.isUndefined(this.LFMLargeAlbumArt) && this.LFMLargeAlbumArt === 'none') || _.isEmpty(this.LFMLargeAlbumArt))
        return '<p>ART UNAVAILABLE</p>';
      else
        return '<p>ART NOT RETRIEVED!</p>';
    }
  });

  function switchToFromEditMode(event, mode) {
    if(mode === 'to')
    {
      Session.set('reviewActive', true);
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songArtistLabel').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songTitleLabel').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songArtistValue').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songTitleValue').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#manualEdit').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#itunesCheck').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#lfmCheck').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#editLabels').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#editSection').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songValidityContainer').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#confirmUpdate').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#cancelUpdate').show();
    }
    else if(mode === 'from')
    {
      Session.set('reviewActive', false);
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songArtistLabel').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songTitleLabel').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songArtistValue').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songTitleValue').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#manualEdit').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#itunesCheck').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#lfmCheck').show();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#editLabels').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#editSection').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#songValidityContainer').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#confirmUpdate').hide();
      $(event.currentTarget.parentElement.parentElement.parentElement).find('#cancelUpdate').hide();
    }
  }

  function manualUpdateConfirm(event)
  {
    var originalArtist = $(event.currentTarget.parentElement.parentElement.parentElement).find('#songArtistValue').text();
    var originalTitle = $(event.currentTarget.parentElement.parentElement.parentElement).find('#songTitleValue').text();
    var newArtist = $(event.currentTarget.parentElement.parentElement.parentElement).find('#txtEditArtist').val();
    var newTitle = $(event.currentTarget.parentElement.parentElement.parentElement).find('#txtEditTitle').val();
    var songValidity = $(event.currentTarget.parentElement.parentElement.parentElement).find("#songValiditySelect").val()
    var checkItunes = $(event.currentTarget.parentElement.parentElement.parentElement).find("#songManualItunesCheck").val()
    var songLink = $(event.currentTarget.parentElement.parentElement.parentElement.parentElement).find("#externalSongLink").attr('href');
    var updatedLink = $(event.currentTarget.parentElement.parentElement.parentElement).find('#txtEditLink').val();

    console.log('ORIGINAL ARTiSt:');
    console.log(originalArtist);
    console.log('new ARTiSt:');
    console.log(newArtist);
    console.log('VALIDITY:');
    console.log(songValidity);
    console.log('CHECK ITUNES:');
    console.log(checkItunes);

    if(checkItunes === 'CHECK ITUNES')
      checkItunes = true;
    
    if(checkItunes === 'NO HOPE IN ITUNES' || songValidity === 'INVALID')
      checkItunes = false;

    console.log('THIS IS THE LInK SL: ' + songLink);

    if((originalArtist !== newArtist) || (originalTitle !== newTitle) || (songLink !== updatedLink) || songValidity === 'INVALID') //something has been updated
    {
      console.log('SOMETHING HAS BEEN UDPATED!!!!!');
      Meteor.call('updateSongWithManualApproval', songLink, newArtist, newTitle, updatedLink, songValidity, checkItunes);
      //if update is actually done refresh page
      location.reload();
    }
    else
    {
      console.log('NOTHING WAS UPDATED SO NO CHANGE WILL BE MADE!');
    }
    //updateSongWithManualApproval
  }

  Template.reviewItem.events({
    "click #manualEdit": function (event) {
      console.log('CLICKED MANUAL EDIT!!!!');
      console.log(event);
      if(!Session.get('reviewActive'))
      {        
        switchToFromEditMode(event, 'to');
      }
      return false;
    },

    "click #cancelUpdate": function (event) {
      if(Session.get('reviewActive'))
      {
        switchToFromEditMode(event, 'from');
      }
      return false;
    },
    "click #confirmUpdate": function (event) {
      if(Session.get('reviewActive'))
      {
        manualUpdateConfirm(event);
        switchToFromEditMode(event, 'from');
      }
      return false;
    },
    "click #itunesCheck": function (event) {
      console.log('clicked ITUNES CHECK BUTTON');
      var songLink = $(event.currentTarget.parentElement.parentElement.parentElement.parentElement).find("#externalSongLink").attr('href');
      Meteor.call('doManualItunesValidationForLink', songLink, 'YT');
      location.reload();
    },
    "click #lfmCheck": function (event) {
      console.log('clicked LastFM CHECK BUTTON');
      var songLink = $(event.currentTarget.parentElement.parentElement.parentElement.parentElement).find("#externalSongLink").attr('href');
      console.log('FOR THIS SONG: ');
      console.log(songLink);
      var originalArtist = $(event.currentTarget.parentElement.parentElement.parentElement).find('#songArtistValue').text();
      var originalTitle = $(event.currentTarget.parentElement.parentElement.parentElement).find('#songTitleValue').text();
      console.log('and with this Artist: ' + originalArtist);
      console.log('and with this song title: ' + originalTitle);
      Meteor.call('doManualLFMValidationForLink', songLink, originalArtist, originalTitle, 'YT');
      location.reload();
    }

  });
}
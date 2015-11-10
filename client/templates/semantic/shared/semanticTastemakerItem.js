if (Meteor.isClient) {   
  Template.semanticTastemakerItem.helpers({
    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.sl.substring(this.sl.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
    },
    hasAlbumArt: function() {
      if(!_.isUndefined(this.iTunesLargeAlbumArt))
      {
        //console.log('SOnG has album art also!!');
        if(this.iTunesLargeAlbumArt.indexOf('http') >= 0)
          return true;
        else
          return false;
      }
    },
    albumArtForCurrentSong:function() {
      if(!_.isUndefined(this))
      {
        if(!_.isUndefined(this.iTunesLargeAlbumArt))
          return this.iTunesLargeAlbumArt;
      }
    },
    songItemTimeStamp: function() {
      var counter = 0;
      while(counter < this.sharedBy.length)
      {
        //return new Date(this.sharedBy[counter].systemDate * 1000).toUTCString();
        if(this.sharedBy[counter].uid === Meteor.user().services.facebook.id)
          return new moment(this.sharedBy[counter].systemDate * 1000).format('llll');
        else
          counter++;
      }      
    },
    trimmedArtist: function() {
      return this.sa.substring(0,40);
    },
    trimmedTitle: function() {
      return this.st.substring(0,35);
    },
    songDataSource: function() {
      if(this.dataSource === 'FB')
        return '<i class="fa fa-facebook-official"></i>';
    },
    songType: function() {
      if(this.type === 'YOUTUBE')
        return '<i class="youtube icon"></i>';
    },
    songItemMessageForUser: function() {
      var counter = 0;
      while(counter < this.sharedBy.length)
      {
        //return new Date(this.sharedBy[counter].systemDate * 1000).toUTCString();
        if(this.sharedBy[counter].uid === Meteor.user().services.facebook.id)
          return this.sharedBy[counter].msg;
        else
          counter++;
      }
    },
    songDataSource: function() {
      if(this.dataSource === 'FB')
        return '<i class="fa fa-facebook-official"></i>';
    },
    songItemTimeStamp: function() {
      var counter = 0;
      while(counter < this.sharedBy.length)
      {
        //return new Date(this.sharedBy[counter].systemDate * 1000).toUTCString();
        if(this.sharedBy[counter].uid === Meteor.user().services.facebook.id)
          return new moment(this.sharedBy[counter].systemDate * 1000).format('llll');
        else
          counter++;
      }
    },
    /*friendsSharedByForTastemakerItem: function() {
      var shareCounter = 0;
      var friendCounter = 0;
      var friendIDsThatSharedThisSong = [];
      while(shareCounter < this.sharedBy.length)
      {
        console.log('INSIDE SHARE COUNTER: for this length: '+this.sharedBy.length);
        console.log('this is the sharedBy object: ');
        console.log(this.sharedBy);
        //while(friendCounter < Meteor.user().fbFriends.length)
        while(friendCounter < Meteor.user().tastemakers.length)
        {
          console.log('INSIDE FRIEND COUNTER: for this length: '+Meteor.user().fbFriends.length);
          console.log('FRIEND COUNTER IS:  '+ friendCounter);
          console.log('this is the tastemakers object: ');
          console.log(Meteor.user().tastemakers);
          if(!_.isUndefined(Meteor.user().tastemakers[friendCounter]))
          {
            if(this.sharedBy[shareCounter].uid === Meteor.user().tastemakers[friendCounter].fbid)
              friendIDsThatSharedThisSong.push({friendID: Meteor.user().tastemakers[friendCounter].fbid, friendName: Meteor.user().tastemakers[friendCounter].name, friendTimestamp: new moment(this.sharedBy[shareCounter].systemDate * 1000).format('llll')});
          }
        
          friendCounter++;
        }
        shareCounter++;
      }
      return friendIDsThatSharedThisSong;
    }*/
    friendsSharedByForTastemakerItem: function() {
      var shareCounter = 0;
      var friendIDsThatSharedThisSong = [];
      while(shareCounter < this.sharedBy.length)
      {
        //that means this shared by DETAIL is for one of the current user's tastemakers
        var foundFriend = _.findWhere(Meteor.user().tastemakers, {fbid: this.sharedBy[shareCounter].uid});
        if(!_.isUndefined(foundFriend))
        {
          friendIDsThatSharedThisSong.push({friendID: foundFriend.fbid, friendName: foundFriend.name, friendTimestamp: new moment(this.sharedBy[shareCounter].systemDate * 1000).format('llll')});
        }
        
        shareCounter++;
      }
      return friendIDsThatSharedThisSong;
    }
  });

  Template.semanticTastemakerItem.events({
    "click a.tastemakersongItem": function (event) {
      // This function is called when the new task form is submitted
      Session.set('animatedToSong', false);
      Session.set('activeTab', 'friends');
      //console.log('THIS IS THE CLICK EVENT for the SONG ITEM!!!!!!');
      //console.log(event);
      //var text = event.target.text.value;
      var ytLinkID=  this.sl.substring(this.sl.indexOf("v=")+2);
      //console.log(ytLinkID);
      //console.log('CALLING JQUERY EVENT CLASS METHOD!!!!');
      removeAndAddSelectedClassToSelectedSong(event.currentTarget);
      //loadVideoById(ytLinkID, this);
      loadVideoById(ytLinkID);
      //makeMuutCommentRelatedUpdates(ytLinkID, this);
      setShareByLinkID(ytLinkID);
      // Prevent default form submit
      return false;
    }
  });
}

function removeAndAddSelectedClassToSelectedSong(selectedSong) {
  //console.log('setting CLASS using JQUERY event!!!!!!!')
  //console.log(selectedSong);
   //CHANGE SELECTED CLASS
  $('.ui.fluid.card.green.selected').removeClass('green selected');
  $(selectedSong).addClass('green selected');
  //END CHANGE SELECTED CLASS

  //take care of now playing overlay
  /*$('.nowplaying').removeClass('nowplaying');
  $('.selected .overlay').addClass('nowplaying');*/
}
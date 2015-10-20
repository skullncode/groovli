if (Meteor.isClient) {   
  Template.yearSpecificSongItem.helpers({
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
      var beginYr = new Date('January 1, '+ String(Session.get('selyr'))).getTime()/1000;
      var endYr = new Date('January 1, '+ String(Session.get('selyr')+1)).getTime()/1000;
      /*console.log('this is the begin YR: ');
      console.log(beginYr);
      console.log('this is the END YR: ');
      console.log(endYr);*/
      
      while(counter < this.sharedBy.length)
      {
        /*console.log('this is the '+counter+' timestamp: ');
        console.log(this.sharedBy[counter].systemDate);*/
        //return new Date(this.sharedBy[counter].systemDate * 1000).toUTCString();
         //&& this.sharedBy[counter].systemDate >= beginYr && this.sharedBy[counter].systemDate < endYr
        if((this.sharedBy[counter].uid === Meteor.user().services.facebook.id) && (this.sharedBy[counter].systemDate >= beginYr && this.sharedBy[counter].systemDate < endYr))
        {
          return new moment(this.sharedBy[counter].systemDate * 1000).format('llll');
          //return this.sharedBy[counter].systemDate;
        }
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
    howManyOthers: function() {
      var counter = 0;
      var otherCounter = 0;
      while(counter < this.sharedBy.length)
      {
        if(this.sharedBy[counter].uid !== Meteor.user().services.facebook.id)
        {
          otherCounter++
        }
        counter++;
      }
      if(otherCounter === 1)
        return '& 1 other person, '
      else if (otherCounter > 1)
        return '& ' + otherCounter + ' other people, '
      else
        return '';
    }
  });

  Template.yearSpecificSongItem.events({
    "click a.songBrowserItem": function (event) {
      // This function is called when the new task form is submitted
      Session.set('animatedToSong', false);
      Session.set('activeTab', 'me');
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
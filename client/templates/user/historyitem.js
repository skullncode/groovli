if (Meteor.isClient) { 
  Template.historyItem.helpers({
    songArtist: function() {
      return this.songObj.sa;
    },

    songTitle: function() {
      return this.songObj.st;
    },

    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.songObj.sl.substring(this.songObj.sl.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
    },

    songItemTimeStamp: function() {
    	return new moment(this.timestamp).format('llll');    
  	},
    howManyOthers: function() {
      var counter = 0;
      var otherCounter = 0;
      var otherList = [];
      while(counter < this.songObj.sharedBy.length)
      {
        if(this.songObj.sharedBy[counter]._id !== Meteor.user()._id)
        {
          if(_.isUndefined(_.findWhere(otherList, this.songObj.sharedBy[counter].name)))
          {
            otherList.push(this.songObj.sharedBy[counter].name);
            otherCounter++
          }
        }
        counter++;
      }
      if(otherCounter === 1)
        return '1 other person also listened to it'
      else if (otherCounter > 1)
        return otherCounter + ' other people also listened to it '
      else
        return '';
    },

    userProfileIsNotYou: function() {
      var x = Router.current().params._id !== Meteor.user()._id;
      console.log('USER PROFILE IS NOT YOU???? : ' + x);
      return Router.current().params._id !== Meteor.user()._id;
    }
  });

  Template.historyItem.events({
    "click a.songBrowserItem": function (event) {
      // This function is called when the new task form is submitted
      Session.set('animatedToSong', false);
      //console.log('THIS IS THE CLICK EVENT for the SONG ITEM!!!!!!');
      //console.log(event);
      //var text = event.target.text.value;
      var ytLinkID=  this.sl.substring(this.sl.indexOf("v=")+2);
      //console.log(ytLinkID);
      //console.log('CALLING JQUERY EVENT CLASS METHOD!!!!');
      removeAndAddSelectedClassToSelectedSong(event.currentTarget);
      loadVideoById(ytLinkID, this);
      makeMuutCommentRelatedUpdates(ytLinkID, this);
      setShareByLinkID(ytLinkID);
      // Prevent default form submit
      return false;
    }
  });
}
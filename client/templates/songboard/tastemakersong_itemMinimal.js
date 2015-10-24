if (Meteor.isClient) {   
  Template.tastemakersongItemMinimal.helpers({
    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.sl.substring(this.sl.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
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
    friendsSharedByForTastemakerItem: function() {
      var shareCounter = 0;
      var friendCounter = 0;
      var friendIDsThatSharedThisSong = [];
      while(shareCounter < this.sharedBy.length)
      {
        //console.log('INSIDE SHARE COUNTER: for this length: '+this.sharedBy.length);
        //while(friendCounter < Meteor.user().fbFriends.length)
        while(friendCounter < Meteor.user().tastemakers.length)
        {
          //console.log('INSIDE FRIEND COUNTER: for this length: '+Meteor.user().fbFriends.length);
          //console.log('FRIEND COUNTER IS:  '+ friendCounter);
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
    }
  });

  Template.tastemakersongItemMinimal.events({
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
      loadVideoById(ytLinkID, this);
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
  $('.selected').removeClass('selected');
  $(selectedSong).addClass('selected');
  //END CHANGE SELECTED CLASS

  //take care of now playing overlay
  $('.nowplaying').removeClass('nowplaying');
  $('.selected .overlay').addClass('nowplaying');
}
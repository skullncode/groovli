if (Meteor.isClient) {   
  Template.songItem.helpers({
    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.sl.substring(this.sl.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
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
    }
  });

  Template.songItem.events({
    "click a.songBrowserItem": function (event) {
      // This function is called when the new task form is submitted

      //var text = event.target.text.value;
      var ytLinkID=  this.sl.substring(this.sl.indexOf("v=")+2);
      //console.log(ytLinkID);
      loadVideoById(ytLinkID, this);
      makeMuutCommentRelatedUpdates(ytLinkID, this);
      setShareByLinkID(ytLinkID);
      // Prevent default form submit
      return false;
    }
  });
}
if (Meteor.isClient) { 
  Template.songItem.helpers({
    songArtist: function() {
      if(!_.isUndefined(this.songObj) && !_.isUndefined(this.songObj.sa))
      {
        return this.songObj.sa;
      }
      else
      {
        return "";
      }
    },
    albumDeetsNotEmpty: function() {
      //return (this.songObj.album !== undefined && this.songObj.album !== "");
      return (!_.isUndefined(this.songObj) && !_.isUndefined(this.songObj.album));
    },

    songTitle: function() {
      if(!_.isUndefined(this.songObj) && !_.isUndefined(this.songObj.st))
      {
        return this.songObj.st;
      }
      else
      {
        return "";
      }
    },

    songIsCover: function() {
      if(!_.isUndefined(this.songObj) && !_.isUndefined(this.songObj.cover))
      {
        return this.songObj.cover;
      }
    },

    formattedReleaseDate: function() {
      var formattedDate = new Date(this.songObj.releaseDate).getFullYear();
      return formattedDate;
    },

    sharedByHowMany: function() {
      if(!_.isUndefined(this.songObj) && !_.isUndefined(this.songObj.sharedBy))
      {
        var counter = 0;
        var otherCounter = 0;
        var selfCounter = 0;
        while(counter < this.songObj.sharedBy.length)
        {
          if(this.songObj.sharedBy[counter].uid !== Meteor.user().services.facebook.id)
          {
            otherCounter++
          }
          else
          {
            selfCounter++;
          }
          counter++;
        }
        var selfText = '';
        var otherText = '';
        if(selfCounter > 0)
        {
          selfText = 'shared by you';
        }

        if(selfCounter > 0 && otherCounter === 1)
        {
          otherText = ' & ' + otherCounter + ' other person';
        }
        else if(selfCounter > 0 && otherCounter > 1)
        {
          otherText = ' & ' + otherCounter + ' other people';
        }
        else if(selfCounter === 0 && otherCounter === 1)
        {
          otherText = 'shared by ' + otherCounter + ' person'; 
        }
        else if(selfCounter === 0 && otherCounter > 1)
        {
          otherText = 'shared by ' + otherCounter + ' other people'; 
        }

        return selfText + otherText;
      }
      else 
        return '';
    },

    youtubeThumbnail: function() {
      if(!_.isUndefined(this.songObj) && !_.isUndefined(this.songObj.sl))
      {
        var ytImgLink = 'https://i.ytimg.com/vi/' + this.songObj.sl.substring(this.songObj.sl.indexOf("v=")+2) + '/default.jpg';
        return ytImgLink;
      }
      else{
        return 'https://i.ytimg.com/vi/default.jpg';
      }
    },

    songItemTimeStamp: function() {
    	return new moment(this.timestamp).format('llll');    
  	},
    userProfileIsNotYou: function() {
      var x = Router.current().params._id !== Meteor.user()._id;
      //console.log('USER PROFILE IS NOT YOU???? : ' + x);
      return Router.current().params._id !== Meteor.user()._id;
    }
  });
}
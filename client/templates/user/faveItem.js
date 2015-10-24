if (Meteor.isClient) { 
  Template.faveItem.helpers({
    songArtist: function() {
      if(!_.isUndefined(this) && !_.isUndefined(this.sa))
      {
        return this.sa;
      }
      else
      {
        return "";
      }
    },

    songTitle: function() {
      if(!_.isUndefined(this) && !_.isUndefined(this.st))
      {
        return this.st;
      }
      else
      {
        return "";
      }
    },

    youtubeThumbnail: function() {
      //console.log('THIS IS THE this object:');
      //console.log(this);
      if(!_.isUndefined(this) && !_.isUndefined(this.referenceId))
      {
        var ytImgLink = 'https://i.ytimg.com/vi/' + this.referenceId.substring(this.referenceId.indexOf("v=")+2) + '/default.jpg';
        return ytImgLink;
      }
      else{
        return 'https://i.ytimg.com/vi/default.jpg';
      }
    },

    faveTimeStamp: function() {
    	return new moment(this.favoritedAt).format('llll');    
  	},
    userProfileIsNotYou: function() {
      var x = Router.current().params._id !== Meteor.user()._id;
      //console.log('USER PROFILE IS NOT YOU???? : ' + x);
      return Router.current().params._id !== Meteor.user()._id;
    }
  });
}
if (Meteor.isClient) { 
  Template.mutualItem.helpers({
    songArtist: function() {
      return this.sa;
    },

    songTitle: function() {
      return this.st;
    },

    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.sl.substring(this.sl.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
    },

    mutualID: function() {
      return this._id;
    },

    mutualUserThumbnail: function() {
      var fbProfThumb = 'http://graph.facebook.com/'+this.soc_id+'/picture?type=large';
      return fbProfThumb;
    },

    mutualUserSocialName: function() {
      return this.soc_name;
    },

    songItemTimeStamp: function() {
    	return new moment(this.timestamp).format('llll');    
  	},
    userProfileIsNotYou: function() {
      var x = Router.current().params._id !== Meteor.user()._id;
      //console.log('USER PROFILE IS NOT YOU???? : ' + x);
      return Router.current().params._id !== Meteor.user()._id;
    },

    listenCount: function() {
      return this.listenCount;
    },

    listenCountMoreThanOne: function() {
      return this.listenCount > 1;
    }
  });
}
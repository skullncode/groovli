 Template.faveSongItem.helpers({
  youtubeThumbnail: function() {
    var ytImgLink = 'https://i.ytimg.com/vi/' + this.referenceId.substring(this.referenceId.indexOf("v=")+2) + '/default.jpg';
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
  trimmedArtist: function() {
    return this.sa.substring(0,40);
  },
  trimmedTitle: function() {
    return this.st.substring(0,35);
  },
  faveTimeStamp: function() {
      return new moment(this.favoritedAt).format('llll');    
  },
  userProfileIsNotYou: function() {
    if(!_.isUndefined(FlowRouter.current().params._id) && !_.isUndefined(Meteor.user()))
      return FlowRouter.current().params._id !== Meteor.user()._id;
  }
});
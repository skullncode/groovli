
Template.topSongItem.helpers({
    youtubeThumbnail: function() {
      if(!_.isUndefined(this) && !_.isUndefined(this._id))
      {
        var ytImgLink = 'https://i.ytimg.com/vi/' + this._id.substring(this._id.indexOf("v=")+2) + '/default.jpg';
        return ytImgLink;
      }
    },

    songItemTimeStamp: function() {
    	return new moment(this.timestamp).format('llll');    
  	}
});
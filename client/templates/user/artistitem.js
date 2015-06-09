Template.artistItem.helpers({
  artistImage: function() {
    if(!_.isUndefined(this.largeImage['#text']) && !_.isEmpty(this.largeImage['#text']))
      return '<img src="'+this.largeImage['#text']+'" style="float:left;width:50%;height:50%;">';
    else
      return '<h4>NO ARTIST IMAGE AVAILABLE</h4>';
  },
  genres: function() {
    return this.genres;
  },
  albumArt: function() {
    if(!_.isUndefined(this.LFMLargeAlbumArt) && this.LFMLargeAlbumArt.indexOf('http') === 0)
      return '<img src="'+this.LFMLargeAlbumArt+'" height="100px" width="100px">';
    else if((!_.isUndefined(this.LFMLargeAlbumArt) && this.LFMLargeAlbumArt === 'none') || _.isEmpty(this.LFMLargeAlbumArt))
      return '<p>ART UNAVAILABLE</p>';
    else
      return '<p>ART NOT RETRIEVED!</p>';
  }
});

Template.artistItem.events({
  'click #deleteArtistEntry': function(e) {
    console.log('CLICKED delete artist button:');
    var artName = $(e.currentTarget.parentElement.parentElement).find('#artistName').text()
    //console.log(e);
    var artistObjectDiv = $(e.currentTarget.parentElement.parentElement);
    //console.log('FOR THIS ARTIST: ' + artName);
    //console.log(artistObjectDiv);
    Meteor.call('deleteArtistEntry', artName, function(error,result){
        if(error){
          return toastr.error(error.reason);
        }
        else{
            // do something with result
          $(artistObjectDiv).hide();
          return toastr.success('Successfully deleted data for: ' + artName);
        };
    });
  }
});
Template.genreItem.helpers({
  artistImage: function() {
    if(!_.isUndefined(this.largeImage['#text']) && !_.isEmpty(this.largeImage['#text']))
      return '<img src="'+this.largeImage['#text']+'" style="float:left;width:50%;height:50%;">';
    else
      return '<h4>NO ARTIST IMAGE AVAILABLE</h4>';
  }
});

Template.genreItem.events({
  'click #deleteGenreEntry': function(e) {
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
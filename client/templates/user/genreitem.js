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
    var genreName = $(e.currentTarget.parentElement.parentElement).find('#genreName').text()
    //console.log(e);
    var genreObjectDiv = $(e.currentTarget.parentElement.parentElement);
    //console.log('FOR THIS ARTIST: ' + artName);
    //console.log(artistObjectDiv);
    Meteor.call('deleteGenreEntry', genreName, function(error,result){
        if(error){
          return toastr.error(error.reason);
        }
        else{
            // do something with result
          $(genreObjectDiv).hide();
          return toastr.success('Successfully deleted entry for: ' + genreName);
        };
    });
  }
});
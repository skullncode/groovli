Template.semanticGenreItem.events({
  'click #deleteGenreEntry': function(e) {
    console.log('CLICKED delete genre button:');
    var genreName = $(e.currentTarget.parentElement.parentElement).find('#genreName').text()
    console.log(e);
    var genreObjectDiv = $(e.currentTarget.parentElement.parentElement);
    //console.log('FOR THIS ARTIST: ' + artName);
    //console.log(artistObjectDiv);
    Meteor.call('deleteGenreEntry', genreName, function(error,result){
        if(error){
          return toastr.error(error.reason);
        }
        else{
            // do something with result
          //$(genreObjectDiv).hide();
          return toastr.success('Successfully deleted entry for: ' + genreName);
        };
    });
  }
});
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
  },

  'click #deleteGenreForArtist': function(e) {
    console.log('CLICKED delete genre for artist button:');
    //console.log(e);
    var artName = $(e.currentTarget.parentElement.parentElement).find('#artistName').text()
    var genreName = $(e.currentTarget).text();
    if(_.isEmpty(genreName))
      genreName = null;
    var genreObjectDiv = $(e.currentTarget)[0];
    console.log('FOR THIS GENRE: ' + genreName);
    //console.log(genreObjectDiv);
    var genreDeleteCheck = confirm("Are you sure you want to delete the '"+genreName+"' genre for this artist?");
    if(genreDeleteCheck == true) {
        console.log('WILL GO AHEAD AND DELETE THE '+genreName+' FOR THis ARTIST!');
        Meteor.call('deleteGenreForArtist', genreName, artName, function(error,result){
            if(error){
              return toastr.error(error.reason);
            }
            else{
                // do something with result
              $(genreObjectDiv).hide();
              return toastr.success('Successfully deleted the "'+genreName+'" genre for the artist: ' + artName);
            };
        });
    } 
    else {
      console.log('NOTHING WILL BE DELETED!!!');
    }
  },

  'click #addGenreForArtist': function(e) {
    //console.log(e);
    var artName = $(e.currentTarget.parentElement.parentElement).find('#artistName').text();
    //console.log('CLICKED add genre for artist button: ' + artName);
    var genreName = $(e.currentTarget.parentElement).find('#txtNewGenreForArtist').val();
    var genreObjectDiv = $(e.currentTarget)[0];
    //console.log('FOR THIS GENRE: ' + genreName);
    //console.log(genreObjectDiv);
    Meteor.call('addGenreForArtist', genreName, artName, function(error,result){
            if(error){
              return toastr.error(error.reason);
            }
            else{
                // do something with result
              //$(genreObjectDiv).hide();
              $(e.currentTarget.parentElement).find('#txtNewGenreForArtist').val('');
              location.reload();
            };
        });
  }
});
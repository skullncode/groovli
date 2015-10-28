var editingSong = new ReactiveVar(false);
var currentlyEditingID = new ReactiveVar(null);
var currentlyEditingObject = new ReactiveVar(null);

Template.semanticArtistItem.helpers({
    artistImage: function() {
    if(!_.isUndefined(this.largeImage['#text']) && !_.isEmpty(this.largeImage['#text']))
      return '<img src="'+this.largeImage['#text']+'" class="image">';
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
    },
    currentlyEditingSong: function() {
    	return editingSong.get();
    },
    thisItemIsCurrentlyBeingEdited: function(){
    	return this._id == currentlyEditingID.get();
    }
});

Template.semanticArtistItem.events({
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
    //console.log('CLICKED delete genre for artist button:');
    //console.log(e);
    var artName = $(e.currentTarget.parentElement.parentElement).find('#artistName').text()
    var genreName = $(e.currentTarget).text();
    if(_.isEmpty(genreName))
      genreName = null;
    var genreObjectDiv = $(e.currentTarget)[0];
    //console.log('FOR THIS GENRE: ' + genreName);
    //console.log(genreObjectDiv);
    var genreDeleteCheck = confirm("Are you sure you want to delete the '"+genreName+"' genre for this artist?");
    if(genreDeleteCheck == true) {
        //console.log('WILL GO AHEAD AND DELETE THE '+genreName+' FOR THis ARTIST!'+artName);
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
    console.log(e);
    var artName = $(e.currentTarget.parentElement.parentElement.parentElement).find('#artistName').text();
    console.log('CLICKED add genre for artist button: ' + artName);
    var genreName = $(e.currentTarget.parentElement).find('#txtNewGenreForArtist').val();
    var genreObjectDiv = $(e.currentTarget)[0];
    console.log('FOR THIS GENRE: ' + genreName);
    //console.log(genreObjectDiv);
    Meteor.call('addGenreForArtist', genreName, artName, function(error,result){
            if(error){
              return toastr.error(error.reason);
            }
            else{
                // do something with result
              //$(genreObjectDiv).hide();
              $(e.currentTarget.parentElement).find('#txtNewGenreForArtist').val('');
              //location.reload();
            };
        });
  }
});


function enableValidityDropdown(){
  //console.log('enabled dropdown now!');
  $('#songManualItunesCheck').dropdown();
  $('#songValiditySelect').dropdown();  
}

function setupEditingOptionsBasedOnSongData(){
  console.log('GONNA SET OPTIONS FOR DROPDOWN; this is the validity: ');
  console.log(currentlyEditingObject.get());
  if(currentlyEditingObject.get().iTunesValid == "VALID" || currentlyEditingObject.get().manualApproval == "VALID")
  {
    console.log('SETTING DROPDOWN to valid!!!!');
    $("#songValiditySelect").val("VALID");
  }
  else if(currentlyEditingObject.get().iTunesValid == "INVALID" || currentlyEditingObject.get().iTunesValid == "PENDING")
  {
    console.log('SETTING DROPDOWN to invalid!!!!');
    $("#songValiditySelect").val("INVALID");
  }

  if(currentlyEditingObject.get().live)
  {
    $("#check_live").prop('checked', true);
  }

  if(currentlyEditingObject.get().mashup)
  {
    $("#check_mashup").prop('checked', true);
  }

  if(currentlyEditingObject.get().remix)
  {
    $("#check_remix").prop('checked', true);
  }


}

function manualUpdateConfirm(event)
  {
    var originalSongLink = $('#originalSongLink').val();
    var updatedLink = $('#editedSongLink').val();
    var originalArtist = $('#originalSongArtist').val();
    var originalTitle = $('#originalSongTitle').val();
    var newArtist = $('#editedSongArtist').val();
    var newTitle = $('#editedSongTitle').val();
    var checkItunes = $("#songManualItunesCheck").val();    
    var songValidity = $("#songValiditySelect").val();
    var isSongLive = $('#check_live').is(':checked');
    var isSongCover = $('#check_cover').is(':checked');
    var isSongRemix = $('#check_remix').is(':checked');
    var isSongMashup = $('#check_mashup').is(':checked');
    
    var originalCoveredBy = $('#originalCoveredBy').val();
    var coveredBy = $('#txtEditCoveredBy').val();
    var originalRemixedBy = $('#originalRemixedBy').val();
    var remixedBy = $('#txtEditRemixedBy').val();

    console.log('ORIGINAL ARTiSt:');
    console.log(originalArtist);
    console.log('new ARTiSt:');
    console.log(newArtist);
    console.log('VALIDITY:');
    console.log(songValidity);
    console.log('song is LIVE:');
    console.log(isSongLive);

    //console.log(event);

    //console.log('song is covered by:' + coveredBy);
    //console.log('song is cover:' + isSongCover);
    //console.log('song is mashup:' + isSongMashup);
    
    if(checkItunes === 'CHECK ITUNES')
      checkItunes = true;
    
    if(checkItunes === 'NO HOPE IN ITUNES' || songValidity === 'INVALID')
      checkItunes = false;

    console.log('CHECK ITUNES:');
    console.log(checkItunes);

    console.log('THIS IS THE LInK SL: ' + updatedLink);

    if((originalArtist !== newArtist) || (originalTitle !== newTitle) || (originalSongLink !== updatedLink) || songValidity === 'INVALID' || isSongLive || !isSongLive || (originalCoveredBy !== coveredBy) || (originalRemixedBy !== remixedBy)) //something has been updated
    {
      console.log('SOMETHING HAS BEEN UDPATED!!!!!');
      Meteor.call('updateSongWithManualApproval', originalSongLink, newArtist, newTitle, updatedLink, songValidity, checkItunes, isSongLive, isSongCover, isSongMashup, coveredBy, isSongRemix, remixedBy);
    }
    else
    {
      console.log('NOTHING WAS UPDATED SO NO CHANGE WILL BE MADE!');
    }
    //updateSongWithManualApproval
  }
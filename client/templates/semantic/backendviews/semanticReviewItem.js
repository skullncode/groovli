var editingSong = new ReactiveVar(false);
var currentlyEditingID = new ReactiveVar(null);
var currentlyEditingObject = new ReactiveVar(null);

Template.semanticReviewItem.helpers({
    youtubeThumbnail: function() {
      var ytImgLink = 'https://i.ytimg.com/vi/' + this.sl.substring(this.sl.indexOf("v=")+2) + '/default.jpg';
      return ytImgLink;
    },

    songItemTimeStamp: function() {
    	return new moment(this.timestamp).format('llll');    
  	},
    iTunesValid: function() {
    	if(!_.isUndefined(this.iTunesValid))
    	{
    		if(this.iTunesValid == 'VALID')
    			return true;
    		else
    			return false;
    	}
    	else
    		return false;
    },
    LFMValid: function() {
    	if(!_.isUndefined(this.LFMValid))
    	{
    		if(this.LFMValid == 'VALID')
    			return true;
    		else
    			return false;
    	}
    	else
    		return false;
    },
    manuallyValid: function() {
    	if(!_.isUndefined(this.manualApproval))
    	{
    		if(this.manualApproval == 'VALID')
    			return true;
    		else
    			return false;
    	}
    	else
    		return false;
    },
    pendingIsInvalid: function() {
      return this.manualApproval === 'INVALID';
    },
    albumDeetsNotEmpty: function() {
      return (this.album !== undefined && this.album !== "");
    },
    isSongLive: function() {
      if(!_.isUndefined(this.live))
      {
        return this.live;
      }
      else
        return false;
    },
    isSongCover: function() {
      if(!_.isUndefined(this.cover))
      {
        return this.cover;
      }
      else
        return false;
    },
    isSongMashup: function() {
      if(!_.isUndefined(this.mashup))
      {
        return this.mashup;
      }
      else
        return false;
    },
    isSongRemix: function() {
      if(!_.isUndefined(this.remix))
      {
        return this.remix;
      }
      else
        return false;
    },
    sharedByDetailsForCurrentSong: function() {
      var shareCounter = 0;
      var globalIDsThatSharedThisSong = [];
      while(shareCounter < this.sharedBy.length)
      {
        //console.log('INSIDE SHARE COUNTER: for this length: '+this.sharedBy.length);
        //console.log('INSIDE FRIEND COUNTER: for this length: '+Meteor.user().fbFriends.length);
        //console.log('FRIEND COUNTER IS:  '+ friendCounter);
        globalIDsThatSharedThisSong.push({personID: this.sharedBy[shareCounter].uid, personName: this.sharedBy[shareCounter].uname, personTimestamp: new moment(this.sharedBy[shareCounter].systemDate * 1000).format('llll'), p_id: this.sharedBy[shareCounter]._id});
        
        shareCounter++;
      }
      return globalIDsThatSharedThisSong;
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

Template.semanticReviewItem.events({
    "click #editSong": function(event) {
      if(!editingSong.get())
      {
        editingSong.set(true);
        currentlyEditingID.set(this._id);
        currentlyEditingObject.set(this);

        Meteor.setTimeout(setupEditingOptionsBasedOnSongData, 50);
        //console.log('THIS IS THE ITUNES VALID VALUE: ');
        //console.log(this.iTunesValid);
        //$(event.currentTarget).prop('text','Editing');
      }
    },
    "click #cancelEditing": function(event) {
      editingSong.set(false);
      currentlyEditingID.set(null);
    },
    "click #deleteSong": function(event) {
      if(window.confirm("Are you sure you want to delete this song?"))
      {
        Meteor.call('manuallyDeleteSong', currentlyEditingID.get(), function(error, result) {
          if(error)
          {
            console.log('Encountered error while trying to delete song');
            console.log(error);
          }
          else
          {
            console.log('Successfully deleted song!');
            editingSong.set(false);
            currentlyEditingID.set(null);
            alert('Successfully deleted song!');
          }
        });
      }
      else
      {
        //alert("you chose to cancel!");
      }
    },    
    "click #updateSong": function(event){
      manualUpdateConfirm(event);
      editingSong.set(false);
      currentlyEditingID.set(null);
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
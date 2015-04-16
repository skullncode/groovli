Template.songDetails.helpers({
  songPlaying: function() {
  	var cs = Session.get('CS');
    if(cs !== undefined && cs !== {} && cs !== [])
  		return true;
  	else
  		return false;
  },

  currentSong: function() {
  	var cs = Session.get('CS');
    if(cs !== undefined && cs !== {} && cs !== [])
		return cs;
  },
  
  artistTrackAreNotSame: function() {
  	//console.log('CHECKING for artist and track!!');
  	var cs = Session.get('CS');
  	if(cs.sa !== cs.st)
  	{
  		//console.log('ARTIST and track are not the same');
  		return true;
  	}
  	else
  		return false;
  },

  albumDeetsNotEmpty: function() {
  	var cs = Session.get('CS');
    //console.log('CHECKING if ALBUM deets are empty!!');
    //console.log('ALBUM IS ['+cs.album+']');
  	return (cs.album !== undefined);
  },

  formattedReleaseDate: function() {
  	var cs = Session.get('CS');
  	var formattedDate = new Date(cs.releaseDate).getFullYear();
  	return formattedDate;
  },

  currentSongHasEncounteredAnError: function() {
    //console.log('INSIDE THE SONG ERROR CHECKER!!!!');
    if(Session.get('SongErroneous'))
    {
      console.log('THERE IS AN ACTUAL ERROR WITH THE SONG!!!!');
    }
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
    }
});
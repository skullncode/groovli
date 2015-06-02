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
  	return (cs.album !== undefined && cs.album !== "");
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

Template.songDetails.events({
  'click #shareButton': function(e) {
    //console.log('CLICKED share button!');
    var cs = Session.get('CS');
    if(cs !== undefined && cs !== {} && cs !== [])
    {
      //console.log(FB);
      FB.init({
            //appId      : '848177241914409', //dev app
            appId      : '1555076711418973', //prod app
            xfbml      : true,
            version    : 'v2.2'
          });
      FB.ui({
        method: 'share',
        href: cs.sl,
      },
      // callback
      function(response) {
        if (response && !response.error_code) {
          //console.log('THIs IS THE RESPONSE!')
          var sharedFBObject = {
            storyTitle: '',
            uid: Meteor.user().services.facebook.id,
            msgWithStory: 'shared from Groovli',
            storyLink: cs.sl,
            systemDate: new moment().unix()
          };
          Meteor.call('insertNewSong',sharedFBObject, 'FB', 'YOUTUBE');
          updateSongSourceTabInHistory(sharedFBObject);
          toastr.success('Song shared successfully!');
        } else {
          toastr.error('Error while sharing song!');
        }
      });
    }
    return true;
  }
});
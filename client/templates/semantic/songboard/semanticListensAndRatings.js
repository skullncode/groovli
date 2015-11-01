Template.semanticListensAndRatings.helpers({
  songPlaying: function() {
    var cs = Session.get('CS');
    Meteor.setTimeout(enableRater, 3000);
    if(cs !== undefined && cs !== {} && cs !== [])
      return true;
    else
      return false;
  },

  currentSong: function() {
    var cs = Session.get('CS');
    resetSongRatingsWhenSongChanges();
    if(cs !== undefined && cs !== {} && cs !== [])
      return cs;
  },
  
  totalListensForThisSong: function() {
    var cs = Session.get('CS');
    var currentID = cs.sl.substring(cs.sl.indexOf('v=')+2);
    var lc = Session.get(currentID+'_lc');
    return lc;
  },

  listenCountMoreThanOne: function() {
    var lc = Session.get(currentID+'_lc');
    if(lc > 1 || lc == 0)
      return true;
    else
      return false;
  },

  averageRating: function() {
    calculateRatingForThisSong();
    return Session.get('avgrtg');
  },

  numberOfRaters: function() {
    return Session.get('numrtrs');
  },

  ratingsExist: function() {
    //return (Session.get('numrtrs') > 0);
    return Ratings.find().count() > 0;
  },
  getPersonalRating: function() {
    getPersonalRatingForSong(Session.get('CS'));
  }
});

Template.semanticListensAndRatings.onRendered(function () {
  //$('.ui.rating').rating();
});

Template.semanticListensAndRatings.onCreated(function () {
  var self = this;

  // Use self.subscribe with the data context reactively
  self.autorun(function () {
    var cs = Session.get('CS');
    if(!_.isUndefined(cs) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services))
    {
      var sid = cs.sl.substring(cs.sl.indexOf("v=")+2);
      self.subscribe("ratingsForCurrentSong", cs.type, sid, {onReady: onSubFinishedCalcRatingForThisSong});
      

      self.subscribe("listensForCurrentSong", cs.type, sid)
      Session.set(sid+'_lc', Counts.get('listenCounterForYTSong'));
    }
  });
});

function onSubFinishedCalcRatingForThisSong() {
  calculateRatingForThisSong();
  getPersonalRatingForSong(Session.get('CS'));
}

function calculateRatingForThisSong() {
  //console.log('CALCULATING RATING FOR THISSSSSSSSSSSSSSSS SONG!!!!');
  var cs = Session.get('CS');
  var avg = 0;

  var currentRatings = Ratings.find({"sl":cs.sl}).fetch();
  if(_.isEmpty(currentRatings))
  {
    Session.set('numrtrs', 0);
    Session.set('avgrtg', 0);
  }
  else
  {
    //console.log('calculating average rating as there are: ' + result.length + '');
    var counter = 0;

    //console.log('this is the initial averageRating : ' + avg)
    while(counter < currentRatings.length)
    {
      avg += parseInt(currentRatings[counter].rating);
      counter++;
    }

    avg = avg / currentRatings.length;
    avg = avg.toFixed(1); //rounding to nearest 1 decimal place for rating or its too long
    Session.set('numrtrs', currentRatings.length);

    //console.log('THIS IS THE AVERAGE rating: ' + avg);
    Session.set('avgrtg', avg);
  }
}

function getPersonalRatingForSong(thisSong) {
  //console.log("get PERSONAL RATING METHOD Called!!!!!!!!!");
  var cs = thisSong;
  //var x = Ratings.find({'uid': Meteor.user().services.facebook.id, "sl":cs.sl}).fetch();
  //console.log('CURRENT SONG IS: ');
  //console.log(cs);
  //console.log("CURRENT RATING OBJECT IS: ");
  //console.log(x);
  if(!_.isUndefined(currentSong) && !_.isUndefined(currentSong.sl) && currentSong.sl.indexOf('youtube.com') >= 0)
  {
    var sid = cs.sl.substring(cs.sl.indexOf("v=")+2);
    var personalSongRating = Ratings.find({'uid': Meteor.user().services.facebook.id, "sl":cs.sl}).fetch();
    if(!_.isEmpty(personalSongRating))
    {
      //console.log('GOT THIS PERSONAL RATING for this song:');
      //console.log(personalSongRating[0]);
      setSongRater(personalSongRating[0].rating);
    }
    else
    {
      //console.log('NO PERSONAL RATING found for this song - resetting SONG RATER!!');
      setSongRater(0);
    }
    enableRater();
  }
}


function setSongRater(rating) 
{
  if(rating > 0)
  {
    //console.log('IN Set SONG RATER METHOD with this rating: '+ rating);
    $('.ui.rating').rating('set rating', rating);
  }
  else if(rating === 0)
  {
    //console.log('CLEARING RATING!!');
    $('.ui.rating').rating('clear rating');
  }
}

function disableRater(){
  $('.ui.rating').rating('disable');
}

function enableRater(){
  $('.ui.rating').rating('enable');
  $('.ui.rating').rating('setting', 'onRate', function(value) {
      // your amazing code here
      //console.log('CLICKED THE rating mechanism!!!');
      //console.log(value);
      if(currentSong.sl.indexOf('youtube.com') >= 0 & value > 0)
      {
        var sid = currentSong.sl.substring(currentSong.sl.indexOf("v=")+2);
        //console.log('GOING TO UPDATE THIS SID: '+sid+':with this rating: ' + value);
        Meteor.call('updateSongRating', sid, 'yt', value, function(error, result) {
          if(error)
            console.log('Encountered error while trying to set personal rating for current song!');
          else
          {
            //console.log('GOT THIS RATING RESULT FROM THE SERVER: ' + result);
            //setSongRater();
            //getAverageRatingForSong();
          }
        });
        mixpanel.track('rate song', {
          songID: sid,
          rating: value,
          type: 'yt'
        });
      }
  });
}

function resetSongRatingsWhenSongChanges()
{
  disableRater();
  //console.log('resetting SONG RATER!!!!');
  Session.set('avgrtg', 0);
  Session.set('numrtrs', 0);
  //remove all star ratings before next song comes
  /*$('#star-1').prop('checked',true);
  $('#star-1').prop('checked',false);*/
  setSongRater(0);
}
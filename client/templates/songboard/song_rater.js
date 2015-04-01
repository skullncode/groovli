Template.songRater.helpers({
  songPlaying: function() {
    var cs = Session.get('CS');
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

  averageRating: function() {
    return Session.get('avgrtg');
  },

  numberOfRaters: function() {
    return Session.get('numrtrs');
  },

  ratingsExist: function() {
    return (Session.get('numrtrs') > 0);
  },

  getPersonalRatingForSong: function() {
    var cs = Session.get('CS');
    if(currentSong.sl.indexOf('youtube.com') >= 0)
    {
      var sid = cs.sl.substring(cs.sl.indexOf("v=")+2);
      Meteor.call('getPersonalRatingForSong', sid, 'yt', function(error, result) {
        if(error)
          console.log('Encountered error while trying to get personal rating for current song!');
        else
        {
          //console.log('THIS IS THE PERSONAL RATING GOT from the DB: ');
          //console.log(result);

          if(result === undefined)
            personalRatingForSong = 0;
          else
            personalRatingForSong = result[0].rating;
          
          setSongRater(personalRatingForSong);
        }
      });
    }
  },

  getAverageRatingForSong: function() {
    var cs = Session.get('CS');
    var avg = 0;
    if(currentSong.sl.indexOf('youtube.com') >= 0)
    {
      var sid = cs.sl.substring(cs.sl.indexOf("v=")+2);
      Meteor.call('getAverageRatingForSong', sid, 'yt', function(error, result) {
        if(error)
          console.log('Encountered error while trying to get AVERAGE rating for current song!');
        else
        {
          //console.log('THIS IS THE AVERRAGE RATING GOT from the DB: ');
          //console.log(result);
          if(result === undefined)
          {
            Session.set('numrtrs', 0);
            Session.set('avgrtg', 0);
          }
          else
          {
            //console.log('calculating average rating as there are: ' + result.length + '');
            var counter = 0;

            //console.log('this is the initial averageRating : ' + avg)
            while(counter < result.length)
            {
              avg += result[counter].rating;
              counter++;
            }

            avg = avg / result.length;

            Session.set('numrtrs', result.length);

            //console.log('THIS IS THE AVERAGE rating: ' + avg);
            Session.set('avgrtg', avg);
          }
          
          //setSongRater(personalRatingForSong);
        }
      });
    }
  }
});

Template.songRater.events({
  "click input[type=radio]": function (event) {
    //console.log('RATING CLICKED!!!');
    //console.log(event.toElement.value);

    setSongRater(event.toElement.value);

    if(currentSong.sl.indexOf('youtube.com') >= 0)
    {
      var sid = currentSong.sl.substring(currentSong.sl.indexOf("v=")+2);
      Meteor.call('updateSongRating', sid, 'yt', event.toElement.value)
    }
    getPersonalRatingForSong();
    // allow radio button checking to happen - return true
    return true;
  }
});

function setSongRater(rating) 
{
  starName = '#star' + rating;
  //console.log($(starName));
  $(starName).prop('checked',true);
}

function getAverageRatingForSong()
{
  if(currentSong.sl.indexOf('youtube.com') >= 0)
  {
    var sid = currentSong.sl.substring(currentSong.sl.indexOf("v=")+2);
    Meteor.call('getAverageRatingForSong', sid, 'yt');
  }
}

function getPersonalRatingForSong()
{
  if(currentSong.sl.indexOf('youtube.com') >= 0)
  {
    var sid = currentSong.sl.substring(currentSong.sl.indexOf("v=")+2);
    Meteor.call('getPersonalRatingForSong', sid, 'yt', function(error, result) {
      if(error)
        console.log('Encountered error while trying to get personal rating for current song!');
      else
      {
        //console.log('THIS IS THE PERSONAL RATING GOT from the DB: ');
        personalSongRatingForSong = result[0].rating;
        setSongRater(personalRatingForSong);
      }
    });
  }
}

function resetSongRatingsWhenSongChanges()
{
  //console.log('resetting SONG RATER!!!!');
  Session.set('avgrtg', 0);
  Session.set('numrtrs', 0);
  var ratingStarName = '';
  var counter = 1;
  //remove all star ratings before next song comes
  while(counter < 6)
  {
    ratingStarName = '#star'+counter;
    $(ratingStarName).prop('checked',false)
    counter++;
  }
}
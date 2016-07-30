Template.songboardGenreFilter.helpers({
  genresForFilter: function() {
    return _.uniq(_.sortBy(_.map(Session.get('agens'), function(name){ name = name.replace(' n ', ' and '); return name.toLowerCase(); }), function (name) {return name}));
  },
  genreFilterEmpty: function() {
    return _.isEmpty(_.compact(Session.get('selGens')));
  }
});

Template.songboardGenreFilter.events({
    'click #clearGenreFilter': function(event) {
        $('.ui.dropdown.flylistGenres').dropdown('set exactly', []);
        return false;
    }
});

function makeFlylistToastrNotification(){
  if(Session.get('cr') == '/semanticboard')
  { 
    if(Session.get('lastToast') !== "home||"+Session.get('selGens').toString() && !_.isEmpty(Session.get('selGens')))
    {
      var combinedHomeGenCount = Session.get('mgSongCount') + Session.get('tmSongCount') + Session.get('sgSongCount');
      if(combinedHomeGenCount <= 5)
        toastr.success("Genre selection for 'Home' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+combinedHomeGenCount+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
      else
        toastr.success("Genre selection for 'Home' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+combinedHomeGenCount+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");
      
      Session.set('lastToast',"home||"+Session.get('selGens').toString());
    }
  }
  else if(Session.get('cr') == '/mygroovs'){
    if(Session.get('lastToast') !== "mygroovs||"+Session.get('selGens').toString() && !_.isEmpty(Session.get('selGens')))
    {
      if(Session.get('mgSongCount') <= 5)
        toastr.success("Genre selection for 'My Groovs' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('mgSongCount')+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
      else
        toastr.success("Genre selection for 'My Groovs' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('mgSongCount')+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");

      Session.set('lastToast',"mygroovs||"+Session.get('selGens').toString());
    }
  }
  else if(Session.get('cr') == '/tastemakers'){
    if(Session.get('lastToast') !== "tastemakers||"+Session.get('selGens').toString() && !_.isEmpty(Session.get('selGens')))
    {
      if(Session.get('tmSongCount') <= 5)
        toastr.success("Genre selection for 'Tastemakers' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('tmSongCount')+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
      else
        toastr.success("Genre selection for 'Tastemakers' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('tmSongCount')+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");
      
      Session.set('lastToast',"tastemakers||"+Session.get('selGens').toString());    
    }
  }
  else if(Session.get('cr') == '/global'){
    if(Session.get('lastToast') !== "global||"+Session.get('selGens').toString() && !_.isEmpty(Session.get('selGens')))
    {
      //console.log('INSIDE THE GLOBAL TOASTER NOTIFICATIONS');
      if(Session.get('sgSongCount') <= 5)
        toastr.success("Genre selection for 'Global' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('sgSongCount')+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
      else
        toastr.success("Genre selection for 'Global' updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('sgSongCount')+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");

      Session.set('lastToast',"global||"+Session.get('selGens').toString());    
    }
  }
}

function updateCurrentFlylistGenres(currentGenreSel) {
  //console.log('THIS IS HTE CURREENT GENRE SEL!!!!!');
  //console.log(currentGenreSel);
  if(!_.isUndefined(currentGenreSel) && !_.isNull(currentGenreSel))
  {
    //console.log('PLAYTHISFLYLIST method - SOMETHING NEW HAS BEEN SELECTED FROM THE GENRE selector:');
    //console.log(currentGenreSel);
    if((_.intersection(currentGenreSel,Session.get('selGens')).length === currentGenreSel.length) && (_.intersection(currentGenreSel,Session.get('selGens')).length === Session.get('selGens').length))
    {
      //do nothing
      //console.log("no change in current genre selection");
    }
    else if(!_.isEmpty(currentGenreSel))
    {
      Meteor.call('getSongsForGenres', currentGenreSel, function(error,result){
            if(error){
              console.log('Encountered error while trying to check if artist has page: ' + error)
            }
            else{
                // do something with result
              //console.log('for this genreList: ');
              //console.log(currentGenreSel);
              //console.log('got this LIST OF SONGS: ');
              //console.log(result);
              Session.set('genl', result);
              //check to see if the current song playing at which the song filter was created matches with the current genre selection; if there is a match then the play count should include this song also
              var currentlyPlayingArtist = Session.get('CS').sa.replace(/&/g, 'and');
              //console.log('CURRENTLY PLAYING ARTIST: ' + currentlyPlayingArtist);
              var foundArtistObjCurrentlyPlaying = Artists.findOne({name: {$regex: new RegExp(currentlyPlayingArtist, 'i')}});
              //console.log('CURRENTLY PLAYING ARTIST OBJECT: ');
              //console.log(foundArtistObjCurrentlyPlaying);

              if(!_.isUndefined(foundArtistObjCurrentlyPlaying) && !_.isUndefined(foundArtistObjCurrentlyPlaying.genres))
              {
                if(_.isEmpty(_.intersection(_.map(foundArtistObjCurrentlyPlaying.genres, function(x){ if(_.contains(x, '-')){return x.replace(/-/,' ');}else{return x;}}), Session.get('selGens'))))
                {
                  //console.log(" NO MATCHES WITH CURRENTLY PLAYING SONG!!!!");
                  Session.set('genPlayedLength', 0);
                }
                else
                {
                  //console.log("Selected GENRE MATCHES CURRENTLY PLAYING SONG!!!!!");
                  Session.set('genPlayedLength', 1);
                }
              }
              else
                Session.set('genPlayedLength', 0);

              /*
              if(Session.get('genl').length <= 5)
                toastr.success("Genre selection updated to: <br><br><b><i>" + currentGenreSel + "<br><br> approximately "+Session.get('genl').length+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
              else
                toastr.success("Genre selection updated to: <br><br><b><i>" + currentGenreSel + "<br><br> approximately "+Session.get('genl').length+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");*/
            };
        });

      if(Session.get('cr') == '/semanticboard')
        Meteor.setTimeout(makeFlylistToastrNotification, 4000);
      else if(Session.get('cr') == '/mygroovs')
        Meteor.setTimeout(makeFlylistToastrNotification, 4000);
      else if(Session.get('cr') == '/tastemakers')
        Meteor.setTimeout(makeFlylistToastrNotification, 4000);
      else if(Session.get('cr') == '/global')
        Meteor.setTimeout(makeFlylistToastrNotification, 4000);
    }
    else
    {
      var gensFromDropdown = _.compact($('.ui.dropdown.flylistGenres').dropdown('get value'));
      if(_.isEmpty(gensFromDropdown) || _.isNull(gensFromDropdown) || isUndefined(gensFromDropdown))
      {
        //console.log('SOMETHING CLEARED ALL THE GENRES!!!!!!!');
        //console.log('$$$$$$$$$$$$$$$$$$ALLLL GENRES FROM DROPDOWN RIGHT NOW: ');
        //console.log(gensFromDropdown);
        //toastr.success("All genre selections removed; going forward, Groovli will play all songs!");
      }
    }

    Session.set('selGens', currentGenreSel);
  }
}

changeGenreSelectionsProgrammatically = function(currentGenreSel){
  if(!_.isNull(currentGenreSel) && !_.isEmpty(currentGenreSel) && !_.isUndefined(currentGenreSel))
  {
    //console.log('current genre sel is NOT blank or NULL so passing it thru');
    iHist(true);
    $('.ui.dropdown.flylistGenres').dropdown('set exactly', currentGenreSel);
    updateCurrentFlylistGenres(currentGenreSel);
  }
  else
  {
    var gensFromDropdown = _.compact($('.ui.dropdown.flylistGenres').dropdown('get value'));
    if(!_.isNull(gensFromDropdown) && !_.isEmpty(gensFromDropdown) && !_.isUndefined(gensFromDropdown))
    {
      //console.log('current genre sel is blank so just picking it up from drop down - gens from DROP DOWN IS ALSO NOT BLANK');
      iHist(true);
      $('.ui.dropdown.flylistGenres').dropdown('set exactly', currentGenreSel);
      updateCurrentFlylistGenres(gensFromDropdown);
    }
    else if(_.isEmpty(currentGenreSel) && _.isEmpty(gensFromDropdown))
    {
      //console.log('SEL GENS is NOW BLANK!!!!');
      iHist(true);
      $('.ui.dropdown.flylistGenres').dropdown('set exactly', []);
      updateCurrentFlylistGenres([]);
    }

    //if gens from dropdown is blank don't do anything
  }
}

function handleGenreSelectionsOnSongboard(currentGenreSel) {
  //console.log('SOMETHING NEW HAS BEEN SELECTED FROM THE GENRE selector:');
  //console.log(currentGenreSel);
  //Session.set('selGens', currentGenreSel);
  if(!_.isNull(currentGenreSel) && !_.isEmpty(currentGenreSel) && !_.isUndefined(currentGenreSel))
  {
    //console.log('current genre sel is NOT blank or NULL so passing it thru');
    iHist(true);
    updateCurrentFlylistGenres(currentGenreSel);
  }
  else
  {
    var gensFromDropdown = _.compact($('.ui.dropdown.flylistGenres').dropdown('get value'));
    if(!_.isNull(gensFromDropdown) && !_.isEmpty(gensFromDropdown) && !_.isUndefined(gensFromDropdown))
    {
      //console.log('current genre sel is blank so just picking it up from drop down - gens from DROP DOWN IS ALSO NOT BLANK');
      iHist(true);
      updateCurrentFlylistGenres(gensFromDropdown);
    }
    else if(_.isEmpty(currentGenreSel) && _.isEmpty(gensFromDropdown))
    {
      //console.log('SEL GENS is NOW BLANK!!!!');
      iHist(true);
      updateCurrentFlylistGenres([]);
    }
    //if gens from dropdown is blank don't do anything
  }
}

initiateSongboardGenreFilter = function() {
  //console.log('initiating SONGBOARD FILTER!!!');
  $('.ui.dropdown.flylistGenres').dropdown({
    action: 'select',
      onChange: function(value, text, $selectedItem) {
        handleGenreSelectionsOnSongboard(value);
      },
      maxSelections: 4
  });
  Meteor.setTimeout(restoreAlreadySelectedGenreFilters, 800);
};

Template.songboardGenreFilter.onRendered(function () {
  //console.log('RENDERING THE songboard filters!!!!');
  //experimenting with moving flylist out to songboard / song details
  initiateSongboardGenreFilter();
});

Template.songboardGenreFilter.onCreated(function () {
  //console.log('creating THE songboard filters!!!!');
  //experimenting with moving flylist out to songboard / song details
  var self = this;
  self.autorun(function() {
    if(!_.isEmpty(Session.get('cr')))
    {
      Meteor.setTimeout(initiateSongboardGenreFilter, 1000);
    }
  });
});

function restoreAlreadySelectedGenreFilters()
{
  $('.ui.dropdown.flylistGenres').dropdown('restore defaults');
}
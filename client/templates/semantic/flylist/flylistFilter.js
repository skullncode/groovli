Session.setDefault('flist', []);
Session.setDefault('flistM', '');
Session.setDefault('eflistnm', ''); //edit flylist name
Session.setDefault('eflistid', ''); //edit flylist id
Session.setDefault('cflist', ''); //current flylist
Session.setDefault('selGens', []);

Template.flylistFilter.onRendered(function () {
  $('.ui.dropdown.flylistSelector').dropdown();
  resetFlylist();
});

Template.flylistFilter.onCreated(function() {
  var self = this;
  self.autorun(function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      self.subscribe('flylistsForSpecificUser', Meteor.user().services.facebook.id, {onReady: getAllFlylistsForUser})
    }
  });
});


Template.flylistFilter.helpers({
  flylistsForUser: function() {
  	return Flylists.find({});
  },
  flylistsExist: function() {
  	//if(_.isUndefined(Session.get('flist')) || _.isEmpty(Session.get('flist')))
  	if(_.isEmpty(Flylists.find({}).fetch()))
  		return false;
  	else
  		return true;
  },
  flylistCount: function() {
  	return Flylists.find({}).fetch().length;
  },
  flylistDropdownHeaderText: function() {
  	return " ("+Flylists.find({}).fetch().length+")";
  },
  flylistPlaying: function() {
  	if(!_.isEmpty(Session.get('cflist')))
  		return true;
  	else
  		return false;
  },
  activatePopups: function() {
    Meteor.setTimeout(activatePopups, 800);
  },
  renderFlylist: function() {
    Meteor.setTimeout(renderFlylist, 500);
  },
  notifsEnabled: function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().notifsEnabled))
    {
      return Meteor.user().notifsEnabled;
    }
    else
    {
      return true;
    }
  }
});

Template.flylistFilter.events({
  "click .flylistItem": function (event) {
    updateFlylistHeaderTextAccordingly('click');
    //playFlylist(this, event);
    
  },
    "click #createFlylist": function (event) {
      //console.log('CLICKED CREATE button for flylist:' + $(event.target).attr('value'));

    $('.ui.modal.newFlylist').modal({
          onHide: function () {
            //console.log("HIDING modal now!");
              resetFlylistForm();
              updateFlylistHeaderTextAccordingly('hide');
              Session.set('flistM', '');
          },
          onShow: function() {
            resetFlylistForm();
            Session.set('flistM', 'new');
          },
          onDeny: function(){
          //window.alert('Wait not yet!');
          resetFlylistForm();
          return true;
        },
          onApprove: function () {
            //console.log("GOING TO APPROVE AND SEE WHAT HAPPENS!!!");
              return validateNewFlylistForm();
          },
          transition: 'horizontal flip'
      }).modal('show');
    },
    "click #deleteFlylist": function (event) {
    //console.log('CLICKED DELETE button for GENRE:' + $(event.target).attr('value'));
    //console.log("THIS IS THE ELEMENT!!!!");
    //console.log(this);
    if(Session.get('cflist') === this.flylistName)
    {
      stopFlylist();
    }
      
    Meteor.call('deleteFlylist',this._id, function(error,result){
      if(error){
        console.log(error.reason);
      }
      else
      {
        updateFlylistHeaderTextAccordingly('delete');
        mixpanel.track('deleted flylist');
        //console.log('SUCCESSFULLY DELETED flylist!!!!!');
      }
    });
    },
    "click #editFlylist": function (event) {
      //console.log('GOING TO EDITTTTTT THIS FLYLIST ITEM:' + $(event.target).attr('value'));
    //console.log("THIS IS THE ELEMENT!!!!");
    //console.log(this);
    Session.set('eflistnm', this.flylistName);
    Session.set('eflistid', this._id);
    Session.set('genForNewFlylist', this.genres);
    $('.ui.dropdown.flylistSelector').dropdown('set text', 'Flylist - ' + $(event.target).attr('value'));
    $('.ui.form.newFlylist')
      .form('set values', {
        flylistGenres   : this.genres
      })
    ;
    $('.ui.modal.newFlylist').modal({
          onHide: function () {
            //console.log("HIDING modal now!");
              //resetFlylistForm();
              updateFlylistHeaderTextAccordingly('edit');
          },
          onShow: function() {
            Session.set('flistM', 'edit');
            $('#flylistName').val(this.flylistName);
          },
          onDeny: function(){
          //window.alert('Wait not yet!');
          Session.set('flistM', '');
          resetFlylistForm();
          return true;
          },
          onApprove: function () {
            console.log('**************************************GOING TO UPDATE flylist!!!!!');
            return validateNewFlylistForm();
          },
          transition: 'horizontal flip'
      }).modal('show');
    },
    "click #playFlylist": function (event) {
      playFlylist(this, event);
    },
    "click #stopPlayingFlylist": function (event) {
      stopFlylist();
    }
});

function resetFlylistForm() {
  $('#flylistName').val(''); // RESET FLYLIST NAME
  $('.ui.dropdown.flylistGenres').dropdown('clear'); // RESET genre dropdown
}

function updateFlylistHeaderTextAccordingly(mode) {
  if(mode === 'create' || mode === 'delete')
  {
    if(!_.isEmpty(Session.get('cflist')))
        $('.ui.dropdown.flylistSelector').dropdown('set text', 'Flylist - ' + Session.get('cflist'));
      else
      $('.ui.dropdown.flylistSelector').dropdown('set text', 'Flylist filters ');
  }
  else
  {
    if(!_.isEmpty(Session.get('cflist')))
        $('.ui.dropdown.flylistSelector').dropdown('set text', 'Flylist - ' + Session.get('cflist'));
      else
        $('.ui.dropdown.flylistSelector').dropdown('set text', 'Flylist filters'+" ("+Flylists.find({}).fetch().length+")");
  }
}

function validateNewFlylistForm() {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%GOING TO validate FLYLIST form now!!!!");
  console.log("THIS IS THE FLYLIST mode: ");
  console.log(Session.get('flistM'));
  if(Session.get('flistM') === 'new')
  {
    //console.log('flylist mode is: NEW');
    if(_.isEmpty($('#flylistName').val().trim()) || _.isNull($('#flylistGenres').val()) || _.isEmpty($('#flylistGenres').val()) || _.isEmpty($('#flylistGenres').val().toString()))
    {
      //console.log('Form STILL INVALID - fix errors now!!!!');
      return false;
    }
    else
    {
      //console.log('Form is finally VALID - will submit form now!!!!!');
      if(!_.isEmpty($('#flylistName').val().trim()) && !_.isNull($('#flylistGenres').val()))
      {
        //console.log("ALL is fine now, going to check if flylist name already exists or not!");
        if(_.isUndefined(Flylists.findOne({flylistName: $('#flylistName').val().trim(), fbID: Meteor.user().services.facebook.id})))
        {
          //console.log("FLYLIST doesn't exist!!! going to go ahead and create it!!!");
          Meteor.call('createNewFlylist',Meteor.user()._id, Meteor.user().profile.name, Meteor.user().services.facebook.id, $('#flylistName').val().trim(), $('#flylistGenres').val(), function(error,result){
            if(error){
                console.log(error.reason);
            }
            else{
              updateFlylistHeaderTextAccordingly('create');
              mixpanel.track('created new flylist', {
                by: Meteor.user().services.facebook.id,
              });
              //console.log('SUCCESSFULLY created new flylist!!!!!');
              return true;
            }
          });
        }
        else
        {
          return false;
        }
      }
    }
  }
  else if(Session.get('flistM') === 'edit')
  {
    //console.log('flylist mode is: EDIT');
    if(_.isNull($('#flylistGenres').val()) || _.isEmpty($('#flylistGenres').val()) || _.isEmpty($('#flylistGenres').val().toString()))
    {
      //console.log('Form STILL INVALID - fix errors now!!!!');
      return false;
    }
    else
    {
      Meteor.call('updateExistingFlylist', Session.get('eflistid'), Meteor.user().services.facebook.id, Session.get('eflistnm'), $('#flylistGenres').val(), function(error,result){
        if(error){
            console.log(error.reason);
        }
        else{
          updateFlylistHeaderTextAccordingly('edit');
          console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%SUCCESSFULLY updated existing flylist!!!!!');
          if(Session.get('cflist') == Session.get('eflistnm')) //flylist that was updated is currently playing - so update it accordingly
          {
            console.log("flylist is the same as the one that was updated - need to update the flylist");
            console.log("THIS IS THE current flylist genre selection: ");
            console.log($('#flylistGenres').val());
            updateCurrentFlylistGenres($('#flylistGenres').val());
            //$('.ui.dropdown.flylistGenres').dropdown('clear'); // RESET genre dropdown
            resetFlylistForm();
          }
          else
          {
            //console.log("NOT THE SAME FLYLIST as currently being played - so nothing further has to be done.");
          }
          Session.set('eflistnm', '');
          Session.set('flistM', '');
          return true;
        }
      });
    }
  }
  else
    return false;
}

function getAllFlylistsForUser() {
  //console.log('flylist subscription rEFRESHED!!!!');
  var f = Flylists.find({}).fetch();
  Session.set('flist', f);
}


function resetFlylist(){
  Session.set('cflist', '');
  updateCurrentFlylistGenres([]);
  updateFlylistHeaderTextAccordingly('delete');
}

function stopFlylist(){
  Session.set('cflist', '');
  updateCurrentFlylistGenres([]);
  //starting a flylist should reset tab play lengths and history
  resetPlayedLengthSpecificToTab('all');
  iHist(true)
  //starting a flylist should reset tab play lengths and history
  updateFlylistHeaderTextAccordingly('stop');

  mixpanel.track('stop flylist');
}

function makeFlylistToastrNotification(){
  if(Session.get('cr') == '/semanticboard')
  {
    if(Session.get('genl').length <= 5)
      toastr.success("Genre selection updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('genl').length+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
    else
      toastr.success("Genre selection updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('genl').length+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");
  }
  else if(Session.get('cr') == '/mygroovs'){
    if(Session.get('genl').length <= 5)
      toastr.success("Genre selection updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('mLen')+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
    else
      toastr.success("Genre selection updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('mLen')+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");
  }
  else if(Session.get('cr') == '/tastemakers'){
    if(Session.get('genl').length <= 5)
      toastr.success("Genre selection updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('fLen')+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
    else
      toastr.success("Genre selection updated to: <br><br><b><i>" + Session.get('selGens') + "<br><br> approximately "+Session.get('fLen')+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");
  }
}

function playFlylist(flylistItem, ev){
  //console.log('GOING TO play THIS FLYLIST ITEM:' + $(ev.target).attr('value'));
    $('.ui.dropdown.flylistSelector').dropdown('set text', 'Flylist - ' + $(ev.target).attr('value'));
  Session.set('cflist', flylistItem.flylistName);
  //console.log(this);

  //starting a flylist should reset tab play lengths and history
  resetPlayedLengthSpecificToTab('all');
  iHist(true)
  //starting a flylist should reset tab play lengths and history

  updateCurrentFlylistGenres(flylistItem.genres);

  mixpanel.track('play flylist');
}

function updateCurrentFlylistGenres(currentGenreSel) {
  //console.log('THIS IS HTE CURREENT GENRE SEL!!!!!');
  //console.log(currentGenreSel);
  if(!_.isUndefined(currentGenreSel))
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

              if(Session.get('cr') == '/semanticboard')
                Meteor.setTimeout(makeFlylistToastrNotification, 100);
              else if(Session.get('cr') == '/mygroovs')
                Meteor.setTimeout(makeFlylistToastrNotification, 800);
              else if(Session.get('cr') == '/tastemakers')
                Meteor.setTimeout(makeFlylistToastrNotification, 800);

              /*
              if(Session.get('genl').length <= 5)
                toastr.success("Genre selection updated to: <br><br><b><i>" + currentGenreSel + "<br><br> approximately "+Session.get('genl').length+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
              else
                toastr.success("Genre selection updated to: <br><br><b><i>" + currentGenreSel + "<br><br> approximately "+Session.get('genl').length+" matching songs</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");*/
            };
        });
    }
    else
    {
      toastr.success("All genre selections removed; going forward, Groovli will play all songs!");
    }

    Session.set('selGens', currentGenreSel);
  }
}

function activatePopups(){
  $('.flylistSelector').popup({position : 'left center'});
}

function renderFlylist() {
  $('.ui.dropdown.flylistSelector').dropdown();
}
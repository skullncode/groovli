Template.listenToSimilar.events({
    "click #listenToSimilar": function (event) {
        if(!_.isUndefined(Session.get('CS')) && !_.isEmpty(Genres.find().fetch()))
        {

        //console.log('GOING TO MAKE A FLYLIST WITH THESE GENRES: ');

        var genreListSimilarToThisTrack = [];

        if(!_.isEmpty(Genres.find().fetch()))
        {
          _.each(Genres.find().fetch(), function(x){
            genreListSimilarToThisTrack.push(x.name);
          });
        }

        //console.log(genreListSimilarToThisTrack);

        var nameOfFlylist = "Similar to - " + Session.get('CS').sa;

        //console.log(nameOfFlylist);

        
        Meteor.call('createNewFlylist',Meteor.user()._id, Meteor.user().profile.name, Meteor.user().services.facebook.id, nameOfFlylist, genreListSimilarToThisTrack, function(error,result){
          if(error){
              console.log(error.reason);
          }
          else{
            mixpanel.track('listen to Similar - created new flylist similar to artist', {
              by: Meteor.user().services.facebook.id,
            });
            //console.log('####### This is the list of flylists now: ');
            var currentFlyLists = $('.ui.dropdown.flylistSelector').find('.flylistItem');
            _.each(currentFlyLists, function(y){
              //console.log('this is the current fly list item value: ');
              //console.log($(y).attr('value'));
              if($(y).attr('value') == nameOfFlylist)
              {
                //console.log('THIS IS THE MATCHING NEW FLYLIST!');
                //console.log(y);
                $(y).find('#playFlylist').click();
              }
            });
            //toastr.success("Successfully created new flylist for songs similar to: "+ Session.get('CS').st + "<br><br><b><i> approximately "+Session.get('genl').length+" matching songs<br><br>NOTE: Select more genres to get more songs!</i></b><br><br> going forward, Groovli will only play songs matching the selected genres!");         
            return true;
          }
        });
      }
      else
      {
        toastr.error("Unable to listen to songs similar to currently playing artist!");
      }
    }
});
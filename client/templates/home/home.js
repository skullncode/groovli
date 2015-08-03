Template.home.rendered = function() {
  if(Meteor.user())
  {
  	Meteor.call('addAdminRolesToKing', Meteor.user().services.facebook.email);
    Meteor.call('setUserBaseLocation', Meteor.user().services.facebook.id);
    //analytics.track("logged in user loaded home page");
    mixpanel.track("logged in user loaded home page");
  }
  else
  {
    //analytics.track("anonymous user loaded home page");
    mixpanel.track("anonymous user loaded home page");
  }
  getLast20Songs();
  return $('#request-beta-invite').validate({
    rules: {
      emailAddress: {
        email: true,
        required: true
      },
      facebookID: {
        required: true
      }
    },
    messages: {
      emailAddress: {
        email: "Please use a valid email address.",
        required: "An email address is required to get your invite."
      },
      facebookID: {
        required: "We need your facebook account ID, in order to add you as a tester."
      }
    },
    submitHandler: function() {
      var invitee;
      invitee = {
        email: $('[name="emailAddress"]').val().toLowerCase(),
        fbID: $('[name="facebookID"]').val().toLowerCase(),
        invited: false,
        requested: (new Date()).getTime()
      };
	    return Meteor.call('addToInvitesList', invitee, function(error, response) {
	      if (error) {
	        //return alert(error.reason);
          return toastr.error(error.reason);
	      } else {
	      	$('[name="emailAddress"]').val('');
          $('[name="facebookID"]').val('');
	        //return alert("Invite requested. We'll be in touch soon. Thanks for your interest in Groovli!");
          return toastr.success("Invite requested. We'll be in touch soon. Thanks for your interest in Groovli!");
	      }
	    });
    }
  });
};

Template.home.helpers({
  landingPageSongList: function() {
    return Session.get('lp_slide_list');
  }
});

Template.home.events({
  'submit form': function(e) {
    return e.preventDefault();
  }
});

function getLast20Songs(){
  Meteor.call('getLast20SongsForLandingPage', function(error,result){
      if(error){
          console.log(error.reason);
      }
      else{
          // do something with result
        //console.log('GOT THIS BACK From the server: ');
        //console.log(result);
        Session.set('lp_slide_list', result)
      }
  });
}
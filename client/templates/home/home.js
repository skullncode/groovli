Template.home.rendered = function() {
  if(Meteor.user())
  {
  	Meteor.call('addAdminRolesToKing', Meteor.user().services.facebook.email);
    Meteor.call('setUserBaseLocation', Meteor.user().services.facebook.id);
  }
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

Template.home.events({
  'submit form': function(e) {
    return e.preventDefault();
  }
});
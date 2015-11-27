Template.semanticFooter.helpers({
  usersCurrentlyOnline: function() {
    //Session.set('personalSongList', Songs.find());
    if (Meteor.user())
    {
        var usersOnline = Meteor.users.find({ 'status.online': true }).fetch().length;
        if(usersOnline === 1)
            return "you're currently the only one here";
        else if(usersOnline > 1)
            return usersOnline + ' users currently online'
	 }
  },
  siteLastUpdatedTimestamp: function() {
    var lastUpdatedManualTimestamp = new moment("November 27th 2015, 5:15 pm", "'MMMM Do YYYY, h:mm a'");
    return new moment(lastUpdatedManualTimestamp).fromNow();
  }
});

Template.semanticFooter.events({
    /*"click #aboutFooterLink": function (event) {
      //console.log('CLICKED ABOUT link');
      $('.ui.modal.aboutPage').modal({
          transition: 'horizontal flip'
      }).modal('show');
    },*/
    "click #feedbackForm": function(event) {
      //console.log('clicked feedback link!!!');
      $('.ui.modal.feedbackForm').modal({
          onHide: function () {
            //console.log("HIDING modal now!");
              //resetFlylistForm();
              //updateFlylistHeaderTextAccordingly('hide');
              //Session.set('flistM', '');
          },
          onShow: function() {
            resetFeedbackForm();
          },
          onDeny: function(){
          //console.log('CLICKED CANCEL!!!');
          return true;
        },
          onApprove: function () {
            //console.log('CLICKED SUBMIT FEEDBACK!!!');
            return validateFeedbackForm();
          },
          transition: 'horizontal flip'
      }).modal('show');
    }
});

function validateFeedbackForm() {
  if($('#feedbackType:checked').length == 0 || _.isEmpty($('#txtFeedback').val()) || _.isEmpty($('#userEmail').val()))
    return false;
  else if($('#feedbackType:checked').length == 1 && !_.isEmpty($('#txtFeedback').val()) && !_.isEmpty($('#userEmail').val()))
  {
    Meteor.call('sendFeedback', $('input[name=feedbackType]:checked', '#modalFeedbackForm').val(), $('#txtFeedback').val(), $('#userEmail').val(), function(error) {
        if (error) {
          return console.log(error);
        } else {
          //return alert("Thank you for your valuable feedback!");
          return toastr.success("Thank you for your valuable feedback!");
        }
      });
    return true;
  }
}

function resetFeedbackForm(){
  $('input[name=feedbackType]:checked', '#modalFeedbackForm').prop('checked',false);
  $('#txtFeedback').val('');
  $('#userEmail').val('');
}
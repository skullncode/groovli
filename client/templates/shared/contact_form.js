Template.contactForm.events({
    'click #bug': function(event) {
    	//console.log('this is a bug!!!');
    	//console.log('this is the event:');
    	//console.log(event);
    	//$('a .active').removeClass('active');
    	$($(event.currentTarget.parentElement).find('.active')).removeClass('active')
  		$('#bug').addClass('active');
  		Session.set('feedbackType', 'bug');
    },
    'click #question': function(event) {
    	//console.log('this is a question!!!');
    	//console.log('this is the event:');
    	//console.log(event);
    	$($(event.currentTarget.parentElement).find('.active')).removeClass('active')
  		$('#question').addClass('active');
  		Session.set('feedbackType', 'question');
    },
    'click #suggestion': function(event) {
    	//console.log('this is a suggestion!!!');
    	//console.log('this is the event:');
    	//console.log(event);
    	$($(event.currentTarget.parentElement).find('.active')).removeClass('active')
  		$('#suggestion').addClass('active');
  		Session.set('feedbackType', 'suggestion');
    },
    'click #kudos': function(event) {
    	//console.log('this is love!!!');
    	//console.log('this is the event:');
    	//console.log(event);
    	$($(event.currentTarget.parentElement).find('.active')).removeClass('active')
  		$('#kudos').addClass('active');
  		Session.set('feedbackType', 'kudos');
    },
    /*
    'click #siteFast': function(event) {
    	//console.log('this is fast site!');
    	$($(event.currentTarget.parentElement).find('.active')).removeClass('active')
  		$('#siteFast').addClass('active');
  		Session.set('siteSpeed', 'fast');
    },
    'click #siteFine': function(event) {
    	//console.log('this is fine site!');
    	$($(event.currentTarget.parentElement).find('.active')).removeClass('active')
  		$('#siteFine').addClass('active');
  		Session.set('siteSpeed', 'fine');
    },
    'click #siteSlow': function(event) {
    	//console.log('this is slow site!');
    	$($(event.currentTarget.parentElement).find('.active')).removeClass('active')
  		$('#siteSlow').addClass('active');
  		Session.set('siteSpeed', 'slow');
    },*/
    'click #submitFeedback': function(event) {
    	Meteor.call('sendFeedback', Session.get('feedbackType'), $('#feedbackTextArea').val(), $('#userEmail').val(), function(error) {
        if (error) {
          return console.log(error);
        } else {
          slidePanel.closePanel();
          //return alert("Thank you for your valuable feedback!");
          return toastr.success("Thank you for your valuable feedback!");
        }
      });
    	return true;
    }
});
Template.pollForm.events({
    'click .poll-questions a': function(event) {
    	//console.log(event);
  		$($(event.currentTarget.parentElement.parentElement)).find('.selected').removeClass('selected');
  		$(event.currentTarget).addClass('selected');
  		//Meteor.call('updateSiteVote', event.toElement.id);
  		var rating = event.toElement.id;
  		if(rating === 'excellent' || rating === 'good' || rating === 'bad' )
  		{
  			Session.set('personalSiteRating', rating);
			Meteor.call('updateSiteVote', rating, function(error){
				if(error){
					return toastr.error(error.reason);
				}
				else{
					// do something with result
					slidePanel.closePanel();
					return toastr.success('Thank you for your rating!');
				};
			});
  		}
    }
});

Template.pollForm.rendered = function() {
	//console.log("RENDERING POLL FORM!");
	if(Meteor.user())
	{
		Meteor.call('getPersonalSiteRating', function(error, result){
			if(error){
				return toastr.error(error.reason);
			}
			else{
				// do something with result
				Session.set('personalSiteRating', result);
			};
		});

		if(!_.isUndefined(Session.get('personalSiteRating')))
		{
			//console.log('SETTING POLL to previously saved value!!!');

			if(Session.get('personalSiteRating') === 'excellent')
				$('#excellent').addClass('selected');
			else if(Session.get('personalSiteRating') === 'good')
				$('#good').addClass('selected');
			else if(Session.get('personalSiteRating') === 'bad')
				$('#bad').addClass('selected');
		}
	}
};
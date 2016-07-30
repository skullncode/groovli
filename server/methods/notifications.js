Meteor.methods({
	insertNewNotification: function(sender, recipient, typeOfAction, actingObject, actionContent){
		//console.log('INSIDE THE NOTIFICATION INSERTION METHOD with these deets: ');

		if(typeOfAction == 'postComment')
		{
			_.each(recipient, function(x){
				if(x.uid !== sender.services.facebook.id)
				{
					var strippedSenderObj = {
						_id: sender._id,
						fbid: sender.services.facebook.id,
						first_name: sender.services.facebook.first_name
					}
					//console.log('sender is NOT the same AS the RECIPIENT');
					Notifications.insert({'from': strippedSenderObj, 'to': x.uid, 'timestamp': moment().unix(), 'action': typeOfAction, 'object': actingObject, 'content': actionContent, 'seen': false}, function(error) {
				      if (error) {
				        // display the error to the user
				        console.log(error.reason);
				        return error.reason;
				      }
				      else{
				      	//console.log('################ message successfully inserted!!! ');
				      }
					});
				}
			});
		}		
	},
	markNotificationsAsSeen: function(nidArray) {
		//console.log("############################################################GOING TO MARK THE MESSAGE AS READDDD!!!!!");
		//console.log(mid);
		_.each(nidArray, function(notifObject){
			Notifications.update({'_id': notifObject._id}, {$set: { seen: true }}, function(error) {
		      if (error) {
		        // display the error to the user
		        return console.log(error.reason);
		      }
		      else{
		      	//console.log('################ message successfully marked as READ: ' + mid);
		      }
			});
		});
		
	}
});
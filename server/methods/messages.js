
Meteor.methods({
	insertNewMessage: function(sender, recipient, msgTimestamp, msgContent){
		//console.log('INSIDE THE MESSAGE INSERTION METHOD with these deets: ');
		//console.log('sender: ' + sender);
		//console.log('recipient: ' + recipient);
		//console.log('timestamp: ' + msgTimestamp);
		//console.log('content: ' + msgContent);

		Messages.insert({ 'from': sender, 'to': recipient, 'timestamp': msgTimestamp, 'content': msgContent, 'read': false}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	        return error.reason;
	      }
	      else{
	      	//console.log('################ message successfully inserted!!! ');
	      }
		});
	},
	insertNewArtistGenreGroupMessage: function(sender, senderName, senderProfileID, groupRecipient, msgTimestamp, msgContent){
		/*console.log("$$$$$$$$$$$$$$$$$$$$$$REACHED message method: ");
		console.log('THIS IS THE SENDER: ');
		console.log(sender);
		console.log('THIS IS THE group recipient: ');
		console.log(groupRecipient);
		console.log('THIS IS THE sender profile id: ');
		console.log(senderProfileID);
		console.log('THIS IS THE msg time stamp: ');
		console.log(msgTimestamp);
		console.log('THIS IS THE msg content: ');
		console.log(msgContent);
		//console.log('THIS IS THE group recipient: ');
		//console.log(groupRecipient);*/
		return Messages.insert({ 'from': sender, 'fromName': senderName, 'fromProfileID': senderProfileID, 'to': groupRecipient, 'timestamp': msgTimestamp, 'content': msgContent, 'read': false}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	        return error.reason;
	      }
	      else{
	      	//console.log('################ message successfully inserted!!! ');
	      }
		});
	},
	markMessageAsRead: function(mid) {
		//console.log("############################################################GOING TO MARK THE MESSAGE AS READDDD!!!!!");
		//console.log(mid);
		Messages.update({'_id': mid}, {$set: { read: true }}, function(error) {
	      if (error) {
	        // display the error to the user
	        return error;
	      }
	      else{
	      	//console.log('################ message successfully marked as READ: ' + mid);
	      }
		});
	},
	deleteMsgDuringReview: function(msgID) {
	    Messages.remove({_id: msgID}, function(error) {
	          if (error) {
	            // display the error to the user
	            return error;
	          }
	          else{
	            console.log('successfully deleted this message: ' + msgID);
	          }
	      })
  	}
});
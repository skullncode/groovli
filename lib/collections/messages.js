Messages = new Meteor.Collection('messages');

Messages.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  }
});


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
	insertNewArtistGroupMessage: function(sender, senderName, senderProfileID, groupRecipient, msgTimestamp, msgContent){
		Messages.insert({ 'from': sender, 'fromName': senderName, 'fromProfileID': senderProfileID, 'to': groupRecipient, 'timestamp': msgTimestamp, 'content': msgContent, 'read': false}, function(error) {
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
		Messages.update({'_id': mid}, {$set: { read: true }}, function(error) {
	      if (error) {
	        // display the error to the user
	        return console.log(error.reason);
	      }
	      else{
	      	//console.log('################ message successfully marked as READ: ' + mid);
	      }
		});
	}
});
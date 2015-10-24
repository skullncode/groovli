Meteor.methods({
	postCommentForSong: function(songID, userID, name, userFBID, commentContent){
		//console.log('INSIDE THE COMMENT POSTING METHOD comments SERVER CONTROLLER');
		//console.log('THIS IS THE SONG ID: ' + songID);
		//console.log('THIS IS THE userID: ' + userID);
		//console.log('THIS IS THE commentContent: ' + commentContent);

		Comments.insert({
			referenceId: songID, 
			userId: userID,
			nameOfUser: name,
			fbID: userFBID,
			content: commentContent,
			likes: [],
			replies: [],
			createdAt: new Date()
		},function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ successfully posted comment for this song: ' + songID);
	      }
		});

		/*var userID = Meteor.user().services.facebook.id;
		//console.log('going to update the rating for: '+ sid + '--- for this user ID: ' + userID + ' WITH THIS rating: ' + userRating);
		var searchString = '';
		if (type == 'yt')
		{
			searchString = 'https://www.youtube.com/watch?v=' + sid;
		}

		Comments.upsert({ 'sl': searchString, 'uid': userID}, {$set: { rating: userRating }}, function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      //else{
	      	//console.log('################ song rating succesfully updated for: ' + searchString);
	      //}
		});*/
	},
	deleteCommentForSong: function(commentID) {
		//console.log('Deleting THIS COMMENT ID : ' + commentID);
	    Comments.remove({_id: commentID}, function(error) {
	          if (error) {
	            // display the error to the user
	            return error;
	          }
	          else{
	            //console.log('result');
	          }
	      })
  	},
  	likeCommentForSong: function(userID, name, userFBID, commentID) {
		console.log('liking THIS COMMENT ID : ' + commentID);
		var existingCommentObject = Comments.findOne({_id: commentID});
		console.log('THIS IS THE existing comment object: ');
		console.log(existingCommentObject);

		var likedEntry = {'id':userID, 'commenterName':name, 'fbID':userFBID};

		if(_.isUndefined(_.findWhere(existingCommentObject.likes, {fbID: userFBID}))) //if undefined that means user has not liked this comment before
		{
			var commentWithNewLikeDeets = {
				likes: likedEntry
			}
			Comments.update(existingCommentObject._id, { $push: commentWithNewLikeDeets });
		}
		else //already liked this comment so clicking like again will remove unlike the comment
		{
			var likeIndex = indexOfObjectInArray(existingCommentObject.likes, likedEntry);
			console.log('THIS IS THE INDEX OF THE LIKED COMMENT: '+ likeIndex);
			existingCommentObject.likes.splice(likeIndex, 1);
			//console.log('THIS IS THE UPDATED ORIGINAL comment OBJECT: ');
			//console.log(existingCommentObject.likes);
			var commentWithUpdatedLikeDeets = {
				likes: existingCommentObject.likes
			}
			//console.log('this is the updated comment like object: ');
			//console.log(commentWithUpdatedLikeDeets);
			Comments.update(existingCommentObject._id, { $set: commentWithUpdatedLikeDeets });
		}
		/*Comments.update(commentID, {$set: {important: true}});
	    Comments.remove({_id: commentID}, function(error) {
	          if (error) {
	            // display the error to the user
	            return error;
	          }
	          else{
	            //console.log('result');
	          }
	      });*/
  	}
});

function indexOfObjectInArray(arr, xobj){
	var y = 0; 
	while(y < arr.length)
	{
        //console.log("this is the current OBJECT: ");
        //console.log(arr[y]);
        //console.log("this is the objective: ");
        //console.log(xobj);
		if(_.isEqual(arr[y],xobj)){
			return y;
		}
		
		y++;
	}

	return -1;
}
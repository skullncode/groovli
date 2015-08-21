Meteor.methods({
	favoriteSong: function(userID, name, userFBID, songLink, artist, title) {
		console.log('favoriting THIS SONG ID : ' + songLink);
		var existingFavorite = Favorites.find({referenceId: songLink, userId: userID}).fetch();
		console.log('THIS IS THE existing SONG object: ');
		console.log(existingFavorite);

		if(_.isEmpty(existingFavorite)) //this user has not favorited this song
		{
			Favorites.insert({
				referenceId: songLink,
				sa: artist,
				st: title,
				userId: userID,
				nameOfUser: name,
				fbID: userFBID,
				favoritedAt: new Date()
			},function(error) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
		      }
		      else{
		      	console.log('################ successfully favorited this song: ' + songLink);
		      }
			});
		}
		else //user has favorited this song
		{
			Favorites.remove({referenceId: songLink, userId: userID}, function(error) {
				if (error) {
				// display the error to the user
					return error;
				}
				else{
					console.log('successfully unfavorited this song!!!');
				}
			})
		}
		
		
		/*var likedEntry = {'id':userID, 'favoriterName':name, 'fbID':userFBID};

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
		}*/
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
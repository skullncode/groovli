Meteor.methods({
	createNewFlylist: function(userID, name, userFBID, nameOfFlylist, genreList){
		console.log("REACHED create flylist METHOD!!!!");
		Flylists.insert({
			userId: userID,
			nameOfUser: name,
			fbID: userFBID,
			flylistName: nameOfFlylist,
			genres: genreList,
			uses: 1,
			createdAt: new Date()
		},function(error) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ successfully created flylist for user: ' + userID);
	      }
		});
	},
	flylistNameAlreadyExists: function(userFBID, nameOfFlylist){
		console.log("REACHED server method to check if flylist already exists or not:");
		console.log('GOT HERE with this flylist name: ');
		console.log(nameOfFlylist);
		console.log('GOT HERE with this FB user id: ');
		console.log(userFBID);

		var x = Flylists.findOne({flylistName: 'nameOfFlylist', fbID: userFBID})

		console.log("THIS IS THE SERACH RESULT of teh flylists:");
		console.log(x);
		if(_.isUndefined(Flylists.findOne({flylistName: 'nameOfFlylist', fbID: userFBID})))
			return false;
		else
			return true;
	},
	deleteFlylist: function(flylistID) {
		//console.log('Deleting THIS COMMENT ID : ' + commentID);
	    Flylists.remove({_id: flylistID}, function(error) {
	          if (error) {
	            // display the error to the user
	            return error;
	          }
	          else{
	            //console.log('result');
	          }
	      })
  	},
  	updateExistingFlylist: function(listID, userFBID, nameOfFlylist, genreList) {
		//console.log('liking THIS COMMENT ID : ' + commentID);
		var existingFlylist = Flylists.findOne({_id: listID, fbID: userFBID, flylistName: nameOfFlylist});
		console.log('THIS IS THE existing flylist object: ');
		console.log(existingFlylist);

		//first check to see if there are any actual changes to the genre list - IF NONE don't do anything
		if((_.intersection(existingFlylist.genres,genreList).length === genreList.length) && (_.intersection(existingFlylist.genres,genreList).length === existingFlylist.genres.length))
		{
			//do nothing
			console.log("Flylist genres are the same; not gonna do anything!!!");
		}
		else
		{
			console.log("Flylist genres have actually changed - gonna update flylist!!!");
			Flylists.update(existingFlylist._id, {$set: {genres: genreList}});
		}
  	}
});

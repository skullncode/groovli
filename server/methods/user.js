function updateUserFriendList(latestFriendList){
	//console.log('REACHED THE UPDATE USER FRIEND LIST server method, with this list of friends: ');
	//console.log(latestFriendList);
	Meteor.users.update({_id: Meteor.userId()},{$set:{fbFriends: latestFriendList}});
	insertFriendsIntoTastemakersList(latestFriendList);
}

function insertFriendsIntoTastemakersList(latestFriendList)
{
	var updatedTastemakerList = Meteor.user().tastemakers;
	console.log('this is the current tastemaker list: ');
	console.log(updatedTastemakerList);
	if(_.isNull(updatedTastemakerList) || _.isUndefined(updatedTastemakerList)){
		updatedTastemakerList = [];
	}
	_.each(latestFriendList, function(x) {
		console.log('CHECKING TO SEE IF THIS FRIEND IS UNFOLLOWED OR NOT: ');
		console.log('this is the result of the search: ');
		var result = _.findWhere(Meteor.user().unfollowedFriends, {'fbid': x.fbid});
		console.log(result);
		//if undefined that means this friend is not unfollowed, and can be safely added to the existing tastemaker list
		if(_.isUndefined(_.findWhere(Meteor.user().unfollowedFriends, {'fbid': x.fbid})) && _.isUndefined(_.findWhere(updatedTastemakerList, {'fbid': x.fbid})))
		{
			console.log('THIS FRIEND IS NOT UNFOLLOWED YET SO will add them as a tastemaker:');
			console.log(x);
			updatedTastemakerList.push(x);
		}
	});

	_.uniq(updatedTastemakerList);

	Meteor.users.update({_id: Meteor.userId()},{$set:{tastemakers: updatedTastemakerList}});
}

Meteor.methods({
	updateFBFriendList: function()
	{
		var updatedFBGetURL = fbGraphURLforFriends.replace('#TOKEN#',Meteor.user().services.facebook.accessToken);
		var counter = 0;
		var fbFriends = [];
		Meteor.http.get(updatedFBGetURL,
			function(error, result) {
				if(!error && result.statusCode === 200) {
					while(counter < result.data.data.length)
					{
						//console.log('GOT THIS result from FB GRAPH: ' + Object.keys(result.data.data[counter]));
						//console.log('COUNTER now is: ' + counter);
						//console.log('THIS IS THE Friends Name: ' + result.data.data[counter].name);
						//console.log('THIS IS THE Friends ID: ' + result.data.data[counter].id);
						var foundFriend = {
							name: result.data.data[counter].name,
							fbid:result.data.data[counter].id
						};
						fbFriends.push(foundFriend);
						counter++;
					}
					//console.log('FOUND ' + fbFriends.length + ' friend(s)');
					if(fbFriends.length > 0)
						updateUserFriendList(fbFriends);

					return true
				}
				else// error is defined
				{
					console.log('ENCOUNTERED an error during FB graph get for FRIENDS: ' + error);
					return false;
				}
			}
		);
	},
	findUserForRouting: function(uid)
	{
		console.log("REACHED SERVER METHOD TO GET USER DATA FOR THIS ID: " + uid);
		return Meteor.users.findOne(uid);
	},
	addAdminRolesToKing: function(kingEmail)
	{
		if(kingEmail === 'reverieandreflection@gmail.com')
		{
			console.log('going to add the BLOG ADMIN ROLE TO THE KING!!!');
			console.log('THIS IS THE USER EMAIL TO ADD THE ADMIN ROLE TO: ');
			console.log(kingEmail);
			var adminRolesToAdd = { 
				roles: ["blogAdmin", "admin", "tester"]
			};

			Meteor.users.update({'services.facebook.email': 'reverieandreflection@gmail.com'}, {$set: adminRolesToAdd}, function(error, result) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
		      }
		      else{
		      	console.log('################ SUCCESSFULLY added blog admin role!!');
		      }
			});
		}
		else
		{
			console.log('this user is not the admin so will add only TESTER role!!');
			var testerRoleToAdd = { 
				roles: ["tester"]
			};

			Meteor.users.update({'services.facebook.email': kingEmail}, {$set: testerRoleToAdd}, function(error, result) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
		      }
		      else{
		      	console.log('################ SUCCESSFULLY added tester role!!');
		      }
			});
		}
	}
});